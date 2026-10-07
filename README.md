# ChatGPT 中键打开新窗口

用于 ChatGPT 网页的 Tampermonkey 用户脚本。鼠标中键点击“新聊天”或左上角的“ChatGPT”时，在独立窗口打开 `https://chatgpt.com/`，方便同时使用多个聊天窗口。

## 安装

1. 在浏览器中安装 Tampermonkey 用户脚本管理扩展。
2. 打开 [Greasy Fork 发布页面](https://greasyfork.org/zh-CN/scripts/599083-chatgpt-%E4%B8%AD%E9%94%AE%E6%89%93%E5%BC%80%E6%96%B0%E7%AA%97%E5%8F%A3)，点击“安装此脚本”并确认安装。
3. 打开或刷新 [ChatGPT](https://chatgpt.com/)。

也可以在 Tampermonkey 中新建脚本，将仓库里的 [chatgpt-middle-click-new-window.user.js](./chatgpt-middle-click-new-window.user.js) 内容粘贴进去并保存。

## 使用

- 鼠标中键（通常为按下滚轮）点击“新聊天”或左上角“ChatGPT”。
- 每次点击都会打开一个新的独立窗口，地址固定为 `https://chatgpt.com/`。
- 左键操作保持原有行为。
- 脚本支持“新聊天”“新对话”和英文“New chat”标签，以及页面动态更新后的按钮。

## 注意事项

- 如果没有打开窗口，请检查浏览器是否拦截了弹出窗口，并允许 `chatgpt.com` 弹出窗口。
- 最终以窗口还是标签页打开，由浏览器设置决定；脚本通过窗口参数请求打开独立窗口。
- ChatGPT 页面结构或按钮标签变化可能影响识别。
- 脚本仅在 `https://chatgpt.com/*` 生效，不需要额外用户脚本权限。

## 发布与源码

- [Greasy Fork](https://greasyfork.org/zh-CN/scripts/599083-chatgpt-%E4%B8%AD%E9%94%AE%E6%89%93%E5%BC%80%E6%96%B0%E7%AA%97%E5%8F%A3)
- [GitHub](https://github.com/cantonadong/NewPageGPT)

## 许可

[MIT](./LICENSE)
