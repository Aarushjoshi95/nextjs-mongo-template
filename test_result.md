#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================
user_problem_statement: "Aarush AI Search Visibility single-page site. This session: (1) Security hardening from audit: admin token on GET /api/enquiries + GET /api/status, per-IP rate limiting (5 req / 10 min) and 16KB body cap on POST /api/enquiries and POST /api/status, frame headers fixed; (2) New /tools hub with 3 client-side calculators: Revenue Impact (cluster-level), Traffic Drop Loss, CTR/Position Opportunity."

backend:
  - task: "POST /api/enquiries - store discovery-call form submissions"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Validates firstName, lastName, email (regex), countryCode (+digits), phone (6-15 digits after stripping spaces/dashes), source (required), message (<=2000). Returns 201 {ok, enquiry} with uuid id, status 'new', createdAt. 400 {error:'Validation failed', errors:{field:msg}} on invalid. Honeypot: body.website_url non-empty -> 200 {ok:true} without storing. Invalid JSON -> 400."
      - working: true
        agent: "testing"
        comment: "✅ All tests passed. Tested: (1) Valid payload returns 201 with correct structure, uuid id, no _id field, email lowercased, phone stripped to digits only. (2) Missing required fields returns 400 with validation errors for firstName, lastName, email, countryCode, phone, source. (3) Invalid email format rejected with 400. (4) Invalid phone (too short <6 digits, contains letters) rejected with 400. (5) Invalid countryCode (missing + prefix) rejected with 400. (6) Message >2000 chars rejected with 400. (7) Honeypot field (website_url) returns 200 but does NOT store in database (verified). (8) Invalid JSON body returns 400 with 'Invalid JSON body' error."
  - task: "GET /api/enquiries - list submissions newest first"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Returns {count, enquiries[]} without _id, sorted by createdAt desc, limit 200."
      - working: true
        agent: "testing"
        comment: "✅ All tests passed. Returns 200 with {count, enquiries:[]} structure. Verified: (1) count matches array length, (2) no _id fields in response, (3) sorted by createdAt descending (newest first), (4) includes enquiry created in POST test (verified by id match)."
      - working: "NA"
        agent: "main"
        comment: "SECURITY: now admin-only. Requires 'Authorization: Bearer <ADMIN_TOKEN>' or 'X-Admin-Token: <ADMIN_TOKEN>' (token in /app/memory/test_credentials.md and /app/.env ADMIN_TOKEN). No/wrong token -> 401 {error:'Unauthorized'}. Same guard applies to GET /api/status."
      - working: true
        agent: "testing"
        comment: "✅ Admin authentication working correctly. Tested: (1) No auth header -> 401 Unauthorized. (2) Wrong token -> 401 Unauthorized. (3) Correct Bearer token -> 200 with {count, enquiries[]} structure, no _id fields, sorted by createdAt desc. (4) X-Admin-Token header -> 200 with correct structure. Both authentication methods (Bearer and X-Admin-Token) work as expected."
  - task: "POST /api/visibility - Gemini live answer + Jev scoring (AI Visibility Checker)"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js, /app/lib/ai.js, /app/lib/jev.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Body {brand (2-120 chars), buyerPrompt (8-800 chars)}. Calls Gemini (gemini/gemini-2.5-flash) via Emergent proxy with EMERGENT_LLM_KEY, strips markdown, parses __VISIBILITY__ competitor JSON, computes `mentioned` locally (word-boundary regex), then Jev scores stance/sentiment/shortlistProbability (fail-open: aiScored:false if Jev fails). Returns 200 {id, brand, buyerPrompt, engine:'Gemini', model, answer (string, no '**'), mentioned (bool), competitors (string[]), aiScored, visibilityScore 0-100, stance in [not_mentioned, mentioned_in_passing, listed_as_option, recommended], sentiment in [negative, neutral, positive], shortlistProbability 0-1, createdAt}. Stored in visibility_checks collection. Validation -> 400 {error:'Validation failed', errors}. Rate limit 10 per 10 min per IP -> 429. Takes 4-15s per call. Manually verified with brands Scaler, Kama Ayurveda, Emeritus."
      - working: true
        agent: "testing"
        comment: "✅ All tests passed. Tested: (1) Valid payload {brand:'Scaler', buyerPrompt:'best online data science course in India for working professionals'} -> 200 with correct structure. Verified: answer is non-empty string without '**' (1103 chars), mentioned is boolean (true), competitors is array of 10 strings, engine is 'Gemini', model is 'gemini/gemini-2.5-flash', createdAt is ISO format. AI scoring: aiScored=true, visibilityScore=74 (0-100 ✓), stance='listed_as_option' (in allowed set ✓), sentiment='positive' (in allowed set ✓), shortlistProbability=0.87 (0-1 ✓). (2) Missing brand -> 400 with errors.brand='Enter your brand name'. (3) Short buyerPrompt (5 chars) -> 400 with errors.buyerPrompt='Enter the question a buyer would ask (8+ characters)'. All validation and AI scoring working correctly. Request took ~6 seconds with 60s timeout."
  - task: "Jev enrichment on POST /api/enquiries (lead score, spam flag, service intent, industry)"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js, /app/lib/ai.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "After validation, classifyEnquiry() calls Jev (jev-latest) once with 4 questions. Stored doc gains leadScore (0-100), leadLabel (cold|warm|hot), serviceIntent (audit|geo_programme|advisory|other), industry (d2c|edtech|fintech|saas_b2b|enterprise|media|agency|other), ai{aiClassified, spamProbability,...}. If spamProbability>=0.85 the doc is stored with status:'spam' BUT the HTTP 201 response shows status:'new' (do not tip off bots). Response `enquiry` object includes leadScore/leadLabel/serviceIntent/industry but NOT the `ai` sub-object. Fail-open: if Jev errors, enquiry is still stored with ai.aiClassified:false. Manually verified: genuine D2C audit request -> hot/100/audit/d2c; backlink pitch -> status spam (0.98) in DB."
      - working: true
        agent: "testing"
        comment: "✅ All tests passed. Tested: (1) Genuine lead (Priya from Traya, D2C hair health brand requesting audit) -> 201 with enriched fields: leadLabel='hot' (in allowed set ✓), leadScore=100 (0-100 ✓), serviceIntent='audit' (present ✓), industry='d2c' (present ✓), status='new', NO 'ai' key in response (✓). (2) Spam submission (backlink pitch) -> 201 with response status='new' (spam verdict hidden ✓). MongoDB verification: stored status='spam' (✓), ai.spamProbability=0.98 (>= 0.85 ✓), ai.aiClassified=true (✓). (3) GET /api/enquiries with admin token -> 200, found 4 enquiries with enriched fields (leadScore/leadLabel/serviceIntent/industry visible ✓). All Jev enrichment working correctly: lead scoring, spam detection (hidden from submitter), service intent classification, and industry classification."
  - task: "Security: rate limit + body size cap on POST /api/enquiries"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "In-memory per-IP fixed window: max 5 POSTs per 10 minutes per client IP (x-forwarded-for first hop) -> 6th returns 429 {error} with Retry-After header. Body cap: Content-Length or body > 16384 bytes -> 413 {error:'Request body too large'}. Non-object JSON (array/string) -> 400. Existing validation/honeypot behaviour unchanged. NOTE for tester: the rate limit is per IP so a test run from one IP will hit 429 after 5 POSTs within 10 min — plan ordering accordingly (validation-error requests also count). The limiter is in-process; restarting nextjs resets it (sudo supervisorctl restart nextjs)."
      - working: true
        agent: "testing"
        comment: "✅ All security features working correctly. Tested: (1) Valid POST -> 201 with enquiry object. (2) POST with 20,000 char message (>16KB body) -> 413 'Request body too large'. (3) POST with JSON array body -> 400 'Invalid JSON body'. (4) Rate limiting: 5 successful POSTs allowed, 6th POST -> 429 with Retry-After: 600s header and error message 'Too many requests. Please try again in a few minutes.' (5) Security headers: X-Frame-Options: SAMEORIGIN and Content-Security-Policy with frame-ancestors 'self' present on all responses. (6) GET /api/status admin authentication: no token -> 401, correct token -> 200 with array. All rate limiting, body size caps, JSON validation, and security headers are functioning as specified."

