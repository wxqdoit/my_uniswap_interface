import { createAction } from '@reduxjs/toolkit'

export enum Field {
    NAME = 'NAME',
    AGE = 'AGE',
}
// export const selectCoin = createAction<{ field: Field; coinId: string }>('swap/selectCoin')
// export const switchCoins = createAction<void>('swap/switchCoins')
// export const typeInput = createAction<{ field: Field; typedValue: string }>('swap/typeInput')
export const replaceUserState = createAction<{
    field: Field,
    typedValue: string
    nameValue?: string
    ageValue?: string
}>('user/replaceUserState')
