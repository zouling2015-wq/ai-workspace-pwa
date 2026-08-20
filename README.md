# AI Workspace PWA v1

这是一个可安装到手机桌面的轻量 PWA 原型。

## 文件
- index.html
- styles.css
- app.js
- manifest.webmanifest
- sw.js
- icons/

## 本地测试
Service Worker 需要通过 HTTP/HTTPS 运行，不能直接双击 index.html。

### 最简单方式
在这个目录打开终端：

```bash
python -m http.server 8080
```

电脑访问：
http://localhost:8080

如果部署到 HTTPS 网站（例如 GitHub Pages / Vercel / Netlify / 你现有工作台服务器），手机访问该网址即可安装。

## 手机安装
### iPhone / Safari
1. 用 Safari 打开 HTTPS 地址
2. 点击“分享”
3. 选择“添加到主屏幕”

### Android / Chrome
1. 用 Chrome 打开 HTTPS 地址
2. 浏览器菜单中选择“安装应用”或“添加到主屏幕”
3. 某些浏览器也会显示页面内“安装 App”按钮

## 下一步建议
把此 PWA 的 UI 和 Manifest / Service Worker 结构合并进你现有的 AI 工作台，而不是长期维护两套独立项目。
