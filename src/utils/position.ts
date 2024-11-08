import {CurrencyAmount, Percent, Token,} from '@uniswap/sdk-core'
import ERC20ABI from './ERC20ABI.json'
import {FeeAmount, MintOptions, nearestUsableTick, NonfungiblePositionManager, Pool, Position,TickMath,maxLiquidityForAmounts} from '@uniswap/v3-sdk'
import {ethers} from 'ethers'

import {CurrentConfig} from './config'
import {
    MAX_FEE_PER_GAS,
    MAX_PRIORITY_FEE_PER_GAS,
    NONFUNGIBLE_POSITION_MANAGER_ABI,
    NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
} from './constants'
import {getPoolAddress, getPoolInfo} from './pool.ts'
import {getProvider, sendTransaction, TransactionState,} from './providers'
import JSBI from "jsbi";
import {fromReadableAmount} from "./conversion.ts";

export interface PositionInfo {
    tickLower: number
    tickUpper: number
    liquidity: JSBI
    feeGrowthInside0LastX128: JSBI
    feeGrowthInside1LastX128: JSBI
    tokensOwed0: JSBI
    tokensOwed1: JSBI
}

/**
 * 创建自己的lp
 * @param address
 */
export async function mintPosition(address: string): Promise<TransactionState> {
    const provider = getProvider()
    if (!address || !provider) {
        return TransactionState.Failed
    }


    // 1. 授权代币A和代币B给POSITION_MANAGER_CONTRACT
    // const tokenInApproval = await getTokenTransferApproval(address,
    //     CurrentConfig.tokens.token0
    // )
    // const tokenOutApproval = await getTokenTransferApproval(address,
    //     CurrentConfig.tokens.token1
    // )
    //
    // // Fail if transfer approvals do not go through
    // if (tokenInApproval !== TransactionState.Sent || tokenOutApproval !== TransactionState.Sent) {
    //     return TransactionState.Failed
    // }

    // 2. 创建一个等待mint的Position
    //      2.1 使用辅助函数计算pool的地址
    //      2.2 使用pool地址通过合约查询pool的信息
    //      2.3 使用pool信息构建一个Pool
    //      2.4 使用实例化的Pool创建一个Position

    const position = await constructPosition(
        CurrencyAmount.fromRawAmount(
            CurrentConfig.tokens.token0,
            10000
        ),
        CurrencyAmount.fromRawAmount(
            CurrentConfig.tokens.token1,
            10000000000000
        )
    )


    // 3. mint配置，MintOptions用于创建新头寸的类型
    const mintOptions: MintOptions = {
        recipient: address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 20,
        slippageTolerance: new Percent(50, 10_000),
    }

    console.log('mintOptions===',mintOptions)
    console.log('positionToMint===',position.liquidity)
    // 4. 获取calldata，构建交易，以便mint position使用
    const {calldata, value} = NonfungiblePositionManager.addCallParameters(
        position,
        mintOptions
    )
    const transaction = {
        data: calldata,
        to: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
        value: value,
        from: address,
        maxFeePerGas: MAX_FEE_PER_GAS,
        maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    }

    // 5.发送交易，创建自己的仓位
    return sendTransaction(transaction)



    // const positionManager = new ethers.Contract(POOL_FACTORY_CONTRACT_ADDRESS, PoolABI, provider);
    // const poolAddress = await positionManager.getPool(CurrentConfig.tokens.token0.address, CurrentConfig.tokens.token1.address, poolFee);


}

export async function constructPosition(
    token0Amount: CurrencyAmount<Token>,
    token1Amount: CurrencyAmount<Token>
): Promise<Position> {

    // get pool address
    const pa = getPoolAddress()


    // get pool info
    const poolInfo = await getPoolInfo(pa)
    // construct pool instance

    const configuredPool = new Pool(
        token0Amount.currency,
        token1Amount.currency,
        FeeAmount.LOWEST,
        poolInfo.sqrtPriceX96.toString(),
        poolInfo.liquidity.toString(),
        poolInfo.tick
    )
    // 将 sqrtPriceX96 转换为可读价格
    const currentPrice = (BigInt(poolInfo.sqrtPriceX96) ** BigInt(2)) / BigInt(2 ** 192);



    console.log('pool price====' ,poolInfo.sqrtPriceX96,Number(currentPrice) )


    const tickLower = nearestUsableTick(poolInfo.tick, poolInfo.tickSpacing) - poolInfo.tickSpacing * 2
    const tickUpper = nearestUsableTick(poolInfo.tick, poolInfo.tickSpacing) + poolInfo.tickSpacing * 2


    const sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower)
    const sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper)

    console.log('====')
    console.log('configuredPool',configuredPool)
    console.log('====')

    const data = maxLiquidityForAmounts( configuredPool.sqrtRatioX96,sqrtRatioAX96,sqrtRatioBX96,token0Amount.quotient,token1Amount.quotient,true)

    console.log('maxLiquidityForAmounts data====',data)


    return Position.fromAmounts({
        pool: configuredPool,
        tickLower,
        tickUpper,
        amount0: token0Amount.quotient,
        amount1: token1Amount.quotient,
        useFullPrecision: true,
    })
}
export function invariant(condition:boolean, message:string) {
    console.log(condition)
    if (condition) {
        return;
    }
    throw new Error(message);
}
export async function getPositionIds(address:string): Promise<number[]> {
    const provider = getProvider()
    if (!provider || !address) {
        throw new Error('No provider available')
    }

    const positionContract = new ethers.Contract(
        NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
        NONFUNGIBLE_POSITION_MANAGER_ABI,
        provider
    )

    // Get number of positions
    const balance: number = await positionContract.balanceOf(address)

    // Get all positions
    const tokenIds = []
    for (let i = 0; i < balance; i++) {
        const tokenOfOwnerByIndex: number =
            await positionContract.tokenOfOwnerByIndex(address, i)
        tokenIds.push(tokenOfOwnerByIndex)
    }

    return tokenIds
}

export async function getPositionInfo(tokenId: number): Promise<PositionInfo> {
    const provider = getProvider()
    if (!provider) {
        throw new Error('No provider available')
    }

    const positionContract = new ethers.Contract(
        NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
        NONFUNGIBLE_POSITION_MANAGER_ABI,
        provider
    )

    const position = await positionContract.positions(tokenId)
    return {
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
        liquidity: position.liquidity,
        feeGrowthInside0LastX128: position.feeGrowthInside0LastX128,
        feeGrowthInside1LastX128: position.feeGrowthInside1LastX128,
        tokensOwed0: position.tokensOwed0,
        tokensOwed1: position.tokensOwed1,
    }
}

export async function getTokenTransferApproval(
    address:string,
    token: Token
): Promise<TransactionState> {
    const provider = getProvider()
    if (!provider || !address) {
        console.log('No Provider Found')
        return TransactionState.Failed
    }
    const signer = await provider.getSigner()

    try {
        console.log('token::',token,provider,ERC20ABI)
        const tokenContract = new ethers.Contract(
            token.address,
            ERC20ABI,
            signer
        )
        console.log('tokenContract',tokenContract.populateTransaction)
        const txResponse  = await tokenContract.approve(
            NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
            ethers.parseUnits(TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER.toString(),token.decimals)
        )
        // 等待交易确认
        if (txResponse) {
            return TransactionState.Sent
        } else {
            return TransactionState.Failed
        }
    } catch (e) {
        console.error(e)
        return TransactionState.Failed
    }
}