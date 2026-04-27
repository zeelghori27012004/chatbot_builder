import React from "react";
import VariableInsertDropdown from "./VariableDropDownField";

export function DefaultField({
  formData,
  onChange,
  fieldKey,
  label,
  showVariableDropdown = true,
  errors,
  required = false,
}) {
  const displayLabel = label || fieldKey.replace(/([a-z])([A-Z])/g, "$1 $2");

  const handleVariableInsert = (variable) => {
    const current = formData[fieldKey] || "";
    onChange(fieldKey, current + variable);
  };

  return (
    <div className="mb-4">
      <label className="text-sm font-medium capitalize block mb-1">
        {displayLabel}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div
        className={`flex items-center rounded-md border bg-white transition-colors ${
          errors?.[fieldKey] ? "border-red-500" : "border-gray-300"
        } focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500`}
      >
        <input
          type="text"
          value={formData[fieldKey] ?? ""}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          className="h-10 w-full flex-grow bg-transparent px-3 outline-none"
        />

        {showVariableDropdown && (
          <div className="flex-shrink-0">
            <VariableInsertDropdown onInsert={handleVariableInsert} />
          </div>
        )}
      </div>

      {errors?.[fieldKey] && (
        <p className="text-red-500 text-sm mt-1">{errors[fieldKey]}</p>
      )}
    </div>
  );
}
export default DefaultField;
