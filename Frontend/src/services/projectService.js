import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_SERVER_DOMAIN}/projects`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getProjects = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all`, getAuthHeaders());
    return response.data.projects;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch projects");
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/create`,
      projectData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
        "Failed to create project. Please note that the project name must be unique."
    );
  }
};

export const updateProjectUsers = async (projectId, users) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/add-user`,
      { projectId, users },
      getAuthHeaders()
    );
    return response.data.project;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to update project");
  }
};

export const getProjectById = async (projectId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/get-project/${projectId}`,
      getAuthHeaders()
    );
    return response.data.project;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to get project");
  }
};

export const deleteProject = async (projectId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${import.meta.env.VITE_SERVER_DOMAIN}/projects/delete/${projectId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || "Failed to delete project");
  }
  return await res.json();
};

export const updateProjectFlow = async (projectId, fileTree) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/update-flow/${projectId}`,
      { fileTree },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update project flow"
    );
  }
};

export const toggleProjectActiveState = async ({ projectId, userId }) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/toggle-active/${projectId}`,
      { userId },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      "Failed to toggle project active state";
    throw new Error(errorMessage);
  }
};

export const updateProjectName = async ({ projectId, name, userId }) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/update-name/${projectId}`,
      { name, userId },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    // Extract the server's error message if available
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to update project name";
    throw new Error(errorMessage);
  }
};
