import prisma from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function toDateOnly(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toISOString().slice(0, 10);
}

function daysUntil(dateValue) {
  if (!dateValue) return null;
  const target = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}

function appointmentNotification(appointment) {
  const remaining = daysUntil(appointment.date);
  const appointmentDate = toDateOnly(appointment.date);
  const title = appointment.type || "ANC appointment";
  const location = appointment.facility || "Location not saved";

  if (remaining === null) {
    return {
      id: `appointment-${appointment.id}-date-check`,
      type: "appointment",
      status: "date_check",
      level: "normal",
      title: "Appointment date needs checking",
      message: `${title} has no readable date. Add the correct date so MamaCare can remind you.`,
      appointmentId: appointment.id,
    };
  }

  if (remaining < 0) {
    return {
      id: `appointment-${appointment.id}-overdue`,
      type: "appointment",
      status: "overdue",
      level: "watch",
      title: "Appointment reminder overdue",
      message: `${title} at ${location} was saved for ${appointmentDate}. Update it if you already attended.`,
      appointmentId: appointment.id,
    };
  }

  if (remaining === 0) {
    return {
      id: `appointment-${appointment.id}-today`,
      type: "appointment",
      status: "today",
      level: "watch",
      title: "Appointment is today",
      message: `${title} is today at ${appointment.time || "the saved time"}. Carry your ANC card and hospital notes.`,
      appointmentId: appointment.id,
    };
  }

  if (remaining === 1) {
    return {
      id: `appointment-${appointment.id}-tomorrow`,
      type: "appointment",
      status: "tomorrow",
      level: "watch",
      title: "Appointment is tomorrow",
      message: `${title} is tomorrow at ${location}. Confirm transport and what to carry.`,
      appointmentId: appointment.id,
    };
  }

  if (remaining <= 7) {
    return {
      id: `appointment-${appointment.id}-seven-day`,
      type: "appointment",
      status: "upcoming",
      level: "normal",
      title: "Appointment is within 7 days",
      message: `${title} is due on ${appointmentDate} at ${location}. MamaCare will keep this reminder visible.`,
      appointmentId: appointment.id,
    };
  }

  return null;
}

export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const [appointments, medications, latestVital, latestSymptom, latestMovement] = await Promise.all([
    prisma.appointment.findMany({ where: { userId }, orderBy: [{ date: "asc" }, { time: "asc" }] }),
    prisma.medicationReminder.findMany({ where: { userId, isActive: true }, orderBy: { time: "asc" } }),
    prisma.vitalLog.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.symptomLog.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.babyMovementLog.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
  ]);

  const items = [];

  for (const appointment of appointments) {
    const item = appointmentNotification(appointment);
    if (item) items.push(item);
  }

  for (const medication of medications.slice(0, 5)) {
    items.push({
      id: `medication-${medication.id}`,
      type: "medication",
      status: "active",
      level: "normal",
      title: "Medication reminder",
      message: `${medication.name} ${medication.dosage || ""}`.trim() + ` • ${medication.time || "Time not set"}`,
      medicationId: medication.id,
    });
  }

  const recentHealthRecords = [
    { kind: "vital", record: latestVital },
    { kind: "symptom", record: latestSymptom },
    { kind: "movement", record: latestMovement },
  ];

  for (const { kind, record } of recentHealthRecords) {
    if (record?.riskLevel === "urgent" || record?.riskLevel === "watch") {
      items.unshift({
        id: `${kind}-${record.id}-${record.riskLevel}`,
        type: "health_alert",
        status: record.riskLevel,
        level: record.riskLevel,
        title: record.riskLevel === "urgent" ? "Urgent health alert" : "Health reading needs attention",
        message: "A recent MamaCare log produced an alert. Open the app to review the AI/safety guidance and next steps.",
      });
    }
  }

  res.json({ items, unreadCount: items.filter((item) => item.level !== "normal").length });
});

export const markRead = asyncHandler(async (req, res) => {
  res.json({ message: "Notification marked as read.", id: req.params.id });
});

export const markAllRead = asyncHandler(async (req, res) => {
  res.json({ message: "All notifications marked as read." });
});
