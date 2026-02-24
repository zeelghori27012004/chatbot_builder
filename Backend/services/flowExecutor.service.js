import projectModel from "../models/project.model.js";
import redisClient from "./redis.service.js";
import {sendWhatsappMessage, sendWhatsappMedia} from "./whatsapp.service.js";
import _ from "lodash";
import axios from "axios";

// interpolation function for contact properties
async function interpolate(str, projectId, senderWaPhoneNo) {
  if (!str || typeof str !== "string") return str;

  const regex = /{{(.*?)}}/g;
  const matches = [...str.matchAll(regex)];

  for (const match of matches) {
    const variable = match[1].trim();
    const redisKey = `${projectId}_${senderWaPhoneNo}_${variable}`;

    try {
      const value = await redisClient.get(redisKey);
      console.log(value);
      str = str.replace(match[0], value || "");
    } catch (error) {
      console.error(`Error fetching ${redisKey} from Redis:`, error);
      str = str.replace(match[0], "");
    }
  }

  return str;
}

// Normalize button text
function normalizeLabel(label) {
  return label.trim().toLowerCase().replace(/\s+/g, "_");
}

// Find next node based on edge label
function findNextNode(sourceNodeId, edges, conditionLabel = null) {
  if (conditionLabel) {
    return (
      edges.find(
        (e) =>
          e.source === sourceNodeId &&
          normalizeLabel(e.label || "") === normalizeLabel(conditionLabel)
      )?.target || null
    );
  }
  return edges.find((e) => e.source === sourceNodeId)?.target || null;
}

// Get project fileTree from DB
async function getProjectFileTree(projectId) {
  try {
    const project = await projectModel.findById(projectId).select("fileTree");
    return project?.fileTree || null;
  } catch (error) {
    console.error("Error fetching project fileTree:", error);
    return null;
  }
}

export async function processMessage({
  projectId,
  senderWaPhoneNo,
  messageText,
  buttonReplyId,
}) {
  const userStateKey = `flow-state:${senderWaPhoneNo}:${projectId}`;
  const fileTree = await getProjectFileTree(projectId);
  if (!fileTree) return;

  const normalizedInput = buttonReplyId
    ? buttonReplyId.trim().toLowerCase()
    : normalizeLabel(messageText || "");

  // 1. Handle awaiting button response
  let awaiting;
  try {
    const awaitingStr = await redisClient.get(
      `${userStateKey}:awaitingButtonResponse`
    );
    if (awaitingStr) awaiting = JSON.parse(awaitingStr);
  } catch (error) {
    console.error("Redis read error:", error);
  }

  if (awaiting) {
    const {nodeId, buttons} = awaiting;

    console.log("Awaiting button response:");
    console.log("User input (raw messageText):", messageText);
    console.log("ButtonReplyId:", buttonReplyId);
    console.log("Normalized input:", normalizedInput);
    console.log(
      "Matching against button IDs:",
      buttons.map((btn, index) => `btn_${index + 1}_${normalizeLabel(btn)}`)
    );