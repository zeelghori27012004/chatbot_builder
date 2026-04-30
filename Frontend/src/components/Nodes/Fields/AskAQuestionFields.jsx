import { BooleanField } from "./BooleanField";
// import { useVariableContext } from "../../../context/Variable.context";
// import { useEffect } from "react";
export function AskAQuestionFields({ formData, onChange, errors }) {
  // const handleCheckboxChange = (e) => {
  //   onChange(
  //     "saveTheAnswerAsContactProperty",
  //     e.target.checked ? "true" : "false"
  //   );
  // };
  // const { addVariable } = useVariableContext();
  // useEffect(() => {
  //   if (formData.propertyName) {
  //     addVariable(formData.propertyName);
  //   }
  // }, [formData.propertyName]);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium block mb-1">
          Question <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          value={formData.question || ""}
          onChange={(e) => onChange("question", e.target.value)}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
            errors?.question ? "border-red-500" : ""
          }`}
          placeholder="Ask your question here"
        />
        {errors?.question && (
          <p className="text-red-500 text-sm mt-1">{errors.question}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">
          Validation Type
        </label>
        <select
          value={formData.validationType || "none"}
          onChange={(e) => onChange("validationType", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          {["none", "name", "email", "phone number", "URL"].map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">
          Number of Repeats
        </label>
        <input
          type="number"
          min="1"
          value={formData.numberOfRepeats || "1"}
          onChange={(e) => onChange("numberOfRepeats", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* <div className="flex items-center gap-2">
        <input
          id="save-answer"
          type="checkbox"
          checked={formData.saveTheAnswerAsContactProperty === "true"}
          onChange={handleCheckboxChange}
          className="w-4 h-4"
        />
        <label htmlFor="save-answer" className="text-sm">
          Save answer as contact property
        </label>
      </div> */}

      <div>
        <label className="text-sm font-medium block mb-1">Property Name</label>
        <input
          type="text"
          value={formData.propertyName || ""}
          onChange={(e) => onChange("propertyName", e.target.value)}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
            errors?.propertyName ? "border-red-500" : ""
          }`}
          placeholder="e.g., user_email"
        />
        {errors?.propertyName && (
          <p className="text-red-500 text-sm mt-1">{errors.propertyName}</p>
        )}
      </div>

      <BooleanField
        formData={formData}
        onChange={onChange}
        fieldKey="waitForUserReply"
        label="Wait for User Reply"
      />
    </div>
  );
}
