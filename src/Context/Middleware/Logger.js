

let lastLoggedState = null;

const Logger = (store) => (next) => (action) => {
  try {
    // Call the next middleware or reducer
    let result = next(action);

    // Get the current state
    const authState = store.getState();

    // Compare the current state with the last logged state
    if (JSON.stringify(authState) !== JSON.stringify(lastLoggedState)) {
      console.group(action.type);
      console.info("dispatching", action);
      console.log("store data", authState);
      localStorage.setItem("classes", JSON.stringify(authState));
      console.groupEnd();

      // Update lastLoggedState to current state
      lastLoggedState = authState;
    }

    return result;
  } catch (error) {
    console.warn(error);
  }
};

export default Logger;
