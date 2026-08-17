#!/usr/bin/env python3
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from observable_lib import (
    empty_session,
    is_observable_prompt,
    load_session,
    merge_model,
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
    merge_model(session, payload)
    text = payload.get("prompt") or ""
    session.setdefault("prompts", []).append(
        {
            "at": now_iso(),
            "text": text,
            "is_observable": is_observable_prompt(text),
        }
    )
    save_session(path, session)
    print(json.dumps({"continue": True}))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        sys.stderr.write(f"[observable beforeSubmitPrompt] {exc}\n")
        print(json.dumps({"continue": True}))