frontend:
  - task: "Booking pop-up form (BookingModal) opened from header/hero/offers/book-section/footer CTAs"
    implemented: true
    working: "NA"
    file: "/app/components/site/BookingModal.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Verified via screenshot on desktop and mobile. Not yet tested by frontend testing agent (awaiting user permission)."
  - task: "AI Visibility Checker UI (hero PromptDemo 'Live check' tab + /tools/ai-visibility-checker page)"
    implemented: true
    working: "NA"
    file: "/app/components/tools/VisibilityChecker.js, /app/components/site/PromptDemo.js, /app/app/tools/ai-visibility-checker/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Hero card now defaults to a live Gemini check (brand + buyer prompt, example chips), with the old before/after illustration on a second tab. Verified via screenshot: result renders with mention pill, stance, shortlist odds, score, highlighted brand and competitor chips. Not yet tested by frontend agent."
  - task: "/tools hub + 3 calculators (Revenue Impact, Traffic Drop Loss, CTR/Position Opportunity)"
    implemented: true
    working: "NA"
    file: "/app/components/tools/*.js, /app/app/tools/**/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Client-side only (no API). Routes: /tools, /tools/revenue-impact-calculator, /tools/traffic-drop-loss-calculator, /tools/ctr-position-opportunity-calculator. INR default with USD toggle (localStorage), share link (?s= base64 state), copy summary, CSV export, recharts charts. Verified via desktop + mobile screenshots; no page overflow. Not yet tested by frontend agent."
  - task: "Brand wall section 'Growth teams I've worked with'"
    implemented: true
    working: "NA"
    file: "/app/components/site/BrandWall.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "12 brands with favicon marks + monogram fallback. Verified via screenshot."
      - working: "NA"
        agent: "main"
        comment: "Replaced Google/Clearbit favicons with official brand logo files served locally from /public/logos (Traya, Kama Ayurveda, Forest Essentials, Zee Zest, QS, Emeritus, Ramco, Nestle, Scaler, Eureka Forbes, Schneider Electric). Spin keeps monogram fallback (no official asset identified). Card layout changed to logo-on-top. metadataBase set to https://aarushjoshi.in. Verified via desktop + mobile screenshots, no overflow."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 2
  run_ui: false

