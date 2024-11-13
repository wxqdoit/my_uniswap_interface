import {Currency, NativeCurrency, Token} from "@uniswap/sdk-core";

export class NativeToken extends NativeCurrency {
    private readonly WrappedToken:Token
    public constructor(WrappedToken:Token,name:string,symbol:string) {
        super(WrappedToken.chainId, 18, name,symbol);
        this.WrappedToken = WrappedToken
    }
    public equals(other: Currency): boolean {
        return other.isNative && other.chainId === this.chainId
    }
    get wrapped(): Token {
        return  this.WrappedToken
    }
}