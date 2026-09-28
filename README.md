# Antigravity 简体中文界面覆盖（Linux）

面向 Google Antigravity 2.17.0 的社区汉化项目。项目只提供补丁脚本和翻译表，不分发 Antigravity 安装包或任何原厂资源。

## 效果与范围

- 将常见按钮、菜单、侧边栏标签、提示文字翻译为简体中文。
- 将 Electron/Chromium 的界面语言设为 `zh-CN`，并翻译原生窗口中的部分文字。
- 代码、命令、文件路径、终端、编辑器和输入内容不做翻译。
- 当前是**部分汉化**。Antigravity 主界面由压缩在本地服务中的前端程序提供，原版没有公开的中文语言包；未收录的文字仍会显示英文。新的版本可能需要重新适配。

## 安装

要求 Python 3.9 或更新版本。先**完全退出 Antigravity**，再运行：

```bash
git clone https://github.com/zfd03/antigravity-zh.git
cd antigravity-zh
python3 patch.py install "$HOME/下载/Antigravity/Antigravity-x64"
```

参数可以是安装目录、`antigravity` 可执行文件，或 `resources/app.asar`。例如：

```bash
python3 patch.py install "$HOME/下载/Antigravity/Antigravity-x64"
```

安装时会在 `resources` 中建立 `app.asar.antigravity-zh.backup`，然后替换 `app.asar`。保持备份文件，才能一键还原。若安装目录不可写，可由安装目录所有者执行，或仅针对安装命令使用适当的文件权限。

查看状态：

```bash
python3 patch.py status "$HOME/下载/Antigravity/Antigravity-x64"
```

还原英文原版：

```bash
python3 patch.py uninstall "$HOME/下载/Antigravity/Antigravity-x64"
```

Antigravity 自动更新后，补丁可能会被覆盖。本项目会检查版本号和应用结构；只有明确支持的版本才能安装。更新后先确认本项目是否已经适配。

本项目增加翻译后，已安装旧版补丁的用户可以在完全退出 Antigravity 后运行：

```bash
python3 patch.py update "$HOME/下载/Antigravity/Antigravity-x64"
```

更新会从原版备份重新生成补丁，保留备份文件。

## 添加翻译

编辑 [`overlay.js`](overlay.js) 中 `words` 对象，按 `英文原文: 简体中文` 添加短界面文字。匹配时会忽略多余空格，并兼容末尾标点；界面覆盖包括设置页、侧栏、控件标签和 `title`、`aria-label`、`placeholder`、`data-placeholder` 属性。代码、路径和可编辑输入区域会跳过。翻译原生窗口的文字在 [`patch.py`](patch.py) 的 `patch_contents` 函数中。

欢迎提交问题或 Pull Request，并附上 Antigravity 版本、英文原文和对应界面截图。请勿把原厂安装包、`app.asar` 或压缩后的前端文件提交到仓库。

## 实现原理

安装脚本读取本机 `resources/app.asar`，核对 Antigravity 版本，注入一个只在本机 `127.0.0.1` 页面运行的界面文字覆盖层，重新生成 ASAR 文件并更新校验值。覆盖层按界面文案精确匹配，也处理常见占位符；代码、命令、路径和对话内容会跳过。脚本保留原版备份，失败时不替换当前资源。所有翻译都在用户自己的电脑上运行，不调用在线翻译服务。

## 使用说明与风险

本项目会修改本机安装目录中的 `resources/app.asar`。它是非官方的社区补丁，与 Google 无关；官方条款可能限制修改客户端软件，使用者应自行阅读并评估适用条款。本项目不承诺账号安全或条款合规。补丁只替换本地界面文案，不修改账号认证和服务端请求。
