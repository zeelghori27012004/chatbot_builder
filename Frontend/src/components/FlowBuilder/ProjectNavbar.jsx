import { ArrowLeft, Edit, Check, X, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { updateProjectName } from "../../services/projectService";
import { useUser } from "../../context/User.context";
import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";

export default function ProjectNavbar({ project, initialName }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [projectName, setProjectName] = useState(initialName);
  const [tempName, setTempName] = useState(initialName);

  // ✅ Update name when `initialName` prop changes (e.g., after fetching from backend)
  useEffect(() => {
    setProjectName(initialName);
    setTempName(initialName);
  }, [initialName]);

  const handleRename = async () => {
    if (!tempName.trim()) {
      toast.error("Project name cannot be empty.");
      return;
    }

    if (!project?._id) {
      toast.error("Project ID not found.");
      return;
    }

    try {
      await updateProjectName({
        projectId: project._id,
        name: tempName,
        userId: project.createdBy,
      });
      setProjectName(tempName);
      setIsEditing(false);
      toast.success("Project name updated");
    } catch (err) {
      toast.error("Failed to update project name.");
      console.error(err);
    }
  };
  const cancelEdit = () => {
    setTempName(projectName);
    setIsEditing(false);
  };
  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 shadow-sm">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {isEditing ? (
          <div className="flex items-center space-x-3">
            <input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="bg-transparent border-b border-gray-400 focus:outline-none text-lg font-medium dark:text-white"
              autoFocus
              onKeyDown={(e) => {
                e.key == "Enter" && handleRename();
              }}
            />
            <button
              onClick={handleRename}
              className="text-green-600 hover:text-green-800"
            >
              <Check size={20} />
            </button>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={cancelEdit}
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              {projectName}
            </h1>
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:text-blue-700"
            >
              <Edit size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-zinc-600">
        <img src="https://avatar.iran.liara.run/public/boy" />
      </div>
    </nav>
  );
}
