#!/usr/bin/env python3
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from observable_lib import (
    empty_session,
    load_session,
    now_iso,
    save_session,
    session_id,
    session_path,
    workspace_root,
)


def main() -> None:
    payload = json.load(sys.stdin)
    root = workspace_root(payload)
    path = session_path(root, session_id(payload))
    session = load_session(path) or empty_session(payload)
    session["ended_at"] = now_iso()
    if payload.get("duration_ms") is not None:
        session["duration_ms"] = payload["duration_ms"]
    session["end_reason"] = payload.get("reason") or ""
    save_session(path, session)
    print("{}")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        sys.stderr.write(f"[observable sessionEnd] {exc}\n")
        print("{}")
