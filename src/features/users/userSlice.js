import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserList } from "./userAPI";
import axios from "axios";
import { toast } from "react-toastify";

import {
  convertIscToUtc,
  convertIstToUtc,
  convertUtcToIst,
} from "../../Utils/timeUtils";

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (accessToken) => {
    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_URL}/user/all?page=1&limit=10`,
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.request(config);

      if (response.status === 200) {
        let subjectData = response.data.data.subject_data;

        if (subjectData && Array.isArray(subjectData)) {
          subjectData = subjectData.map((item) => {
            if (item.createdAt) {
              item.createdAt = convertUtcToIst(item.createdAt);
            }
            if (item.updatedAt) {
              item.updatedAt = convertUtcToIst(item.updatedAt);
            }
            if (item.dob) {
              item.dob = convertUtcToIst(item.dob);
            }
            return item;
          });
        }

        return {
          success: true,
          dataList: subjectData,
        };
      } else {
        throw new Error(`Error fetching user list: ${response.data.message}`);
      }
    } catch (err) {
      console.error("Error fetching user list:", err.message);
      throw new Error(err.message);
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        if (action?.payload) {
          state.loading = false;
          state.users = action.payload.dataList;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.error?.message || "Something went wrong!";
      });
  },
});

export default userSlice.reducer;
