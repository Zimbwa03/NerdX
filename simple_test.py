#!/usr/bin/env python3
print("Starting simple test...")

try:
    print("Importing payment service...")
    from services.payment_service import PaymentService
    print("✅ Payment service imported")
    
    print("Creating payment service instance...")
    ps = PaymentService()
    print("✅ Payment service created")
    
    print("Getting credit packages...")
    packages = ps.calculate_credit_packages()
    print(f"✅ Got {len(packages)} packages")
    
    for pkg in packages:
        print(f"   - {pkg['name']}: ${pkg['price']} for {pkg['credits']} credits")
    
    print("Test completed successfully!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
