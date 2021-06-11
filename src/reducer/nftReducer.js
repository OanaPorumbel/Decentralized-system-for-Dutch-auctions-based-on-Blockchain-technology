import { createSlice} from "@reduxjs/toolkit";


let initialState = {
    nft: null
}

const nftSlice = createSlice({
    name: "nft",
    initialState,
    reducers: {
        setNFT(state, action){
            state.nft = action.payload;
        },
    }
})


export const { setNFT } = nftSlice.actions;
export default nftSlice.reducer;