test_plan:
  current_focus:
    - "POST /api/visibility - Gemini live answer + Jev scoring (AI Visibility Checker)"
    - "Jev enrichment on POST /api/enquiries (lead score, spam flag, service intent, industry)"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: "Please test the two enquiries endpoints only (backend). No auth required. Use NEXT_PUBLIC_BASE_URL from /app/.env + /api."
  - agent: "testing"
    message: "✅ Backend testing complete. All 10 tests passed (POST /api/enquiries with 8 scenarios + GET /api/enquiries + GET /api/root sanity check). Both enquiry endpoints are working correctly with proper validation, error handling, honeypot protection, and data persistence. No issues found. Ready for main agent to summarize and finish."
  - agent: "main"
    message: "Security round. Please test: (1) GET /api/enquiries and GET /api/status without token -> 401; with wrong token -> 401; with correct Bearer token (see /app/memory/test_credentials.md) -> 200 and same shape as before; X-Admin-Token header variant -> 200. (2) POST /api/enquiries: a valid submission still returns 201; body >16KB (e.g. message field padded to 20,000 chars) -> 413; JSON array body -> 400; then verify the 6th POST within the window from the same IP -> 429 with Retry-After header. Do rate-limit test LAST since it will block further POSTs for 10 min (or restart nextjs to reset). (3) Response headers on any page include X-Frame-Options: SAMEORIGIN."
  - agent: "testing"
    message: "✅ Security hardening testing complete. All 14 tests passed. Verified: (1) Admin authentication on GET /api/enquiries and GET /api/status - both Bearer and X-Admin-Token headers work correctly, unauthorized requests return 401. (2) Rate limiting - 5 POSTs per 10 minutes enforced, 6th POST returns 429 with Retry-After: 600s header. (3) Body size cap - requests >16KB return 413. (4) JSON validation - array bodies return 400. (5) Security headers - X-Frame-Options: SAMEORIGIN and Content-Security-Policy with frame-ancestors 'self' present on all responses. (6) GET /api/root sanity check passes. All security features are working as specified. No issues found."
  - agent: "main"
    message: "AI round. Please test (1) POST /api/visibility: valid {brand:'Scaler', buyerPrompt:'best online data science course in India for working professionals'} -> 200 with the documented shape; answer is a non-empty string without '**'; mentioned is boolean; competitors is an array of strings; if aiScored true then visibilityScore 0-100, stance in allowed set, shortlistProbability 0-1. Missing brand -> 400 with errors.brand; short buyerPrompt -> 400 with errors.buyerPrompt. Each call takes 4-15s; make at most 4 calls (limit 10/10min). (2) POST /api/enquiries with a genuine-sounding message (named company, clear audit need) -> 201 and enquiry.leadLabel in [cold,warm,hot], leadScore 0-100, serviceIntent and industry present, no `ai` key in response, status 'new'. Then POST an obvious backlink-selling spam message -> still 201 with status 'new' in the response; verify in MongoDB (MONGO_URL/DB_NAME from /app/.env, collection enquiries, newest doc) that status is 'spam' and ai.spamProbability >= 0.85. Remember the 5 POST per 10 min limit on /api/enquiries (restart nextjs to reset if needed). Also re-run a quick GET /api/enquiries with Bearer ADMIN_TOKEN to confirm the enriched fields are visible there."
  - agent: "testing"
    message: "✅ AI features testing complete. All 6 tests passed. (1) POST /api/visibility: Valid payload with Scaler + data science prompt returned 200 with all required fields - answer without '**' (1103 chars), mentioned=true (boolean), competitors array of 10 strings, engine='Gemini', model='gemini/gemini-2.5-flash', createdAt ISO format. AI scoring: aiScored=true, visibilityScore=74 (0-100), stance='listed_as_option' (valid), sentiment='positive' (valid), shortlistProbability=0.87 (0-1). Validation errors working: missing brand -> 400 with errors.brand, short buyerPrompt -> 400 with errors.buyerPrompt. (2) POST /api/enquiries Jev enrichment: Genuine lead (Traya D2C audit request) returned 201 with leadLabel='hot', leadScore=100, serviceIntent='audit', industry='d2c', NO 'ai' key in response, status='new'. Spam submission (backlink pitch) returned 201 with status='new' in response (hidden), but MongoDB shows status='spam', ai.spamProbability=0.98 (>= 0.85), ai.aiClassified=true. (3) GET /api/enquiries with admin token shows enriched fields (leadScore/leadLabel/serviceIntent/industry) in 4 enquiries. All AI features (Gemini answer generation, Jev scoring, lead enrichment, spam detection) working correctly. No issues found. Backend testing complete - ready for main agent to summarize and finish."

