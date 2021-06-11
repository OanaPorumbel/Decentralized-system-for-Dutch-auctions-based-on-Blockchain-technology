import { createSlice} from "@reduxjs/toolkit";


let initialState = {
    user: localStorage.getItem("user")
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action){
            state.user = action.payload;
        },
        deleteUser(state, action){
            state.user = null;
        }
    }
})


export const { setUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;