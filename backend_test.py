#!/usr/bin/env python3
"""
Backend API Tests for Aarush AI Search Visibility
Tests POST /api/enquiries and GET /api/enquiries endpoints
"""

import requests
import json
import sys
from datetime import datetime

# Base URL from environment
BASE_URL = "https://aarush-seo.preview.emergentagent.com/api"

def print_test_result(test_name, passed, details=""):
    """Print formatted test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"\n{status}: {test_name}")
    if details:
        print(f"  Details: {details}")

def test_root_endpoint():
    """Sanity check: GET /api/root should return Hello World"""
    print("\n" + "="*80)
    print("TEST: GET /api/root (sanity check)")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/root", timeout=10)
        data = response.json()
        
        if response.status_code == 200 and data.get("message") == "Hello World":
            print_test_result("GET /api/root", True, f"Response: {data}")
            return True
        else:
            print_test_result("GET /api/root", False, f"Status: {response.status_code}, Body: {data}")
            return False
    except Exception as e:
        print_test_result("GET /api/root", False, f"Exception: {str(e)}")
        return False

def test_post_enquiry_valid():
    """Test POST /api/enquiries with valid payload"""
    print("\n" + "="*80)
    print("TEST: POST /api/enquiries - Valid payload")
    print("="*80)
    
    payload = {
        "firstName": "Aditi",
        "lastName": "Sharma",
        "email": "aditi@example.com",
        "company": "acme.com",
        "country": "India",
        "countryCode": "+91",
        "phone": "98765 43210",
        "source": "LinkedIn",
        "message": "Why does ChatGPT recommend our competitor?"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/enquiries", json=payload, timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        # Check status code
        if response.status_code != 201:
            print_test_result("Valid payload - Status code", False, f"Expected 201, got {response.status_code}")
            return None
        
        # Check response structure
        if not data.get("ok"):
            print_test_result("Valid payload - ok field", False, "ok field is not true")
            return None
        
        enquiry = data.get("enquiry")
        if not enquiry:
            print_test_result("Valid payload - enquiry field", False, "enquiry field missing")
            return None
        
        # Check required fields
        required_fields = ["id", "firstName", "lastName", "email", "company", "country", 
                          "countryCode", "phone", "source", "message", "status", "createdAt"]
        missing_fields = [f for f in required_fields if f not in enquiry]
        if missing_fields:
            print_test_result("Valid payload - Required fields", False, f"Missing: {missing_fields}")
            return None
        
        # Check _id is NOT present
        if "_id" in enquiry:
            print_test_result("Valid payload - No _id field", False, "_id field should not be present")
            return None
        
        # Check field values
        checks = []
        checks.append(("firstName", enquiry.get("firstName") == "Aditi"))
        checks.append(("lastName", enquiry.get("lastName") == "Sharma"))
        checks.append(("email lowercase", enquiry.get("email") == "aditi@example.com"))
        checks.append(("phone stripped", enquiry.get("phone") == "9876543210"))
        checks.append(("status", enquiry.get("status") == "new"))
        checks.append(("id is uuid", len(enquiry.get("id", "")) == 36))
        
        failed_checks = [name for name, result in checks if not result]
        if failed_checks:
            print_test_result("Valid payload - Field validation", False, f"Failed: {failed_checks}")
            return None
        
        print_test_result("Valid payload", True, f"Created enquiry with id: {enquiry['id']}")
        return enquiry
        
    except Exception as e:
        print_test_result("Valid payload", False, f"Exception: {str(e)}")
        return None

def test_post_enquiry_missing_fields():
    """Test POST /api/enquiries with missing required fields"""
    print("\n" + "="*80)
    print("TEST: POST /api/enquiries - Missing required fields")
    print("="*80)
    
    payload = {}
    
    try:
        response = requests.post(f"{BASE_URL}/enquiries", json=payload, timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code != 400:
            print_test_result("Missing fields - Status code", False, f"Expected 400, got {response.status_code}")
            return False
        
        if data.get("error") != "Validation failed":
            print_test_result("Missing fields - Error message", False, f"Expected 'Validation failed', got {data.get('error')}")
            return False
        
        errors = data.get("errors", {})
        required_error_fields = ["firstName", "lastName", "email", "countryCode", "phone", "source"]
        missing_errors = [f for f in required_error_fields if f not in errors]
        
        if missing_errors:
            print_test_result("Missing fields - Error fields", False, f"Missing error fields: {missing_errors}")
            return False
        
        print_test_result("Missing fields", True, f"Correctly returned validation errors for: {list(errors.keys())}")
        return True
        
    except Exception as e:
        print_test_result("Missing fields", False, f"Exception: {str(e)}")
        return False

def test_post_enquiry_invalid_email():
    """Test POST /api/enquiries with invalid email"""
    print("\n" + "="*80)
    print("TEST: POST /api/enquiries - Invalid email")
    print("="*80)
    
    payload = {
        "firstName": "Raj",
        "lastName": "Kumar",
        "email": "not-an-email",
        "countryCode": "+91",
        "phone": "9876543210",
        "source": "Google"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/enquiries", json=payload, timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code != 400:
            print_test_result("Invalid email - Status code", False, f"Expected 400, got {response.status_code}")
            return False
        
        errors = data.get("errors", {})
        if "email" not in errors:
            print_test_result("Invalid email - Error field", False, "email error not present")
            return False
        
        print_test_result("Invalid email", True, f"Email error: {errors['email']}")
        return True
        
    except Exception as e:
        print_test_result("Invalid email", False, f"Exception: {str(e)}")
        return False

def test_post_enquiry_invalid_phone():
    """Test POST /api/enquiries with invalid phone (too short and with letters)"""
    print("\n" + "="*80)
    print("TEST: POST /api/enquiries - Invalid phone")
    print("="*80)
    
    # Test 1: Phone too short
    payload1 = {
        "firstName": "Priya",
        "lastName": "Singh",
        "email": "priya@example.com",
        "countryCode": "+91",
        "phone": "123",
        "source": "Referral"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/enquiries", json=payload1, timeout=10)
        data = response.json()
        
        print(f"Test 1 - Phone too short (123)")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code != 400 or "phone" not in data.get("errors", {}):
            print_test_result("Invalid phone (too short)", False, "Should reject phone with < 6 digits")
            return False
        
        print_test_result("Invalid phone (too short)", True, f"Phone error: {data['errors']['phone']}")
        
    except Exception as e:
        print_test_result("Invalid phone (too short)", False, f"Exception: {str(e)}")
        return False
    
    # Test 2: Phone with letters
    payload2 = {
        "firstName": "Priya",
        "lastName": "Singh",
        "email": "priya@example.com",
        "countryCode": "+91",
        "phone": "98765abc10",
        "source": "Referral"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/enquiries", json=payload2, timeout=10)
        data = response.json()
        
        print(f"\nTest 2 - Phone with letters (98765abc10)")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code != 400 or "phone" not in data.get("errors", {}):
            print_test_result("Invalid phone (with letters)", False, "Should reject phone with letters")
            return False
        
        print_test_result("Invalid phone (with letters)", True, f"Phone error: {data['errors']['phone']}")
        return True
        
    except Exception as e:
        print_test_result("Invalid phone (with letters)", False, f"Exception: {str(e)}")
        return False

def test_post_enquiry_invalid_country_code():
    """Test POST /api/enquiries with invalid country code (no plus sign)"""
    print("\n" + "="*80)
    print("TEST: POST /api/enquiries - Invalid country code")
    print("="*80)
    
    payload = {
        "firstName": "Amit",
        "lastName": "Patel",
        "email": "amit@example.com",
        "countryCode": "91",
        "phone": "9876543210",
        "source": "Twitter"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/enquiries", json=payload, timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code != 400:
            print_test_result("Invalid country code - Status code", False, f"Expected 400, got {response.status_code}")
            return False
        
        errors = data.get("errors", {})
        if "countryCode" not in errors:
            print_test_result("Invalid country code - Error field", False, "countryCode error not present")
            return False
        
        print_test_result("Invalid country code", True, f"CountryCode error: {errors['countryCode']}")
        return True
        
    except Exception as e:
        print_test_result("Invalid country code", False, f"Exception: {str(e)}")
        return False

def test_post_enquiry_message_too_long():
    """Test POST /api/enquiries with message > 2000 characters"""
    print("\n" + "="*80)
    print("TEST: POST /api/enquiries - Message too long")
    print("="*80)
    
    payload = {
        "firstName": "Neha",
        "lastName": "Gupta",
        "email": "neha@example.com",
        "countryCode": "+91",
        "phone": "9876543210",
        "source": "Blog",
        "message": "A" * 2001
    }
    
    try:
        response = requests.post(f"{BASE_URL}/enquiries", json=payload, timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code != 400:
            print_test_result("Message too long - Status code", False, f"Expected 400, got {response.status_code}")
            return False
        
        errors = data.get("errors", {})
        if "message" not in errors:
            print_test_result("Message too long - Error field", False, "message error not present")
            return False
        
        print_test_result("Message too long", True, f"Message error: {errors['message']}")
        return True
        
    except Exception as e:
        print_test_result("Message too long", False, f"Exception: {str(e)}")
        return False

def test_post_enquiry_honeypot():
    """Test POST /api/enquiries with honeypot field (should not store)"""
    print("\n" + "="*80)
    print("TEST: POST /api/enquiries - Honeypot (should not store)")
    print("="*80)
    
    unique_email = f"honeypot-test-{datetime.now().timestamp()}@example.com"
    payload = {
        "firstName": "Bot",
        "lastName": "Spammer",
        "email": unique_email,
        "countryCode": "+91",
        "phone": "9876543210",
        "source": "Spam",
        "website_url": "http://spam.com"
    }
    
    try:
        # POST with honeypot
        response = requests.post(f"{BASE_URL}/enquiries", json=payload, timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code != 200:
            print_test_result("Honeypot - Status code", False, f"Expected 200, got {response.status_code}")
            return False
        
        if not data.get("ok"):
            print_test_result("Honeypot - ok field", False, "ok field should be true")
            return False
        
        if "id" not in data:
            print_test_result("Honeypot - id field", False, "id field should be present")
            return False
        
        print(f"Honeypot submission accepted with id: {data['id']}")
        
        # Now verify it's NOT in the database
        print("\nVerifying honeypot submission is NOT stored...")
        get_response = requests.get(f"{BASE_URL}/enquiries", timeout=10)
        get_data = get_response.json()
        
        enquiries = get_data.get("enquiries", [])
        honeypot_found = any(e.get("email") == unique_email for e in enquiries)
        
        if honeypot_found:
            print_test_result("Honeypot - Not stored", False, f"Honeypot submission with email {unique_email} was stored in database")
            return False
        
        print_test_result("Honeypot", True, "Honeypot submission accepted but not stored")
        return True
        
    except Exception as e:
        print_test_result("Honeypot", False, f"Exception: {str(e)}")
        return False

def test_post_enquiry_invalid_json():
    """Test POST /api/enquiries with invalid JSON body"""
    print("\n" + "="*80)
    print("TEST: POST /api/enquiries - Invalid JSON body")
    print("="*80)
    
    try:
        response = requests.post(
            f"{BASE_URL}/enquiries", 
            data="not valid json{{{",
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code != 400:
            print_test_result("Invalid JSON - Status code", False, f"Expected 400, got {response.status_code}")
            return False
        
        if data.get("error") != "Invalid JSON body":
            print_test_result("Invalid JSON - Error message", False, f"Expected 'Invalid JSON body', got {data.get('error')}")
            return False
        
        print_test_result("Invalid JSON", True, "Correctly rejected invalid JSON")
        return True
        
    except Exception as e:
        print_test_result("Invalid JSON", False, f"Exception: {str(e)}")
        return False

def test_get_enquiries(created_enquiry_id=None):
    """Test GET /api/enquiries"""
    print("\n" + "="*80)
    print("TEST: GET /api/enquiries")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/enquiries", timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_test_result("GET enquiries - Status code", False, f"Expected 200, got {response.status_code}")
            return False
        
        # Check response structure
        if "count" not in data:
            print_test_result("GET enquiries - count field", False, "count field missing")
            return False
        
        if "enquiries" not in data:
            print_test_result("GET enquiries - enquiries field", False, "enquiries field missing")
            return False
        
        enquiries = data["enquiries"]
        count = data["count"]
        
        print(f"Count: {count}")
        print(f"Enquiries returned: {len(enquiries)}")
        
        if count != len(enquiries):
            print_test_result("GET enquiries - Count mismatch", False, f"count={count} but len(enquiries)={len(enquiries)}")
            return False
        
        # Check no _id fields
        has_id_field = any("_id" in e for e in enquiries)
        if has_id_field:
            print_test_result("GET enquiries - No _id field", False, "_id field found in enquiries")
            return False
        
        # Check sorting (newest first)
        if len(enquiries) > 1:
            dates = [e.get("createdAt") for e in enquiries if "createdAt" in e]
            if dates != sorted(dates, reverse=True):
                print_test_result("GET enquiries - Sorting", False, "Enquiries not sorted by createdAt desc")
                return False
        
        # If we created an enquiry, verify it's in the list
        if created_enquiry_id:
            found = any(e.get("id") == created_enquiry_id for e in enquiries)
            if not found:
                print_test_result("GET enquiries - Created enquiry present", False, f"Enquiry {created_enquiry_id} not found")
                return False
            print(f"✓ Created enquiry {created_enquiry_id} found in list")
        
        print_test_result("GET enquiries", True, f"Retrieved {count} enquiries, sorted correctly, no _id fields")
        return True
        
    except Exception as e:
        print_test_result("GET enquiries", False, f"Exception: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("\n" + "="*80)
    print("BACKEND API TESTS - Aarush AI Search Visibility")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Started at: {datetime.now().isoformat()}")
    
    results = {}
    
    # Sanity check
    results["root_endpoint"] = test_root_endpoint()
    
    # POST /api/enquiries tests
    created_enquiry = test_post_enquiry_valid()
    results["post_valid"] = created_enquiry is not None
    
    results["post_missing_fields"] = test_post_enquiry_missing_fields()
    results["post_invalid_email"] = test_post_enquiry_invalid_email()
    results["post_invalid_phone"] = test_post_enquiry_invalid_phone()
    results["post_invalid_country_code"] = test_post_enquiry_invalid_country_code()
    results["post_message_too_long"] = test_post_enquiry_message_too_long()
    results["post_honeypot"] = test_post_enquiry_honeypot()
    results["post_invalid_json"] = test_post_enquiry_invalid_json()
    
    # GET /api/enquiries test
    created_id = created_enquiry["id"] if created_enquiry else None
    results["get_enquiries"] = test_get_enquiries(created_id)
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed!")
        sys.exit(0)
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
