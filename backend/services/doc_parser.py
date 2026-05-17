import pypdf
from docx import Document
from typing import List, Dict, Any

def parse_pdf(file_path: str) -> Dict[str, Any]:
    with open(file_path, 'rb') as f:
        reader = pypdf.PdfReader(f)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        
        # Simple extraction: assume title is the first non-empty line
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        title = lines[0] if lines else Path(file_path).stem
        
        return {
            "title": title,
            "author": None,
            "total_chapters": 0,
            "price": 0.0,
            "stock_quantity": 10,
        }

def parse_docx(file_path: str) -> Dict[str, Any]:
    doc = Document(file_path)
    text = "\n".join([p.text for p in doc.paragraphs])
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    title = lines[0] if lines else Path(file_path).stem
    
    return {
        "title": title,
        "author": None,
        "total_chapters": 0,
        "price": 0.0,
        "stock_quantity": 10,
    }
