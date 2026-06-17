# MamaCare – Smart Maternal Monitoring System

MamaCare is a **mother-centered smart maternal monitoring system** designed to help a pregnant mother track her pregnancy, record symptoms, log hospital health results, receive reminders, and get smart alerts when her recorded information shows possible risk.

The system has **one user only: the mother**. It does not include doctors, midwives, administrators, receptionists, health workers, or hospital staff as system users. MamaCare is not a hospital management system and it does not book appointments or handle referrals. It is a personal pregnancy monitoring and awareness system, similar in concept to pregnancy tracking apps such as Flo, but focused on maternal monitoring, AI-supported guidance, alerts, and reminders.

---

## Project Summary

Pregnant mothers need continuous support during pregnancy, especially when tracking symptoms, remembering appointments, monitoring body changes, and recognizing possible danger signs early. In many cases, a mother receives health information from a hospital or clinic, such as weight, blood pressure, temperature, or other checkup results, but she may not have a simple personal system for recording and following up on those results over time.

MamaCare addresses this problem by giving the mother one digital space where she can log symptoms, record hospital results, track pregnancy progress, set reminders, and receive alerts. The mother enters her own information into the system, including symptoms, health readings, appointment dates, and personal reminder schedules. The system then analyzes the information and provides AI-generated guidance or alerts when the inputs suggest that something may need attention.

The goal of MamaCare is to support maternal self-monitoring, early awareness, and better personal pregnancy tracking. The system does not replace professional medical care. Instead, it helps the mother understand her recorded information and know when she should seek help from a qualified healthcare provider.

---

## Main User

The only user of the system is:

- **Pregnant Mother**

The mother uses the system to:

- Create and manage her personal pregnancy profile.
- Track her pregnancy progress week by week.
- Log symptoms she is experiencing.
- Receive AI-generated responses based on her logged symptoms.
- Receive alerts when symptoms or readings appear above normal or potentially risky.
- Record hospital results such as weight, blood pressure, temperature, or other checkup values.
- Add appointment dates she has already received from a hospital or clinic.
- Receive reminders for those appointments.
- Set personal reminders for medication, hydration, rest, checkups, and other pregnancy routines.
- View simple maternal health guidance and safety tips.

---

## Purpose of the System

The purpose of MamaCare is to provide a smart maternal monitoring tool that helps the mother:

- Monitor her pregnancy journey from her own phone or device.
- Keep a personal record of symptoms and health changes.
- Store health results received from hospital visits.
- Understand trends in readings such as blood pressure and weight.
- Get AI-supported guidance after symptom logging.
- Receive alerts when entered data suggests possible danger signs.
- Set and receive reminders for appointments she inputs herself.
- Set personal reminders for medication, water intake, rest, and routine monitoring.
- Access maternal health tips from one place.

---

## System Scope

MamaCare focuses only on **monitoring, AI-supported guidance, alerts, and reminders**.

### The system includes:

- Mother registration and login.
- Pregnancy profile setup.
- Pregnancy progress tracking.
- Symptom logging.
- AI-generated responses based on logged symptoms.
- Alert generation when symptoms or readings are above expected levels or match possible danger signs.
- Health result entry, such as weight, blood pressure, temperature, pulse rate, or other values recorded from hospital visits.
- Appointment reminders based only on dates entered by the mother.
- Personal pregnancy reminders.
- Maternal health tips.
- A simple dashboard for pregnancy status, recent logs, reminders, and alerts.

### The system does not include:

- Appointment booking.
- Doctor approval.
- Midwife review.
- Admin dashboard.
- Receptionist functions.
- Referrals.
- Ambulance dispatch.
- Hospital management.
- Laboratory workflows.
- Medical diagnosis.
- Treatment prescription.
- Communication between the mother and hospital staff.

---

## Key Features

### 1. Mother Account

The mother can create an account and securely access her personal pregnancy monitoring space.

### 2. Pregnancy Profile

The mother enters pregnancy-related information such as estimated delivery date, last menstrual period, current pregnancy week, or other pregnancy details depending on the implementation.

### 3. Pregnancy Monitoring Dashboard

The dashboard gives the mother a simple view of her pregnancy progress, upcoming reminders, recent symptoms, logged hospital results, and important alerts.

### 4. Symptom Logging

The mother can record symptoms such as:

- Headache.
- Dizziness.
- Swelling.
- Bleeding.
- Fever.
- Abdominal pain.
- Vomiting.
- Blurred vision.
- Reduced baby movement.
- Unusual tiredness.
- Any other symptom she wants to monitor.

### 5. AI-Generated Symptom Response

After the mother logs symptoms, the system can generate an AI-supported response. This response may explain what the symptom could mean in simple language, suggest safe general actions, and advise the mother to seek professional medical care when the symptom appears serious.

