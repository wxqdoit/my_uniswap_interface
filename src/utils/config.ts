import { Token} from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import { ETH_token, USDC_TOKEN } from './constants'

// Sets if the example should run locally or on chain
export enum Environment {
    LOCAL,
    WALLET_EXTENSION,
    MAINNET,
}

// Inputs that configure this example to run
export interface ExampleConfig {
    env: Environment

    tokens: {
        token0: Token
        token1: Token
        poolFee: FeeAmount
    }
}

// Example Configuration

export const CurrentConfig: ExampleConfig = {
    env: Environment.WALLET_EXTENSION,

    tokens: {
        token0: USDC_TOKEN,
        token1: ETH_token,
        poolFee: FeeAmount.LOWEST,
    },
}