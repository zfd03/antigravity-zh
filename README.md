# Antigravity 简体中文界面覆盖

面向 Google Antigravity **2.17.0** 的社区汉化项目。项目只提供补丁代码和翻译表，不分发 Antigravity 安装包或原厂资源。

## 平台

- [Linux 安装说明](linux/README.md)
- [Windows 安装说明](windows/README.md)

Linux 和 Windows 各有独立的目录、说明和启动入口；两边共用 `src/` 中的补丁与翻译表，避免功能分叉。仓库配置了 Linux 和 Windows 自动测试。当前 Windows 客户端尚未在真实 Windows 桌面环境中完整验收，欢迎反馈菜单及界面显示问题。

## 运行示例

以下命令都从仓库根目录运行。根目录的 `patch.py` 是统一入口，会调用 `src/` 中的补丁代码；Linux 和 Windows 仍分别保留在各自文件夹里。运行前先完全退出 Antigravity。

先克隆仓库并进入项目目录：

```bash
git clone https://github.com/zfd03/antigravity-zh.git
cd antigravity-zh
```

需要 Python 3.9 或更新版本。随后按你的系统运行对应命令。

### Linux

下面使用本机安装目录 `/home/zfd/下载/Antigravity/Antigravity-x64` 举例。首次安装只运行：

```bash
python3 patch.py install "/home/zfd/下载/Antigravity/Antigravity-x64"
```

查看补丁状态：

```bash
python3 patch.py status "/home/zfd/下载/Antigravity/Antigravity-x64"
```

Antigravity 更新后，确认项目已适配新版本再运行更新：

```bash
python3 patch.py update "/home/zfd/下载/Antigravity/Antigravity-x64"
```

恢复原版：

```bash
python3 patch.py uninstall "/home/zfd/下载/Antigravity/Antigravity-x64"
```

### Windows（PowerShell）

常见的用户级安装路径示例：

```powershell
python .\patch.py install "$env:LOCALAPPDATA\Programs\Antigravity\Antigravity.exe"
```

查看状态、更新或还原时，在需要时分别运行对应命令：

```powershell
python .\patch.py status "$env:LOCALAPPDATA\Programs\Antigravity\Antigravity.exe"
python .\patch.py update "$env:LOCALAPPDATA\Programs\Antigravity\Antigravity.exe"
python .\patch.py uninstall "$env:LOCALAPPDATA\Programs\Antigravity\Antigravity.exe"
```

`$env:LOCALAPPDATA` 会自动展开为当前 Windows 用户的完整 AppData 路径。如果 Antigravity 安装在其他位置，可右击快捷方式打开“属性”，把“目标”中的 `Antigravity.exe` 完整路径传给脚本。更多说明见 [Linux](linux/README.md) 和 [Windows](windows/README.md) 文件夹。

## 汉化范围

- 常见按钮、菜单、侧栏、设置页、项目页、提示和输入框占位文字。
- Electron/Chromium 界面语言，以及部分原生窗口菜单文字。
- 代码、命令、文件路径、终端和编辑器内容保持原样。

目前是**部分汉化**。Antigravity 的主要界面由本地服务中的前端程序提供，原版没有公开的中文语言包；未收录文案仍会显示英文。新版可能需要重新适配。

## 项目结构

```text
patch.py   仓库根目录的跨平台运行入口
linux/      Linux 使用说明和入口
windows/    Windows 使用说明和入口
src/        两个平台共用的 ASAR 补丁和翻译表
tests/      跨平台自动化测试
```

添加或修改翻译请编辑 [`src/overlay.js`](src/overlay.js)。匹配时会忽略多余空格并兼容末尾标点；翻译覆盖界面控件及 `title`、`aria-label`、`placeholder`、`data-placeholder` 属性。可编辑输入区域、代码和路径会跳过。原生窗口文字在 [`src/patch.py`](src/patch.py) 中处理。

欢迎提交 Issue 或 Pull Request，并附上 Antigravity 版本、英文原文和对应界面截图。请勿提交原厂安装包、`app.asar` 或压缩后的前端资源。

## 实现与风险

安装入口读取本机 `resources/app.asar`，检查版本和应用结构后，在本机 `127.0.0.1` 页面注入界面文字覆盖层，并重新生成 ASAR 校验值。原版文件会备份；如果检查或写入失败，脚本不会将不完整文件替换为当前程序资源。翻译在本机运行，不调用在线翻译服务。

本项目会修改本机安装目录中的 `resources/app.asar`。它是非官方社区补丁，与 Google 无关；官方条款可能限制修改客户端软件，使用者应自行阅读并评估适用条款。本项目不承诺账号安全或条款合规。补丁只替换本地界面文案，不修改账号认证和服务端请求。
