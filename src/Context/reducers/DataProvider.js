const initialData = {
  Subject: [],
  CurrentSubject: [],
  Questions: [],
  CurrentQue: [],
  Logintype: "Admin",
};

const DataProvider = (state = initialData, action) => {
  switch (action.type) {
    case "SUBJECT":
      return {
        ...state,
        Subject: [action.payload],
      };

    case "QUESTIONS":
      return {
        ...state,
        Questions: [action.payload],
      };

    case "CURRENT":
      return {
        ...state,
        CurrentSubject: [action.payload],
      };

    case "LOGIN_TYPE":
      return {
        ...state,
        Logintype: action.payload,
      };

    case "EDIT":
      return {
        ...state,
        CurrentQue: [action.payload],
      };

    case "LOGOUT":
      return state;

    default:
      return state;
  }
};

export default DataProvider;
