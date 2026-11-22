import assert from 'node:assert/strict';
import { initSocialSharing, urlForWechatSignature, validWechatSignature } from '../_v/src/social-sharing.js';

const page = 'https://miaaavvv.github.io/miao_index/?from=timeline#projects';
const signedPage = page.split('#')[0];
assert.equal(urlForWechatSignature(page), signedPage, 'Sign the precise URL, including its query but excluding the fragment');
const signature = { appId: 'wx0123456789abcdef', timestamp: 1795363200, nonceStr: 'test-nonce', signature: 'a'.repeat(40), url: signedPage };
assert(validWechatSignature(signature, signedPage));
assert(!validWechatSignature({ ...signature, signature: '' }, signedPage));
assert(!validWechatSignature({ ...signature, timestamp: true }, signedPage));
assert(!validWechatSignature({ ...signature, url: 'https://example.com/' }, signedPage));

function fixture({ wechat = true, endpoint = '', signing = signature } = {}) {
  const calls = { fetch: [], sdk: [], message: [], timeline: [] };
  const values = {
    'meta[name="wechat-signature-endpoint"]': { content: endpoint },
    'meta[property="og:title"]': { content: 'MIAO｜产品经理 · AI 交互与 Agent 工作流' },
    'meta[property="og:description"]': { content: '从真实场景出发，让 AI 成为可交付的产品体验。' },
    'meta[property="og:image"]': { content: 'https://miaaavvv.github.io/miao_index/_p/miao-share-card.png' },
  };
  let onReady;
  const wx = {
    config(value) { calls.sdk.push(value); onReady(); },
    ready(callback) { onReady = callback; }, error() {},
    updateAppMessageShareData(value) { calls.message.push(value); value.success(); },
    updateTimelineShareData(value) { calls.timeline.push(value); value.success(); },
  };
  const options = {
    document: { documentElement: { dataset: {} }, title: 'MIAO', querySelector: selector => values[selector] },
    window: { location: new URL(page), navigator: { userAgent: wechat ? 'MicroMessenger/8.0' : 'Safari' } },
    fetch: async (url, config) => { calls.fetch.push({ url, config }); return { ok: true, json: async () => signing }; },
    sdkLoader: async () => wx,
  };
  return { options, calls };
}
{
  const { options, calls } = fixture();
  assert.equal((await initSocialSharing(options)).status, 'not-configured');
  assert.equal(calls.fetch.length, 0, 'Unconfigured static hosting must not call a nonexistent signing server');
}
{
  const { options, calls } = fixture({ wechat: false, endpoint: '/wechat-signature' });
  assert.equal((await initSocialSharing(options)).status, 'not-wechat');
  assert.equal(calls.fetch.length, 0, 'Other browsers must not request WeChat authorization');
}
{
  const { options, calls } = fixture({ endpoint: 'https://sign.example.com/share' });
  assert.equal((await initSocialSharing(options)).status, 'ready');
  assert.equal(new URL(calls.fetch[0].url).searchParams.get('url'), signedPage);
  assert.equal(calls.fetch[0].config.credentials, 'omit');
  assert.deepEqual(calls.sdk[0].jsApiList, ['updateAppMessageShareData', 'updateTimelineShareData']);
  assert.equal(calls.message[0].desc, '从真实场景出发，让 AI 成为可交付的产品体验。');
  assert.equal(calls.message[0].link, signedPage);
  assert.equal(calls.timeline[0].link, signedPage);
  assert(!Object.hasOwn(calls.timeline[0], 'desc'), 'Timeline does not support a separate subtitle');
}
{
  const { options, calls } = fixture({ endpoint: '/wechat-signature', signing: { ...signature, url: 'https://wrong.example/' } });
  assert.equal((await initSocialSharing(options)).status, 'unavailable');
  assert.equal(calls.sdk.length, 0, 'Reject signatures for a different URL');
}
{
  const { options } = fixture({ endpoint: '/wechat-signature' });
  options.fetch = async () => { throw new Error('Offline'); };
  assert.equal((await initSocialSharing(options)).status, 'unavailable', 'Network failure must fail open');
}
{
  const { options } = fixture({ endpoint: '/wechat-signature' });
  options.timeoutMs = 10;
  options.fetch = () => new Promise(() => {});
  assert.equal((await initSocialSharing(options)).status, 'unavailable', 'An unresponsive server must not hang sharing setup');
}
console.log('Verified WeChat configuration gating, exact signature URL, both share APIs, timeline field limits and fail-open behavior.');
