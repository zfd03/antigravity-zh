# Windows 安装

本目录提供 Windows 的安装入口。共享补丁代码位于 `../src/`。

需要 Python 3.9 或更新版本。打开 PowerShell，进入项目根目录，并先完全退出 Antigravity。将示例路径替换为你的实际安装目录或 `antigravity.exe` 完整路径：

```powershell
python .\windows\patch.py install "C:\path\to\Antigravity\antigravity.exe"
```

也可以传入 Antigravity 安装目录或 `resources\app.asar` 路径。脚本接受 `antigravity.exe` 路径，并会自动定位同级 `resources\app.asar`。

查看状态、更新或还原原版时，使用相同的路径：

```powershell
python .\windows\patch.py status "C:\path\to\Antigravity\antigravity.exe"
python .\windows\patch.py update "C:\path\to\Antigravity\antigravity.exe"
python .\windows\patch.py uninstall "C:\path\to\Antigravity\antigravity.exe"
```

如果应用安装在 `Program Files` 等受保护目录，可能需要以管理员身份打开 PowerShell。保留 `resources\app.asar.antigravity-zh.backup` 可还原原版。补丁目前针对 Antigravity 2.17.0；仓库 CI 会在 Windows 上测试路径处理和安装、更新、还原流程，但实际客户端菜单仍需 Windows 用户验证。
