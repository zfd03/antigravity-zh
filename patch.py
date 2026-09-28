#!/usr/bin/env python3
"""Cross-platform root entry point for the Antigravity Chinese patcher."""

from pathlib import Path
import runpy


runpy.run_path(str(Path(__file__).resolve().parent / "src" / "patch.py"), run_name="__main__")
