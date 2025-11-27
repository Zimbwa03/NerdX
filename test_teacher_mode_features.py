import requests
import os

BASE_URL = "http://localhost:5000"
IMAGE_PATH = r"C:/Users/GWENJE/.gemini/antigravity/brain/7d28361b-6347-4d10-bbc9-71671ea63d9c/uploaded_image_0_1764200866785.jpg"

def test_math_scan():
    print("\nTesting /api/mobile/math/scan...")
    if not os.path.exists(IMAGE_PATH):
        print(f"Image not found at {IMAGE_PATH}")
        return

    url = f"{BASE_URL}/api/mobile/math/scan"
    files = {'image': open(IMAGE_PATH, 'rb')}
    try:
        response = requests.post(url, files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

def test_voice_speak():
    print("\nTesting /api/mobile/voice/speak...")
    url = f"{BASE_URL}/api/mobile/voice/speak"
    data = {'text': 'Hello, this is a test.'}
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_math_scan()
    test_voice_speak()
