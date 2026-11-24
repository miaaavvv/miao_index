# MIAO · 产品与 AI

[查看线上作品集](https://miaaavvv.github.io/miao_index/)

以交互湖面为入口的个人作品集，包含个人介绍、教育经历和项目案例。页面支持场景与昼夜调节、音乐播放、移动端浏览、键盘操作，以及简体中文、繁體中文和 English。湖面渲染不可用时，仍可阅读内容摘要。

## 本地运行

需要 Node.js 20 或更新版本，无需安装项目依赖。在仓库根目录运行：

```sh
npm run dev
```

用浏览器打开 [http://127.0.0.1:5173/](http://127.0.0.1:5173/)。本地服务只监听回环地址。若端口已被占用，可设置环境变量 `PORT` 后重新启动。Windows PowerShell 示例：

```powershell
$env:PORT = "5174"
npm run dev
```

开发时运行 `npm run check`，检查素材和路径、公开内容的隐私边界、响应式布局、加载回退及分享配置。

## 部署到 GitHub Pages

在仓库 **Settings → Pages → Build and deployment** 中将来源设为 **GitHub Actions**。[部署工作流](.github/workflows/pages.yml) 会在推送到 `main` 时检查、构建并发布，也支持手动触发。

本地构建命令：

```sh
npm run build:pages -- --base=/miao_index/
```

构建产物位于 `.local/pages-dist/`。部署到其他子路径时，请同步修改命令和工作流中的 `--base`。部署在域名根路径时使用 `--base=/`。静态版根据浏览器地区与时区选择默认语言，并优先保留访客手动设置的语言。

## 内容与资源

| 路径 | 用途 |
| --- | --- |
| [index.html](index.html) | 页面结构、加载入口和分享元信息 |
| [`_v/src/portfolio-content.js`](_v/src/portfolio-content.js) | 三语作品集内容 |
| [`_v/src/local-i18n.js`](_v/src/local-i18n.js) | 通用界面文案 |
| [`_v/`](_v/) | 界面样式、交互与湖面渲染脚本 |
| [`_p/`](_p/)、[`_media/`](_media/) | 图片、字体、渲染素材和音频 |
| [`scripts/`](scripts/) | 本地服务、检查及静态构建 |

使用可公开分享的资料和图片。常规分享预览随站点提供，微信分享配置见 [WECHAT_SHARING.md](WECHAT_SHARING.md)。

湖面交互基于 [Oscar Dumlao 的参考网站](https://oscardumlao.com/) 的编译脚本和素材。相关素材、音乐与作品的权利归各自权利人所有。
