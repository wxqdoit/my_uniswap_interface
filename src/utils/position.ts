import {  Percent, Token,NONFUNGIBLE_POSITION_MANAGER_ADDRESSES} from '@uniswap/sdk-core'
import ERC20ABI from '../abi/ERC20ABI.json'
import {FeeAmount, MintOptions, NonfungiblePositionManager, Pool, Position} from '@uniswap/v3-sdk'
import {ethers} from 'ethers'

import {CurrentConfig} from './config'
import {

    NONFUNGIBLE_POSITION_MANAGER_ABI,
    NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
} from './constants'
import {getPoolAddress, getPoolInfo} from './pool.ts'
import {getProvider, sendTransaction, TransactionState,} from './providers'
import JSBI from "jsbi";
import {tryParseTick} from "./utils.ts";
import tryParseCurrencyAmount from "./tryParseCurrencyAmount.ts";
import {NativeToken} from "../tokens/NativeToken.ts";
import {TOKENS} from "../constants/tokens.ts";
import {CHAINS} from "../constants/chains.ts";


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

    // // 1. 授权代币A和代币B给POSITION_MANAGER_CONTRACT
    // const tokenInApproval = await getTokenTransferApproval(address,
    //     CurrentConfig.tokens.token0
    // )
    // const tokenOutApproval = await getTokenTransferApproval(address,
    //     CurrentConfig.tokens.token1
    // )


    // 2. 创建一个等待mint的Position
    //      2.1 使用辅助函数计算pool的地址
    //      2.2 使用pool地址通过合约查询pool的信息
    //      2.3 使用pool信息构建一个Pool
    //      2.4 使用实例化的Pool创建一个Position
    const position = await constructPosition()



    const eth = new NativeToken(TOKENS[CHAINS.SEPOLIA].WRAPPED_NATIVE,'ETH','Ether')
    // 3. mint config, MintOptions for creating new position
    // if token is native,useNative is required
    const mintOptions: MintOptions = {
        recipient: address,
        useNative:eth ,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10,
        slippageTolerance: new Percent(50, 10_000),
    }

    console.log('mintOptions===',mintOptions,NONFUNGIBLE_POSITION_MANAGER_ADDRESSES)
    console.log('position===',position)
    // 4. build calldata，构建交易，以便mint position使用
    const {calldata, value} = NonfungiblePositionManager.addCallParameters(
        position,
        mintOptions
    )
    const transaction = {
        data: calldata,
        to: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
        value: value,
        from: address,
    }

    // 5.发送交易，创建自己的仓位
    return sendTransaction(transaction)

    // const positionManager = new ethers.Contract(POOL_FACTORY_CONTRACT_ADDRESS, PoolABI, provider);
    // const poolAddress = await positionManager.getPool(CurrentConfig.tokens.token0.address, CurrentConfig.tokens.token1.address, poolFee);


}

export async function constructPosition(): Promise<Position> {

    // get pool address
    const pa = getPoolAddress()


    // get pool info
    const poolInfo = await getPoolInfo(pa)
    // construct pool instance

    const configuredPool = new Pool(
        CurrentConfig.tokens.token0,
        CurrentConfig.tokens.token1,
        poolInfo.fee,
        poolInfo.sqrtPriceX96.toString(),
        poolInfo.liquidity.toString(),
        poolInfo.tick,
    )

    // 计算可读价格
    const price =  (BigInt(poolInfo.sqrtPriceX96.toString()) ** BigInt(2)) / BigInt(2 ** 192);

    // 调整价格以考虑代币精度 1 token1 值多少 token0
    const adjustedPrice = ethers.formatUnits(price.toString(),CurrentConfig.tokens.token1.decimals-CurrentConfig.tokens.token0.decimals)

    console.log('adjustedPrice',adjustedPrice)

    // 设置流动性范围
    const priceLower = Number(adjustedPrice) * 0.9989; // 设定下限为当前价格的 99.89%
    const priceUpper = Number(adjustedPrice) * 1.001; // 设定上限为当前价格的 100.1%
    console.log('price====' ,priceLower,priceUpper )

    const tickLower = tryParseTick(CurrentConfig.tokens.token0, CurrentConfig.tokens.token1, FeeAmount.LOWEST, priceLower.toString())
    const tickUpper = tryParseTick(CurrentConfig.tokens.token0, CurrentConfig.tokens.token1, FeeAmount.LOWEST, priceUpper.toString())

    console.log('pool price====' ,poolInfo.sqrtPriceX96,Number(adjustedPrice) )
    console.log('configuredPool===',configuredPool)
    console.log('tickLower====' ,tickLower )
    console.log('tickUpper====' ,tickUpper )


    // const sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower)
    // const sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper)
    //
    // console.log('sqrtRatioAX96',sqrtRatioAX96,sqrtRatioBX96)


    const independentAmount = tryParseCurrencyAmount('1', CurrentConfig.tokens.token0);

    const calculateDependentAmount  = ():string=>{
        const position: Position | undefined = Position.fromAmount0({
                pool: configuredPool,
                tickLower,
                tickUpper,
                amount0: independentAmount.quotient,
                useFullPrecision:true
            })
        const dependentTokenAmount = position.amount1
        return  ethers.formatUnits(JSBI.toNumber(dependentTokenAmount.quotient))
    }
    const dependentAmount = tryParseCurrencyAmount(calculateDependentAmount(), CurrentConfig.tokens.token1);

    console.log('independentAmount===',independentAmount.quotient)
    console.log('dependentAmount===',dependentAmount.quotient)

    return Position.fromAmounts({
        pool: configuredPool,
        tickLower,
        tickUpper,
        amount0: independentAmount.quotient,
        amount1: dependentAmount.quotient,
        useFullPrecision: true,
    })
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