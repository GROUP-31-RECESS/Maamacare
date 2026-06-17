import prisma from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await prisma.motherProfile.upsert({
    where: { userId: req.user.id },
    update: {},
    create: { userId: req.user.id, name: req.user.name, phone: req.user.phone },
  });
  res.json(profile);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await prisma.motherProfile.upsert({
    where: { userId: req.user.id },
    update: req.body,
    create: { userId: req.user.id, name: req.body.name || req.user.name, phone: req.body.phone || req.user.phone, ...req.body },
  });
  res.json(profile);
});
