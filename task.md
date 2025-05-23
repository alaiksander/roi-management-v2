# Task List: Basic Input Validation

## 1. Report Name Validation
- [x] Prevent saving reports with empty names
- [x] Prevent duplicate report names
- [x] Limit report name length (e.g., max 50 characters)
- [x] Disallow special characters that could cause issues in file names (e.g., / \ : * ? " < > |)

## 2. Date Range Validation
- [x] Ensure start date is not after end date
- [x] Ensure date fields are not empty when required

## 3. Amount Validation (if user input is allowed)
- [x] Ensure amounts are positive numbers
- [x] Prevent non-numeric input for amount fields

## 4. General Form Validation
- [x] Disable "Simpan Laporan" button if validation fails
- [x] Show user-friendly error messages for invalid input

---

# Task List: Clients Page Improvements

## UI/UX Improvements
- [x] Improve badge visibility and consistency for "Aktif" campaigns (use green color, match detail page)
- [x] Add debounce to search input for better performance with large datasets
- [x] Truncate or add tooltip for long email addresses in client cards

## Code Quality & Performance
- [x] Use optional chaining for `client.campaigns?.length` to avoid errors if campaigns is undefined
- [x] Memoize filteredClients with `useMemo` for performance on large lists

## Accessibility
- [x] Ensure card links are accessible and have visible focus styles

## Features
- [x] Add infinite scroll for large client lists

---

# Task List: Transactions Page Improvements

## UI/UX Improvements
- [ ] Add debounce to search/filter inputs for better performance
- [ ] Use dropdowns or multi-selects for filtering by category, client, or type
- [ ] Make columns sortable (by date, amount, etc.)
- [ ] Add pagination or infinite scroll for large datasets
- [ ] Use clear badges for transaction types (e.g., green for income, red for expense)
- [ ] Show a friendly empty state message and call-to-action if there are no transactions
- [ ] Ensure responsive design for mobile (horizontal scroll or stacked cards)

## Code Quality & Performance
- [ ] Memoize filtered/sorted transactions with `useMemo`
- [ ] Use optional chaining for nested properties (e.g., `transaction.client?.name`)
- [ ] Move hardcoded strings to `UI_TEXT` for localization
- [ ] Use a utility like `formatCurrency` for all amount displays

## Accessibility
- [ ] Use semantic table tags (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`)
- [ ] Ensure visible focus styles for keyboard navigation
- [ ] Use descriptive `aria-label` or visible text for action buttons

## Features
- [ ] Allow selecting multiple transactions for bulk delete/export
- [ ] Add CSV/Excel export for filtered transactions
- [ ] Provide a modal or page for adding/editing transactions with validation

## Validation & Error Handling
- [ ] Validate all user inputs (amount must be positive, required fields, etc.)
- [ ] Show user-friendly error messages for failed actions

## Performance
- [ ] Use pagination or infinite scroll for large transaction lists
- [ ] Consider virtualization for very large tables

## Security
- [ ] Sanitize user input for descriptions/notes to prevent XSS
- [ ] Escape values starting with `=`, `+`, `-`, or `@` when exporting to CSV

---

# Task List: Data Persistence

- [x] Create utility functions for loading and saving to localStorage
- [ ] Initialize state for clients, campaigns, transactions, and reports from localStorage (with mock fallback)
- [ ] Sync state changes to localStorage for all entities
- [ ] Ensure all CRUD operations update both state and localStorage
- [ ] Apply this pattern in all relevant pages/components

---

*After completing these, review and iterate for further improvements.*