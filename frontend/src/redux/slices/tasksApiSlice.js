import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tasksApiSlice = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL + "/tasks",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
      headers.set("Custom", "Header");
    }
    console.log(headers);
    return headers;
  },
  tagTypes: ["Tasks"],
  endpoints: (builder) => ({
    fetchTasks: builder.query({
      query: () => "/",
      providesTags: ["Tasks"],
    }),
    createTask: builder.mutation({
      query: (newTask) => ({
        url: "/",
        method: "POST",
        body: newTask,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTaskStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Tasks"],
    }),
    assignTask: builder.mutation({
      query: ({ id, assignTo }) => ({
        url: `/${id}/assign`,
        method: "PUT",
        body: { assignTo },
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateDocument: builder.mutation({
      query: ({ id, content }) => ({
        url: `/${id}/document`,
        method: "PUT",
        body: { content },
      }),
      invalidatesTags: ["Tasks"],
    }),
    uploadDocument: builder.mutation({
      query: ({ id, document }) => ({
        url: `/${id}/document`,
        method: "PUT",
        body: document,
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useFetchTasksQuery,
  useLazyFetchTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useAssignTaskMutation,
  useUpdateDocumentMutation,
  useUploadDocumentMutation,
} = tasksApiSlice;
