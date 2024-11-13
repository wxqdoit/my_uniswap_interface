import {UserState} from "./reducer";
import {Field} from "./actions";

import {AppState} from "../index";
import {useAppDispatch, useAppSelector} from "../hooks";


export function useUserState(): AppState['user'] {
    return useAppSelector((state) => state.user)
}


export function queryParametersToSwapState(): UserState {
    const typedValue = ''
    const independentField = Field.AGE
    return {
        [Field.NAME]: {
            value: null,
        },
        [Field.AGE]: {
            value: null,
        },
        typedValue,
        independentField,
    }
}
