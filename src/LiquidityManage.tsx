import {useCallback, useEffect, useMemo, useState} from 'react'
import {CurrentConfig} from './utils/config'
import {getCurrencyBalance, getNativeTokenBalance} from './utils/balance.ts'
import {getPositionIds, getPositionInfo, mintPosition, PositionInfo,} from './utils/position.ts'
import {connectWallet, getProvider, TransactionState,} from './utils/providers'
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import {FeeAmount} from "@uniswap/v3-sdk";
import Card from '@mui/material/Card';
import OutlinedInput from '@mui/material/OutlinedInput';

export const LiquidityManage = () => {
    const FeeAmountList:FeeAmount[] = [FeeAmount.LOWEST,FeeAmount.LOW,FeeAmount.MEDIUM,FeeAmount.HIGH]

    const [token0Balance, setToken0Balance] = useState<string>('')
    const [token1Balance, setToken1Balance] = useState<string>('')
    const [tokenNativeBalance, setTokenNativeBalance] = useState<string>('')
    const [selectedTier, setSelectedTier] = useState<FeeAmount>(FeeAmountList[0])
    const [positionIds, setPositionIds] = useState<number[]>([])
    const [address, setAddress] = useState<string>('')
    const [positionsInfo, setPositionsInfo] = useState<PositionInfo[]>([])
    const [txState, setTxState] = useState<TransactionState>(TransactionState.New)


    useEffect(() => {
        if(address){
            const provider = getProvider()
            if (!provider || !address) {
                return
            }
            const fetchData = async () => {
                // Set Balances
                setToken0Balance(
                    await getCurrencyBalance(provider, address, CurrentConfig.tokens.token0)
                )
                setToken1Balance(
                    await getCurrencyBalance(provider, address, CurrentConfig.tokens.token1)
                )

                setTokenNativeBalance(
                    await getNativeTokenBalance(provider, address)
                )

                // Set Position Info
                const ids = await getPositionIds(address)
                setPositionIds(ids)
                const info = await Promise.all(ids.map(getPositionInfo))
                setPositionsInfo(info)
                console.log('positionsInfo',info)
            }
            fetchData()

        }
    }, [address]);
    const handleChangeTier = (e:any)=>{
        setSelectedTier(e.target.value as FeeAmount)
    }

    // Event Handlers

    const onConnectWallet = async () => {
        if(!address){
            const account = await connectWallet();
            setAddress(account)
        }

    }

    const onMintPosition = useCallback(async () => {
        setTxState(TransactionState.Sending)
        setTxState(await mintPosition(address))
    }, [address])

    // Formatted Data

    const positionInfoStrings: string[] = useMemo(() => {
        if (positionIds.length !== positionsInfo.length) {
            return []
        }
        return positionIds
            .map((id, index) => [id, positionsInfo[index]])
            .map((info) => {
                const id = info[0]
                const posInfo = info[1] as PositionInfo
                return `${id}: ${posInfo.liquidity.toString()} liquidity, owed ${posInfo.tokensOwed0.toString()} and ${posInfo.tokensOwed1.toString()}`
            })
    }, [positionIds, positionsInfo])

    return (
        <div className="App">


            {!address ? <Button variant="contained" onClick={onConnectWallet}>{'Connect Wallet'}</Button> :
                <h3>{`Wallet Address: ${address}`}</h3>}
            <h3>{`ETH Balance: ${tokenNativeBalance}`}</h3>
            <h3>{`${CurrentConfig.tokens.token0.symbol} Balance: ${token0Balance}`}</h3>
            <h3>{`${CurrentConfig.tokens.token1.symbol} Balance: ${token1Balance}`}</h3>
            <br/>
            <br/>
            <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                <h3>token</h3>
                <Button variant="outlined">{CurrentConfig.tokens.token0.symbol}</Button>
                <span>+</span>
                <Button variant="outlined">{CurrentConfig.tokens.token1.symbol}</Button>
            </div>

            <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                <h3>tier</h3>
                <FormControl>
                    <RadioGroup
                        value={selectedTier}
                        onChange={handleChangeTier}
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                    >
                        {FeeAmountList.map((i: FeeAmount) => {
                            return <FormControlLabel key={i} value={i} control={<Radio/>} label={(i / 10000) + '%'}/>
                        })}
                    </RadioGroup>
                </FormControl>
            </div>


            <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                <h3>Set price range</h3>
                <Card variant="outlined" style={{padding:'12px'}}>
                    <div>Low price</div>
                    <OutlinedInput size={'small'} placeholder="0"/>
                    <div>USDC per ETH</div>
                </Card>
                <br/>
                <Card variant="outlined" style={{padding:'12px'}}>
                    <div>High price</div>
                    <OutlinedInput  size={'small'} placeholder="0"/>
                    <div>USDC per ETH</div>
                </Card>
            </div>


            <h3>{`Transaction State: ${txState}`}</h3>

            <div>
                Positions:{' '}
                {positionInfoStrings.map((s, i) => (
                    <p key={i}>{s}</p>
                ))}
            </div>
            <button
                onClick={() => onMintPosition()}
            >
                <p>Mint Position</p>
            </button>
        </div>
    )
}

