import {Field, replaceUserState} from "./actions";
import {queryParametersToSwapState} from "./hooks";

import {createReducer} from "@reduxjs/toolkit";

export interface UserState {
    readonly independentField: Field
    readonly typedValue: string
    readonly [Field.NAME]: {
        readonly value: string | undefined | null
    }
    readonly [Field.AGE]: {
        readonly value: string | undefined | null
    }
}

const initialState: UserState = queryParametersToSwapState()

export default createReducer<UserState>(initialState, (builder) =>
    builder
        .addCase(replaceUserState, (state, {payload: {typedValue, field, nameValue, ageValue}}) => {
            return {
                [Field.NAME]: {
                    value: nameValue || null,
                },
                [Field.AGE]: {
                    value: ageValue ?? null,
                },
                independentField: field,
                typedValue,
            }
        })

)
