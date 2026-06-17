import { asyncHandler } from "../utils/asyncHandler.js";

export const getSyncStatus = asyncHandler(async (req, res) => {
  res.json({ status: "ready", mode: "local-to-cloud-ready", userId: req.user.id, serverTime: new Date().toISOString() });
});

export const pushSyncData = asyncHandler(async (req, res) => {
  res.json({ message: "Sync payload received.", groups: Object.keys(req.body || {}) });
});

export const pullSyncData = asyncHandler(async (req, res) => {
  res.json({ message: "Pull sync placeholder.", data: {} });
});
