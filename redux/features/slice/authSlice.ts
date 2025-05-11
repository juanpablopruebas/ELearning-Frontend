import { User } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

export type userInitialType = {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: { courseId: string }[];
};

type initialStateType = {
  token: string | null;
  user: User | null;
};

const initialState: initialStateType = {
  token: null,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action) => {
      state.token = action.payload.token;
    },
    userLoggedIn: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    userLoggedOut: (state) => {
      state.token = null;
      state.user = null;
    },
    userUpdatedRole: (state, action) => {
      state.token = state.token;
      state.user = state.user
        ? { ...state.user, role: action.payload.role }
        : null;
    },
    userUpdatedCourses: (state, action) => {
      state.token = state.token;
      state.user = state.user
        ? { ...state.user, courses: action.payload.userCourses }
        : null;
    },
  },
});

export const {
  userRegistration,
  userLoggedIn,
  userLoggedOut,
  userUpdatedRole,
  userUpdatedCourses,
} = authSlice.actions;
