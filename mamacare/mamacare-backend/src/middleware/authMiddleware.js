import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) return res.status(401).json({ message: "Not authorized. Token missing." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, phone: true, createdAt: true },
    });

    if (!user) return res.status(401).json({ message: "Not authorized. User not found." });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Not authorized. Invalid token." });
  }
};
