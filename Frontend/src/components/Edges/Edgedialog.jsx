import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

function EdgeDialog({ edge, onClose, onSave, onDelete, nodes, edges }) {
  const [label, setLabel] = useState("");
  const [sourceIsCondition, setSourceIsCondition] = useState(false);
  const [error, setError] = useState("");

  const sourceNode = nodes.find((n) => n.id === edge.source);
  const targetNode = nodes.find((n) => n.id === edge.target);

  useEffect(() => {
    const initialLabel = edge?.data?.label ?? edge?.label ?? "";
    setLabel(initialLabel);

    const type = edge?.data?.sourceNodeType || sourceNode?.type || "";
    setSourceIsCondition(type === "condition");
    setError("");
  }, [edge, sourceNode]);

  // Get used condition labels for the same source node (excluding current edge)
  const usedLabels = edges
    .filter(
      (e) =>
        e.source === edge.source &&
        e.id !== edge.id &&
        (e.label || e.data?.label)
    )
    .map((e) => (e.label || e.data?.label)?.toLowerCase());

  // Always show the currently selected label, even if already used
  const baseOptions = ["true", "false"];
  const conditionOptions = baseOptions.filter(
    (opt) => !usedLabels.includes(opt) || opt === label?.toLowerCase()
  );

  const validateLabel = (val) => {
    if (/[^\w\s.,!?@#\-]/.test(val)) {
      return "Special characters are not allowed.";
    }
    if (val.length > 100) {
      return "Maximum length is 100 characters.";
    }
    return "";
  };

  const handleLabelChange = (e) => {
    const val = e.target.value;
    setLabel(val);
    setError(validateLabel(val));
  };

  const handleSave = () => {
    if (error) return;
    const updatedEdge = {
      ...edge,
      label,
      data: {
        ...(edge.data || {}),
        label,
      },
    };
    onSave(updatedEdge);
    onClose();
  };

  const handleDelete = () => {
    onDelete(edge.id);
    onClose();
  };

  if (!edge) return null;

  return (
    <div className="inset-0 absolute bg-opacity-30 backdrop-grayscale-75 z-50 flex justify-center items-center">
      <div className="absolute bottom-6 right-6 ">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative animate-slide-in-right">
          <button
            onClick={handleDelete}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            title="Delete edge"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <h2 className="text-lg font-bold mb-4">
            Edit edge from "{sourceNode?.data?.label}" to "
            {targetNode?.data?.label}"
          </h2>

          {sourceIsCondition ? (
            <>
              <p className="mb-2 text-sm text-gray-600">
                Choose condition outcome:
              </p>
              <div className="flex gap-3 mb-4">
                {conditionOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setLabel(opt)}
                    className={`px-4 py-2 rounded ${
                      label === opt
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </button>
                ))}
              </div>
              {conditionOptions.length === 0 && (
                <p className="text-sm text-red-500">
                  Both "true" and "false" outcomes are already used.
                </p>
              )}
            </>
          ) : (
            <>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Label
              </label>
              <input
                type="text"
                value={label}
                onChange={handleLabelChange}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-1"
                placeholder="Edge label"
              />
              {error && (
                <p className="text-red-500 text-sm mb-3">{error}</p>
              )}
            </>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!!error || (sourceIsCondition && !label)}
              className={`px-4 py-2 rounded text-white ${
                !!error || (sourceIsCondition && !label)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EdgeDialog;
