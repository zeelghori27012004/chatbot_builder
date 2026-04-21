import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { NodeFieldRenderer } from "./NodeFieldRenderer";
import { getInitialFields, getNodeCategory } from "./Node-config";

function BaseNodeDialog({ node, onClose, onSave, onDelete }) {
  if (!node) return null;

  const nodeType = getNodeCategory(node.type);

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  // Define required fields for each node type
  const getRequiredFields = (type) => {
    const requiredFieldsMap = {
      start: [],
      message: ["message"],
      buttons: ["message", "buttons"],
      keywordMatch: ["keywords"],
      apiCall: ["requestName", "url"],
      askaQuestion: ["question", "propertyName"],
      end: [],
    };
    return requiredFieldsMap[type] || [];
  };

  useEffect(() => {
    const initialFields = getInitialFields(nodeType) || {};
    const existing = node.data?.properties || {};

    const filteredExisting = Object.fromEntries(
      Object.entries(existing).filter(
        ([key]) => key !== "isSelected" && key !== "fields"
      )
    );

    setFormData({ ...initialFields, ...filteredExisting });
  }, [node, nodeType]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const requiredFields = getRequiredFields(nodeType);
    const newErrors = {};

    requiredFields.forEach((field) => {
      const value = formData[field];

      // Check for null, undefined, or empty string
      if (!value || value === "") {
        newErrors[field] = "Please fill the entry";
        return;
      }

      // Check for whitespace-only strings
      if (typeof value === "string" && value.trim() === "") {
        newErrors[field] = "Please fill the entry";
        return;
      }

      // Special character and length validation for label fields
      // const labelFields = ["message", "requestName", "question", "propertyName"];
      // if (labelFields.includes(field) && typeof value === "string") {
      //   if (/[^\w\s.,!?@#\-]/.test(value)) {
      //     newErrors[field] = "Special characters are not allowed.";
      //     return;
      //   }
      //   if (value.length > 100) {
      //     newErrors[field] = "Maximum length is 100 characters.";
      //     return;
      //   }
      // }

      // Check for arrays
      if (Array.isArray(value)) {
        // Check if array is empty
        if (value.length === 0) {
          newErrors[field] = "Please fill the entry";
          return;
        }

        // Check if all items in array are empty or whitespace-only
        if (
          value.every(
            (item) => !item || (typeof item === "string" && item.trim() === "")
          )
        ) {
          newErrors[field] = "Please fill the entry";
          return;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      setShowErrors(true);
      return;
    }

    onSave({
      ...node,
      data: {
        ...node.data,
        properties: formData,
      },
    });
    onClose();
  };

  return (
    <div
      className="absolute inset-0 bg-opacity-30 z-50 flex justify-end items-end p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-opacity-30 backdrop-grayscale-75 z-0"></div>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white p-6 rounded-lg shadow-lg shadow-indigo-900 max-h-[90vh] overflow-y-auto relative animate-slide-in-right ${
          nodeType === "apiCall" ? "w-[1000px]" : "w-[500px]"
        }`}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
      >
        <button
          onClick={() => {
            onDelete(node.id);
            onClose();
          }}
          className="absolute rounded-md p-1 m-1 top-4 right-4 border-2 border-black transition-all duration-300 text-white bg-red-500 hover:bg-red-900"
        >
          <Trash2 className="w-6 h-6" />
        </button>

        <h2 className="text-lg font-bold mb-4">Edit Node: {node.data.label}</h2>

        {showErrors && Object.keys(errors).length > 0 && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-medium">Please fix the following errors:</p>
            <ul className="list-disc list-inside mt-1">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <NodeFieldRenderer
          nodeType={nodeType}
          formData={formData}
          onChange={handleChange}
          errors={errors}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 rounded-md text-white hover:bg-red-800 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-900 transition-all duration-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default BaseNodeDialog;
