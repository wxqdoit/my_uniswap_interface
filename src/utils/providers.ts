import {ethers} from "ethers";


export enum TransactionState {
    Failed = 'Failed',
    New = 'New',
    Rejected = 'Rejected',
    Sending = 'Sending',
    Sent = 'Sent',
}

export const getProvider = () => {
  return new ethers.BrowserProvider(window.ethereum);
}


export async function connectWallet() {
    if (!window.ethereum) {
        return null
    }
    const provider = getProvider()
    const accounts = await provider.send('eth_requestAccounts', [])

    if (accounts.length !== 1) {
        return
    }
    console.log(accounts)

    return accounts[0]
}


export async function sendTransaction(
    transaction: ethers.TransactionRequest
): Promise<TransactionState> {
    const browserExtensionProvider =getProvider()
    try {
        const receipt = await browserExtensionProvider?.send(
            'eth_sendTransaction',
            [transaction]
        )
        if (receipt) {
            return TransactionState.Sent
        } else {
            return TransactionState.Failed
        }
    } catch (e) {
        console.log(e)
        return TransactionState.Rejected
    }
}