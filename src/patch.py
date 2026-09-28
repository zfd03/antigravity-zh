#!/usr/bin/env python3
"""Apply or undo the community Chinese UI overlay for Antigravity 2.17.0.

Only the user's local app.asar is modified. No Antigravity files are distributed.
"""

import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import struct
import sys
import tempfile

SUPPORTED_VERSION = "2.17.0"
MARKER = "ANTIGRAVITY_ZH_OVERLAY_V1"
SCRIPT_DIR = Path(__file__).resolve().parent


def archive_path(value: str) -> Path:
    path = Path(value).expanduser().resolve()
    if path.is_dir():
        path = path / "resources" / "app.asar"
    elif path.is_file() and path.name.lower() in {"antigravity", "antigravity.exe"}:
        path = path.parent / "resources" / "app.asar"
    if not path.is_file() or path.name != "app.asar":
        raise ValueError("找不到 app.asar；请传入 Antigravity 安装目录、antigravity/antigravity.exe 或 app.asar 路径")
    return path


def walk(node, prefix=""):
    for name, entry in node["files"].items():
        path = f"{prefix}/{name}" if prefix else name
        if "files" in entry:
            yield from walk(entry, path)
        elif "offset" in entry:
            yield path, entry


def read_archive(path: Path):
    with path.open("rb") as stream:
        sizes = stream.read(16)
        if len(sizes) != 16:
            raise ValueError("app.asar 文件头不完整")
        one, header_size, string_size, json_size = struct.unpack("<IIII", sizes)
        if one != 4 or header_size != json_size + 8 or string_size != json_size + 4:
            raise ValueError("不支持的 ASAR 格式")
        header = json.loads(stream.read(json_size))
        start = 16 + json_size
        contents = {}
        for name, entry in walk(header):
            stream.seek(start + int(entry["offset"]))
            data = stream.read(entry["size"])
            if len(data) != entry["size"]:
                raise ValueError(f"损坏的 ASAR 文件：{name}")
            contents[name] = data
    return header, contents


def replace_once(source: str, before: str, after: str, name: str):
    if source.count(before) != 1:
        raise ValueError(f"{name} 的结构与预期不同，已停止以避免损坏程序")
    return source.replace(before, after, 1)


def patch_contents(contents):
    package = json.loads(contents["package.json"])
    if package.get("name") != "antigravity" or package.get("version") != SUPPORTED_VERSION:
        raise ValueError(f"仅支持 Antigravity {SUPPORTED_VERSION}；当前为 {package.get('version')}")

    overlay = (SCRIPT_DIR / "overlay.js").read_text(encoding="utf-8")
    key = "dist/utils.js"
    utils = contents[key].decode("utf-8")
    if MARKER in utils:
        raise ValueError("汉化已经安装")
    injection = (
        f"    // {MARKER}\n"
        "    win.webContents.on('did-finish-load', () => {\n"
        "        if (!win.webContents.getURL().startsWith('https://127.0.0.1:')) return;\n"
        f"        void win.webContents.executeJavaScript({json.dumps(overlay, ensure_ascii=False)})\n"
        "            .catch((error) => console.warn('Chinese UI overlay:', error));\n"
        "    });\n"
    )
    utils = replace_once(utils, "    void win.loadURL(url);", injection + "    void win.loadURL(url);", key)
    contents[key] = utils.encode("utf-8")

    key = "dist/main.js"
    main = contents[key].decode("utf-8")
    main = replace_once(main, 'const electron_1 = require("electron");',
                        'const electron_1 = require("electron");\nelectron_1.app.commandLine.appendSwitch("lang", "zh-CN");', key)
    for english, chinese in {
        "'New Window'": "'新建窗口'",
        "'No agents running'": "'没有正在运行的智能体'",
        "'Quit'": "'退出'",
        "'Confirm Quit'": "'确认退出'",
    }.items():
        main = main.replace(english, chinese)
    contents[key] = main.encode("utf-8")

    key = "dist/menu.js"
    menu = contents[key].decode("utf-8")
    for english, chinese in {
        "label: 'New Window'": "label: '新建窗口'",
        "label: 'Docs'": "label: '文档'",
    }.items():
        menu = menu.replace(english, chinese)
    menu = replace_once(
        menu,
        "appMenu.items.find((item) => item.label === submenuLabel)",
        "appMenu.items.find((item) => item.label === submenuLabel || item.label === ({ File: '文件', Help: '帮助' }[submenuLabel]))",
        key,
    )
    native_menu_translation = """    const chineseLabels = {
        'File': '文件', 'Edit': '编辑', 'View': '视图', 'Window': '窗口', 'Help': '帮助',
        'Zoom In': '放大', 'Zoom Out': '缩小', 'Reset Zoom': '重置缩放',
        'Undo': '撤销', 'Redo': '重做', 'Cut': '剪切', 'Copy': '复制',
        'Paste': '粘贴', 'Select All': '全选', 'Reload': '重新加载',
        'Toggle Full Screen': '切换全屏', 'Minimize': '最小化', 'Close': '关闭',
    };
    const localizeNativeMenu = (items) => {
        for (const item of items) {
            item.label = chineseLabels[item.label] ?? item.label;
            if (item.submenu) localizeNativeMenu(item.submenu.items);
        }
    };
    localizeNativeMenu(menu.items);
"""
    menu = replace_once(menu, "    hideDevTools(menu);\n", "    hideDevTools(menu);\n" + native_menu_translation, key)
    contents[key] = menu.encode("utf-8")

    key = "dist/ideInstall/wizardHtml.js"
    wizard = contents[key].decode("utf-8")
    for english, chinese in {
        '<html lang="en">': '<html lang="zh-CN">',
        'Welcome to the new Antigravity!': '欢迎使用新版 Antigravity！',
        "Antigravity has been redesigned to put agents first with new capabilities. If you'd still like a code editor, you can download it as a separate app named <b>Antigravity IDE</b>.": '新版 Antigravity 以智能体为中心，提供了更多功能。如果还需要代码编辑器，可以单独下载 <b>Antigravity IDE</b>。',
        'Download the Antigravity IDE': '下载 Antigravity IDE',
        'Explore the new Antigravity': '探索新版 Antigravity',
        'Setting up…': '正在设置…',
    }.items():
        wizard = wizard.replace(english, chinese)
    contents[key] = wizard.encode("utf-8")