The AI response is not a medical diagnosis. It is meant to provide awareness, guidance, and safety support based on the information entered by the mother.

### 6. Hospital Result Logging

MamaCare allows the mother to record results she receives from a hospital, clinic, or antenatal checkup. These may include:

- New weight.
- Blood pressure.
- Body temperature.
- Pulse rate.
- Blood sugar level, if supported.
- Hemoglobin level, if supported.
- Notes from a checkup.

This helps the mother keep a personal history of her pregnancy health information instead of losing or forgetting values from different visits.

### 7. Smart Alerts

The system checks logged symptoms and health readings against basic maternal safety rules. When possible risk signs are detected, the system displays an alert.

Examples of alert triggers may include:

- Severe headache.
- Heavy bleeding.
- Swollen face or hands.
- Blurred vision.
- High fever.
- Severe abdominal pain.
- Reduced or no baby movement.
- Very high blood pressure readings.
- A reading that appears above the expected range.

The alert advises the mother to take the issue seriously and seek help from a qualified health facility when necessary.

### 8. Appointment Reminders

MamaCare does **not** book appointments. Instead, the mother enters an appointment date and time that she already received from a hospital or clinic, and the system reminds her before the appointment.

Example process:

1. The mother receives an antenatal appointment date from a health facility.
2. She enters the appointment title, date, time, and optional notes into MamaCare.
3. MamaCare saves the appointment reminder.
4. The system notifies her before the appointment.
5. The mother attends the appointment outside the system.

### 9. Personal Pregnancy Reminders

The mother can create reminders for pregnancy-related activities such as:

- Taking medication or supplements.
- Drinking water.
- Resting.
- Attending checkups.
- Recording symptoms.
- Monitoring blood pressure.
- Updating her weight after a clinic visit.

### 10. Maternal Health Tips

The system provides simple health guidance about pregnancy care, nutrition, danger signs, hygiene, rest, and general wellness.

---

## Main System Process

```text
Start
  ↓
Mother creates an account or logs in
  ↓
Mother sets up her pregnancy profile
  ↓
Mother views her monitoring dashboard
  ↓
Mother logs symptoms, hospital results, appointment dates, or reminders
  ↓
System stores the entered information
  ↓
System analyzes symptoms and readings
  ↓
System generates AI-supported guidance where applicable
  ↓
System checks for possible danger signs or above-normal values
  ↓
System sends alerts or reminders where necessary
  ↓
Mother views guidance and takes action when needed
  ↓
End
```

---

## Symptom and AI Response Process

```text
Start
  ↓
Mother selects or types symptoms
  ↓
Mother submits the symptom log
  ↓
System saves the symptom record
  ↓
System analyzes the symptoms
  ↓
System generates a simple AI-supported response
  ↓
If symptoms are mild or routine:
    System displays general guidance
  ↓
If symptoms suggest possible danger:
    System displays an alert
    System advises the mother to seek professional medical care
  ↓
End
```

---

## Hospital Result Logging Process

```text
Start
  ↓
Mother receives results from a hospital or clinic
  ↓
Mother opens the health result entry section
  ↓
Mother enters values such as weight, blood pressure, or temperature
  ↓
System saves the result with date and time
  ↓
System checks whether any value is above expected limits
  ↓
If values appear normal:
    System stores the record and updates the dashboard
  ↓
If values appear risky:
    System displays an alert and safety advice
  ↓
End
```

---

## Appointment Reminder Process

```text
Start
  ↓
Mother receives or knows her appointment date
  ↓
Mother enters appointment title, date, time, and notes
  ↓
System saves the appointment reminder
  ↓
System checks upcoming appointment dates
  ↓
System sends a reminder before the appointment
  ↓
Mother attends the appointment outside the system
  ↓
End
```

---

## Alert Process

```text
Start
  ↓
Mother records symptoms or health readings
  ↓
System validates the entered information
  ↓
System compares the input with maternal safety rules
  ↓
If no danger sign is detected:
    System saves the record and displays normal guidance
  ↓
If a possible danger sign is detected:
    System displays an alert message
    System advises the mother to seek professional medical care
  ↓
End
```

---

## Suggested Technology Stack

Update this section according to the actual implementation.

### Frontend

- React, React Native, Flutter, or any selected UI framework.
- HTML, CSS, and JavaScript if implemented as a web application.
- Mobile-first interface for easy mother access.

### Backend

- Node.js with Express, Django, Laravel, Firebase, Supabase, or any selected backend service.
- API logic for storing symptoms, reminders, appointment dates, alerts, AI responses, pregnancy profile data, and hospital result logs.

### Database

- Firebase, Supabase, MySQL, PostgreSQL, MongoDB, SQLite, or any selected database.

### AI Layer

