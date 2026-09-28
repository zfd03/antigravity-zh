# Linux 安装

本目录提供 Linux 的安装入口。共享补丁代码位于 `../src/`。

需要 Python 3.9 或更新版本。先完全退出 Antigravity，在项目根目录运行：

```bash
python3 linux/patch.py install "$HOME/下载/Antigravity/Antigravity-x64"
```

也可以将安装目录、`antigravity` 可执行文件或 `resources/app.asar` 路径作为最后一个参数。

查看状态、更新或还原原版：

```bash
python3 linux/patch.py status "$HOME/下载/Antigravity/Antigravity-x64"
python3 linux/patch.py update "$HOME/下载/Antigravity/Antigravity-x64"
python3 linux/patch.py uninstall "$HOME/下载/Antigravity/Antigravity-x64"
```

安装时会在 `resources` 目录创建原版备份 `app.asar.antigravity-zh.backup`。请保留它以便还原。补丁目前针对 Antigravity 2.17.0。
