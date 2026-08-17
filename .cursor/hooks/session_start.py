#!/usr/bin/env python3
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from observable_lib import empty_session, load_session, save_session, session_path, workspace_root


def main() -> None:
    payload = json.load(sys.stdin)
    root = workspace_root(payload)
    path = session_path(root, payload.get("conversation_id") or payload.get("session_id") or "sem-id")
    session = load_session(path) or empty_session(payload)
    if not session.get("started_at"):
        session.update(empty_session(payload))
    session["composer_mode"] = payload.get("composer_mode") or session.get("composer_mode") or ""
    save_session(path, session)
    print(
        json.dumps(
            {
                "additional_context": (
                    "Laboratório Campos Minados: experimentos em projetos/. "
                    "Quando o usuário invocar /observable, siga .cursor/skills/observable/SKILL.md "
                    "e grave resume.md no projeto gerado."
                )
            }
        )
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        sys.stderr.write(f"[observable sessionStart] {exc}\n")
        print("{}")
