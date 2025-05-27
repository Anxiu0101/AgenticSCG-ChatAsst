import json, subprocess, tempfile, os
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get('content-length', 0))
        body = json.loads(self.rfile.read(length) or '{}')
        code  = body.get("code", "")
        if not code:
            self.send_error(400, "code is required"); return

        with tempfile.NamedTemporaryFile("w+", delete=False, suffix=".py") as f:
            f.write(code); f.flush()
            result = subprocess.run(
                ["bandit", "-r", f.name, "-f", "json"],
                capture_output=True, text=True, check=False
            )
        os.unlink(f.name)

        self.send_response(200)
        self.send_header("content-type", "application/json")
        self.end_headers()
        self.wfile.write(result.stdout.encode())
