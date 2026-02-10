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

