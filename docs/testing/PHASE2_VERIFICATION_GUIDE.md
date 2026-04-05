# Phase 2: Offline-First Verification Guide

## Overview
This guide covers testing for the Offline-First Architecture, including WatermelonDB local storage and the Sync Engine.

## 1. Backend Sync Endpoints Verification
**Goal**: Ensure the server can handle pull/push requests.

### Test Script
Run the automated verification script:
```bash
python test_sync_engine.py
```

### Expected Output
```
[TEST 1] Pull Changes (GET /sync/pull)
Status: 200
PASS - Pull Changes

[TEST 2] Push Changes (POST /sync/push)
Status: 200
PASS - Push Changes
```

## 2. Mobile App Verification (Manual)
**Goal**: Verify local data persistence and background sync.

### Prerequisites
- Mobile app running (`npx expo start`)
- Backend deployed and accessible

### Test Scenarios

#### Scenario A: Online Practice (Normal Mode)
1. Open Quiz Screen
2. Answer a question
3. **Verify**:
   - Console logs: `✅ Offline DKT: Logged interaction for ...`
   - Console logs: `Sync completed successfully`
   - Backend DB: Interaction appears in `student_interactions` table

#### Scenario B: Offline Practice (No Internet)
1. Turn off WiFi / Enable Airplane Mode
2. Answer 3 questions
3. **Verify**:
   - Console logs: `✅ Offline DKT: Logged interaction ...`
   - No sync error (Sync should be skipped or queued)
4. Close and Re-open App
5. **Verify**:
   - User stats (credits/XP) remain updated locally

#### Scenario C: Re-connection Sync
1. Turn on WiFi
2. App should auto-sync (or trigger manually via next action)
3. **Verify**:
   - Console logs: `Sync completed successfully`
   - Backend DB: The 3 offline interactions now appear in `student_interactions`

## 3. Database Integrity Check
Run this SQL in Supabase to verify synced data:
```sql
SELECT * FROM student_interactions 
WHERE device_id = 'offline_sync' 
ORDER BY timestamp DESC;
```
You should see the interactions that were pushed from the mobile app.
