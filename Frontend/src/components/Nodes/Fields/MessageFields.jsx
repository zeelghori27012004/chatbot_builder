// src/components/fields/MessageFields.jsx
import React from "react";
import { DefaultField } from "./DefaultField";
import { BooleanField } from "./BooleanField";

export function MessageFields({ formData, onChange, errors }) {
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
      <BooleanField
        formData={formData}
        onChange={onChange}
        fieldKey="waitForUserReply"
        label="Wait for user reply"
      />
    </>
  );
}
