import { ethers } from 'ethers'
import { CurrentConfig } from './config'
import PoolABI from './PoolABI.json'
import { POOL_FACTORY_CONTRACT_ADDRESS } from './constants'
import { computePoolAddress } from '@uniswap/v3-sdk'
export const provider = new ethers.BrowserProvider(window.ethereum);
interface PoolInfo {
    token0: string
    token1: string
    fee: number
    tickSpacing: number
    sqrtPriceX96:bigint
    liquidity: bigint
    tick: number
}



export function getPoolAddress():string{
    return computePoolAddress({
        factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
        tokenB: CurrentConfig.tokens.token0,
        tokenA: CurrentConfig.tokens.token1,
        fee: CurrentConfig.tokens.poolFee,
    })
}

export async function getPoolInfo(currentPoolAddress:string): Promise<PoolInfo> {

    if (!provider) {
        throw new Error('No provider')
    }

    const poolContract = new ethers.Contract(
        currentPoolAddress,
        PoolABI,
        provider
    )
    const [token0, token1, fee, tickSpacing, liquidity, slot0] =
        await Promise.all([
            poolContract.token0(),
            poolContract.token1(),
            poolContract.fee(),
            poolContract.tickSpacing(),
            poolContract.liquidity(),
            poolContract.slot0(),
        ])
    console.log('liquidity',liquidity)
    return {
        token0,
        token1,
        fee:Number(fee),
        tickSpacing:Number(tickSpacing),
        liquidity,
        sqrtPriceX96: slot0[0],
        tick: Number(slot0[1]),
    }
}