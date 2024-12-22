import { configureStore } from "@reduxjs/toolkit";
import { tasksApiSlice } from "./slices/tasksApiSlice";
import { userApiSlice } from "./slices/userApiSlice";

const store = configureStore({
  reducer: {
    [tasksApiSlice.reducerPath]: tasksApiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(tasksApiSlice.middleware)
      .concat(userApiSlice.middleware),
});

export default store;
