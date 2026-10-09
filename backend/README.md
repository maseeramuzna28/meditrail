# MediTrail Backend API

Node.js + Express.js backend for MediTrail — a patient-controlled digital medical record platform.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (JWT)
- **AI**: Google Gemini 1.5 Flash
- **File Storage**: Supabase Storage

---

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set Up Environment Variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

### 3. Set Up Database
1. Go to your Supabase project → **SQL Editor**
2. Copy the entire contents of `schema.sql`
3. Paste it and click **Run**

### 4. Set Up Supabase Storage (for file uploads)
1. Go to Supabase → **Storage**
2. Create a new bucket named `medical-files`
3. Set it to **Private**

### 5. Run the Server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

Server runs on: `http://localhost:5000`

---

## API Endpoints

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check if server is running |

### Medical Records (🔐 Requires Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/records` | Upload a new record |
| GET | `/api/records` | Get all records (filter by `?category=`) |
| GET | `/api/records/:id` | Get a single record |
| PUT | `/api/records/:id` | Update a record |
| DELETE | `/api/records/:id` | Delete a record |

### Timeline (🔐 Requires Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/timeline` | Get records in chronological order (filter by `?category=`) |

### AI Summary (🔐 Requires Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ai/summary` | Generate AI health summary from records |

### Doctor Sharing (🔐 Requires Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/share` | Create a doctor share link |
| GET | `/api/share` | Get all share links |
| DELETE | `/api/share/:id/revoke` | Revoke a share link |
| GET | `/api/share/:id/qr` | Get QR code for a share link |

### Doctor View (🌐 Public — No Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctor/:token` | Doctor views shared records via token |

### Activity Logs (🔐 Requires Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activity` | Get all activity history |
| GET | `/api/activity/share/:id` | Get activity for a specific share link |

---

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <supabase_jwt_token>
```

The frontend gets this token from Supabase Auth after the user logs in.

---

## Record Categories
- `prescription`
- `lab_report`
- `diagnosis`
- `discharge_summary`
- `imaging`
- `vaccination`
- `other`

---

## Demo Flow
1. Patient logs in (handled by Supabase Auth on frontend)
2. Frontend sends JWT token with every API request
3. Patient uploads records → `POST /api/records`
4. Patient views timeline → `GET /api/timeline`
5. AI generates summary → `GET /api/ai/summary`
6. Patient creates share link → `POST /api/share`
7. Doctor opens link → `GET /api/doctor/:token`
8. Patient revokes access → `DELETE /api/share/:id/revoke`
9. Patient checks activity → `GET /api/activity`
