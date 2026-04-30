// components/fields/ButtonsFields.jsx
import { X } from "lucide-react";
import { ArrayInput } from "./ArrayInput";
import { DefaultField } from "./DefaultField";
import { BooleanField } from "./BooleanField";
export function ButtonsFields({ formData, onChange, errors }) {
  return (
    <>
      <DefaultField
        formData={formData}
        onChange={onChange}
        fieldKey="message"
        label="Message Text"
        errors={errors}
        required={true}
      />
      <div className="mb-4">
        <ArrayInput
          label="Button Options"
          items={formData.buttons || []}
          onChange={(newButtons) => onChange("buttons", newButtons)}
          newItemValue=""
          addButtonLabel="Add Button"
          maxItems={3}
          minItems={1}
          placeholder="Button"
          renderItem={({
            item,
            index,
            onChange,
            onRemove,
            isRemoveDisabled,
            placeholder,
          }) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={item}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder={placeholder}
              />
              <button
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isRemoveDisabled}
                title="Remove Button"
              >
                <X />
              </button>
            </div>
          )}
        />
        {errors?.buttons && (
          <p className="text-red-500 text-sm mt-1">{errors.buttons}</p>
        )}
      </div>
      <BooleanField
        formData={formData}
        onChange={onChange}
        fieldKey="waitForUserReply"
        label="Wait for user reply"
      />
    </>
  );
}
