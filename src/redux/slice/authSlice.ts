import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchApi } from "../../hooks/api";
import { ILoginValidation, Auth, RegisterFormFields } from "../../models/auth";

interface ItemState {
  data: Auth;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ItemState = {
  data: {
    email: '',
    password: '',
    id: 0,
    avatar: '', 
    name: '',
    state: '',
    region: '',
    gender: ''
  },
  status: "idle",
  error: null,
};

export const loginFetch = createAsyncThunk(
  "auth/login",
  async ({ email, password }: ILoginValidation) => {
    const data = await fetchApi("/api/auth/login", "post", {
      email: email,
      password: password,
    });
    return data;
  }
);

export const getProfile = createAsyncThunk("getProfile/login", async () => {
  const data = await fetchApi("/api/user", "get");
  return data.data;
});
export const registerFetch = createAsyncThunk(
  "register/login",
  async ({
    email,
    password,
    repeatPassword,
    name,
    gender,
    region,
    state,
  }: RegisterFormFields) => {
    const data = await fetchApi("/api/auth/register", "post", {
      email: email,
      password: password,
      repeatPassword: repeatPassword,
      name: name,
      gender: "male",
      region: region,
      state: state,
    });
    return data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //loginFetch
      .addCase(loginFetch.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginFetch.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(loginFetch.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Có lỗi";
      })
      //registerFetch
      .addCase(registerFetch.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerFetch.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(registerFetch.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Có lỗi";
      })
      //get profile
      .addCase(getProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Có lỗi";
      });
  },
});

export default authSlice.reducer;
