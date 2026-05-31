# ✈️ DropLink

A premium, custom, and highly secure link-sharing and rich notes storage platform, fully containerized in Docker and engineered with a modern, modular architecture.

DropLink functions similarly to WeTransfer but adds advanced security layers, mandatory transfer naming, activation/expiration dates, custom URL slugs, and zero central server tracking.

---

## 🚀 Key Features

* **Mandatory Naming**: Every share link must be named, ensuring clean organization on the recipient landing views.
* **Clean URL Routing**: Fully resolved paths (`/link/:id` or `/link/:custom-slug`) instead of messy query parameters.
* **Zero Leak Security**: For password-locked links, file lists and text contents are strictly withheld by the server until correct password verification (preventing client-side inspection).
* **SHA-256 Hashing**: Passwords are securely hashed using standard SHA-256 before saving to the database.
* **Strict Date Boundaries**: Expired links and pending (future activation) links are validated and blocked server-side.
* **Private Log History**: The "My Transfers" list is completely stored in the browser's `localStorage` of the creator. Tiers cannot see what you shared.
* **Popup-Blocker Safe Downloader**: Sequential down-loader with 400ms interval delays to bypass native browser multiple popup blocks.
* **Vibrant Glassmorphic UI**: Sleek slate-dark theme utilizing Outfit typography, glassmorphism boundaries, and smooth CSS animations.

---

## 🛠️ Tech Stack

| Layer | Component | Detail |
| :--- | :--- | :--- |
| **Frontend** | HTML5, Vanilla CSS3, ES6 JavaScript | Glassmorphism visual elements, responsive grids, native browser ES Modules. |
| **Backend** | Node.js + Express.js | Modular Express Router architecture. |
| **File Handling** | Multer | Multipart/form-data upload system mapping files with unique UUIDs. |
| **Security** | Node.js `crypto` | SHA-256 secure cryptographic password hashing. |
| **Database** | Lightweight Local JSON | Dynamic, self-creating metadata store in `data/database.json`. |
| **Containerization** | Docker | Lean container image built on `node:18-alpine`. |
| **Guest OS** | WSL (Ubuntu) | Native execution environment for persistent Docker volumes. |

---

## 📦 Project Architecture

DropLink is designed around **SOLID** and **Separation of Concerns** principles:

```
src/
├── config/
│   └── index.js          # Unified configurations, Multer storage, and directory bounds.
├── database/
│   └── db.js             # DB Sync and SHA-256 hashing.
├── middlewares/
│   └── validator.js      # Express middleware validating payloads and date boundaries.
├── controllers/
│   └── transfer.js       # Express HTTP controllers managing transfer lifecycles.
├── routes/
│   ├── api.js            # Router mapping API routes (/api/transfers).
│   └── web.js            # Router mapping static assets and clean page slugs (/link/:id).
├── app.js                # Express app builder registering standard middleware blocks.
└── server.js             # Minimalist server launcher.
```

---

## 🏁 Quick Start

### 1. Running with Docker (Recommended)

DropLink is ready to run out of the box using Docker:

```bash
# 1. Build the Docker image
docker build -t droplink .

# 2. Run the container with persistent volumes
docker run -d -p 3000:3000 \
  -v $(pwd)/uploads:/usr/src/app/uploads \
  -v $(pwd)/data:/usr/src/app/data \
  --name droplink-container droplink
```

*Access the application by visiting:* **`http://localhost:3000`**

### 2. Running Natively (Node.js)

If you prefer running natively without Docker:

```bash
# 1. Install dependencies
npm install

# 2. Start the Express server
npm start
```

---

## 🧪 Automated Testing

We include a custom, comprehensive API testing suite verifying all secure behaviors (password locks, data masking, date expiration limits):

```bash
# Run the API test suite (ensure the server is running on port 3000 first)
node test-api.js
```
