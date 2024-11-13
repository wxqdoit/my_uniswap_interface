// Currencies and Tokens
import {CHAINS} from "./chains.ts";
import {Token} from "@uniswap/sdk-core";


export const TOKENS = {
    [CHAINS.SEPOLIA]: {
        WRAPPED_NATIVE: new Token(CHAINS.SEPOLIA, '0xfff9976782d46cc05630d1f6ebab18b2324d6b14', 18, 'WETH', 'Wrapped Ether'),
        USDC: new Token(CHAINS.SEPOLIA, '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', 6, 'USDC', 'USD Coin'),
        FCT: new Token(CHAINS.SEPOLIA, '0x24e8740930078958F88390a345f27395dBf1539b', 18, 'FCT', 'Face Coin'),
        MTC: new Token(CHAINS.SEPOLIA, '0xD203FDAC3fDcEcB2D78635Bb1e762f8e61a460c9', 18, 'MTC', 'My Test Coin'),
    },
    [CHAINS.BSCTESTNET]: {
        WRAPPED_NATIVE: new Token(CHAINS.BSCTESTNET, '0xfff9976782d46cc05630d1f6ebab18b2324d6b14', 18, 'WBNB', 'Wrapped Ether'),
        MTC: new Token(CHAINS.BSCTESTNET, '0xD203FDAC3fDcEcB2D78635Bb1e762f8e61a460c9', 18, 'MTC', 'My Test Coin'),
    }
}
