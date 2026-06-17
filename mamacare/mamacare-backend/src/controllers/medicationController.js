import prisma from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAll = asyncHandler(async (req, res) => {
  const items = await prisma.medicationReminder.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });
  res.json(items);
});

export const createOne = asyncHandler(async (req, res) => {
  const item = await prisma.medicationReminder.create({
    data: { ...req.body, userId: req.user.id },
  });
  res.status(201).json(item);
});

export const updateOne = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.medicationReminder.findFirst({ where: { id, userId: req.user.id } });
  if (!existing) {
    res.status(404);
    throw new Error("Record not found.");
  }
  const item = await prisma.medicationReminder.update({ where: { id }, data: req.body });
  res.json(item);
});

export const deleteOne = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.medicationReminder.findFirst({ where: { id, userId: req.user.id } });
  if (!existing) {
    res.status(404);
    throw new Error("Record not found.");
  }
  await prisma.medicationReminder.delete({ where: { id } });
  res.json({ message: "Record deleted successfully." });
});
