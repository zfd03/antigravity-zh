"""Windows entry point for the shared Antigravity localization patcher."""

from pathlib import Path
import runpy


runpy.run_path(str(Path(__file__).resolve().parents[1] / "src" / "patch.py"), run_name="__main__")
