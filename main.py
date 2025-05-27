from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess, tempfile, os, json

app = FastAPI()

class CodeIn(BaseModel):
    code: str

@app.post("/api/v1/secure-scan/python")
async def secure_scan(body: CodeIn):
    if not body.code:
        raise HTTPException(status_code=400, detail="code is required")

    # Write incoming code to a temp file so Bandit can scan it
    with tempfile.NamedTemporaryFile("w+", delete=False, suffix=".py") as f:
        f.write(body.code)
        f.flush()
        result = subprocess.run(
            ["bandit", "-r", f.name, "-f", "json"],
            capture_output=True, text=True, check=False
        )
    os.unlink(f.name)

    try:
        report = json.loads(result.stdout or "{}")
    except json.JSONDecodeError:
        report = {"error": "Bandit failed", "raw": result.stdout}

    return report
