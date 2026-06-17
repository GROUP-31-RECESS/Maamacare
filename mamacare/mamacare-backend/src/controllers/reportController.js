import prisma from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const clinicSummary = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const [
    profile, latestSymptom, latestVital, latestWellness, latestMovement,
    healthRecord, emergencyPlan, postnatalCare, supportPeople
  ] = await Promise.all([
    prisma.motherProfile.findUnique({ where: { userId } }),
    prisma.symptomLog.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.vitalLog.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.wellnessLog.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.babyMovementLog.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.healthRecord.findUnique({ where: { userId } }),
    prisma.emergencyPlan.findUnique({ where: { userId } }),
    prisma.postnatalCare.findUnique({ where: { userId } }),
    prisma.supportPerson.findMany({ where: { userId }, orderBy: { isPrimary: "desc" } }),
  ]);
  res.json({ profile, latestSymptom, latestVital, latestWellness, latestMovement, healthRecord, emergencyPlan, postnatalCare, supportPeople });
});
