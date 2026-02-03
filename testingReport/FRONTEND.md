# Monthly Calculator – Frontend Component Test Documentation

This document records Jest test cases, test basis, and conclusions for all React components under `frontend/src/pages/MonthlyCalculator/`, for Senior QA Analyst interviews and daily regression use.

---

## 1. How to Run Tests

### Command

```bash
cd frontend
npm test
```

Or from the project root:

```bash
cd frontend && npm test
```

On first run you may be asked about watch mode; press `a` to run all tests, or add `--watchAll=false` to run once and exit:

```bash
cd frontend
npm test -- --watchAll=false
```

### How to Verify No Bugs

- **Pass criteria**: All `MonthlyCalculator`-related cases show `PASS` with no failures
- **Regression verification**: Run `npm test` after changing components or API interaction logic
- **CI integration**: Add `cd frontend && npm test -- --watchAll=false` to GitHub Actions

---

## 2. Test Files and Case Overview

| Test File | Component Under Test | Case Count | Description |
|-----------|----------------------|------------|-------------|
| `annualSummary.test.js` | `annualSummary.js` | 4 | Annual summary page: loading, error, success, 404 |
| `dashboard.test.js` | `dashboard.js` | 4 | Dashboard: loading, error, success, 404 |
| `expenseDetail.test.js` | `expenseDetail.js` | 3 | Expense detail page: loading, error, success |
| `registerForm.test.js` | `registerForm.js` | 4 | Registration form: loading, error, form render, buttons |

**Note**: `react-router-dom` is mocked via `frontend/__mocks__/react-router-dom.js` and `moduleNameMapper` in `package.json` so Link, MemoryRouter, etc. work correctly in tests.

---

## 3. Detailed Test File Descriptions

### 3.1 annualSummary.test.js

**Component under test**: `annualSummary.js`  
**Purpose**: Annual expense summary with BarChart, DonutChart, LineChart, and stat cards

| Case | Scenario | Test Basis | Expected Result |
|------|----------|------------|-----------------|
| TC-AS-01 | Initial load | useEffect triggers fetch, loading is true | Shows "加载中..." (Loading...) |
| TC-AS-02 | Fetch fails | Network or API error | Shows "出错了: [error message]" |
| TC-AS-03 | Success | 200 with valid JSON | Shows Annual Summary, Expense overview, Total Costs, Favourite supermarket, location list |
| TC-AS-04 | 404 empty structure | No data for year | Shows Annual Summary, Total Costs, no chart data |

**Conclusion**: The annual summary page correctly handles loading, error, success, and 404 states.

---

### 3.2 dashboard.test.js

**Component under test**: `dashboard.js`  
**Purpose**: Monthly dashboard with total expense, per-capita, comparison with last month, recent activity, amounts owed per member

| Case | Scenario | Test Basis | Expected Result |
|------|----------|------------|-----------------|
| TC-DB-01 | Initial load | loading is true | Shows "加载中..." (Loading...) |
| TC-DB-02 | Fetch fails | Network error | Shows "出错了: [error message]" |
| TC-DB-03 | Success | 200 with valid JSON | Shows Dashboard, Total Expense, Expense Count, Average Costs, Recent activity, New expense |
| TC-DB-04 | 404 empty structure | No data for month | Renders dashboard with default structure |

**Conclusion**: The dashboard correctly renders for loading, error, success, and 404 states.

---

### 3.3 expenseDetail.test.js

**Component under test**: `expenseDetail.js`  
**Purpose**: Monthly expense detail plus personal expense detail with member filter

| Case | Scenario | Test Basis | Expected Result |
|------|----------|------------|-----------------|
| TC-ED-01 | Initial load | Both fetches pending | Shows "加载中..." (Loading...) |
| TC-ED-02 | Fetch fails | Any API error | Shows "出错了" (Error) |
| TC-ED-03 | Both fetches succeed | Monthly + personal detail data | Shows Expense Detail, Monthly Expense Detail, Personal Expense Detail |

**Conclusion**: The expense detail page correctly handles loading, error, and success states.

---

### 3.4 registerForm.test.js

**Component under test**: `registerForm.js`  
**Purpose**: New expense registration form, depends on family member API

| Case | Scenario | Test Basis | Expected Result |
|------|----------|------------|-----------------|
| TC-RF-01 | Loading family members | familyMember fetch pending | Shows Loading |
| TC-RF-02 | familyMember fetch fails | API error | Shows Error |
| TC-RF-03 | Form loaded | familyMember success | Shows Register Entry, Payer, Payment Location, Expense Amount, Submit button |
| TC-RF-04 | Form loaded | Same as above | Submit and Cancel buttons both present |

**Conclusion**: The registration form correctly shows loading, error, and success states and includes required fields and buttons.

---

## 4. Technical Notes

- **Framework**: Jest + React Testing Library + @testing-library/jest-dom
- **Mocking**:
  - `global.fetch` mocked in `beforeEach` to control API responses
  - `@tremor/react` mocked as lightweight components in annualSummary tests
  - `@headlessui/react` mocked in expenseDetail tests
  - `react-router-dom` replaced via `__mocks__/react-router-dom.js` and `moduleNameMapper`

---

## 5. Summary

| Metric | Value |
|--------|-------|
| Test files | 4 |
| Total test cases | 15 |
| Components covered | 4 |
| Target pass rate | 100% |

All core pages under `MonthlyCalculator` have automated regression tests and can be validated locally or in CI.
