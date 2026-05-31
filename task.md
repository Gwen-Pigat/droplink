# Refactoring Tasks - Modularization & DRY

- `[x]` Refactor Backend into modular `src/` structure
  - `[x]` Create `src/config/index.js`
  - `[x]` Create `src/database/db.js`
  - `[x]` Create `src/middlewares/validator.js`
  - `[x]` Create `src/controllers/transfer.js`
  - `[x]` Create `src/routes/api.js`
  - `[x]` Create `src/routes/web.js`
  - `[x]` Create `src/app.js`
  - `[x]` Rewrite root `server.js`
- `[x]` Refactor Frontend using ES6 modules
  - `[x]` Create `public/js/modules/utils.js`
  - `[x]` Create `public/js/modules/api.js`
  - `[x]` Update `public/index.html` and `public/share.html` to load type="module"
  - `[x]` Refactor and simplify `public/js/app.js`
  - `[x]` Refactor and simplify `public/js/share.js`
- `[x]` Copy updated files to WSL project workspace
- `[x]` Rebuild Docker image & restart container in WSL
- `[x]` Verify backend API & UI features using `test-api.js`
