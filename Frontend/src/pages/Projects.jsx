import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/User.context";
import {
  getProjects,
  createProject as createProjectService,
  deleteProject,
  toggleProjectActiveState,
} from "../services/projectService";
import {
  Trash2,
  PencilIcon,
  PlusIcon,
  EllipsisVertical,
  BadgeCheck,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Projects() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [newProjectName, setNewProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createProjectModal, setCreateProjectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [openOptionsId, setOpenOptionsId] = useState(null);
  const optionsRef = useRef(null);

  // Add ToastContainer at the component level
  // This can also be added at your root App component
  const notifyError = (message) => toast.error(message);
  const notifySuccess = (message) => toast.success(message);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setOpenOptionsId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    fetchProjects();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data || []);
      const activeProject = data.find((project) => project.isActive);
      if (activeProject) {
        setActiveProjectId(activeProject._id);
      }
    } catch (err) {
      const errorMsg = err.message || "Failed to load projects";
      setError(errorMsg);
      notifyError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const createProjectPopup = () => {
    setCreateProjectModal(true);
  };

  const createProject = async () => {
    if (!newProjectName.trim()) {
      notifyError("Project name cannot be empty.");
      return;
    }

    try {
      const data = await createProjectService({ name: newProjectName.trim() });
      setCreateProjectModal(false);
      setNewProjectName("");
      notifySuccess(`Project "${data.name}" created successfully!`);
      fetchProjects();
    } catch (error) {
      console.error("Error creating project:", error.message);
      notifyError(error.message);
    }
  };

  const handleOpenOptions = (projectId, e) => {
    e.stopPropagation();
    setOpenOptionsId(openOptionsId === projectId ? null : projectId);
  };

  const confirmDelete = (project, e) => {
    e?.stopPropagation();
    setProjectToDelete(project);
    setShowDeleteModal(true);
    setOpenOptionsId(null);
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject(projectToDelete._id);
      setProjects((prev) => prev.filter((p) => p._id !== projectToDelete._id));
      if (activeProjectId === projectToDelete._id) {
        setActiveProjectId(null);
      }
      setShowDeleteModal(false);
      setProjectToDelete(null);
      notifySuccess(`Project "${projectToDelete.name}" deleted successfully`);
    } catch (err) {
      notifyError(err.message);
    }
  };

  const handleSetActive = async (projectId, e) => {
    e.stopPropagation();
    try {
      await toggleProjectActiveState({
        projectId,
        userId: user._id,
      });

      setProjects((prev) =>
        prev.map((project) => ({
          ...project,
          isActive: project._id === projectId ? !project.isActive : false,
        }))
      );

      setActiveProjectId((prev) => (prev === projectId ? null : projectId));

      const project = projects.find((p) => p._id === projectId);
      if (project) {
        const action =
          activeProjectId === projectId ? "deactivated" : "activated";
        notifySuccess(`Project "${project.name}" ${action} successfully`);
      }
    } catch (error) {
      console.error("Error toggling active state:", error.message);
      // Split error messages if multiple errors are present
      if (error.message && error.message.includes("Flow validation failed:")) {
        const errorList = error.message
          .replace("Flow validation failed: ", "")
          .split(", Error: ");
        errorList.forEach((err, idx) => {
          toast.error((idx === 0 ? err : "Error: " + err).trim());
        });
      } else {
        notifyError(error.message);
      }

      // If it's the "only one project" error, refresh to sync state
      if (error.message.includes("Only one project can be active")) {
        fetchProjects();
      }
    }
  };

  return (
    <div className="bg-slate-300 min-h-screen">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={true}
        theme="light"
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-gray-800">My Projects</h1>
          <button
            onClick={createProjectPopup}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
          >
            <PlusIcon /> Create New Project
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading projects...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : projects.length === 0 ? (
          <p className="text-gray-700">No projects yet. Create one above.</p>
        ) : (
          <div className="flex-col gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={(e) => {
                  navigate(`/projects/${project._id}`);
                }}
                className="relative flex justify-between items-center bg-slate-200 border border-gray-200 shadow rounded-xl p-5 m-5 hover:shadow-sm duration-300 hover:shadow-black transition-all cursor-pointer"
              >
                <h2 className="text-xl font-semibold text-black capitalize mb-1">
                  {project.name}
                  {activeProjectId === project._id && (
                    <span className="ml-4 text-xs bg-green-700 text-white px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </h2>
                <div className="flex justify-center items-center gap-3">
                  {/* Active Toggle Button */}
                  <button
                    className={`p-2 rounded-full transition-all duration-300 ${
                      activeProjectId === project._id
                        ? "text-white bg-green-700 hover:bg-green-900"
                        : "bg-slate-300 hover:bg-green-200"
                    }`}
                    onClick={(e) => handleSetActive(project._id, e)}
                  >
                    <div className="flex gap-2 items-center justify-center px-2">
                      {activeProjectId === project._id ? "Active" : "Activate"}
                      <BadgeCheck />
                    </div>
                  </button>

                  {/* Options Button */}
                  <button
                    className="text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all"
                    onClick={(e) => handleOpenOptions(project._id, e)}
                  >
                    <EllipsisVertical />
                  </button>

                  {/* Options Dropdown */}
                  {openOptionsId === project._id && (
                    <div
                      ref={optionsRef}
                      className="absolute right-0 top-12 z-10 bg-white rounded-md shadow-lg py-1 w-40"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          navigate(`/projects/${project._id}`);
                          setOpenOptionsId(null);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => confirmDelete(project, e)}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && projectToDelete && (
          <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 animate-scale-in">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <strong>{projectToDelete.name}</strong>? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProjectToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {createProjectModal && (
          <div className="animate-slide-in-right fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50 animate-scale-in">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Create New Project
              </h3>
              <p className="text-gray-600 mb-6">
                Enter the name for your new project.
              </p>
              <input
                type="text"
                placeholder="Project Name"
                onChange={(e) => setNewProjectName(e.target.value)}
                value={newProjectName}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-400"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && createProject()}
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setCreateProjectModal(false);
                    setNewProjectName("");
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={createProject}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
