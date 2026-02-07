import axios from "axios";
import projectModel from "../models/project.model.js";

// Helper function to get project credentials securely
async function getProjectCredentials(projectId) {
  const project = await projectModel
    .findById(projectId)
    .select("whatsappPhoneNumberId whatsappAccessToken");
  if (
    !project ||
    !project.whatsappPhoneNumberId ||
    !project.whatsappAccessToken
  ) {
    throw new Error(
      `WhatsApp credentials not configured for project ${projectId}`
    );
  }
  return {
    phoneNumberId: project.whatsappPhoneNumberId,
    accessToken: project.whatsappAccessToken,
  };
}

export async function sendWhatsappMessage({to, text, projectId, buttons = []}) {
  try {
    const {phoneNumberId, accessToken} = await getProjectCredentials(projectId);

    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

    let payload;

    // If buttons are provided, send interactive button message
    if (buttons.length > 0) {
      const formattedButtons =
        typeof buttons[0] === "string"
          ? buttons.slice(0, 3).map((label, index) => ({
              type: "reply",
              reply: {
                id: `btn_${index + 1}_${label
                  .toLowerCase()
                  .replace(/\s+/g, "_")}`,
                title: label,
              },
            }))
          : buttons.slice(0, 3); // already formatted

      payload = {
        messaging_product: "whatsapp",
        to,
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: text,
          },
          action: {
            buttons: formattedButtons,
          },
        },
      };
    } else {
      // Default to plain text message
      payload = {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: {body: text},
      };
    }

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Message sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error sending WhatsApp message:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

export async function sendWhatsappMedia({to, content, projectId}) {
  try {
    const {phoneNumberId, accessToken} = await getProjectCredentials(projectId);

    let payload;

    payload = {
      messaging_product: "whatsapp",
      to,
      type: "document",
      document: {
        link: content.mediaUrl,
      },
    };
    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Media sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error sending WhatsApp media:",
      error.response ? error.response.data : error.message
    );
  }
}