def write_archive(path: Path, header, contents):
    ordered = sorted(walk(header), key=lambda item: int(item[1]["offset"]))
    offset = 0
    for name, entry in ordered:
        data = contents[name]
        entry["offset"] = str(offset)
        entry["size"] = len(data)
        if "integrity" in entry:
            digest = hashlib.sha256(data).hexdigest()
            entry["integrity"]["hash"] = digest
            entry["integrity"]["blocks"] = [
                hashlib.sha256(data[i:i + entry["integrity"]["blockSize"]]).hexdigest()
                for i in range(0, len(data), entry["integrity"]["blockSize"])
            ]
        offset += len(data)
    serialized = json.dumps(header, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    serialized += b" " * (-len(serialized) % 4)
    with path.open("wb") as stream:
        stream.write(struct.pack("<IIII", 4, len(serialized) + 8, len(serialized) + 4, len(serialized)))
        stream.write(serialized)
        for name, _ in ordered:
            stream.write(contents[name])


def main():
    parser = argparse.ArgumentParser(description="Antigravity 2.17.0 简体中文界面覆盖")
    parser.add_argument("action", choices=["install", "update", "uninstall", "status"])
    parser.add_argument("app", help="安装目录、antigravity/antigravity.exe 可执行文件或 app.asar 路径")
    args = parser.parse_args()
    target = archive_path(args.app)
    backup = target.with_name("app.asar.antigravity-zh.backup")
    header, contents = read_archive(target)
    installed = MARKER.encode() in contents["dist/utils.js"]
    if args.action == "status":
        print("已安装汉化" if installed else "未安装汉化")
        print(f"程序资源：{target}")
        print(f"原版备份：{'存在' if backup.exists() else '不存在'}")
        return
    if args.action == "uninstall":
        if not backup.exists():
            raise ValueError("找不到原版备份，无法还原")
        if not installed:
            raise ValueError("当前资源已不是本项目的汉化版本；拒绝用旧备份覆盖可能更新过的程序")
        _, original = read_archive(backup)
        if json.loads(original["package.json"]).get("version") != json.loads(contents["package.json"]).get("version"):
            raise ValueError("原版备份与当前程序版本不同；拒绝降级还原")
        os.replace(backup, target)
        print("已还原原版 app.asar")
        return
    if args.action == "update":
        if not installed or not backup.exists():
            raise ValueError("需要先安装汉化且保留原版备份，才能更新")
        if json.loads(read_archive(backup)[1]["package.json"]).get("version") != json.loads(contents["package.json"]).get("version"):
            raise ValueError("原版备份与当前程序版本不同；拒绝用旧版本更新")
        header, contents = read_archive(backup)
    elif installed or backup.exists():
        raise ValueError("已有汉化或原版备份；请先检查安装状态")
    patch_contents(contents)
    with tempfile.NamedTemporaryFile(dir=target.parent, prefix=".app.asar.zh.", delete=False) as temp:
        temporary = Path(temp.name)
    try:
        write_archive(temporary, header, contents)
        check_header, check_contents = read_archive(temporary)
        if MARKER.encode() not in check_contents["dist/utils.js"] or len(check_header["files"]) != len(header["files"]):
            raise ValueError("汉化包校验失败")
        shutil.copymode(target, temporary)
        backup_created = False
        if args.action == "install":
            shutil.copy2(target, backup)
            backup_created = True
        try:
            os.replace(temporary, target)
        except OSError:
            # A failed replacement (for example, a still-running app on Windows)
            # must not leave a backup that makes the next install look completed.
            if backup_created:
                backup.unlink(missing_ok=True)
            raise
        print(f"汉化已{'更新' if args.action == 'update' else '安装'}。原版备份：{backup}")
        print("请重新启动 Antigravity。更新程序后需要重新运行安装命令。")
    finally:
        temporary.unlink(missing_ok=True)


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, KeyError) as error:
        print(f"错误：{error}", file=sys.stderr)
        sys.exit(1)
