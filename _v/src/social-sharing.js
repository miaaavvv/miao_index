// WeChat's custom share data requires a server-issued JS-SDK signature.
// With no endpoint configured, ordinary page metadata remains the fallback.
export const WECHAT_SDK_URL = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';
const shareApis = ['updateAppMessageShareData', 'updateTimelineShareData'];

export function urlForWechatSignature(href) {
  const url = new URL(href);
  url.hash = '';
  return url.href;
}

export function validWechatSignature(value, url) {
  return Boolean(value && typeof value.appId === 'string' && /^wx[\da-f]{16}$/i.test(value.appId)
    && ['number', 'string'].includes(typeof value.timestamp)
    && Number.isSafeInteger(Number(value.timestamp)) && Number(value.timestamp) > 0
    && typeof value.nonceStr === 'string' && value.nonceStr.length > 0 && value.nonceStr.length <= 256
    && typeof value.signature === 'string' && /^[\da-f]{40}$/i.test(value.signature)
    && (value.url === undefined || value.url === url));
}

function withTimeout(promise, milliseconds, onTimeout = () => {}) {
  let timer;
  return Promise.race([promise, new Promise((_, reject) => {
    timer = setTimeout(() => { onTimeout(); reject(new Error('Share setup timed out')); }, milliseconds);
  })]).finally(() => clearTimeout(timer));
}

function loadWechatSdk(document, window, timeoutMs) {
  if (window.wx) return Promise.resolve(window.wx);
  return withTimeout(new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = WECHAT_SDK_URL;
    script.async = true;
    script.referrerPolicy = 'no-referrer';
    script.onload = () => window.wx ? resolve(window.wx) : reject(new Error('SDK unavailable'));
    script.onerror = () => reject(new Error('SDK could not load'));
    document.head.append(script);
  }), timeoutMs);
}

export async function initSocialSharing(options = {}) {
  const document = options.document ?? globalThis.document;
  const window = options.window ?? globalThis.window;
  if (!document || !window) return { status: 'unavailable' };
  const setStatus = status => {
    document.documentElement.dataset.wechatShare = status;
    return { status };
  };
  if (!/MicroMessenger/i.test(window.navigator.userAgent)) return setStatus('not-wechat');
  const meta = property => document.querySelector(`meta[property="${property}"]`)?.content ?? '';
  const configuredEndpoint = options.endpoint
    ?? document.querySelector('meta[name="wechat-signature-endpoint"]')?.content;
  if (!configuredEndpoint?.trim()) return setStatus('not-configured');
  const timeoutMs = options.timeoutMs ?? 5000;
  try {
    const signatureUrl = urlForWechatSignature(window.location.href);
    const endpoint = new URL(configuredEndpoint, signatureUrl);
    const sameOrigin = endpoint.origin === window.location.origin;
    if (endpoint.username || endpoint.password || (endpoint.protocol !== 'https:' && !sameOrigin)) {
      return setStatus('unavailable');
    }
    endpoint.searchParams.set('url', signatureUrl);
    const fetcher = options.fetch ?? globalThis.fetch;
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const response = await withTimeout(fetcher(endpoint.href, {
      cache: 'no-store', credentials: 'omit', redirect: 'error',
      ...(controller ? { signal: controller.signal } : {}),
    }), timeoutMs, () => controller?.abort());
    if (!response.ok) return setStatus('unavailable');
    const signature = await withTimeout(response.json(), timeoutMs);
    if (!validWechatSignature(signature, signatureUrl)) return setStatus('unavailable');
    const wx = await (options.sdkLoader ?? loadWechatSdk)(document, window, timeoutMs);
    if (!wx || !['config', 'ready', 'error', ...shareApis].every(key => typeof wx[key] === 'function')) {
      return setStatus('unavailable');
    }
    const data = {
      title: meta('og:title') || document.title || 'MIAO',
      desc: meta('og:description') || document.querySelector('meta[name="description"]')?.content || '',
      link: signatureUrl,
      imgUrl: new URL(document.querySelector('meta[name="wechat-share-image"]')?.content
        || meta('og:image') || '/_p/miao-share-card-square.png', signatureUrl).href,
    };
    await withTimeout(new Promise((resolve, reject) => {
      wx.error(() => reject(new Error('WeChat signature rejected')));
      wx.ready(() => {
        try {
          let completed = 0;
          const success = () => { if (++completed === 2) resolve(); };
          const fail = () => reject(new Error('WeChat share data was rejected'));
          wx.updateAppMessageShareData({ ...data, success, fail });
          // Timeline's API has no separate description/subtitle field.
          wx.updateTimelineShareData({ title: data.title, link: data.link, imgUrl: data.imgUrl, success, fail });
        } catch (error) { reject(error); }
      });
      wx.config({
        debug: false,
        appId: signature.appId,
        timestamp: Number(signature.timestamp),
        nonceStr: signature.nonceStr,
        signature: signature.signature,
        jsApiList: [...shareApis],
      });
    }), timeoutMs);
    return setStatus('ready');
  } catch {
    // Sharing must never prevent the profile or the interactive scene loading.
    return setStatus('unavailable');
  }
}
