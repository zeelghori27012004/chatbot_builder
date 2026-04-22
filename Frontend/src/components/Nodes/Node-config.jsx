export const NODE_TYPES = {
  start: "User Message",
  message: "Send Text",
  askaQuestion: "Ask a Question",
  buttons: "Decision Buttons",
  apiCall: "API Call",
  keywordMatch: "Keyword Match",
  end: "End Flow",
};

export function getNodeLabel(type) {
  return NODE_TYPES[type] || type;
}

export const NODE_CATEGORY_MAP = {
  TriggerUserMessage: "start",

  ActionSendText: "message",
  ActionAskaQuestion: "askaQuestion",
  ActionButtons: "buttons",
  ActionApiCall: "apiCall",

  ConditionKeyword: "keywordMatch",

  ControlEndFlow: "end",
};

export function getNodeCategory(type) {
  return NODE_CATEGORY_MAP[type] || type;
}

export const nodeFieldMap = {
  start: {
    quickReply: "",
    waitForUserReply: false,
  },
  message: {
    message: "",
    waitForUserReply: false,
  },
  buttons: {
    message: "",
    buttons: [""],
    waitForUserReply: false,
  },
  keywordMatch: {
    keywords: [""],
    waitForUserReply: false,
  },
  apiCall: {
    requestName: "",
    method: "GET",
    url: "",
    authType: "none",
    headers: [],
    username: "",
    password: "",
    bearerToken: "",
    accessToken: "",
    waitForUserReply: false,
  },
  askaQuestion: {
    question: "",
    validationType: "none",
    numberOfRepeats: "1",
    saveTheAnswerAsContactProperty: "false",
    propertyName: "",
    waitForUserReply: false,
  },
  end: {
    waitForUserReply: false,
  },
};

export function getInitialFields(type) {
  const fields = nodeFieldMap[type];
  return fields ? structuredClone(fields) : {};
}

export const TriggerNodes = ["start"];

export const ConditionNodes = ["keywordMatch", "end"];

export const ActionNodes = ["message", "askaQuestion", "buttons", "apiCall"];

export const dummyData = {
  Select: [
    {
      Id: "2",
      Name: "Riya Patel",
      City: "2",
      Gender: "1",
      Password: "12345678",
      Hobbies: "cricket",
      PhoneNumber: "1234123412",
      Image:
        "https://drive.google.com/uc?export=download&id=1iv2P0tkHgrBL7Nx9bverXzthFKR9eLEX",
      CityName: "Bardoli",
    },
    {
      Id: "3",
      Name: "teat",
      City: "3",
      Gender: "0",
      Password: "12345678",
      Hobbies: "cricket,dance",
      PhoneNumber: "9574099524",
      Image:
        "https://drive.google.com/uc?export=download&id=1KG1ishxJlP-sSvhpd2-wceuYo21q1hxQ",
      CityName: "Baroda",
    },
    {
      Id: "5",
      Name: "Jon Stewart Doe",
      City: "3",
      Gender: "0",
      Password: "12345678",
      Hobbies: "cricket",
      PhoneNumber: "6019521325",
      Image:
        "https://drive.google.com/uc?export=download&id=14nFoaQ0jZb9xv7wVqO7HJfMbW4_PYaQc",
      CityName: "Baroda",
    },
    {
      Id: "6",
      Name: "kiii",
      City: "2",
      Gender: "0",
      Password: "12345678",
      Hobbies: "cricket,dance",
      PhoneNumber: "1234567891",
      Image:
        "https://drive.google.com/uc?export=download&id=1DyuvSTOrjhspXLDjdcYiBSxhhz22du6I",
      CityName: "Bardoli",
    },
  ],
  Error: [
    {
      Status: 1,
      Message: "6 user selected.",
    },
  ],
};
