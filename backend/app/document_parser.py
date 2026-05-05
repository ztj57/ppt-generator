from docx import Document
from pypdf import PdfReader
from pathlib import Path


def parse_document(file_path: str, suffix: str) -> str:
    suffix = suffix.lower()
    if suffix in ['.docx', '.doc']:
        return parse_word(file_path)
    elif suffix == '.pdf':
        return parse_pdf(file_path)
    elif suffix == '.txt':
        return Path(file_path).read_text(encoding='utf-8')
    else:
        raise ValueError(f"Unsupported file type: {suffix}")


def parse_word(file_path: str) -> str:
    doc = Document(file_path)
    paragraphs = []
    for para in doc.paragraphs:
        text = para.text.strip()
        if text:
            paragraphs.append(text)
    return '\n'.join(paragraphs)


def parse_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    text_parts = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            text_parts.append(text.strip())
    return '\n'.join(text_parts)