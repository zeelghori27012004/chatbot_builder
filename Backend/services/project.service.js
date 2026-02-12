import projectModel from "../models/project.model.js";
import mongoose from "mongoose";

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export const createProject = async ({
  name,
  userId,
  fileTree = { nodes: [], edges: [] },
}) => {
  if (!name) throw new Error("Name is required");
  if (!userId) throw new Error("UserId is required");

  try {
    const project = await projectModel.create({
      name,
      users: [userId],
      fileTree,
      createdBy: userId,
    });
    return project;
  } catch (error) {
    if (error.code === 11000) throw new Error("Project name already exists");
    throw error;
  }
};

export const getAllProjectByUserId = async ({ userId }) => {
  if (!userId) {
    throw new Error("UserId is required");
  }

  const allUserProjects = await projectModel.find({
    users: userId,
  });

  return allUserProjects;
};

export const addUsersToProject = async ({ projectId, users, userId }) => {
  if (!isValidObjectId(projectId)) throw new Error("Invalid Project ID");
  if (!projectId) {
    throw new Error("projectId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId");
  }

  if (!users) {
    throw new Error("users are required");
  }

  if (
    !Array.isArray(users) ||
    users.some((userId) => !mongoose.Types.ObjectId.isValid(userId))
  ) {
    throw new Error("Invalid userId(s) in users array");
  }

  if (!userId) {
    throw new Error("userId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId");
  }

  const project = await projectModel.findOne({
    _id: projectId,
    users: userId,
  });

  console.log(project);

  if (!project) {
    throw new Error("User not belong to this project");
  }

  const updatedProject = await projectModel.findOneAndUpdate(
    {
      _id: projectId,
    },
    {
      $addToSet: {
        users: {
          $each: users,
        },
      },
    },
    {
      new: true,
    }
  );

  return updatedProject;
};

export const getProjectById = async ({ projectId }) => {
  if (!isValidObjectId(projectId)) throw new Error("Invalid Project ID");
  if (!projectId) {
    throw new Error("projectId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId");
  }

  const project = await projectModel
    .findOne({
      _id: projectId,
    })
    .populate("users");

  return project;
};

export const deleteProjectById = async ({ projectId, userId }) => {
  if (!projectId) {
    throw new Error("projectId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId");
  }

  if (!userId) {
    throw new Error("userId is required");
  }

  const project = await projectModel.findOne({ _id: projectId });

  if (!project) {
    throw new Error("Project not found");
  }

  // Optional: Only allow deletion if the user is part of the project
  const isUserInProject = project.users.includes(userId);
  if (!isUserInProject) {
    throw new Error("User does not have permission to delete this project");
  }

  await projectModel.deleteOne({ _id: projectId });

  return { message: "Project deleted successfully" };
};

export const updateProjectFlow = async ({ projectId, fileTree }) => {
  if (!isValidObjectId(projectId)) throw new Error("Invalid Project ID");
  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId");
  }

  const project = await projectModel.findById(projectId);
  if (!project) {
    throw new Error("Project not found");
  }

  project.fileTree = fileTree;
  return await project.save();
};

export const updateProjectName = async ({ projectId, name, userId }) => {
  if (!isValidObjectId(projectId)) throw new Error("Invalid Project ID");
  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId");
  }

  if (!name || typeof name !== "string") {
    throw new Error("Project name must be a valid string");
  }

  const project = await projectModel.findOne({ _id: projectId });

  if (!project) {
    throw new Error("Project not found");
  }

  if (!project.users.includes(userId)) {
    throw new Error("User does not have permission to update this project");
  }

  project.name = name.toLowerCase().trim();

  try {
    return await project.save();
  } catch (err) {
    if (err.code === 11000) {
      throw new Error("Project name already exists");
    }
    throw err;
  }
};

export const searchProjectsByName = async ({ name, userId }) => {
  if (!name || !userId) {
    throw new Error("Name and userId are required");
  }

  const regex = new RegExp(name, "i"); // case-insensitive partial match

  const projects = await projectModel.find({
    name: { $regex: regex },
    users: userId,
  });

  return projects;
};

