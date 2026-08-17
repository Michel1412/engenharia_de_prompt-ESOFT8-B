"""Estado compartilhado do laboratório /observable."""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

USAGE_URL = "https://cursor.com/dashboard/usage"
IGNORE_PREFIXES = (".observable/", ".cursor/", ".git/")
IGNORE_NAMES = {"resume.md", "_indice.md"}
OBSERVABLE_RE = re.compile(r"(^|\s)/observable(\s|$)", re.IGNORECASE)


def now_iso() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")


def workspace_root(payload: dict[str, Any] | None = None) -> Path:
    roots = (payload or {}).get("workspace_roots") or []
    if roots:
        return Path(roots[0])
    return Path.cwd()


def sessions_dir(root: Path) -> Path:
    path = root / ".observable" / "sessions"
    path.mkdir(parents=True, exist_ok=True)
    return path


def session_id(payload: dict[str, Any]) -> str:
    return (
        payload.get("conversation_id")
        or payload.get("session_id")
        or "sem-id"
    )


def session_path(root: Path, sid: str) -> Path:
    safe = re.sub(r"[^a-zA-Z0-9._-]", "_", sid)
    return sessions_dir(root) / f"{safe}.json"


def load_session(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}


def save_session(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def empty_session(payload: dict[str, Any]) -> dict[str, Any]:
    return {
        "conversation_id": session_id(payload),
        "started_at": now_iso(),
        "ended_at": None,
        "duration_ms": None,
        "model": payload.get("model") or "",
        "model_id": payload.get("model_id") or "",
        "model_params": payload.get("model_params") or [],
        "composer_mode": payload.get("composer_mode") or "",
        "prompts": [],
        "files": [],
        "unique_files": [],
    }


def merge_model(session: dict[str, Any], payload: dict[str, Any]) -> None:
    if payload.get("model"):
        session["model"] = payload["model"]
    if payload.get("model_id"):
        session["model_id"] = payload["model_id"]
    if payload.get("model_params"):
        session["model_params"] = payload["model_params"]


def is_observable_prompt(text: str) -> bool:
    stripped = (text or "").strip()
    return bool(OBSERVABLE_RE.search(stripped)) or stripped.lower() in {
        "observable",
        "/observable",
    }


def to_posix_rel(root: Path, file_path: str) -> str | None:
    try:
        rel = Path(file_path).resolve().relative_to(root.resolve())
    except ValueError:
        return Path(file_path).as_posix()
    return rel.as_posix()


def should_count_file(rel: str) -> bool:
    normalized = rel.replace("\\", "/").lstrip("./")
    name = Path(normalized).name.lower()
    if name in IGNORE_NAMES:
        return False
    return not any(normalized.startswith(prefix) for prefix in IGNORE_PREFIXES)


def load_prices(root: Path) -> list[dict[str, Any]]:
    path = root / ".cursor" / "skills" / "observable" / "precos.json"
    if not path.exists():
        return []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return []
    return data.get("modelos") or []


def _norm(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", (value or "").lower())


def lookup_price(root: Path, model: str, model_id: str) -> dict[str, Any]:
    haystacks = [_norm(model), _norm(model_id)]
    for entry in load_prices(root):
        aliases = [_norm(entry.get("nome", "")), *(_norm(a) for a in entry.get("aliases") or [])]
        if any(h and a and (a in h or h in a) for h in haystacks for a in aliases):
            return entry
    return {
        "nome": model or model_id or "desconhecido",
        "input_usd_por_1m": None,
        "output_usd_por_1m": None,
        "fonte": "https://cursor.com/docs/models",
        "nota": "Preço de lista não mapeado; conferir no dashboard de usage.",
    }


def input_text(session: dict[str, Any]) -> str:
    prompts = session.get("prompts") or []
    for item in prompts:
        if not item.get("is_observable"):
            return (item.get("text") or "").strip()
    if prompts:
        return (prompts[0].get("text") or "").strip()
    return ""


def latest_session_path(root: Path) -> Path | None:
    files = sorted(sessions_dir(root).glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True)
    return files[0] if files else None


def detect_project_dir(root: Path, unique_files: list[str]) -> str | None:
    counts: dict[str, int] = {}
    for rel in unique_files:
        parts = Path(rel).parts
        if len(parts) >= 2 and parts[0] == "projetos":
            folder = f"projetos/{parts[1]}"
            counts[folder] = counts.get(folder, 0) + 1
    if counts:
        return max(counts, key=counts.get)
    return None


def elapsed_human(session: dict[str, Any]) -> tuple[str, int | None]:
    started = session.get("started_at")
    ended = session.get("ended_at") or now_iso()
    if session.get("duration_ms") is not None and session.get("ended_at"):
        ms = int(session["duration_ms"])
    elif started:
        try:
            start_dt = datetime.fromisoformat(started)
            end_dt = datetime.fromisoformat(ended)
            ms = int((end_dt - start_dt).total_seconds() * 1000)
        except ValueError:
            return "não disponível", None
    else:
        return "não disponível", None

    seconds = max(ms, 0) / 1000
    if seconds < 60:
        human = f"{seconds:.1f}s"
    elif seconds < 3600:
        minutes, rest = divmod(seconds, 60)
        human = f"{int(minutes)}m {rest:.0f}s"
    else:
        hours, rest = divmod(seconds, 3600)
        minutes, secs = divmod(rest, 60)
        human = f"{int(hours)}h {int(minutes)}m {secs:.0f}s"
    return human, ms
