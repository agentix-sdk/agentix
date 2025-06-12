import { Token } from "./types";

// Native tokens
export const ETH: Token = {
    decimals: 18,
    symbol: "ETH",
    name: "Ether",
    chains: {
        "1": { native: true },
        "10": { native: true },
        "8453": { native: true },
        "42161": { native: true },
        "11155111": { native: true },
        "84532": { native: true },
        "34443": { native: true },
        "starknet-mainnet": { native: true },
    },
};

export const SOL: Token = {
    decimals: 9,
    symbol: "SOL",
    name: "Solana",
    chains: {
        "solana-mainnet": { native: true },
        "solana-devnet": { native: true },
    },
};

export const APT: Token = {
    decimals: 8,
    symbol: "APT",
    name: "Aptos",
    chains: {
        "aptos-mainnet": { native: true },
    },
};

export const SUI: Token = {
    decimals: 9,
    symbol: "SUI",
    name: "Sui",
    chains: {
        "sui-mainnet": { native: true },
    },
};

export const MATIC: Token = {
    decimals: 18,
    symbol: "MATIC",
    name: "Polygon",
    chains: {
        "137": { native: true },
    },
};

export const ZIL: Token = {
    decimals: 12,
    symbol: "ZIL",
    name: "Zilliqa",
    chains: {
        "zilliqa-mainnet": { native: true },
        "32769": { native: true },
    },
};

export const ATOM: Token = {
    decimals: 6,
    symbol: "ATOM",
    name: "Cosmos",
    chains: {
        "cosmos-hub": { native: true },
    },
};

export const XRD: Token = {
    decimals: 18,
    symbol: "XRD",
    name: "Radix",
    chains: {
        "radix-mainnet": { native: true },
    },
};

export const CHR: Token = {
    decimals: 6,
    symbol: "CHR",
    name: "Chromia",
    chains: {
        "chromia-mainnet": { native: true },
    },
};

export const ZTX: Token = {
    decimals: 6,
    symbol: "ZTX",
    name: "Zetrix",
    chains: {
        "zetrix-mainnet": { native: true },
    },
};

// ERC-20 and cross-chain tokens
export const PEPE: Token = {
    decimals: 18,
    symbol: "PEPE",
    name: "Pepe",
    chains: {
        "1": {
            contractAddress: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
        },
        "10": {
            contractAddress: "0xc1c167cc44f7923cd0062c4370df962f9ddb16f5",
        },
        "8453": {
            contractAddress: "0xb4fde59a779991bfb6a52253b51947828b982be3",
        },
    },
};

export const USDC: Token = {
    decimals: 6,
    symbol: "USDC",
    name: "USD Coin",
    chains: {
        "1": {
            contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        },
        "10": {
            contractAddress: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
        },
        "137": {
            contractAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
        },
        "8453": {
            contractAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        },
        "84532": {
            contractAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        },
        "11155111": {
            contractAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        },
        "34443": {
            contractAddress: "0xd988097fb8612cc24eeC14542bC03424c656005f",
        },
        "42161": {
            contractAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
        },
        // Solana USDC
        "solana-mainnet": {
            contractAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        },
    },
};

export const USDT: Token = {
    decimals: 6,
    symbol: "USDT",
    name: "Tether USD",
    chains: {
        "1": {
            contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        },
        "10": {
            contractAddress: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
        },
        "137": {
            contractAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        },
        "8453": {
            contractAddress: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
        },
        "42161": {
            contractAddress: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        },
        // Solana USDT
        "solana-mainnet": {
            contractAddress: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
        },
    },
};

export const MODE: Token = {
    decimals: 18,
    symbol: "MODE",
    name: "Mode",
    chains: {
        "34443": {
            contractAddress: "0xDfc7C877a950e49D2610114102175A06C2e3167a",
        },
    },
};

export const WETH: Token = {
    decimals: 18,
    symbol: "WETH",
    name: "Wrapped Ether",
    chains: {
        "1": {
            contractAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        },
        "8453": {
            contractAddress: "0x4200000000000000000000000000000000000006",
        },
        "34443": {
            contractAddress: "0x4200000000000000000000000000000000000006",
        },
        "42161": {
            contractAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        },
        "10": {
            contractAddress: "0x4200000000000000000000000000000000000006",
        },
        "137": {
            contractAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        },
    },
};

export const WBTC: Token = {
    decimals: 8,
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    chains: {
        "1": {
            contractAddress: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        },
        "10": {
            contractAddress: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
        },
        "137": {
            contractAddress: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
        },
        "8453": {
            contractAddress: "0x236aa50979D5f3De3Bd1Eeb40E81137F22ab794b",
        },
        "42161": {
            contractAddress: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
        },
    },
};

// All default tokens
export const DEFAULT_TOKENS = [
    // Native tokens
    ETH, SOL, APT, SUI, MATIC, ZIL, ATOM, XRD, CHR, ZTX,
    // ERC-20 and cross-chain
    PEPE, USDC, USDT, MODE, WETH, WBTC
];

export const NATIVE_TOKENS = [ETH, SOL, APT, SUI, MATIC, ZIL, ATOM, XRD, CHR, ZTX];
export const ERC20_TOKENS = [PEPE, USDC, USDT, MODE, WETH, WBTC];