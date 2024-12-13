import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/users/userSlice";
import authSlice from "../features/users/authSlice";

const store = configureStore({
  reducer: {
    users: userSlice,
    auth: authSlice,
  },
});

export default store;
