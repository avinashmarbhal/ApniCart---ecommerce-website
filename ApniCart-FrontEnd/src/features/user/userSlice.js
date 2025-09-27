import { createSlice } from "@reduxjs/toolkit";
const userFromStorage = localStorage.getItem("apniUser");
const initialState = {
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  checking: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.checking = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.checking = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
