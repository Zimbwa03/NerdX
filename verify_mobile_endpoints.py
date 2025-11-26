import requests
import json
import os

BASE_URL = "http://localhost:5000"

def test_endpoint(name, method, endpoint, data=None, files=None):
    print(f"Testing {name} ({endpoint})...", end=" ")
    try:
        if method == 'POST':
            if files:
                response = requests.post(f"{BASE_URL}{endpoint}", files=files)
            else:
                response = requests.post(f"{BASE_URL}{endpoint}", json=data)
        else:
            response = requests.get(f"{BASE_URL}{endpoint}")
            
        if response.status_code == 200:
            print("[SUCCESS]")
            try:
                print(json.dumps(response.json(), indent=2))
            except:
                print("Response not JSON")
            return True
        else:
            print(f"[FAILED] ({response.status_code})")
            print(response.text)
            return False
    except Exception as e:
        print(f"[ERROR]: {e}")
        return False

def main():
    print("=== Verifying Mobile API Endpoints ===\n")
    
    # 1. Test Math Solver (SymPy)
    test_endpoint(
        "Math Solver", 
        "POST", 
        "/mobile/math/solve", 
        {"problem": "2*x + 5 = 15"}
    )
    
    # 2. Test Manim Quadratic
    # Note: This might fail if Manim is not set up, but we want to check the endpoint exists
    test_endpoint(
        "Manim Quadratic", 
        "POST", 
        "/mobile/math/animate/quadratic", 
        {"a": 1, "b": 0, "c": 0}
    )
    
    # 3. Test Manim Linear
    test_endpoint(
        "Manim Linear", 
        "POST", 
        "/mobile/math/animate/linear", 
        {"m": 2, "c": 1}
    )

if __name__ == "__main__":
    main()
