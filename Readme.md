# MamaCare — Smart Maternal Monitoring System

MamaCare is a mother-centered smart maternal monitoring system designed to help pregnant and postnatal mothers track their health, record hospital results, receive reminders, and get AI-supported guidance when symptoms or readings may need attention.

The system is designed around **one primary user only: the mother**. It does not manage doctors, admins, hospital staff, appointment booking, referrals, or immunization tracking.

---

## Project Purpose

Many expectant mothers receive important health information during antenatal visits, such as blood pressure, weight, temperature, scan notes, medication instructions, and appointment dates. However, this information can easily be forgotten, misplaced, or left unmonitored between hospital visits.

MamaCare helps the mother keep this information in one personal digital space. The mother can log symptoms, record readings received from the hospital, monitor trends, and receive alerts or reminders when something needs attention.

The system works like a pregnancy tracking and monitoring assistant, similar in concept to apps like Flo, but focused on maternal monitoring, alerts, reminders, and pregnancy safety awareness.

---

## Core Scope

MamaCare includes:

- Mother registration and login
- Personal pregnancy profile
- Symptom logging
- AI-generated maternal guidance
- Risk alerts for concerning symptoms or abnormal readings
- Hospital result logging, such as:
  - Blood pressure
  - Weight
  - Temperature
  - Baby movement status
  - Scan notes
  - Lab notes
  - General hospital notes
- Appointment reminders for appointments already given by a hospital or clinic
- Medication reminders
- Baby movement tracking
- Wellness and mood tracking
- Emergency plan information
- Support person records
- Postnatal care tracking
- Printable or shareable maternal health summary

MamaCare does **not** include:

- Appointment booking
- Hospital appointment approval
- Doctor dashboard
- Midwife dashboard
- Admin dashboard
- Referral management
- Facility management
- Immunization tracking
- Child immunization schedules

---

## Main User

The only main user of the system is the **mother**.

The mother can:

1. Create an account.
2. Set up her pregnancy profile.
3. Log symptoms she is experiencing.
4. Receive AI-generated guidance or safety alerts.
5. Record hospital results such as weight, blood pressure, temperature, scan notes, and lab notes.
6. Add appointment dates given by the hospital so the system can remind her.
7. Add medication reminders.
8. Track baby movement, wellness, and postnatal care.
9. Store emergency and support contact information.
10. View reminders, alerts, and personal health summaries.

---

## Key Features

### 1. Symptom Logging and AI Guidance

The mother can enter symptoms such as headache, bleeding, fever, pain, reduced baby movement, dizziness, or other concerns. MamaCare analyzes the logged symptoms and can provide an AI-generated response.

The AI response is safety-first. It does not diagnose the mother. Instead, it provides simple guidance and highlights when a symptom may require urgent attention.

### 2. Health Alerts

MamaCare can raise alerts when a logged symptom or health reading appears above the expected safe range or suggests a danger sign.

Examples of readings or symptoms that may trigger attention include:

- High blood pressure
- Severe headache
- Bleeding
- Fever
- Reduced or no baby movement
- Severe abdominal pain
- Difficulty breathing
- Fainting or convulsions

The system is not a replacement for medical care. If danger signs are present, the mother should seek professional help immediately.

### 3. Hospital Result Logging

The mother can record results she receives from the hospital or clinic. This includes values such as:

- Current weight
- Blood pressure
- Temperature
- Facility or source of the reading
- Scan notes
- Lab notes
- General health notes

This allows the mother to track changes over time instead of depending only on paper records.

### 4. Appointment Reminders

MamaCare does not book appointments. The mother manually enters appointments she has already received from a hospital or clinic.

The system then reminds her when the appointment is:

- Today
- Tomorrow
- Within 7 days
- Overdue

### 5. Medication Reminders

The mother can add medications or supplements and set reminder information such as dosage, frequency, time, and notes.

### 6. Baby Movement Tracking

The mother can record baby movement information and receive a warning if movement appears reduced or concerning.

### 7. Wellness Tracking

The system allows the mother to log wellness information such as mood, energy, sleep, stress, and personal notes.

### 8. Emergency Plan

MamaCare allows the mother to save emergency details, including nearest facility, facility phone number, transport contact, support person, blood group, and important medical notes.

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- Framer Motion
- Lucide React icons

### Backend

- Node.js
- Express.js
- Prisma ORM
- SQLite database
- JWT authentication
- bcrypt password hashing
- OpenAI API integration with local fallback safety response

---

## Project Structure

```text
mamacare/
├── mamacare-app/              # Frontend React application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── App.jsx             # Main frontend application
│   │   ├── App.css             # Main styling
│   │   ├── index.css           # Global styles
│   │   ├── main.jsx            # React entry point
│   │   └── services/
│   │       └── api.js          # Frontend API service layer
│   ├── package.json
│   └── vite.config.js
│
├── mamacare-backend/           # Backend Express API
│   ├── prisma/
│   │   ├── schema.prisma       # Database models
│   │   └── migrations/         # Prisma database migrations
│   ├── src/
│   │   ├── config/             # Prisma configuration
│   │   ├── controllers/        # API controller logic
│   │   ├── middleware/         # Auth and error middleware
│   │   ├── routes/             # API routes
│   │   ├── utils/              # Utility helpers
│   │   └── server.js           # Express server entry point
│   ├── .env.example            # Environment variable template
│   └── package.json
│
├── MERGE_NOTES.md              # Notes about features merged from the similar project
└── README.md                   # Project documentation
```

