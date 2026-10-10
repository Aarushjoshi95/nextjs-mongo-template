#!/usr/bin/env python3
"""
Backend AI Features Tests for Aarush AI Search Visibility
Tests POST /api/visibility (Gemini + Jev scoring) and POST /api/enquiries (Jev enrichment)
"""

import requests
import json
import sys
from datetime import datetime
from pymongo import MongoClient
import os

# Base URL and credentials
BASE_URL = "https://aarush-seo.preview.emergentagent.com/api"
ADMIN_TOKEN = "28036f964253ac7437628c651caf519b712d3478fb673ce7"
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "your_database_name"

def print_test_result(test_name, passed, details=""):
    """Print formatted test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"\n{status}: {test_name}")
    if details:
        print(f"  Details: {details}")

def test_visibility_valid():
    """Test POST /api/visibility with valid payload"""
    print("\n" + "="*80)
    print("TEST: POST /api/visibility - Valid payload (Scaler + data science)")
    print("="*80)
    
    payload = {
        "brand": "Scaler",
        "buyerPrompt": "best online data science course in India for working professionals"
    }
    
    try:
        print(f"Sending request to {BASE_URL}/visibility...")
        print(f"Payload: {json.dumps(payload, indent=2)}")
        print("Note: This may take 4-15 seconds...")
        
        response = requests.post(f"{BASE_URL}/visibility", json=payload, timeout=60)
        data = response.json()
        
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        # Check status code
        if response.status_code != 200:
            print_test_result("Visibility valid - Status code", False, f"Expected 200, got {response.status_code}")
            return False
        
        # Check required fields
        required_fields = ["id", "brand", "buyerPrompt", "engine", "model", "answer", 
                          "mentioned", "competitors", "createdAt"]
        missing_fields = [f for f in required_fields if f not in data]
        if missing_fields:
            print_test_result("Visibility valid - Required fields", False, f"Missing: {missing_fields}")
            return False
        
        # Check answer is non-empty string without **
        answer = data.get("answer", "")
        if not isinstance(answer, str) or not answer:
            print_test_result("Visibility valid - Answer", False, "answer must be non-empty string")
            return False
        
        if "**" in answer:
            print_test_result("Visibility valid - Answer markdown", False, "answer contains ** (markdown not stripped)")
            return False
        
        # Check mentioned is boolean
        mentioned = data.get("mentioned")
        if not isinstance(mentioned, bool):
            print_test_result("Visibility valid - mentioned type", False, f"mentioned must be boolean, got {type(mentioned)}")
            return False
        
        # Check competitors is array of strings
        competitors = data.get("competitors")
        if not isinstance(competitors, list):
            print_test_result("Visibility valid - competitors type", False, f"competitors must be array, got {type(competitors)}")
            return False
        
        if not all(isinstance(c, str) for c in competitors):
            print_test_result("Visibility valid - competitors items", False, "competitors must be array of strings")
            return False
        
        # Check engine is "Gemini"
        if data.get("engine") != "Gemini":
            print_test_result("Visibility valid - engine", False, f"engine must be 'Gemini', got {data.get('engine')}")
            return False
        
        # Check model is string
        if not isinstance(data.get("model"), str):
            print_test_result("Visibility valid - model type", False, "model must be string")
            return False
        
        # Check createdAt is ISO format
        try:
            datetime.fromisoformat(data.get("createdAt", "").replace("Z", "+00:00"))
        except:
            print_test_result("Visibility valid - createdAt", False, "createdAt must be ISO format")
            return False
        
        # If aiScored is true, check scoring fields
        if data.get("aiScored"):
            # Check visibilityScore 0-100
            score = data.get("visibilityScore")
            if not isinstance(score, int) or score < 0 or score > 100:
                print_test_result("Visibility valid - visibilityScore", False, f"visibilityScore must be integer 0-100, got {score}")
                return False
            
            # Check stance in allowed set
            stance = data.get("stance")
            allowed_stances = ["not_mentioned", "mentioned_in_passing", "listed_as_option", "recommended"]
            if stance not in allowed_stances:
                print_test_result("Visibility valid - stance", False, f"stance must be in {allowed_stances}, got {stance}")
                return False
            
            # Check sentiment in allowed set
            sentiment = data.get("sentiment")
            allowed_sentiments = ["negative", "neutral", "positive"]
            if sentiment not in allowed_sentiments:
                print_test_result("Visibility valid - sentiment", False, f"sentiment must be in {allowed_sentiments}, got {sentiment}")
                return False
            
            # Check shortlistProbability 0-1
            prob = data.get("shortlistProbability")
            if not isinstance(prob, (int, float)) or prob < 0 or prob > 1:
                print_test_result("Visibility valid - shortlistProbability", False, f"shortlistProbability must be 0-1, got {prob}")
                return False
            
            print(f"✓ AI Scoring: score={score}, stance={stance}, sentiment={sentiment}, shortlist={prob}")
        else:
            print("⚠ aiScored is false (Jev scoring failed, fail-open)")
        
        print_test_result("Visibility valid", True, f"Answer length: {len(answer)}, Mentioned: {mentioned}, Competitors: {len(competitors)}")
        return True
        
    except requests.exceptions.Timeout:
        print_test_result("Visibility valid", False, "Request timed out after 60s")
        return False
    except Exception as e:
        print_test_result("Visibility valid", False, f"Exception: {str(e)}")
        return False

def test_visibility_missing_brand():
    """Test POST /api/visibility with missing brand"""
    print("\n" + "="*80)
    print("TEST: POST /api/visibility - Missing brand")
    print("="*80)
    
    payload = {
        "buyerPrompt": "best shoes"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/visibility", json=payload, timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code != 400:
            print_test_result("Visibility missing brand - Status code", False, f"Expected 400, got {response.status_code}")
            return False
        
        if data.get("error") != "Validation failed":
            print_test_result("Visibility missing brand - Error message", False, f"Expected 'Validation failed', got {data.get('error')}")
            return False
        
        errors = data.get("errors", {})
        if "brand" not in errors:
            print_test_result("Visibility missing brand - Error field", False, "errors.brand not present")
            return False
        
        print_test_result("Visibility missing brand", True, f"Brand error: {errors['brand']}")
        return True
        
    except Exception as e:
        print_test_result("Visibility missing brand", False, f"Exception: {str(e)}")
        return False

def test_visibility_short_prompt():
    """Test POST /api/visibility with short buyerPrompt"""
    print("\n" + "="*80)
    print("TEST: POST /api/visibility - Short buyerPrompt")
    print("="*80)
    
    payload = {
        "brand": "Nike",
        "buyerPrompt": "shoes"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/visibility", json=payload, timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code != 400:
            print_test_result("Visibility short prompt - Status code", False, f"Expected 400, got {response.status_code}")
            return False
        
        if data.get("error") != "Validation failed":
            print_test_result("Visibility short prompt - Error message", False, f"Expected 'Validation failed', got {data.get('error')}")
            return False
        
        errors = data.get("errors", {})
        if "buyerPrompt" not in errors:
            print_test_result("Visibility short prompt - Error field", False, "errors.buyerPrompt not present")
            return False
        
        print_test_result("Visibility short prompt", True, f"BuyerPrompt error: {errors['buyerPrompt']}")
        return True
        
    except Exception as e:
        print_test_result("Visibility short prompt", False, f"Exception: {str(e)}")
        return False

def test_enquiry_genuine_lead():
    """Test POST /api/enquiries with genuine lead (Jev enrichment)"""
    print("\n" + "="*80)
    print("TEST: POST /api/enquiries - Genuine lead with Jev enrichment")
    print("="*80)
    
    payload = {
        "firstName": "Priya",
        "lastName": "Nair",
        "email": "priya@traya.health",
        "company": "Traya",
        "country": "India",
        "countryCode": "+91",
        "phone": "9876543210",
        "source": "LinkedIn",
        "message": "We are a D2C hair health brand doing ~2M organic sessions/mo. Our Head of Growth wants an audit of how we show up in ChatGPT and AI Overviews before Q3 budget planning. Can we scope a 2-3 week audit?"
    }
    
    try:
        print(f"Sending genuine lead enquiry...")
        print(f"Payload: {json.dumps(payload, indent=2)}")
        print("Note: This may take a few seconds for AI enrichment...")
        
        response = requests.post(f"{BASE_URL}/enquiries", json=payload, timeout=30)
        data = response.json()
        
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        # Check status code
        if response.status_code != 201:
            print_test_result("Genuine lead - Status code", False, f"Expected 201, got {response.status_code}")
            return None
        
        enquiry = data.get("enquiry")
        if not enquiry:
            print_test_result("Genuine lead - enquiry field", False, "enquiry field missing")
            return None
        
        # Check leadLabel in allowed set
        lead_label = enquiry.get("leadLabel")
        allowed_labels = ["cold", "warm", "hot"]
        if lead_label not in allowed_labels:
            print_test_result("Genuine lead - leadLabel", False, f"leadLabel must be in {allowed_labels}, got {lead_label}")
            return None
        
        # Check leadScore 0-100
        lead_score = enquiry.get("leadScore")
        if not isinstance(lead_score, int) or lead_score < 0 or lead_score > 100:
            print_test_result("Genuine lead - leadScore", False, f"leadScore must be integer 0-100, got {lead_score}")
            return None
        
        # Check serviceIntent present
        service_intent = enquiry.get("serviceIntent")
        if not isinstance(service_intent, str) or not service_intent:
            print_test_result("Genuine lead - serviceIntent", False, f"serviceIntent must be non-empty string, got {service_intent}")
            return None
        
        # Check industry present
        industry = enquiry.get("industry")
        if not isinstance(industry, str) or not industry:
            print_test_result("Genuine lead - industry", False, f"industry must be non-empty string, got {industry}")
            return None
        
        # Check NO "ai" key in response
        if "ai" in enquiry:
            print_test_result("Genuine lead - No ai key", False, "Response should NOT contain 'ai' key")
            return None
        
        # Check status is "new"
        if enquiry.get("status") != "new":
            print_test_result("Genuine lead - status", False, f"status must be 'new', got {enquiry.get('status')}")
            return None
        
        print(f"✓ Enrichment: leadLabel={lead_label}, leadScore={lead_score}, serviceIntent={service_intent}, industry={industry}")
        print_test_result("Genuine lead", True, f"Created enquiry with id: {enquiry['id']}")
        return enquiry
        
    except Exception as e:
        print_test_result("Genuine lead", False, f"Exception: {str(e)}")
        return None

def test_enquiry_spam():
    """Test POST /api/enquiries with spam (should be flagged in DB but not in response)"""
    print("\n" + "="*80)
    print("TEST: POST /api/enquiries - Spam detection")
    print("="*80)
    
    payload = {
        "firstName": "Best",
        "lastName": "Links",
        "email": "seo@cheaplinks.biz",
        "countryCode": "+1",
        "phone": "5555555555",
        "source": "Google",
        "message": "Hi, we offer high DA guest post backlinks at $5 each. Bulk discount available. Reply to get our list of 5000 sites!!!"
    }
    
    try:
        print(f"Sending spam enquiry...")
        print(f"Payload: {json.dumps(payload, indent=2)}")
        print("Note: This may take a few seconds for AI classification...")
        
        response = requests.post(f"{BASE_URL}/enquiries", json=payload, timeout=30)
        data = response.json()
        
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        # Check status code
        if response.status_code != 201:
            print_test_result("Spam - Status code", False, f"Expected 201, got {response.status_code}")
            return False
        
        enquiry = data.get("enquiry")
        if not enquiry:
            print_test_result("Spam - enquiry field", False, "enquiry field missing")
            return False
        
        enquiry_id = enquiry.get("id")
        
        # Check response status is "new" (spam verdict hidden from submitter)
        if enquiry.get("status") != "new":
            print_test_result("Spam - Response status", False, f"Response status must be 'new' (hidden), got {enquiry.get('status')}")
            return False
        
        print(f"✓ Response status is 'new' (spam verdict hidden from submitter)")
        
        # Now check MongoDB directly
        print(f"\nChecking MongoDB for enquiry {enquiry_id}...")
        client = MongoClient(MONGO_URL)
        db = client[DB_NAME]
        collection = db["enquiries"]
        
        doc = collection.find_one({"id": enquiry_id})
        
        if not doc:
            print_test_result("Spam - MongoDB lookup", False, f"Enquiry {enquiry_id} not found in MongoDB")
            client.close()
            return False
        
        print(f"Found in MongoDB: {json.dumps({k: v for k, v in doc.items() if k != '_id'}, indent=2, default=str)}")
        
        # Check stored status is "spam"
        if doc.get("status") != "spam":
            print_test_result("Spam - DB status", False, f"DB status must be 'spam', got {doc.get('status')}")
            client.close()
            return False
        
        # Check ai.spamProbability >= 0.85
        ai = doc.get("ai", {})
        spam_prob = ai.get("spamProbability", 0)
        if spam_prob < 0.85:
            print_test_result("Spam - spamProbability", False, f"spamProbability must be >= 0.85, got {spam_prob}")
            client.close()
            return False
        
        # Check ai.aiClassified is true
        if not ai.get("aiClassified"):
            print_test_result("Spam - aiClassified", False, "ai.aiClassified must be true")
            client.close()
            return False
        
        print(f"✓ DB status: 'spam', spamProbability: {spam_prob}, aiClassified: {ai.get('aiClassified')}")
        print_test_result("Spam detection", True, f"Spam correctly flagged in DB with probability {spam_prob}")
        
        client.close()
        return True
        
    except Exception as e:
        print_test_result("Spam detection", False, f"Exception: {str(e)}")
        return False

def test_get_enquiries_enriched():
    """Test GET /api/enquiries with admin token to verify enriched fields"""
    print("\n" + "="*80)
    print("TEST: GET /api/enquiries - Verify enriched fields")
    print("="*80)
    
    try:
        headers = {
            "Authorization": f"Bearer {ADMIN_TOKEN}"
        }
        
        response = requests.get(f"{BASE_URL}/enquiries", headers=headers, timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_test_result("GET enquiries enriched - Status code", False, f"Expected 200, got {response.status_code}")
            return False
        
        enquiries = data.get("enquiries", [])
        if not enquiries:
            print_test_result("GET enquiries enriched - No data", False, "No enquiries found")
            return False
        
        print(f"Found {len(enquiries)} enquiries")
        
        # Check the newest enquiries for enriched fields
        enriched_count = 0
        for i, enq in enumerate(enquiries[:5]):  # Check first 5
            has_enrichment = all(k in enq for k in ["leadScore", "leadLabel", "serviceIntent", "industry"])
            if has_enrichment:
                enriched_count += 1
                if i == 0:  # Print first one
                    print(f"\nNewest enquiry enrichment:")
                    print(f"  leadScore: {enq.get('leadScore')}")
                    print(f"  leadLabel: {enq.get('leadLabel')}")
                    print(f"  serviceIntent: {enq.get('serviceIntent')}")
                    print(f"  industry: {enq.get('industry')}")
        
        if enriched_count == 0:
            print_test_result("GET enquiries enriched - Fields present", False, "No enquiries have enriched fields (leadScore/leadLabel/serviceIntent/industry)")
            return False
        
        print(f"✓ Found {enriched_count} enquiries with enriched fields")
        print_test_result("GET enquiries enriched", True, f"{enriched_count} enquiries have leadScore/leadLabel/serviceIntent/industry")
        return True
        
    except Exception as e:
        print_test_result("GET enquiries enriched", False, f"Exception: {str(e)}")
        return False

def main():
    """Run all AI feature tests"""
    print("\n" + "="*80)
    print("BACKEND AI FEATURES TESTS - Aarush AI Search Visibility")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Started at: {datetime.now().isoformat()}")
    print("\nNOTE: Rate limits apply:")
    print("  - /api/visibility: 10 requests per 10 minutes")
    print("  - /api/enquiries: 5 requests per 10 minutes")
    print("  Making at most 4 visibility calls and 2 enquiry calls")
    
    results = {}
    
    # Test 1: POST /api/visibility with valid payload
    results["visibility_valid"] = test_visibility_valid()
    
    # Test 2: POST /api/visibility validation errors
    results["visibility_missing_brand"] = test_visibility_missing_brand()
    results["visibility_short_prompt"] = test_visibility_short_prompt()
    
    # Test 3: POST /api/enquiries with genuine lead
    genuine_enquiry = test_enquiry_genuine_lead()
    results["enquiry_genuine"] = genuine_enquiry is not None
    
    # Test 4: POST /api/enquiries with spam
    results["enquiry_spam"] = test_enquiry_spam()
    
    # Test 5: GET /api/enquiries with admin token
    results["get_enquiries_enriched"] = test_get_enquiries_enriched()
    
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
        print("\n🎉 All AI feature tests passed!")
        sys.exit(0)
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
