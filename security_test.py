#!/usr/bin/env python3
"""
Security Hardening Tests for Aarush AI Search Visibility
Tests admin authentication, rate limiting, body size caps, and security headers
"""

import requests
import json
import sys
from datetime import datetime

# Base URL and credentials
BASE_URL = "https://aarush-seo.preview.emergentagent.com/api"
ADMIN_TOKEN = "28036f964253ac7437628c651caf519b712d3478fb673ce7"

def print_test_result(test_name, passed, details=""):
    """Print formatted test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"\n{status}: {test_name}")
    if details:
        print(f"  Details: {details}")

def print_section(title):
    """Print section header"""
    print("\n" + "="*80)
    print(title)
    print("="*80)

# =============================================================================
# Test 1: Sanity check - GET /api/root (no auth, no rate limit)
# =============================================================================
def test_root_endpoint():
    print_section("TEST 1: GET /api/root (sanity check)")
    
    try:
        response = requests.get(f"{BASE_URL}/root", timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 200 and data.get("message") == "Hello World":
            print_test_result("GET /api/root", True, "Sanity check passed")
            return True
        else:
            print_test_result("GET /api/root", False, f"Expected 200 with 'Hello World', got {response.status_code}: {data}")
            return False
    except Exception as e:
        print_test_result("GET /api/root", False, f"Exception: {str(e)}")
        return False

# =============================================================================
# Test 2: GET /api/enquiries without auth -> 401
# =============================================================================
def test_get_enquiries_no_auth():
    print_section("TEST 2: GET /api/enquiries without auth -> 401")
    
    try:
        response = requests.get(f"{BASE_URL}/enquiries", timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 401 and data.get("error") == "Unauthorized":
            print_test_result("GET /api/enquiries no auth", True, "Correctly returned 401 Unauthorized")
            return True
        else:
            print_test_result("GET /api/enquiries no auth", False, f"Expected 401 with 'Unauthorized', got {response.status_code}: {data}")
            return False
    except Exception as e:
        print_test_result("GET /api/enquiries no auth", False, f"Exception: {str(e)}")
        return False

# =============================================================================
# Test 3: GET /api/enquiries with wrong token -> 401
# =============================================================================
def test_get_enquiries_wrong_token():
    print_section("TEST 3: GET /api/enquiries with wrong token -> 401")
    
    try:
        headers = {"Authorization": "Bearer wrongtoken123456"}
        response = requests.get(f"{BASE_URL}/enquiries", headers=headers, timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 401 and data.get("error") == "Unauthorized":
            print_test_result("GET /api/enquiries wrong token", True, "Correctly returned 401 Unauthorized")
            return True
        else:
            print_test_result("GET /api/enquiries wrong token", False, f"Expected 401 with 'Unauthorized', got {response.status_code}: {data}")
            return False
    except Exception as e:
        print_test_result("GET /api/enquiries wrong token", False, f"Exception: {str(e)}")
        return False

# =============================================================================
# Test 4: GET /api/enquiries with correct Bearer token -> 200
# =============================================================================
def test_get_enquiries_bearer_token():
    print_section("TEST 4: GET /api/enquiries with correct Bearer token -> 200")
    
    try:
        headers = {"Authorization": f"Bearer {ADMIN_TOKEN}"}
        response = requests.get(f"{BASE_URL}/enquiries", headers=headers, timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response keys: {list(data.keys())}")
        print(f"Count: {data.get('count')}")
        
        if response.status_code != 200:
            print_test_result("GET /api/enquiries Bearer token", False, f"Expected 200, got {response.status_code}: {data}")
            return False
        
        # Check response structure
        if "count" not in data or "enquiries" not in data:
            print_test_result("GET /api/enquiries Bearer token", False, f"Missing count or enquiries field: {data}")
            return False
        
        enquiries = data.get("enquiries", [])
        
        # Check no _id fields
        if enquiries and any("_id" in e for e in enquiries):
            print_test_result("GET /api/enquiries Bearer token", False, "_id field found in response")
            return False
        
        # Check sorting (newest first)
        if len(enquiries) > 1:
            dates = [e.get("createdAt") for e in enquiries if "createdAt" in e]
            if dates != sorted(dates, reverse=True):
                print_test_result("GET /api/enquiries Bearer token", False, "Not sorted by createdAt desc")
                return False
        
        print_test_result("GET /api/enquiries Bearer token", True, f"Retrieved {data['count']} enquiries, no _id fields, sorted correctly")
        return True
    except Exception as e:
        print_test_result("GET /api/enquiries Bearer token", False, f"Exception: {str(e)}")
        return False

# =============================================================================
# Test 5: GET /api/enquiries with X-Admin-Token header -> 200
# =============================================================================
def test_get_enquiries_x_admin_token():
    print_section("TEST 5: GET /api/enquiries with X-Admin-Token header -> 200")
    
    try:
        headers = {"X-Admin-Token": ADMIN_TOKEN}
        response = requests.get(f"{BASE_URL}/enquiries", headers=headers, timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response keys: {list(data.keys())}")
        print(f"Count: {data.get('count')}")
        
        if response.status_code != 200:
            print_test_result("GET /api/enquiries X-Admin-Token", False, f"Expected 200, got {response.status_code}: {data}")
            return False
        
        # Check response structure
        if "count" not in data or "enquiries" not in data:
            print_test_result("GET /api/enquiries X-Admin-Token", False, f"Missing count or enquiries field: {data}")
            return False
        
        print_test_result("GET /api/enquiries X-Admin-Token", True, f"Retrieved {data['count']} enquiries with X-Admin-Token header")
        return True
    except Exception as e:
        print_test_result("GET /api/enquiries X-Admin-Token", False, f"Exception: {str(e)}")
        return False

# =============================================================================
# Test 6: GET /api/status without auth -> 401
# =============================================================================
def test_get_status_no_auth():
    print_section("TEST 6: GET /api/status without auth -> 401")
    
    try:
        response = requests.get(f"{BASE_URL}/status", timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 401 and data.get("error") == "Unauthorized":
            print_test_result("GET /api/status no auth", True, "Correctly returned 401 Unauthorized")
            return True
        else:
            print_test_result("GET /api/status no auth", False, f"Expected 401 with 'Unauthorized', got {response.status_code}: {data}")
            return False
    except Exception as e:
        print_test_result("GET /api/status no auth", False, f"Exception: {str(e)}")
        return False

# =============================================================================
# Test 7: GET /api/status with correct token -> 200
# =============================================================================
def test_get_status_with_token():
    print_section("TEST 7: GET /api/status with correct token -> 200")
    
    try:
        headers = {"Authorization": f"Bearer {ADMIN_TOKEN}"}
        response = requests.get(f"{BASE_URL}/status", headers=headers, timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response type: {type(data)}")
        print(f"Response: {json.dumps(data, indent=2) if isinstance(data, (list, dict)) else data}")
        
        if response.status_code == 200 and isinstance(data, list):
            print_test_result("GET /api/status with token", True, f"Retrieved status array with {len(data)} items")
            return True
        else:
            print_test_result("GET /api/status with token", False, f"Expected 200 with array, got {response.status_code}: {type(data)}")
            return False
    except Exception as e:
        print_test_result("GET /api/status with token", False, f"Exception: {str(e)}")
        return False

# =============================================================================
# Test 8: Check security headers (X-Frame-Options, Content-Security-Policy)
# =============================================================================
def test_security_headers():
    print_section("TEST 8: Security headers (X-Frame-Options, CSP)")
    
    try:
        response = requests.get(f"{BASE_URL}/root", timeout=10)
        
        print(f"Response headers:")
        for key, value in response.headers.items():
            if 'frame' in key.lower() or 'security' in key.lower() or 'csp' in key.lower():
                print(f"  {key}: {value}")
        
        x_frame_options = response.headers.get('X-Frame-Options', '')
        csp = response.headers.get('Content-Security-Policy', '')
        
        print(f"\nX-Frame-Options: {x_frame_options}")
        print(f"Content-Security-Policy: {csp}")
        
        passed = True
        issues = []
        
        if x_frame_options.upper() != 'SAMEORIGIN':
            passed = False
            issues.append(f"X-Frame-Options should be SAMEORIGIN, got: {x_frame_options}")
        
        if 'frame-ancestors' not in csp.lower() or "'self'" not in csp.lower():
            passed = False
            issues.append(f"Content-Security-Policy should contain frame-ancestors 'self', got: {csp}")
        
        if passed:
            print_test_result("Security headers", True, "X-Frame-Options: SAMEORIGIN and CSP with frame-ancestors 'self' present")
            return True
        else:
            print_test_result("Security headers", False, "; ".join(issues))
            return False
    except Exception as e:
        print_test_result("Security headers", False, f"Exception: {str(e)}")
        return False

# =============================================================================
# Test 9: POST /api/enquiries valid payload -> 201 (1st POST)
# =============================================================================
def test_post_enquiry_valid():
    print_section("TEST 9: POST /api/enquiries valid payload -> 201 (1st POST)")
    
    payload = {
        "firstName": "Rajesh",
        "lastName": "Kumar",
        "email": "rajesh.kumar@example.com",
        "countryCode": "+91",
        "phone": "9876543210",
        "source": "LinkedIn",
        "message": "Interested in SEO consultation"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/enquiries", json=payload, timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 201 and data.get("ok") and "enquiry" in data:
            enquiry = data["enquiry"]
            if "_id" in enquiry:
                print_test_result("POST valid enquiry", False, "_id field should not be present")
                return False
            print_test_result("POST valid enquiry", True, f"Created enquiry with id: {enquiry.get('id')}")
            return True
        else:
            print_test_result("POST valid enquiry", False, f"Expected 201 with enquiry, got {response.status_code}: {data}")
            return False
    except Exception as e:
        print_test_result("POST valid enquiry", False, f"Exception: {str(e)}")
        return False

# =============================================================================
# Test 10: POST /api/enquiries with 20,000 char message -> 413 (2nd POST)
# =============================================================================
def test_post_enquiry_large_body():
    print_section("TEST 10: POST /api/enquiries with 20,000 char message -> 413 (2nd POST)")
    
    payload = {
        "firstName": "Test",
        "lastName": "User",
        "email": "test@example.com",
        "countryCode": "+91",
        "phone": "9876543210",
        "source": "Test",
        "message": "A" * 20000  # 20,000 characters
    }
    
    try:
        response = requests.post(f"{BASE_URL}/enquiries", json=payload, timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        print(f"Payload size: {len(json.dumps(payload))} bytes")
        
        if response.status_code == 413 and data.get("error") == "Request body too large":
            print_test_result("POST large body", True, "Correctly returned 413 Request body too large")
            return True
        else:
            print_test_result("POST large body", False, f"Expected 413 with 'Request body too large', got {response.status_code}: {data}")
            return False
    except Exception as e:
        print_test_result("POST large body", False, f"Exception: {str(e)}")
        return False

# =============================================================================
# Test 11: POST /api/enquiries with JSON array -> 400 (3rd POST)
# =============================================================================
def test_post_enquiry_json_array():
    print_section("TEST 11: POST /api/enquiries with JSON array -> 400 (3rd POST)")
    
    try:
        response = requests.post(
            f"{BASE_URL}/enquiries",
            data='[1, 2, 3]',
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 400 and data.get("error") == "Invalid JSON body":
            print_test_result("POST JSON array", True, "Correctly returned 400 Invalid JSON body")
            return True
        else:
            print_test_result("POST JSON array", False, f"Expected 400 with 'Invalid JSON body', got {response.status_code}: {data}")
            return False
    except Exception as e:
        print_test_result("POST JSON array", False, f"Exception: {str(e)}")
        return False

# =============================================================================
# Test 12-14: POST /api/enquiries valid payloads (4th, 5th POST)
# =============================================================================
def test_post_enquiry_multiple(test_num, post_count):
    print_section(f"TEST {test_num}: POST /api/enquiries valid payload -> 201 ({post_count} POST)")
    
    payload = {
        "firstName": f"User{post_count}",
        "lastName": "Test",
        "email": f"user{post_count}@example.com",
        "countryCode": "+91",
        "phone": "9876543210",
        "source": "Test",
        "message": f"Test message {post_count}"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/enquiries", json=payload, timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 201 and data.get("ok"):
            print_test_result(f"POST valid enquiry ({post_count})", True, f"Created enquiry")
            return True
        else:
            print_test_result(f"POST valid enquiry ({post_count})", False, f"Expected 201, got {response.status_code}: {data}")
            return False
    except Exception as e:
        print_test_result(f"POST valid enquiry ({post_count})", False, f"Exception: {str(e)}")
        return False

# =============================================================================
# Test 15: POST /api/enquiries rate limit -> 429 (6th POST)
# =============================================================================
def test_post_enquiry_rate_limit():
    print_section("TEST 15: POST /api/enquiries rate limit -> 429 (6th POST)")
    
    payload = {
        "firstName": "RateLimit",
        "lastName": "Test",
        "email": "ratelimit@example.com",
        "countryCode": "+91",
        "phone": "9876543210",
        "source": "Test",
        "message": "This should be rate limited"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/enquiries", json=payload, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response text: {response.text[:500]}")
        print(f"Content-Type: {response.headers.get('Content-Type', 'N/A')}")
        print(f"Headers:")
        for key, value in response.headers.items():
            if 'retry' in key.lower():
                print(f"  {key}: {value}")
        
        retry_after = response.headers.get('Retry-After', '')
        
        # Try to parse JSON, but handle non-JSON responses
        data = None
        try:
            data = response.json()
            print(f"Response JSON: {json.dumps(data, indent=2)}")
        except:
            print(f"Response is not JSON")
        
        if response.status_code == 429 and retry_after:
            if data and "error" in data:
                print_test_result("POST rate limit", True, f"Correctly returned 429 with Retry-After: {retry_after}s and error message")
                return True
            else:
                print_test_result("POST rate limit", True, f"Correctly returned 429 with Retry-After: {retry_after}s (no JSON body)")
                return True
        else:
            print_test_result("POST rate limit", False, f"Expected 429 with Retry-After header, got {response.status_code}, Retry-After: {retry_after}")
            return False
    except Exception as e:
        print_test_result("POST rate limit", False, f"Exception: {str(e)}")
        return False

# =============================================================================
# Main test runner
# =============================================================================
def main():
    print("\n" + "="*80)
    print("SECURITY HARDENING TESTS - Aarush AI Search Visibility")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Started at: {datetime.now().isoformat()}")
    print(f"Admin Token: {ADMIN_TOKEN[:20]}...")
    
    results = {}
    
    # Run tests in order
    results["1_root_endpoint"] = test_root_endpoint()
    results["2_get_enquiries_no_auth"] = test_get_enquiries_no_auth()
    results["3_get_enquiries_wrong_token"] = test_get_enquiries_wrong_token()
    results["4_get_enquiries_bearer_token"] = test_get_enquiries_bearer_token()
    results["5_get_enquiries_x_admin_token"] = test_get_enquiries_x_admin_token()
    results["6_get_status_no_auth"] = test_get_status_no_auth()
    results["7_get_status_with_token"] = test_get_status_with_token()
    results["8_security_headers"] = test_security_headers()
    
    # Rate-limited POST tests (must be in order)
    print("\n" + "="*80)
    print("RATE LIMIT TESTS - These count toward the 5 req/10min limit")
    print("="*80)
    
    results["9_post_valid_1st"] = test_post_enquiry_valid()
    results["10_post_large_body_2nd"] = test_post_enquiry_large_body()
    results["11_post_json_array_3rd"] = test_post_enquiry_json_array()
    results["12_post_valid_4th"] = test_post_enquiry_multiple(12, "4th")
    results["13_post_valid_5th"] = test_post_enquiry_multiple(13, "5th")
    results["14_post_rate_limit_6th"] = test_post_enquiry_rate_limit()
    
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
    print(f"Completed at: {datetime.now().isoformat()}")
    
    if passed == total:
        print("\n🎉 All security tests passed!")
        sys.exit(0)
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
