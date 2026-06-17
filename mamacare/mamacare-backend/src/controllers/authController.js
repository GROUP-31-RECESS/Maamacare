import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, phone, password } = req.body;

  if (!name || !phone || !password) {
    res.status(400);
    throw new Error("Name, phone, and password are required.");
  }

  const existingUser = await prisma.user.findUnique({ where: { phone } });

  if (existingUser) {
    res.status(409);
    throw new Error("A user with this phone number already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      phone,
      password: hashedPassword,
      profile: {
        create: {
          name,
          phone,
          pregnancyWeek: 24,
          appearance: "light",
          language: "en",
          fontSize: 16,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  res.status(201).json({
    token: createToken(user.id),
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
    },
    profile: user.profile,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    res.status(400);
    throw new Error("Phone and password are required.");
  }

  const user = await prisma.user.findUnique({
    where: { phone },
    include: { profile: true },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error("Invalid phone number or password.");
  }

  res.json({
    token: createToken(user.id),
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
    },
    profile: user.profile,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      phone: true,
      createdAt: true,
      profile: true,
    },
  });

  res.json(user);
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Current password and new password are required.");
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error("New password must be at least 6 characters.");
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    res.status(401);
    throw new Error("Current password is incorrect.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedPassword },
  });

  res.json({
    message: "Password changed successfully.",
  });
});
