# 🛡️ MediTrail — Your Medical History. One Secure Trail.

> **Patient-Controlled Digital Medical Record & Time-Bound Doctor Sharing Platform**  
> *Built for HealthTech Hackathon 2026*

---

## 📌 Project Overview

**MediTrail** brings scattered medical records, prescriptions, lab reports, diagnoses, discharge summaries, and medical certificates into a unified, encrypted vault.

### The Core Problem
Patients usually have medical documents scattered across different hospitals, clinics, PDFs, and paper files. When visiting a new doctor, patients are often forced to expose their entire medical history or struggle to find relevant lab reports.

### The MediTrail Solution
**The patient maintains 100% data sovereignty.** Patients choose *strictly specific records* to share with a consulting physician, generate a temporary link or QR code with a chosen expiry duration (1h, 24h, 7d), and can click **[Revoke Access]** at any moment.

---

## ✨ Key Features

1. 🔐 **Patient Authentication & 1-Click Judge Demo Login**
   * Clean Login & Signup UI.
   * **Hackathon Judge Quick-Access:** 1-Click Demo button to instantly jump into Alex Mercer's pre-loaded medical vault without typing credentials.

2. 📂 **Medical Record Vault**
   * Categorized document management (*Prescriptions, Lab Reports, Diagnoses, Discharge Summaries, Medical Certificates*).
   * Live search bar by title, practitioner name, facility, or summary text.
   * Document viewer modal with verified PDF preview simulation and file upload modal.

3. ⏳ **Chronological Health Timeline**
   * Visual vertical history log detailing past diagnostic tests, treatments, and clinical visits.

4. 🩺 **AI Health Summary**
   * Summarizes existing records into 6 clinical sections: *Diagnosed Conditions, Active Medications, Test Results, Known Allergies, Medical History, and Missing Information*.
   * **Mandatory AI Disclaimer Banner:** *"AI-generated information is for informational purposes only and does not replace professional medical advice."*

5. 🔗 **Selective Doctor Sharing & QR Code Generator**
   * Checkbox record picker to select specific documents for consultation.
   * Duration selector (*1 Hour, 24 Hours, 7 Days*).
   * Interactive SVG QR Code generator & temporary link shareable with doctors.

6. ⏱ **Standalone Doctor Portal View (`/share/:token`)**
   * Restricted portal for doctors opening a share token.
   * Header badge: **`🔐 Securely Shared by Patient`**.
   * Expiration timer: **`⏱ Access expires in: 23h 42m`**.
   * Strictly displays *only* patient-selected documents.

7. 🚫 **Instant Access Revocation & Active Shares Control**
   * Active share tokens list with live countdown timers and instant **[Revoke Access]** action.
   * If access is revoked, opening the link displays an instant **"Access Revoked by Patient"** screen.

8. 📋 **Security Audit Trail**
   * Tamper-evident security audit log tracking document uploads, doctor share creations, access events, and revocations with timestamps.

---

## 🛠️ Tech Stack

* **Build Tool:** Vite 6
* **Frontend Framework:** React 18
* **Styling:** Tailwind CSS + PostCSS + Autoprefixer
* **Icons:** Lucide React (Clean SVG vector icons)
* **Data & API Layer:** Dual-mode service architecture (`localStorage`-backed mock store + REST API client)

---

## ⚙️ Quick Start & Local Setup

### Prerequisites
* **Node.js:** v18+ or v22+
* **npm:** v9+ or v10+

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/maseeramuzna28/meditrail.git
   cd meditrail
   ```

2. **Install frontend and backend dependencies:**
   ```bash
   npm --prefix frontend ci
   npm --prefix backend ci
   ```

3. **Start the frontend:**
   ```bash
   npm run dev
   ```
   Open your browser at **`http://localhost:3000`**

   To enable backend API features, configure `backend/.env` from `backend/.env.example` and start the backend in a second terminal:
   ```bash
   npm run dev:backend
   ```

4. **Verify production builds:**
   ```bash
   npm run build
   ```

---

## 🔌 Connecting to Node.js / Express / Supabase Backend

MediTrail includes an abstraction layer in [`src/services/apiService.js`](file:///c:/Users/SMARt/proo/src/services/apiService.js) that maps to standard Express REST endpoints:

| Endpoint | Method | Action |
| :--- | :--- | :--- |
| `/api/records` | `GET` | Fetch all patient medical vault records |
| `/api/records` | `POST` | Upload new medical document record |
| `/api/records/:id` | `DELETE` | Delete record from vault |
| `/api/share` | `POST` | Create temporary time-bound share link & QR token |
| `/api/share/:token` | `GET` | Fetch doctor-permitted records for token |
| `/api/share/:id/revoke` | `POST` | Instantly revoke doctor share access |
| `/api/ai/summary` | `POST` | Generate AI Health summary |
| `/api/access-logs` | `GET` | Fetch security audit log |

### How to Toggle Real Backend Mode:

Open [`src/services/apiService.js`](file:///c:/Users/SMARt/proo/src/services/apiService.js) and flip line 6:

```javascript
// src/services/apiService.js
const USE_REAL_BACKEND = true; // Switch from false to true
```

Set your backend server URL in a `.env` file if running on a different port:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🎨 Design Philosophy & Aesthetic Standards

* **Clinical SaaS Palette:** Deep Slate (`#0f172a`), Soft Clinical Teal (`#0d9488`), Emerald status accents (`#10b981`), Crisp Muted surfaces (`#f8fafc`).
* **Zero Clutter:** No purple gradients, no pill-shaped capsule buttons, no neon colors, no fake reviews, no dev-tool jargon.
* **100% Vector Icons:** All UI icons utilize clean SVG vector graphics via Lucide.

---

## 📄 License

Developed for 24-Hour HealthTech Hackathon 2026. All rights reserved.
