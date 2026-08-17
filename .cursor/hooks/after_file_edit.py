#!/usr/bin/env python3
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from observable_lib import (
    empty_session,
    load_session,
    merge_model,
    now_iso,
    save_session,
    session_id,
    session_path,
    should_count_file,
    to_posix_rel,
    workspace_root,
)


def main() -> None:
    payload = json.load(sys.stdin)
    root = workspace_root(payload)
    path = session_path(root, session_id(payload))
    session = load_session(path) or empty_session(payload)
    merge_model(session, payload)
    rel = to_posix_rel(root, payload.get("file_path") or "")
    if rel and should_count_file(rel):
        session.setdefault("files", []).append({"path": rel, "at": now_iso()})
        unique = session.setdefault("unique_files", [])
        if rel not in unique:
            unique.append(rel)
        save_session(path, session)
    print("{}")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        sys.stderr.write(f"[observable afterFileEdit] {exc}\n")
        print("{}")