- AI response module for symptom explanation and safety guidance.
- Rule-based alert module for detecting high-risk symptoms or readings.
- Fallback local safety assistant if external AI is unavailable.

### Tools

- Git and GitHub for version control.
- VS Code for development.
- Figma, Draw.io, or similar tools for interface and diagram design.

---

## Project Structure

A possible project structure is shown below. Update it to match the actual project files.

```text
MamaCare/
│
├── public/                  # Static files and images
├── src/                     # Main application source code
│   ├── assets/              # Images, icons, and design assets
│   ├── components/          # Reusable UI components
│   ├── pages/               # App screens/pages
│   ├── services/            # API, reminder, alert, and AI logic
│   ├── data/                # Static health tips or sample content
│   ├── utils/               # Helper functions
│   └── App.jsx              # Main application component
│
├── backend/                 # Optional backend folder
│   ├── routes/              # API routes
│   ├── controllers/         # Application logic
│   ├── models/              # Database models
│   └── server.js            # Backend entry point
│
├── package.json             # Project dependencies and scripts
├── README.md                # Project documentation
└── .env                     # Environment variables, not committed to GitHub
```

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <your-repository-link>
cd MamaCare
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root if the project requires environment variables.

```env
VITE_APP_NAME=MamaCare
VITE_API_BASE_URL=http://localhost:5000
VITE_AI_PROVIDER=local_or_external
```

Private keys should not be exposed in frontend code or committed to GitHub.

### 4. Run the Project

```bash
npm run dev
```

The development server will provide a local URL in the terminal.

---

## Reminder Logic

The reminder module is responsible for checking dates and notifying the mother about upcoming activities.

Examples of reminders include:

- Appointment reminders entered by the mother.
- Medication reminders.
- Hydration reminders.
- Rest reminders.
- Health check reminders.
- Symptom recording reminders.
- Hospital result update reminders.

---

## AI and Alert Logic

MamaCare uses two types of support logic:

1. **AI-generated response logic** – explains logged symptoms in simple language and gives general safety guidance.
2. **Alert logic** – checks symptoms and readings against safety rules and warns the mother when something appears risky.

The alert system is only for awareness and early warning. It does not provide diagnosis or treatment.

---

## Design Choices

MamaCare is designed as a simple mother-focused system. The design avoids hospital workflows because the purpose is not to manage a health facility. The system is built around the mother’s personal pregnancy journey: tracking, logging, reminders, AI-supported guidance, alerts, and health awareness.

The interface should be:

- Simple and easy to understand.
- Mobile-friendly.
- Clear in showing alerts and reminders.
- Supportive rather than complicated.
- Focused on the mother’s daily pregnancy monitoring experience.
- Similar to modern personal tracking apps, where the user records information and receives feedback.

---

## Assumptions

The system assumes that:

- The pregnant mother is the only user.
- The mother enters her own symptoms, hospital results, appointment dates, and reminders.
- The system reminds the mother about appointments but does not book appointments.
- The system can generate AI-supported responses after symptom logging.
- The system can alert the mother about possible danger signs or above-normal readings.
- The system does not refer the mother to a specific facility.
- The system does not replace doctors, midwives, or professional healthcare providers.
- The system supports maternal self-monitoring and awareness.

---

## Future Improvements

Possible future improvements include:

- Offline support for mothers with limited internet access.
- SMS reminders for mothers who may not always use mobile data.
- Local language support.
- Voice reminders.
- Better danger-sign detection rules.
- More advanced AI symptom explanations.
- Trend charts for weight, blood pressure, and other readings.
- Integration with wearable or digital health devices, such as blood pressure monitors.
- Improved notification scheduling.

Future improvements should still keep the system mother-centered unless the project scope changes.

---

## Security and Privacy Considerations

MamaCare handles personal pregnancy information, so privacy and security are important.

Recommended measures include:

- Secure login and authentication.
- Protecting mother profile data.
- Protecting symptom logs and hospital result records.
- Avoiding unnecessary collection of sensitive information.
- Keeping private keys out of public repositories.
- Using HTTPS in production.
- Allowing the mother to control her own data.

---

## Academic Relevance

This project demonstrates how software can support maternal health monitoring through user-centered design, symptom logging, hospital result tracking, reminders, smart alerts, AI-supported guidance, data storage, and simple health awareness logic. It shows how technology can assist mothers in tracking their pregnancy journey without turning the system into a hospital administration platform.

---

## Disclaimer

MamaCare is a maternal monitoring and awareness system. It does not provide medical diagnosis, treatment, appointment booking, referrals, or emergency dispatch. AI-generated responses are for general guidance only. A mother experiencing serious symptoms or danger signs should seek immediate help from a qualified healthcare provider or nearby health facility.

---

## Author

Developed by Alex Kwagala as part of the Smart Maternal Monitoring System / MamaCare project.