export const removeUserFromProject = async ({
  projectId,
  userToRemove,
  requestedBy,
}) => {
  if (!isValidObjectId(projectId) || !isValidObjectId(userIdToRemove)) {
    throw new Error("Invalid IDs");
  }
  const project = await projectModel.findOne({ _id: projectId });

  if (!project) throw new Error("Project not found");
  if (!project.users.includes(requestedBy)) throw new Error("Not authorized");

  project.users = project.users.filter((u) => u.toString() !== userToRemove);
  return await project.save();
};

export const updateWhatsappConfig = async ({
  projectId,
  userId,
  configData,
}) => {
  if (!isValidObjectId(projectId)) throw new Error("Invalid Project ID");

  const project = await projectModel.findOne({ _id: projectId, users: userId });

  if (!project) {
    throw new Error("Project not found or user not authorized");
  }

  const {
    whatsappPhoneNumberId,
    whatsappAccessToken,
    whatsappWebhookVerifyToken,
  } = configData;

  project.whatsappPhoneNumberId = whatsappPhoneNumberId;
  project.whatsappAccessToken = whatsappAccessToken;
  project.whatsappWebhookVerifyToken = whatsappWebhookVerifyToken;

  return await project.save();
};

export const toggleProjectActiveState = async ({ projectId, userId }) => {
  if (!isValidObjectId(projectId)) throw new Error("Invalid Project ID");

  const project = await projectModel.findOne({ _id: projectId, users: userId });

  if (!project) {
    throw new Error("Project not found or user not authorized");
  }

  const isActivating = !project.isActive;

  if (isActivating) {
    // Validate flow before activation
    const validationResult = validateFlow(project.fileTree?.nodes || [], project.fileTree?.edges || []);
    if (!validationResult.isValid) {
      throw new Error(`Flow validation failed: ${validationResult.errors.join(', ')}`);
    }

    const existingActive = await projectModel.findOne({
      users: userId,
      isActive: true,
      _id: { $ne: projectId },
    });

    if (existingActive) {
      throw new Error("Only one project can be active at a time.");
    }
  }

  project.isActive = isActivating;
  const updated = await project.save();

  return {
    message: `Project ${isActivating ? "activated" : "deactivated"} successfully.`,
    project: updated,
  };
};

