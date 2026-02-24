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

    // Match based on reply ID format
    const matchedIndex = buttons.findIndex(
      (btn, index) =>
        normalizedInput === `btn_${index + 1}_${normalizeLabel(btn)}`
    );

    const matchedLabel = matchedIndex !== -1 ? buttons[matchedIndex] : null;

    if (matchedLabel) {
      console.log(`Matched button: "${matchedLabel}"`);

      const nextNodeId = findNextNode(
        nodeId,
        fileTree.edges,
        normalizeLabel(matchedLabel)
      );

      if (nextNodeId) {
        await redisClient.set(userStateKey, nextNodeId, "EX", 3600);
        await redisClient.del(`${userStateKey}:awaitingButtonResponse`);
        await redisClient.del(`${userStateKey}:buttonInvalidCount`);

        console.log(`➡ Moving to next node: ${nextNodeId}`);
        await executeNode(nextNodeId, {
          projectId,
          senderWaPhoneNo,
          messageText,
          fileTree,
          userStateKey,
          buttonReplyId,
        });
        return;
      }
    } else {
      console.warn("No matching button found.");

      const invalidCountKey = `${userStateKey}:buttonInvalidCount`;
      let invalidCount = 0;
      try {
        const countStr = await redisClient.get(invalidCountKey);
        invalidCount = countStr ? parseInt(countStr, 10) : 0;
      } catch (err) {
        console.error("Error reading invalid count from Redis:", err);
      }

      invalidCount += 1;

      if (invalidCount >= 3) {
        console.warn(
          `User ${senderWaPhoneNo} exceeded invalid attempts. Ending flow.`
        );

        await sendWhatsappMessage({
          to: senderWaPhoneNo,
          text: `You've entered too many invalid responses (3/3).\nEnding this session. Please try again later if needed.`,
          projectId,
        });

        await redisClient.del(userStateKey);
        await redisClient.del(`${userStateKey}:awaitingButtonResponse`);
        await redisClient.del(invalidCountKey);

        const endNode = fileTree.nodes.find((n) => n.type === "end");
        if (endNode) {
          await executeNode(endNode.id, {
            projectId,
            senderWaPhoneNo,
            messageText,
            fileTree,
            userStateKey,
            buttonReplyId,
          });
        }

        return;
      }

      await redisClient.set(
        invalidCountKey,
        invalidCount.toString(),
        "EX",
        3600
      );

      await sendWhatsappMessage({
        to: senderWaPhoneNo,
        text: `Invalid response. Please choose one of the buttons. (${invalidCount}/3 attempts used)`,
        projectId,
      });

      return;
    }
  }

  // 2. Global button check
  for (const node of fileTree.nodes) {
    if (node.type === "buttons") {
      const buttons = node.data?.properties?.buttons || [];

      const matchedIndex = buttons.findIndex(
        (btn, index) =>
          normalizedInput === `btn_${index + 1}_${normalizeLabel(btn)}`
      );

      const matchedLabel = matchedIndex !== -1 ? buttons[matchedIndex] : null;

      if (matchedLabel) {
        const nextNodeId = findNextNode(
          node.id,
          fileTree.edges,
          normalizeLabel(matchedLabel)
        );
        if (nextNodeId) {
          await redisClient.set(userStateKey, nextNodeId, "EX", 3600);
          await redisClient.del(`${userStateKey}:awaitingButtonResponse`);
          await redisClient.del(`${userStateKey}:buttonInvalidCount`);
          await executeNode(nextNodeId, {
            projectId,
            senderWaPhoneNo,
            messageText,
            fileTree,
            userStateKey,
            buttonReplyId,
          });
          return;
        }
      }
    }
  }

  // 3. Continue or start normal flow
  let currentNodeId = null;
  try {
    currentNodeId = await redisClient.get(userStateKey);
  } catch (err) {
    console.error("Redis error while getting currentNodeId:", err);
  }

  if (!currentNodeId) {
    const startNode = fileTree.nodes.find((node) => node.type === "start");
    if (!startNode) {
      console.error("No start node found.");
      return;
    }
    currentNodeId = startNode.id;
  }

  //------------------------------ question - node starts-------------------------------//

  const currentNode = fileTree.nodes.find((n) => n.id === currentNodeId);
  if (!currentNode) {
    console.error("Current node not found in fileTree.");
    await redisClient.del(userStateKey);
    return;
  }

  if (currentNode.type === "askaQuestion") {
    const askedFlag = await redisClient.get(`${userStateKey}:asked`);

    if (askedFlag) {
      const variableName = currentNode.data?.properties?.propertyName;
      const validationType = currentNode.data?.properties?.validationType;
      const numberOfRepeats = parseInt(
        currentNode.data?.properties?.numberOfRepeats || "3",
        10
      );
      const retryKey = `${userStateKey}:retries`;

      const retryCount = parseInt((await redisClient.get(retryKey)) || "0", 10);

      let isValid = true;
      const input = messageText.trim();

      if (validationType === "email") {
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
      } else if (validationType === "phone number") {
        isValid = /^\+?\d{10,15}$/.test(input);
      } else if (validationType === "url") {
        isValid =
          /^(https?:\/\/)?[\w.-]+(\.[\w\.-]+)+[\w\-\._~:\/?#\[\]@!\$&'\(\)\*\+,;=.]+$/.test(
            input
          );
      }

      if (!isValid) {
        if (retryCount + 1 >= numberOfRepeats) {
          // await sendWhatsappMessage({
          //   to: senderWaPhoneNo,
          //   text: "Too many invalid attempts. Ending flow.",
          //   projectId,
          // });
          // await redisClient.del(userStateKey);
          await redisClient.del(`${userStateKey}:asked`);
          await redisClient.del(retryKey);
          const nextNodeId = findNextNode(
            currentNodeId,
            fileTree.edges,
            "Failure"
          );
          await redisClient.set(userStateKey, nextNodeId, "EX", 3600);
          await executeNode(nextNodeId, {
            projectId,
            senderWaPhoneNo,
            messageText,
            fileTree,
            userStateKey,
          });
          return;
        }

        await redisClient.set(retryKey, retryCount + 1, "EX", 3600);
        await sendWhatsappMessage({
          to: senderWaPhoneNo,
          text: `Please provide a valid ${validationType}.`,
          projectId,
        });
        return;
      }

      // Store valid answer
      if (variableName) {
        await redisClient.set(
          `${projectId}_${senderWaPhoneNo}_${variableName}`,
          input,
          "EX",
          3600
        );
        console.log(`Stored variable ${variableName} = ${input}`);
      }

      const nextNodeId = findNextNode(
        currentNode.id,
        fileTree.edges,
        "Success"
      );
      if (nextNodeId) {
        await redisClient.set(userStateKey, nextNodeId, "EX", 3600);
        await redisClient.del(`${userStateKey}:asked`);
        await redisClient.del(retryKey);
        await executeNode(nextNodeId, {
          projectId,
          senderWaPhoneNo,
          messageText,
          fileTree,
          userStateKey,
        });
      } else {
        await redisClient.del(userStateKey);
        console.log("No next node after question.");
      }
      return;
    }
  }