#!/usr/bin/env python3
"""Imprime JSON com as métricas da sessão para o /observable."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from observable_lib import (
    USAGE_URL,
    detect_project_dir,
    elapsed_human,
    input_text,
    latest_session_path,
    load_session,
    lookup_price,
    session_path,
    workspace_root,
)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--conversation-id", default="")
    parser.add_argument("--project", default="")
    args = parser.parse_args()

    root = workspace_root()
    if args.conversation_id:
        path = session_path(root, args.conversation_id)
    else:
        path = latest_session_path(root)

    session = load_session(path) if path else {}
    unique_files = list(session.get("unique_files") or [])
    project = args.project or detect_project_dir(root, unique_files)
    human, ms = elapsed_human(session)
    model = session.get("model") or ""
    model_id = session.get("model_id") or ""
    price = lookup_price(root, model, model_id)

    payload = {
        "session_file": str(path) if path else None,
        "conversation_id": session.get("conversation_id") or "",
        "projeto": project,
        "texto_input": input_text(session),
        "tokens_input": None,
        "tokens_output": None,
        "tokens_fonte": "pendente — conferir em https://cursor.com/dashboard/usage",
        "arquivos_gerados": unique_files,
        "numero_arquivos": len(unique_files),
        "tempo_execucao": human,
        "tempo_ms": ms,
        "iniciado_em": session.get("started_at"),
        "finalizado_em": session.get("ended_at"),
        "preco_input": price.get("input_usd_por_1m"),
        "preco_output": price.get("output_usd_por_1m"),
        "preco_unidade": "USD / 1M tokens",
        "preco_fonte": price.get("fonte") or "https://cursor.com/docs/models",
        "preco_nota": price.get("nota") or "",
        "modelo": price.get("nome") or model or model_id or "desconhecido",
        "modelo_slug": model,
        "modelo_id": model_id,
        "usage_url": USAGE_URL,
    }
    latest = root / ".observable" / "latest.json"
    latest.parent.mkdir(parents=True, exist_ok=True)
    latest.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(payload, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        sys.stderr.write(f"[observable coletar] {exc}\n")
        print(json.dumps({"erro": str(exc)}))
        sys.exit(1)
