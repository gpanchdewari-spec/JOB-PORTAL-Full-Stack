# JobFlow — MERN Job Portal

A portfolio-ready full-stack job portal built to demonstrate real MERN development: authentication, authorization, CRUD, search, dashboards, file upload and a multi-role application workflow.

## Features

### Candidate
- Register/login with JWT
- Edit profile, location, headline and skills
- Upload PDF resume (max 5MB) using Multer + Cloudinary
- Browse jobs
- Search by title, company or skill
- Filter-ready job API
- View job details
- Apply with optional cover letter
- Prevent duplicate applications
- Track application status

### Recruiter
- Register/login as recruiter
- Create jobs
- View own job posts
- Delete jobs
- View applicants per job
- Open candidate resume
- Move applications through: applied → reviewing → shortlisted → rejected/hired

### Backend
- Express + MongoDB + Mongoose
- MVC-style folders
- Password hashing with bcrypt
- JWT authentication middleware
- Role-based authorization
- Multer memory upload
- Cloudinary PDF storage
- Pagination/search-ready jobs endpoint
- Central 404/error middleware
- Seed script

## Folder structure

```text
job-portal/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   └── package.json
├── package.json
└── README.md
```

## 1. Requirements

Install:
- Node.js 20+
- MongoDB locally, or use MongoDB Atlas
- A free Cloudinary account for resume uploads

## 2. Backend setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/jobflow
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run backend:

```bash
npm run dev
```

API health check:

```text
http://localhost:5000/api/health
```

## 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

Open the Vite URL, normally:

```text
http://localhost:5173
```

## 4. Optional sample data

After configuring MongoDB, from `backend/` run:

```bash
npm run seed
```

Demo accounts:

```text
Recruiter
recruiter@example.com
password123

Candidate
candidate@example.com
password123
```

The seeded candidate intentionally does not contain a fake resume URL. Upload a real PDF from the candidate dashboard before applying.

## Resume upload flow

```text
React file input
   ↓
FormData
   ↓
POST /api/users/resume
   ↓
protect middleware
   ↓
Multer validates + stores PDF in memory
   ↓
Cloudinary upload_stream
   ↓
Cloudinary secure URL
   ↓
User.resumeUrl saved in MongoDB
```

MongoDB stores only the URL/public ID, not the PDF binary.

## Important API routes

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

PUT    /api/users/profile
POST   /api/users/resume

GET    /api/jobs
GET    /api/jobs/:id
GET    /api/jobs/mine
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id

POST   /api/applications/apply/:jobId
GET    /api/applications/mine
GET    /api/applications/job/:jobId
PATCH  /api/applications/:id/status
```

## How authentication works

1. Register/login API creates a JWT containing the user's ID and role.
2. Frontend stores the token in `localStorage` for this learning project.
3. Axios interceptor automatically sends `Authorization: Bearer <token>`.
4. `protect` verifies the JWT and loads the user from MongoDB.
5. `allowRoles("candidate")` / `allowRoles("recruiter")` blocks unauthorized roles.

For a higher-security production deployment, prefer an HTTP-only secure cookie-based token strategy rather than long-lived tokens in localStorage.

## Suggested next improvements

After you understand the current code, good upgrades are:
- Refresh-token + HTTP-only cookies
- Email verification / forgot password
- Saved jobs
- Recruiter job editing UI (backend route already exists)
- Pagination controls in frontend
- Admin role/dashboard
- Socket.IO notifications/chat
- Interview scheduling
- Automated tests
- Docker
- CI/CD

## Portfolio tip

Do not upload the ZIP itself to GitHub. Extract it, understand the code, change the branding/content, make several meaningful commits, deploy the frontend/backend and add screenshots + live links to your README.
