from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
import tempfile
from pathlib import Path

from app.document_parser import parse_document
from app.ppt_generator import generate_ppt
from app.ai_service import is_api_available

app = FastAPI(title="PPT Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/generate-ppt")
async def generate_ppt_endpoint(
    file: UploadFile = File(...),
    use_ai: bool = Form(True)
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    suffix = Path(file.filename).suffix.lower()
    if suffix not in ['.docx', '.doc', '.pdf', '.txt']:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    with tempfile.TemporaryDirectory() as tmpdir:
        tmp_path = Path(tmpdir) / file.filename
        content = await file.read()
        tmp_path.write_bytes(content)

        try:
            text = parse_document(str(tmp_path), suffix)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Document parsing failed: {str(e)}")

        ppt_path = Path(tmpdir) / "output.pptx"
        try:
            generate_ppt(text, str(ppt_path), use_ai=use_ai)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"PPT generation failed: {str(e)}")

        return FileResponse(
            path=str(ppt_path),
            filename=f"presentation.pptx",
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation"
        )

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.get("/api/status")
async def get_status():
    ai_available = is_api_available()
    return {
        "ai_available": ai_available,
        "message": "AI模型已连接" if ai_available else "使用模板生成模式"
    }