// Flow validation function
function validateFlow(nodes, edges) {
  const errors = [];

  if (nodes.length === 0) {
    errors.push("Error: Flow is empty. Please add at least one node.");
    return { isValid: false, errors };
  }

  // Helper maps for efficient lookups
  const nodeConnections = new Map(
    nodes.map((node) => [node.id, { in: 0, out: 0 }])
  );

  for (const edge of edges) {
    // Rule: No self-connecting nodes
    if (edge.source === edge.target) {
      const node = nodes.find((n) => n.id === edge.source);
      errors.push(
        `Error: Node "${node?.data?.label || node?.id}" connects to itself.`
      );
    }

    // Tally incoming and outgoing connections for each node
    if (nodeConnections.has(edge.source)) {
      nodeConnections.get(edge.source).out += 1;
    }
    if (nodeConnections.has(edge.target)) {
      nodeConnections.get(edge.target).in += 1;
    }
  }

  // Iterate over each node to check its specific rules
  for (const node of nodes) {
    const connections = nodeConnections.get(node.id);

    // Rule: Every node must be connected (except for a single start node)
    if (connections.in === 0 && connections.out === 0) {
      errors.push(
        `Error: Node "${
          node.data.label || node.id
        }" is isolated and not connected to anything.`
      );
    }

    const startNodes = nodes.filter((n) => n.type === "start");
    if (startNodes.length > 1) {
      errors.push("Error: Multiple start nodes detected. Only one is allowed.");
    }

    if (connections.in === 0 && node.type !== "start") {
      errors.push(
        `Error: Node "${
          node.data.label || node.id
        }" has no incoming connection.`
      );
    }
    if (connections.out === 0 && node.type !== "end") {
      errors.push(
        `Error: Node "${
          node.data.label || node.id
        }" has no outgoing connection.`
      );
    }

    // --- Required content validation ---
    // Helper: required fields for each node type
    const requiredFieldsMap = {
      start: [],
      message: ["message"],
      buttons: ["message", "buttons"],
      keywordMatch: ["keywords"],
      apiCall: ["requestName", "url"],
      askaQuestion: ["question", "propertyName"],
      end: [],
    };
    const nodeType = node.type;
    const requiredFields = requiredFieldsMap[nodeType] || [];
    const properties = node.data?.properties || {};
    requiredFields.forEach((field) => {
      const value = properties[field];
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0) ||
        (Array.isArray(value) && value.every((item) => !item || (typeof item === "string" && item.trim() === "")))
      ) {
        errors.push(
          `Error: Node "${node.data.label || node.id}" is missing required content: ${field}`
        );
      }
      // API URL validation
      if (nodeType === "apiCall" && field === "url" && typeof value === "string") {
        try {
          new URL(value);
        } catch {
          errors.push(`Error: Node "${node.data.label || node.id}" has an invalid API URL.`);
        }
      }
    });

    // Node-specific validation
    switch (node.type) {
      case "condition": {
        const outgoingEdges = edges.filter((e) => e.source === node.id);
        const labels = new Set(
          outgoingEdges.map((e) => (e.label || e.data?.label)?.toLowerCase())
        );
        if (!labels.has("true")) {
          errors.push(
            `Error: Condition node "${
              node.data.label || node.id
            }" is missing an outgoing 'true' path.`
          );
        }
        if (!labels.has("false")) {
          errors.push(
            `Error: Condition node "${
              node.data.label || node.id
            }" is missing an outgoing 'false' path.`
          );
        }
        break;
      }
      case "buttons": {
        const definedButtons = node.data?.properties?.buttons || [];
        if (definedButtons.length === 0 && connections.out > 0) {
          errors.push(
            `Error: Buttons node "${
              node.data.label || node.id
            }" has outgoing connections but no buttons defined.`
          );
        }

        const outgoingEdges = edges.filter((e) => e.source === node.id);
        const edgeLabels = new Set(
          outgoingEdges.map((e) => (e.label || e.data?.label)?.toLowerCase())
        );

        for (const buttonLabel of definedButtons) {
          if (!edgeLabels.has(buttonLabel.toLowerCase())) {
            errors.push(
              `Error: Buttons node "${
                node.data.label || node.id
              }" is missing an outgoing connection for the "${buttonLabel}" button.`
            );
          }
        }
        break;
      }
      case "end":
        if (connections.out > 0) {
          errors.push(
            `Error: End node "${
              node.data.label || node.id
            }" cannot have outgoing connections.`
          );
        }
        break;
      case "start":
        if (connections.in > 0) {
          errors.push(
            `Error: Start Node "${
              node.data.label || node.id
            }" cannot have incoming connections.`
          );
        }
        break;
      default:
        break;
    }
  }

  // Check for multiple end nodes
  const endNodes = nodes.filter((n) => n.type === "end");
  if (endNodes.length > 1) {
    errors.push("Error: Multiple end nodes detected. Only one is allowed.");
  }

  // Cycle detection (DFS)
  function hasCycle() {
    const visited = new Set();
    const recStack = new Set();
    const adj = {};
    nodes.forEach((node) => (adj[node.id] = []));
    edges.forEach((edge) => {
      if (adj[edge.source]) adj[edge.source].push(edge.target);
    });
    function dfs(nodeId) {
      if (!visited.has(nodeId)) {
        visited.add(nodeId);
        recStack.add(nodeId);
        for (const neighbor of adj[nodeId]) {
          if (!visited.has(neighbor) && dfs(neighbor)) return true;
          else if (recStack.has(neighbor)) return true;
        }
      }
      recStack.delete(nodeId);
      return false;
    }
    return nodes.some((node) => dfs(node.id));
  }
  if (hasCycle()) {
    errors.push("Error: The flow contains a circular loop (cycle). Please remove cycles.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