---

## Backend API Overview

The backend exposes REST API routes under `/api`.

| Area | Route |
|---|---|
| Authentication | `/api/auth` |
| Mother profile | `/api/profile` |
| Symptom logs | `/api/symptoms` |
| Vital logs | `/api/vitals` |
| Wellness logs | `/api/wellness` |
| Appointment reminders | `/api/appointments` |
| Medication reminders | `/api/medications` |
| Baby movement logs | `/api/baby-movements` |
| Emergency plan | `/api/emergency-plan` |
| Health records | `/api/health-record` |
| Postnatal care | `/api/postnatal-care` |
| Support people | `/api/support-people` |
| Notifications and alerts | `/api/notifications` |
| Reports | `/api/reports` |
| Sync status | `/api/sync` |
| AI guidance | `/api/ai` |

---

## Installation and Setup

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git

---

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd mamacare
```

---

## 2. Setup the Backend

```bash
cd mamacare-backend
npm install
```

Create a `.env` file by copying the example file:

```bash
cp .env.example .env
```

For Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Example `.env` file:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="change_this_to_a_long_random_secret"
PORT=5000
FRONTEND_URL="http://localhost:5173"
OPENAI_API_KEY=""
OPENAI_MODEL="gpt-5.5"
```

Generate the Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start the backend server:

```bash
npm run dev
```

The backend should run at:

```text
http://localhost:5000
```

Health check endpoint:

```text
http://localhost:5000/api/health
```

---

## 3. Setup the Frontend

Open a new terminal:

```bash
cd mamacare-app
npm install
npm run dev
```

The frontend should run at:

```text
http://localhost:5173
```

---

## Running the Full Project Locally

Terminal 1:

```bash
cd mamacare-backend
npm run dev
```

Terminal 2:

```bash
cd mamacare-app
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

## Build Commands

### Frontend Production Build

```bash
cd mamacare-app
npm run build
```

### Frontend Preview

```bash
npm run preview
```

### Backend Production Start

```bash
cd mamacare-backend
npm start
```

---

## AI Functionality

MamaCare includes an AI route:

```text
POST /api/ai/ask
```

The AI assistant is designed to provide safety-first pregnancy guidance. It uses saved MamaCare context where available, such as symptoms, vitals, wellness logs, baby movement, and emergency plan details.

If `OPENAI_API_KEY` is not set, the backend uses a local fallback response. This fallback can still detect some danger-sign keywords and return a safety warning.

The AI must not be treated as a doctor or diagnostic system. It should support awareness, guidance, and urgent-care escalation when danger signs appear.

---

## Database Models

The Prisma schema includes the following main models:

- `User`
- `MotherProfile`
- `SymptomLog`
- `VitalLog`
- `WellnessLog`
- `Appointment`
- `MedicationReminder`
- `BabyMovementLog`
- `EmergencyPlan`
- `HealthRecord`
- `PostnatalCare`
- `SupportPerson`

These models support the mother-centered monitoring flow of the application.

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | SQLite database connection string |
| `JWT_SECRET` | Secret key used for authentication tokens |
| `PORT` | Backend server port |
| `FRONTEND_URL` | Frontend URL allowed by CORS |
| `OPENAI_API_KEY` | Optional API key for AI-generated responses |
| `OPENAI_MODEL` | AI model used by the backend |

Do not commit a real `.env` file to GitHub. Use `.env.example` for sharing setup requirements.

---

## Security Notes

- Do not upload `node_modules`.
- Do not push `.env` files to GitHub.
- Use a strong `JWT_SECRET` in production.
- Keep API keys private.
- Use HTTPS in production.
- Use secure hosting for both frontend and backend.

---

## Important Health Disclaimer

MamaCare is a support and monitoring tool. It is not a medical diagnosis system and does not replace doctors, midwives, nurses, or emergency care.

If the mother experiences danger signs such as heavy bleeding, severe headache, blurred vision, convulsions, severe abdominal pain, difficulty breathing, high fever, fainting, or reduced baby movement, she should seek urgent medical care immediately.

---

## Project Status

Current status: active academic/project development.

Completed areas include:

- Frontend pregnancy monitoring interface
- Backend API structure
- Authentication
- Symptom logging
- Vitals logging with weight support
- Appointment reminder logic
- Medication reminders
- Notification generation
- AI guidance route
- Prisma database models

Future improvements may include:

- Better dashboard charts
- More detailed trend analysis
- SMS or WhatsApp reminder integration
- Offline-first sync improvements
- Cleaner separation of frontend components
- Deployment to a production server

---

## Author

MamaCare was developed as a smart maternal monitoring system project focused on improving pregnancy monitoring, reminders, alerts, and maternal health awareness from the mother’s side.

