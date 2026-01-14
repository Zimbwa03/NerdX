
import os
import logging
from PIL import Image, ImageDraw, ImageFont

# Setup logging
logging.basicConfig(level=logging.INFO)

def create_dummy_image(path):
    img = Image.new('RGB', (200, 100), color = (255, 255, 255))
    d = ImageDraw.Draw(img)
    d.text((10,10), "x^2 + y^2 = 4", fill=(0,0,0))
    img.save(path)
    print(f"Created dummy image at {path}")

def test_math_ocr():
    print("\n--- Testing Math OCR Service ---")
    image_path = "test_math.png"
    create_dummy_image(image_path)
    
    try:
        from services.math_ocr_service import MathOCRService
        service = MathOCRService()
        
        print(f"Gemini Available: {service.gemini_model is not None}")
        print(f"API Key Present: {bool(service.gemini_api_key)}")
        
        result = service.scan_equation(image_path)
        print(f"Scan Result: {result}")
        
    except Exception as e:
        print(f"EXCEPTION: {e}")
    finally:
        if os.path.exists(image_path):
            os.remove(image_path)

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    test_math_ocr()
