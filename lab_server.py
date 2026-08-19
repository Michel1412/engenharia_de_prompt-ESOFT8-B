#!/usr/bin/env python3
"""Hub em / e jogos em /{modelo}/{projeto}/ no mesmo domínio."""

from __future__ import annotations

import mimetypes
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent
HOME = ROOT / "home"
SITE = ROOT / "site"
IMAGENS = ROOT / "imagens"
HOST = "127.0.0.1"
PORT = 8080

GROK_ROOTS = (
    SITE / "grok-4-6-high-fast" / "campo_minado_Grok_46",
    HOME / "grok-4-6-high-fast" / "campo_minado_Grok_46",
    ROOT / "projetos" / "campo_minado_Grok_46",
)

ROUTES = {
    ("grok-4-6-high-fast", "campo_minado_Grok_46"): GROK_ROOTS,
    # Alias da pasta antiga (outros agentes renomearam Grok_46_High → Grok_46)
    ("grok-4-6-high-fast", "campo_minado_Grok_46_High"): GROK_ROOTS,
    ("gemini-3-7-flash", "campo_minado_Gemini_VeryHigh"): (
        SITE / "gemini-3-7-flash" / "campo_minado_Gemini_VeryHigh",
        HOME / "gemini-3-7-flash" / "campo_minado_Gemini_VeryHigh",
    ),
    ("auto", "campo_minado_trabalho_IA"): (
        SITE / "auto" / "campo_minado_trabalho_IA",
        HOME / "auto" / "campo_minado_trabalho_IA",
    ),
    ("gemini-3-7-flash", "campo_minado_web"): (
        SITE / "gemini-3-7-flash" / "campo_minado_web",
        HOME / "gemini-3-7-flash" / "campo_minado_web",
    ),
}

# URLs legadas → canônicas (301)
REDIRECTS = {
    ("grok-4-6-high-fast", "campo_minado_Grok_46_High"): (
        "grok-4-6-high-fast",
        "campo_minado_Grok_46",
    ),
}


def guess_type(path: Path) -> str:
    mime, _ = mimetypes.guess_type(path.name)
    if path.suffix == ".js":
        return "text/javascript; charset=utf-8"
    if path.suffix == ".css":
        return "text/css; charset=utf-8"
    if path.suffix == ".html":
        return "text/html; charset=utf-8"
    return mime or "application/octet-stream"


def first_file(candidates: list[Path]) -> Path | None:
    for candidate in candidates:
        if candidate.is_file():
            return candidate
    return None


def resolve_imagens_static(parts: list[str]) -> Path | None:
    if not parts or parts[0] != "imagens":
        return None
    rest = parts[1:]
    target = (IMAGENS / Path(*rest)).resolve() if rest else IMAGENS.resolve()
    try:
        target.relative_to(IMAGENS.resolve())
    except ValueError:
        return None
    if target.is_file():
        return target
    if target.is_dir():
        index = target / "index.html"
        if index.is_file():
            return index
    return None


def resolve_home_static(parts: list[str]) -> Path | None:
    if not parts:
        return HOME / "index.html"
    target = (HOME / Path(*parts)).resolve()
    try:
        target.relative_to(HOME.resolve())
    except ValueError:
        return None
    if target.is_file():
        return target
    if target.is_dir():
        index = target / "index.html"
        if index.is_file():
            return index
    return None


def resolve_path(url_path: str) -> Path | None:
    raw = unquote(url_path.split("?", 1)[0])
    parts = [part for part in raw.split("/") if part]

    if not parts or parts == ["index.html"]:
        return HOME / "index.html"
    imagens = resolve_imagens_static(parts)
    if imagens:
        return imagens
    if len(parts) == 1 and parts[0] in {
        "styles.css",
        "app.js",
        "presentation.js",
        "presentation-data.js",
    }:
        return HOME / parts[0]

    if len(parts) >= 2:
        key = (parts[0], parts[1])
        rest = Path(*parts[2:]) if len(parts) > 2 else Path("index.html")
        if rest == Path(""):
            rest = Path("index.html")
        roots = ROUTES.get(key, ())
        files = []
        for root in roots:
            target = (root / rest).resolve()
            try:
                target.relative_to(root.resolve())
            except ValueError:
                continue
            if target.is_dir():
                files.append(target / "index.html")
            else:
                files.append(target)
        found = first_file(files)
        if found:
            return found
        if not parts[2:] or parts[-1] == "index.html":
            for root in roots:
                index = root / "index.html"
                if index.is_file():
                    return index
    return resolve_home_static(parts)


class LabHandler(BaseHTTPRequestHandler):
    def log_message(self, format: str, *args) -> None:
        print("%s - %s" % (self.address_string(), format % args), flush=True)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        parts = [part for part in unquote(parsed.path).split("/") if part]

        if len(parts) >= 2:
            alias = REDIRECTS.get((parts[0], parts[1]))
            if alias:
                rest = "/".join(parts[2:])
                location = f"/{alias[0]}/{alias[1]}/"
                if rest:
                    location = f"/{alias[0]}/{alias[1]}/{rest}"
                if parsed.path.endswith("/") and not location.endswith("/"):
                    location += "/"
                self.send_response(301)
                self.send_header("Location", location)
                self.end_headers()
                return

        if (
            len(parts) == 2
            and not parsed.path.endswith("/")
            and (parts[0], parts[1]) in ROUTES
        ):
            self.send_response(301)
            self.send_header("Location", parsed.path + "/")
            self.end_headers()
            return

        target = resolve_path(parsed.path)
        if target is None:
            self.send_error(404, "File not found")
            return
        data = target.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", guess_type(target))
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), LabHandler)
    print(f"Hub: http://{HOST}:{PORT}/", flush=True)
    print("Rotas:", flush=True)
    for model, project in ROUTES:
        print(f"  http://{HOST}:{PORT}/{model}/{project}/", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nEncerrando…")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
