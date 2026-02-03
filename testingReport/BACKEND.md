# Monthly Calculator – Backend Test Documentation

This document records all backend API Jest test cases, test basis, and conclusions for Senior QA Analyst interviews and daily regression use.

---

## 1. How to Run Tests

### Command

```bash
npm test
```

Run this command from the project root (`d:\personal project\monthly calculator`) to execute all `*.test.js` files under `routers/__tests__/`.

### Watch Mode (for development)

```bash
npm run test:watch
```

Tests will automatically re-run when code changes.

### How to Verify No Bugs

- **Pass criteria**: `Tests: 17 passed` (or more) with no failed cases
- **Regression verification**: Run `npm test` after modifying routes or models to ensure no cases fail
- **CI integration**: Add `npm test` to GitHub Actions to run automatically on push/PR

---

## 2. Test Files and Case Overview

| Test File | Route Under Test | Case Count | Status |
|-----------|------------------|------------|--------|
| `annualSummary.test.js` | `GET /api/expense/annualSummary/:year` | 3 | ✅ |
| `dashboardDetail.test.js` | `GET /api/expense/monthSummary/:regDate` | 3 | ✅ |
| `familyMember.test.js` | `GET /api/familyMember` | 3 | ✅ |
| `monthlyDetail.test.js` | `GET /api/expense/:regDate` | 2 | ✅ |
| `personalDetailList.test.js` | `GET /api/expense/:regDate/:payer` | 3 | ✅ |
| `uploadExpense.test.js` | `POST /api/expense` | 3 | ✅ |

---

## 3. Detailed Test File Descriptions

### 3.1 annualSummary.test.js

**Route under test**: `GET /api/expense/annualSummary/:year`  
**Router file**: `routers/annualSummary.js`  
**Purpose**: Returns annual expense summary for a given year (by month, by store, highest/lowest month, etc.)

| Case | Scenario | Test Basis | Expected Result |
|------|----------|------------|-----------------|
| TC-AS-01 | No data for year | Returns 404 when no monthlyTotalExpenses | 404, empty structure and `message: 'No data found for the specified year.'` |
| TC-AS-02 | Full data present | Aggregation logic with monthly and location data | 200, 12 items in `formatMonthlyExpenseResult`, 7 in `formatLocationDataResult`, correct annual total and highest/lowest month |
| TC-AS-03 | Some months are zero | lowestMonthlyExpense skips zero-expense months | Correct highest month and lowest non-zero month |

**Conclusion**: The annual summary endpoint returns the expected structure and values for no-data, full-data, and partial-zero-month scenarios.

---

### 3.2 dashboardDetail.test.js

**Route under test**: `GET /api/expense/monthSummary/:regDate`  
**Router file**: `routers/dashboardDetail.js`  
**Purpose**: Returns monthly dashboard summary (total expense, per-capita, comparison with previous month, latest 5 records, amounts owed per person, etc.)

| Case | Scenario | Test Basis | Expected Result |
|------|----------|------------|-----------------|
| TC-DD-01 | Invalid regDate format | Month name not in January–December | 400, `error: 'Invalid regDate format'` |
| TC-DD-02 | No data for month | Expense.findOne returns nothing | 404, default structure (totalPrice 0, N/A placeholders, etc.) |
| TC-DD-03 | Data exists | Expense records and family members present | 200, correct totalPrice, averagePrice, sortedExpenseSummary, totalCount, etc. |

**Conclusion**: The dashboard endpoint handles invalid regDate, no data, and valid data correctly.

---

### 3.3 familyMember.test.js

**Route under test**: `GET /api/familyMember`  
**Router file**: `routers/familyMember.js`  
**Purpose**: Returns family member list (payer, status)

| Case | Scenario | Test Basis | Expected Result |
|------|----------|------------|-----------------|
| TC-FM-01 | No members | FamilyMember.aggregate returns empty array | 200, `familyMember: []` |
| TC-FM-02 | Members exist | payer and status data present | 200, full member list |
| TC-FM-03 | Database error | aggregate throws | 500, `error` contains exception message |

**Conclusion**: The family member endpoint handles empty data, normal data, and error scenarios correctly.

---

### 3.4 monthlyDetail.test.js

**Route under test**: `GET /api/expense/:regDate`  
**Router file**: `routers/monthlyDetail.js`  
**Purpose**: Returns all expense details and total amount for a given month

| Case | Scenario | Test Basis | Expected Result |
|------|----------|------------|-----------------|
| TC-MD-01 | No data for month | Expense.findOne returns nothing | 404, default structure, `monthlyDetaiListResult[0].payer === 'N/A'` |
| TC-MD-02 | Data exists | Expense records present | 200, correct totalPrice and monthlyDetaiListResult, price format `$xx.xx` |

**Conclusion**: The monthly detail endpoint returns correct structure and amounts for both no-data and data scenarios.

---

### 3.5 personalDetailList.test.js

**Route under test**: `GET /api/expense/:regDate/:payer`  
**Router file**: `routers/personalDetailList.js`  
**Purpose**: Returns expense details and total amount for a specific payer in a given month

| Case | Scenario | Test Basis | Expected Result |
|------|----------|------------|-----------------|
| TC-PD-01 | No data for payer+month | Expense.findOne returns nothing | 404, default structure, correct payer and regDate |
| TC-PD-02 | Single record | One expense for payer in month | 200, correct totalPrice and personalDetaiListResult |
| TC-PD-03 | Multiple records | Multiple expenses for same payer in same month | 200, totalPrice is sum, personalDetaiListResult includes all records |

**Conclusion**: The personal detail endpoint correctly aggregates and returns for no-data, single-record, and multi-record scenarios.

---

### 3.6 uploadExpense.test.js

**Route under test**: `POST /api/expense`  
**Router file**: `routers/uploadExpense.js`  
**Purpose**: Creates a new expense record

| Case | Scenario | Test Basis | Expected Result |
|------|----------|------------|-----------------|
| TC-UE-01 | Valid data | payer, price, location, description, regDate complete | 201, returns saved record |
| TC-UE-02 | Save fails | Mongoose validation fails (e.g. required fields missing) | 400, `error` contains exception message |
| TC-UE-03 | description optional | description can be empty string | 201, saves and returns successfully |

**Conclusion**: The upload expense endpoint handles valid data, validation failure, and optional fields correctly.

---

## 4. Technical Notes

- **Framework**: Jest + supertest
- **Strategy**: Uses `jest.mock()` to mock Mongoose models (Expense, FamilyMember); no real database required
- **Coverage type**: API-level (integration) tests; validates HTTP status codes and response body structure and key fields

---

## 5. Summary

| Metric | Value |
|--------|-------|
| Test files | 6 |
| Total test cases | 17 |
| Routes covered | 6 |
| Current pass rate | 100% |

All core backend APIs have automated regression tests and can be validated locally or in CI to reduce regression risk.
