import {createSlice} from '@reduxjs/toolkit'


export enum AppModal {
    WALLET,

}

export interface ApplicationState {

    readonly modalStatus: AppModal | null
    readonly token: string


}

const initialState: ApplicationState = {
    token:'',
    modalStatus: null,
}
//change state
const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        setOpenModal(state, action) {
            state.modalStatus = action.payload
        },
        setCloseModal(state) {
            state.modalStatus = null
        },
        setToken(state,action) {
            console.log(action.payload)
            state.token = action.payload
        },

    },
})

export const {
    setOpenModal,
    setCloseModal,
    setToken,
} = applicationSlice.actions
export default applicationSlice.reducer
