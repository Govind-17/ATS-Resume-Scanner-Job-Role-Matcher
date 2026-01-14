import requests
import logging

logger = logging.getLogger(__name__)

class TikaParser:
    """
    Parses resume content using Apache Tika first.
    Falls back to local Python libraries (pypdf, docx2txt) if Tika is unavailable.
    
    INSTRUCTIONS TO ENABLE TIKA:
    1. Download Tika Server JAR: https://tika.apache.org/download.html
    2. Run it: `java -jar tika-server-standard-x.x.x.jar`
    3. Ensure it's listening on port 9998.
    """
    def __init__(self, tika_url="http://localhost:9998/tika"):
        self.tika_url = tika_url

    def parse_resume(self, file_content: bytes, filename: str = "resume.pdf") -> str:
        # 1. Try Apache Tika (Best Quality)
        try:
            headers = {
                "X-Tika-PDFextractInlineImages": "true",
                "Accept": "text/plain"
            }
            # Determine mime type hint if possible, but Tika is good at detection
            if filename.endswith(".pdf"):
                headers["Content-Type"] = "application/pdf"
            
            response = requests.put(
                self.tika_url,
                data=file_content,
                headers=headers,
                timeout=5 # Short timeout to fail fast to fallback
            )
            response.raise_for_status()
            text = response.text.strip()
            if text:
                return text
        except requests.exceptions.RequestException:
            logger.warning("Tika Service unavailable. Falling back to local parsers.")

        # 2. Fallback: Local Parsing
        return self._local_fallback(file_content, filename)

    def _local_fallback(self, content: bytes, filename: str) -> str:
        try:
            import io
            filename = filename.lower()
            
            if filename.endswith(".pdf"):
                from pypdf import PdfReader
                reader = PdfReader(io.BytesIO(content))
                text = ""
                for page in reader.pages:
                    text += page.extract_text() + "\n"
                return text.strip() if text else "Error: Empty PDF or unreadable."

            elif filename.endswith(".docx"):
                import docx2txt
                # docx2txt expects a file path or file-like object
                # We need to write to temp or use io? docx2txt process args usually.
                # Actually, python-docx is better but docx2txt is simpler for just text.
                # Let's use a temporary file approach or a different lib if needed, 
                # but docx2txt.process(file_obj) works? 
                # Checking docx2txt signature: process(src) where src is path. 
                # Let's use 'docx' (python-docx) for robust io support if docx2txt fails, 
                # but let's try a workaround since we added docx2txt.
                # Actually, let's write to a temp file safely.
                import tempfile, os
                with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
                    tmp.write(content)
                    tmp_path = tmp.name
                
                try:
                    text = docx2txt.process(tmp_path)
                finally:
                    os.remove(tmp_path)
                return text

            elif filename.endswith(".txt"):
                return content.decode("utf-8", errors="ignore")

            return "Error: Unsupported file format for local fallback. Please enable Tika."

        except Exception as e:
            logger.error(f"Fallback parsing failed: {e}")
            return f"Error: Parsing failed. {str(e)}"
