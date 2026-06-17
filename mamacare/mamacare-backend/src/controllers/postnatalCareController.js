import prisma from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const defaults = {"afterBirthMode": false};

export const getOne = asyncHandler(async (req, res) => {
  const item = await prisma.postnatalCare.upsert({
    where: { userId: req.user.id },
    update: {},
    create: { userId: req.user.id, ...defaults },
  });
  res.json(item);
});

export const updateOne = asyncHandler(async (req, res) => {
  const item = await prisma.postnatalCare.upsert({
    where: { userId: req.user.id },
    update: req.body,
    create: { userId: req.user.id, ...defaults, ...req.body },
  });
  res.json(item);
});
