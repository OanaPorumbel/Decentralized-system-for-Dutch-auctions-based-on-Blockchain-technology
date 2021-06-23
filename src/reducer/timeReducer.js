import { createSlice} from "@reduxjs/toolkit";


let initialState = {
    timer: null
}

const timerSlice = createSlice({
    name: "timer",
    initialState,
    reducers: {
        setTimer(state, action){
            state.timer = action.payload;
        }    
    }
})


export const { setTimer } = timerSlice.actions;
export default timerSlice.reducer;