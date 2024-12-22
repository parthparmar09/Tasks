import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL + "/users",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    fetchUsers: builder.query({
      query: () => "/",
      providesTags: ["Users"],
    }),
    fetchUser: builder.query({
      query: () => "/me",
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useFetchUsersQuery,
  useLazyFetchUsersQuery,
  useFetchUserQuery,
  useLazyFetchUserQuery,
  useLoginMutation,
  useRegisterMutation,
} = userApiSlice;
