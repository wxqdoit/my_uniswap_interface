// This file contains code to easily connect to and get information from a wallet on chain

import { Currency } from '@uniswap/sdk-core'
import { ethers } from 'ethers'
import { ERC20_ABI } from './constants'

export async function getCurrencyBalance(
    provider: ethers.Provider,
    address: string,
    currency: Currency
): Promise<string> {
    // Handle ETH directly
    console.log('currency::',currency,address)
    if (currency.isNative) {
        return ethers.formatEther(await provider.getBalance(address))
    }
    if(currency.isToken){
        // Get currency otherwise
        const currencyContract = new ethers.Contract(
            currency.address,
            ERC20_ABI,
            provider
        )
        const balance: number = await currencyContract.balanceOf(address)

        // Format with proper units (approximate)
        console.log(currency.symbol +' balance: ',balance)
        return ethers.formatUnits(balance,currency.decimals)
    }

}
export async function getNativeTokenBalance(
    provider: ethers.Provider,
    address: string,
): Promise<string> {
    return ethers.formatEther(await provider.getBalance(address))

}