import  { useState } from 'react';

import {
    Container,
    Button,
    Typography,
    Select,
    MenuItem,
    FormControl,
    Grid,
    Paper,
} from '@mui/material';
import OutlinedInput from "@mui/material/OutlinedInput";
import {ArrowsDownUp} from "@phosphor-icons/react";

const tokens =[
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'USDC', name: 'USD Coin' },
    { symbol: 'DAI', name: 'Dai' },
    // 可以添加更多代币
];

export const Swap = () => {
    const [fromToken, setFromToken] = useState(tokens[0].symbol);
    const [toToken, setToToken] = useState(tokens[1].symbol);
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');

    const handleSwap = () => {
        // 这里可以添加交换逻辑
        console.log(`Swapping ${fromAmount} ${fromToken} to ${toAmount} ${toToken}`);
    };

    const handleTokenSwap = () => {
        setFromToken(toToken);
        setToToken(fromToken);
        setFromAmount(toAmount);
        setToAmount(fromAmount);
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '50px' }}>
            <Paper elevation={3} style={{ padding: '20px', borderRadius: '10px' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    V3 Swap
                </Typography>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined">
                            <Select
                                size={'small'}

                                labelId="from-token-label"
                                value={fromToken}
                                onChange={(e) => setFromToken(e.target.value)}
                            >
                                {tokens.map((token) => (
                                    <MenuItem key={token.symbol} value={token.symbol}>
                                        {token.name} ({token.symbol})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <OutlinedInput
                            size={'small'}

                            fullWidth
                            value={fromAmount}
                            onChange={(e) => setFromAmount(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={6} style={{ margin: '20px 0' }}>
                    <ArrowsDownUp onClick={handleTokenSwap} size={20} />
                </Grid>
                <Grid container spacing={2} alignItems="center" >
                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined">
                            <Select
                                labelId="to-token-label"
                                size={'small'}
                                value={toToken}
                                onChange={(e) => setToToken(e.target.value)}
                            >
                                {tokens.map((token) => (
                                    <MenuItem key={token.symbol} value={token.symbol}>
                                        {token.name} ({token.symbol})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <OutlinedInput
                            fullWidth
                            size={'small'}
                            value={toAmount}
                            onChange={(e) => setToAmount(e.target.value)}
                        />
                    </Grid>
                </Grid>

                <Grid container style={{ marginTop: '20px' }}>

                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleSwap}
                            style={{ borderRadius: '20px' }}
                        >
                            Swap
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

