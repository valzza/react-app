// store.js
import { configureStore, createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "users",
    initialState: [],
    reducers: {
        setUsers: (_, { payload }) => payload,
        addUser: (state, { payload }) => [ { ...payload }, ...state ],
        deleteUser: (state, { payload:id }) => state.filter(u => u.id !== id),
        updateUser: (state, { payload }) => state.map(u => u.id === payload.id ? payload : u),
    }
});

export const { setUsers, addUser, deleteUser, updateUser } = slice.actions;

export const store = configureStore({
    reducer: { users: slice.reducer }
});
