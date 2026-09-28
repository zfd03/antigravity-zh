import json
import os
import subprocess
import sys
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from io import StringIO
from pathlib import Path
from unittest import mock

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "src"))
import patch


def make_test_archive(path: Path, version: str = patch.SUPPORTED_VERSION) -> None:
    files = {
        "package.json": json.dumps({"name": "antigravity", "version": version}).encode(),
        "dist/utils.js": b"    void win.loadURL(url);\n",
        "dist/main.js": b'const electron_1 = require("electron");\n',
        "dist/menu.js": (
            b"appMenu.items.find((item) => item.label === submenuLabel)\n"
            b"    hideDevTools(menu);\n"
        ),
        "dist/ideInstall/wizardHtml.js": b'<html lang="en">',
    }
    header = {"files": {}}
    for name, data in files.items():
        node = header
        parts = name.split("/")
        for part in parts[:-1]:
            node = node["files"].setdefault(part, {"files": {}})
        node["files"][parts[-1]] = {"offset": "0", "size": len(data)}
    patch.write_archive(path, header, files)


class ArchivePathTests(unittest.TestCase):
    def test_accepts_install_directory(self):
        with tempfile.TemporaryDirectory() as directory:
            resources = Path(directory) / "resources"
            resources.mkdir()
            archive = resources / "app.asar"
            archive.touch()
            self.assertEqual(patch.archive_path(directory), archive.resolve())

    def test_accepts_antigravity_executable(self):
        with tempfile.TemporaryDirectory() as directory:
            resources = Path(directory) / "resources"
            resources.mkdir()
            archive = resources / "app.asar"
            archive.touch()
            executable = Path(directory) / "antigravity.exe"
            executable.touch()
            self.assertEqual(patch.archive_path(str(executable)), archive.resolve())

    def test_accepts_linux_executable(self):
        with tempfile.TemporaryDirectory() as directory:
            resources = Path(directory) / "resources"
            resources.mkdir()
            archive = resources / "app.asar"
            archive.touch()
            executable = Path(directory) / "antigravity"
            executable.touch()
            self.assertEqual(patch.archive_path(str(executable)), archive.resolve())

    def test_accepts_direct_archive_path(self):
        with tempfile.TemporaryDirectory() as directory:
            archive = Path(directory) / "app.asar"
            archive.touch()
            self.assertEqual(patch.archive_path(str(archive)), archive.resolve())


class InstallerTests(unittest.TestCase):
    def run_patch(self, action: str, app_path: Path) -> subprocess.CompletedProcess:
        platform_folder = "windows" if os.name == "nt" else "linux"
        return subprocess.run(
            [sys.executable, str(PROJECT_ROOT / platform_folder / "patch.py"), action, str(app_path)],
            capture_output=True,
            text=True,
            check=False,
        )

    def test_install_update_and_uninstall_restore_original_archive(self):
        with tempfile.TemporaryDirectory() as directory:
            resources = Path(directory) / "resources"
            resources.mkdir()
            archive = resources / "app.asar"
            make_test_archive(archive)
            original = archive.read_bytes()

            installed = self.run_patch("install", Path(directory))
            self.assertEqual(installed.returncode, 0, installed.stderr)
            self.assertTrue(archive.with_name("app.asar.antigravity-zh.backup").is_file())
            self.assertIn(patch.MARKER.encode(), patch.read_archive(archive)[1]["dist/utils.js"])

            updated = self.run_patch("update", Path(directory))
            self.assertEqual(updated.returncode, 0, updated.stderr)
            self.assertIn(patch.MARKER.encode(), patch.read_archive(archive)[1]["dist/utils.js"])

            status = self.run_patch("status", Path(directory))
            self.assertEqual(status.returncode, 0, status.stderr)
            self.assertIn("已安装汉化", status.stdout)

            restored = self.run_patch("uninstall", Path(directory))
            self.assertEqual(restored.returncode, 0, restored.stderr)
            self.assertEqual(archive.read_bytes(), original)
            self.assertFalse(archive.with_name("app.asar.antigravity-zh.backup").exists())

    def test_rejects_unsupported_version_without_creating_backup(self):
        with tempfile.TemporaryDirectory() as directory:
            resources = Path(directory) / "resources"
            resources.mkdir()
            archive = resources / "app.asar"
            make_test_archive(archive, version="0.0.0")
            original = archive.read_bytes()

            result = self.run_patch("install", Path(directory))

            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(archive.read_bytes(), original)
            self.assertFalse(archive.with_name("app.asar.antigravity-zh.backup").exists())

    def test_failed_replace_removes_partial_install_backup(self):
        with tempfile.TemporaryDirectory() as directory:
            resources = Path(directory) / "resources"
            resources.mkdir()
            archive = resources / "app.asar"
            make_test_archive(archive)
            original = archive.read_bytes()
            with mock.patch.object(sys, "argv", ["patch.py", "install", directory]):
                with mock.patch.object(patch.os, "replace", side_effect=PermissionError("file is in use")):
                    with redirect_stdout(StringIO()), redirect_stderr(StringIO()):
                        with self.assertRaises(PermissionError):
                            patch.main()

            self.assertEqual(archive.read_bytes(), original)
            self.assertFalse(archive.with_name("app.asar.antigravity-zh.backup").exists())


if __name__ == "__main__":
    unittest.main()
