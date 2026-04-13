"""
Render ASGI entrypoint shim.

The current Render web service starts with:
    uvicorn asgi:app --host 0.0.0.0 --port $PORT

Preferred path:
  - Use the hybrid app from backend.asgi when FastAPI is installed.

Fallback path:
  - If FastAPI isn't installed in the native Render environment, expose the
    Flask app through a tiny WSGI-to-ASGI adapter so the service can still boot.
"""

from __future__ import annotations

import io
import os
import sys
from typing import Callable, Iterable, List, Tuple


_ROOT = os.path.dirname(os.path.abspath(__file__))
_BACKEND = os.path.join(_ROOT, "backend")
for _path in (_ROOT, _BACKEND):
    if _path not in sys.path:
        sys.path.insert(0, _path)


try:
    from backend.asgi import app as app
except ModuleNotFoundError as exc:
    if exc.name != "fastapi":
        raise

    from backend.main import app as flask_app

    class WsgiToAsgi:
        def __init__(self, wsgi_app: Callable):
            self.wsgi_app = wsgi_app

        async def __call__(self, scope, receive, send):
            if scope["type"] != "http":
                await send({"type": "http.response.start", "status": 500, "headers": []})
                await send({"type": "http.response.body", "body": b"Unsupported scope"})
                return

            body = b""
            more_body = True
            while more_body:
                message = await receive()
                body += message.get("body", b"")
                more_body = message.get("more_body", False)

            environ = self._build_environ(scope, body)
            captured: List[Tuple[str, List[Tuple[str, str]]]] = []

            def start_response(status: str, headers: List[Tuple[str, str]], exc_info=None):
                captured.append((status, headers))

            result = self.wsgi_app(environ, start_response)
            try:
                status_line, headers = captured[0] if captured else ("500 Internal Server Error", [])
                status_code = int(status_line.split()[0])
                encoded_headers = [
                    (name.lower().encode("latin-1"), value.encode("latin-1"))
                    for name, value in headers
                ]
                await send({"type": "http.response.start", "status": status_code, "headers": encoded_headers})
                for chunk in result:
                    await send({"type": "http.response.body", "body": chunk, "more_body": True})
                await send({"type": "http.response.body", "body": b"", "more_body": False})
            finally:
                if hasattr(result, "close"):
                    result.close()

        def _build_environ(self, scope, body: bytes):
            environ = {
                "REQUEST_METHOD": scope["method"],
                "SCRIPT_NAME": "",
                "PATH_INFO": scope.get("path", ""),
                "QUERY_STRING": scope.get("query_string", b"").decode("latin-1"),
                "SERVER_NAME": "0.0.0.0",
                "SERVER_PORT": str(scope.get("server", ("0.0.0.0", 10000))[1]),
                "SERVER_PROTOCOL": "HTTP/" + scope.get("http_version", "1.1"),
                "wsgi.version": (1, 0),
                "wsgi.url_scheme": scope.get("scheme", "http"),
                "wsgi.input": io.BytesIO(body),
                "wsgi.errors": sys.stderr,
                "wsgi.multithread": True,
                "wsgi.multiprocess": False,
                "wsgi.run_once": False,
                "CONTENT_LENGTH": str(len(body)),
            }
            for name, value in scope.get("headers", []):
                key = name.decode("latin-1").upper().replace("-", "_")
                text = value.decode("latin-1")
                if key == "CONTENT_TYPE":
                    environ["CONTENT_TYPE"] = text
                elif key == "CONTENT_LENGTH":
                    environ["CONTENT_LENGTH"] = text
                else:
                    environ[f"HTTP_{key}"] = text
            return environ

    app = WsgiToAsgi(flask_app)

