import { ChainInfo } from "./types";

export const CHAIN_INFO: Record<string, ChainInfo> = {
    // EVM Chains
    "1": {
        id: 1,
        name: "Ethereum",
        type: "evm",
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        rpcUrls: ["https://eth.public-rpc.com"],
        blockExplorerUrls: ["https://etherscan.io"],
        iconUrls: ["https://cryptologos.cc/logos/ethereum-eth-logo.png"]
    },
    "10": {
        id: 10,
        name: "Optimism",
        type: "evm",
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        rpcUrls: ["https://mainnet.optimism.io"],
        blockExplorerUrls: ["https://optimistic.etherscan.io"],
        iconUrls: ["https://cryptologos.cc/logos/optimism-ethereum-op-logo.png"]
    },
    "137": {
        id: 137,
        name: "Polygon",
        type: "evm",
        nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
        rpcUrls: ["https://polygon-rpc.com"],
        blockExplorerUrls: ["https://polygonscan.com"],
        iconUrls: ["https://cryptologos.cc/logos/polygon-matic-logo.png"]
    },
    "8453": {
        id: 8453,
        name: "Base",
        type: "evm",
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        rpcUrls: ["https://mainnet.base.org"],
        blockExplorerUrls: ["https://basescan.org"],
        iconUrls: ["https://cryptologos.cc/logos/base-logo.png"]
    },
    "42161": {
        id: 42161,
        name: "Arbitrum One",
        type: "evm",
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        rpcUrls: ["https://arb1.arbitrum.io/rpc"],
        blockExplorerUrls: ["https://arbiscan.io"],
        iconUrls: ["https://cryptologos.cc/logos/arbitrum-arb-logo.png"]
    },
    "34443": {
        id: 34443,
        name: "Mode Network",
        type: "evm",
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        rpcUrls: ["https://mainnet.mode.network"],
        blockExplorerUrls: ["https://explorer.mode.network"],
        iconUrls: ["https://cryptologos.cc/logos/mode-logo.png"]
    },
    "11155111": {
        id: 11155111,
        name: "Sepolia",
        type: "evm",
        nativeCurrency: { name: "Sepolia Ether", symbol: "SepoliaETH", decimals: 18 },
        rpcUrls: ["https://rpc.sepolia.org"],
        blockExplorerUrls: ["https://sepolia.etherscan.io"],
        iconUrls: ["https://cryptologos.cc/logos/ethereum-eth-logo.png"]
    },
    "84532": {
        id: 84532,
        name: "Base Sepolia",
        type: "evm",
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        rpcUrls: ["https://sepolia.base.org"],
        blockExplorerUrls: ["https://sepolia.basescan.org"],
        iconUrls: ["https://cryptologos.cc/logos/base-logo.png"]
    },

    // Solana
    "solana-mainnet": {
        id: "solana-mainnet",
        name: "Solana",
        type: "solana",
        nativeCurrency: { name: "Solana", symbol: "SOL", decimals: 9 },
        rpcUrls: ["https://api.mainnet-beta.solana.com"],
        blockExplorerUrls: ["https://explorer.solana.com"],
        iconUrls: ["https://cryptologos.cc/logos/solana-sol-logo.png"]
    },
    "solana-devnet": {
        id: "solana-devnet",
        name: "Solana Devnet",
        type: "solana",
        nativeCurrency: { name: "Solana", symbol: "SOL", decimals: 9 },
        rpcUrls: ["https://api.devnet.solana.com"],
        blockExplorerUrls: ["https://explorer.solana.com?cluster=devnet"],
        iconUrls: ["https://cryptologos.cc/logos/solana-sol-logo.png"]
    },

    // Aptos
    "aptos-mainnet": {
        id: "aptos-mainnet",
        name: "Aptos",
        type: "aptos",
        nativeCurrency: { name: "Aptos", symbol: "APT", decimals: 8 },
        rpcUrls: ["https://fullnode.mainnet.aptoslabs.com/v1"],
        blockExplorerUrls: ["https://explorer.aptoslabs.com"],
        iconUrls: ["https://cryptologos.cc/logos/aptos-apt-logo.png"]
    },

    // Sui
    "sui-mainnet": {
        id: "sui-mainnet",
        name: "Sui",
        type: "sui",
        nativeCurrency: { name: "Sui", symbol: "SUI", decimals: 9 },
        rpcUrls: ["https://fullnode.mainnet.sui.io:443"],
        blockExplorerUrls: ["https://explorer.sui.io"],
        iconUrls: ["https://cryptologos.cc/logos/sui-sui-logo.png"]
    },

    // Zilliqa (supports both native and EVM)
    "zilliqa-mainnet": {
        id: "zilliqa-mainnet",
        name: "Zilliqa",
        type: "zilliqa",
        nativeCurrency: { name: "Zilliqa", symbol: "ZIL", decimals: 12 },
        rpcUrls: ["https://api.zilliqa.com"],
        blockExplorerUrls: ["https://viewblock.io/zilliqa"],
        iconUrls: ["https://cryptologos.cc/logos/zilliqa-zil-logo.png"],
        evmId: 32769
    },
    "32769": {
        id: 32769,
        name: "Zilliqa EVM",
        type: "zilliqa",
        nativeCurrency: { name: "Zilliqa", symbol: "ZIL", decimals: 18 },
        rpcUrls: ["https://api.zilliqa.com"],
        blockExplorerUrls: ["https://evmx.zilliqa.com"],
        iconUrls: ["https://cryptologos.cc/logos/zilliqa-zil-logo.png"],
        evmId: 32769
    },

    // Cosmos
    "cosmos-hub": {
        id: "cosmos-hub",
        name: "Cosmos Hub",
        type: "cosmos",
        nativeCurrency: { name: "Cosmos", symbol: "ATOM", decimals: 6 },
        rpcUrls: ["https://cosmos-rpc.polkachu.com"],
        blockExplorerUrls: ["https://www.mintscan.io/cosmos"],
        iconUrls: ["https://cryptologos.cc/logos/cosmos-atom-logo.png"]
    },

    // Starknet
    "starknet-mainnet": {
        id: "starknet-mainnet",
        name: "Starknet",
        type: "starknet",
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        rpcUrls: ["https://starknet-mainnet.public.blastapi.io"],
        blockExplorerUrls: ["https://starkscan.co"],
        iconUrls: ["https://cryptologos.cc/logos/starknet-logo.png"]
    },

    // Radix
    "radix-mainnet": {
        id: 1,
        name: "Radix",
        type: "radix",
        nativeCurrency: { name: "Radix", symbol: "XRD", decimals: 18 },
        rpcUrls: ["https://mainnet.radixdlt.com"],
        blockExplorerUrls: ["https://dashboard.radixdlt.com"],
        iconUrls: ["https://cryptologos.cc/logos/radix-xrd-logo.png"]
    },

    // Fuel
    "fuel-mainnet": {
        id: "fuel-mainnet",
        name: "Fuel",
        type: "fuel",
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 9 },
        rpcUrls: ["https://mainnet.fuel.network"],
        blockExplorerUrls: ["https://fuellabs.github.io/block-explorer-v2"],
        iconUrls: ["https://cryptologos.cc/logos/fuel-logo.png"]
    },

    // Chromia
    "chromia-mainnet": {
        id: "chromia-mainnet",
        name: "Chromia",
        type: "chromia",
        nativeCurrency: { name: "Chromia", symbol: "CHR", decimals: 6 },
        rpcUrls: ["https://system.chromaway.com:7740"],
        blockExplorerUrls: ["https://explorer-mainnet.chromia.com"],
        iconUrls: ["https://cryptologos.cc/logos/chromia-chr-logo.png"]
    },

    // Zetrix
    "zetrix-mainnet": {
        id: "zetrix-mainnet",
        name: "Zetrix",
        type: "zetrix",
        nativeCurrency: { name: "Zetrix", symbol: "ZTX", decimals: 6 },
        rpcUrls: ["https://mainnet.zetrix.com"],
        blockExplorerUrls: ["https://explorer.zetrix.com"],
        iconUrls: ["https://cryptologos.cc/logos/zetrix-logo.png"]
    }
};

export const EVM_CHAINS = Object.values(CHAIN_INFO).filter(chain => chain.type === "evm");
export const NON_EVM_CHAINS = Object.values(CHAIN_INFO).filter(chain => chain.type !== "evm");

// Helper functions
export function getChainById(id: string | number): ChainInfo | undefined {
    return CHAIN_INFO[id.toString()];
}

export function getChainByName(name: string): ChainInfo | undefined {
    return Object.values(CHAIN_INFO).find(
        chain => chain.name.toLowerCase() === name.toLowerCase()
    );
}

export function getChainsByType(type: string): ChainInfo[] {
    return Object.values(CHAIN_INFO).filter(chain => chain.type === type);
}

export function getAllSupportedChains(): ChainInfo[] {
    return Object.values(CHAIN_INFO);
} 