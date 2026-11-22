# 微信分享接入

当前没有公众号和服务端签名配置，线上版本只提供真实的网页分享元数据与本地卡片图片，不承诺微信会按指定样式生成卡片。微信可以缓存分享结果，Open Graph 元数据也不等于微信 JS-SDK 的正式授权分享。

## 已提供

- `_p/miao-share-card.png`：1200×630，适用于通用网页预览。
- `_p/miao-share-card-square.png`：600×600，供未来微信 JS-SDK 的方形缩略图使用。
- `_v/src/social-sharing.js`：导出异步函数 `initSocialSharing()`，可独立动态导入；不依赖 WebGL 核心。未配置时不加载微信 SDK、不请求不存在的接口，也不阻塞网页。
- `scripts/check-social-sharing.mjs`：验证签名 URL、配置开关、好友与朋友圈字段以及失败回退。

两张图片用 `scripts/generate-share-card.swift` 的 AppKit 原生绘图生成，使用已授权的低细节水彩剪影，不含原照片及真实联系方式。该脚本仅供 macOS 编辑素材；站点和 CI 直接使用随附 PNG，无需 Swift。

## 前端元数据

在 HTML 中设置 `og:title`、`og:description`、`og:url`、`og:image`，其中 `og:image` 使用完整 HTTPS 地址。通用卡片图片尺寸为 1200×630，可同时设置 `og:image:width`、`og:image:height`、`og:image:type` 和 `og:image:alt`。Twitter 卡片使用 `summary_large_image` 及同样的标题、描述和图片。推荐文案：

- 标题：MIAO｜产品经理 · AI 交互与 Agent 工作流
- 描述：从真实场景出发，让 AI 成为可编辑、可验证、可交付的产品体验。探索我的项目与工作方式。
- 图片：https://miaaavvv.github.io/miao_index/_p/miao-share-card.png

## 未来接入公众号

拥有适用的公众号接口权限、完成 JS 接口安全域名配置，并部署服务端签名接口后，在 HTML 设置：

```html
<meta name="wechat-signature-endpoint" content="https://your-authorized-domain.example/wechat/signature">
<meta name="wechat-share-image" content="https://miaaavvv.github.io/miao_index/_p/miao-share-card-square.png">
```

空的 endpoint 表示未配置，应保持禁用。不得把 AppSecret、access_token 或 jsapi_ticket 填入 HTML、JavaScript、GitHub Actions 公开变量或仓库。

模块只在微信 UA 环境中调用指定接口，以 GET 参数 `url` 传入当前页面完整 URL（保留 query、移除 `#` 及其后内容）。服务端应针对这个**精确 URL**返回 JSON：

```json
{
  "appId": "wx0123456789abcdef",
  "timestamp": 1795363200,
  "nonceStr": "server-generated-nonce",
  "signature": "0000000000000000000000000000000000000000",
  "url": "https://miaaavvv.github.io/miao_index/"
}
```

以上是格式示例，不能作为有效签名使用。服务端需自行缓存 access_token、jsapi_ticket，按微信规范计算签名，限制允许签名的站点 URL，避免成为任意 URL 签名服务。跨域接口需正确配置 CORS；前端不发送 cookies 或其他凭据。当前 GitHub Pages 不提供运行该签名逻辑的后端。

模块只请求两个分享 API：

- `updateAppMessageShareData`：好友卡片可设置标题、描述、链接和图片。
- `updateTimelineShareData`：朋友圈可设置标题、链接和图片，**没有独立的描述 / 副标题字段**。因此推荐标题中同时包含 MIAO 与角色方向。

微信 SDK 加载、签名接口或 API 初始化失败，模块返回 `unavailable`，保留普通网页分享，不影响个人介绍或项目内容。只有两个分享数据设置回调都成功后，才返回 `ready`。

## 验证

```sh
node scripts/check-social-sharing.mjs
```

这项自动检查不代替微信公众号配置及微信 / 朋友圈真机验证。相关参数应以微信开放文档和实际账号权限为准。
