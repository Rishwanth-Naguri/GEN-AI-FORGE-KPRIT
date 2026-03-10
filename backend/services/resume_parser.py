"""
PDF resume text extraction service.
"""

import io
from PyPDF2 import PdfReader


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text content from a PDF file."""
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        text_parts = []
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
        
        full_text = "\n".join(text_parts).strip()
        
        if not full_text:
            raise ValueError("No extractable text found in the PDF. The file may be image-based.")
        
        return full_text
    except Exception as e:
        raise ValueError(f"Failed to parse PDF: {str(e)}")
