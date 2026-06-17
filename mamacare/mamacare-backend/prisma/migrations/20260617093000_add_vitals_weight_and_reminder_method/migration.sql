-- Adds mother reminder preference and hospital-result fields for vitals logging.
ALTER TABLE "MotherProfile" ADD COLUMN "preferredReminderMethod" TEXT NOT NULL DEFAULT 'in_app';
ALTER TABLE "VitalLog" ADD COLUMN "weightKg" REAL;
ALTER TABLE "VitalLog" ADD COLUMN "facility" TEXT;
