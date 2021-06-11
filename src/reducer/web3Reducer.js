import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    network: localStorage.getItem("network"),
    address: localStorage.getItem("address"),
}

const web3Slice = createSlice({ 
    name: "web3",
    initialState,
    reducers: {
        changeAddress(state, action){
            state.address = action.payload
        },
        changeNetwork(state, action){
            state.network = action.payload
        }
    }
})

export const { changeAddress, changeNetwork} = web3Slice.actions;
export default web3Slice.reducer;