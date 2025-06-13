import { EvmWalletBase } from "agentix";
import { Agentix } from "agentix";
import { Address, formatUnits, parseUnits, Abi } from "viem";
import rawAbi from "../abi/curves.json";
import { CurvesOptions } from "../types";

const curvesAbi = rawAbi as unknown as Abi;

export class CurvesPluginConfigError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CurvesPluginConfigError";
    }
}

export class CurvesPluginError extends Error {
    constructor(
        message: string,
        public readonly cause?: unknown,
    ) {
        super(message);
        this.name = "CurvesPluginError";
    }
}

export interface ValidatedConfig {
    curves: Required<CurvesOptions>;
}

export function validateConfig(opts?: CurvesOptions): ValidatedConfig {
    // Validation errors
    const errors: string[] = [];

    // Validate curves contract address
    const curvesAddress = opts?.address ?? process.env.CURVES_CONTRACT_ADDRESS;
    if (!curvesAddress) {
        errors.push("Curves contract address not found in plugin options or environment");
    }

    if (errors.length > 0) {
        throw new CurvesPluginConfigError(errors.join("\n"));
    }

    const curves: Required<CurvesOptions> = {
        address: curvesAddress,
        abi: opts?.abi ?? curvesAbi,
    } as Required<CurvesOptions>;

    return {
        curves,
    };
}

const formatPrice = (
    price: bigint,
    options?: {
        unit?: "wei" | "gwei" | "eth";
        decimals?: number;
        includeUnit?: boolean;
    },
) => {
    const defaultOptions = {
        unit: "eth" as const,
        decimals: 6,
        includeUnit: true,
    };
    const opts = { ...defaultOptions, ...options };

    const decimalsMap = {
        wei: 0,
        gwei: 9,
        eth: 18,
    };

    const formatted = formatUnits(price, decimalsMap[opts.unit]).slice(
        0,
        opts.decimals === 0 ? undefined : -18 + opts.decimals + 19,
    );

    return opts.includeUnit ? `${formatted} ${opts.unit.toUpperCase()}` : formatted;
};

/**
 * Buy curves tokens for a specific subject
 */
export async function buyCurvesToken({
    agent,
    subject,
    amount = 1,
}: {
    agent: Agentix<EvmWalletBase>;
    subject: string;
    amount?: number;
}) {
    const walletClient = agent.wallet;
    const curvesAddress = agent.config.curvesAddress || process.env.CURVES_CONTRACT_ADDRESS;
    
    if (!curvesAddress) {
        throw new CurvesPluginError("Curves contract address not configured");
    }

    try {
        // Get buy price as bigint
        const result = await walletClient.read({
            address: curvesAddress,
            abi: curvesAbi,
            functionName: "getBuyPrice",
            args: [subject, amount],
        });

        const price = result.value as unknown;
        let buyPrice: bigint;
        
        if (typeof price === "bigint") {
            buyPrice = price;
        } else if (typeof price === "string" || typeof price === "number") {
            buyPrice = BigInt(price);
        } else {
            throw new CurvesPluginError("Invalid price format returned from contract");
        }

        // Send transaction
        const tx = await walletClient.sendTransaction({
            to: curvesAddress,
            abi: curvesAbi,
            functionName: "buyCurvesToken",
            args: [subject as Address, amount],
            value: buyPrice,
        });

        return tx.hash;
    } catch (error) {
        if (error instanceof CurvesPluginError) {
            throw new CurvesPluginError(`Buy curves token failed: ${error.message}`, error);
        }
        throw new CurvesPluginError(
            `Unexpected error while buying curves token for subject ${subject}`,
            error,
        );
    }
}

/**
 * Get curves token buy price for a specific subject
 */
export async function getBuyPrice({
    agent,
    subject,
    amount = 1,
    unit = "eth",
}: {
    agent: Agentix<EvmWalletBase>;
    subject: string;
    amount?: number;
    unit?: "wei" | "gwei" | "eth";
}) {
    const walletClient = agent.wallet;
    const curvesAddress = agent.config.curvesAddress || process.env.CURVES_CONTRACT_ADDRESS;
    
    if (!curvesAddress) {
        throw new CurvesPluginError("Curves contract address not configured");
    }

    try {
        const result = await walletClient.read({
            address: curvesAddress,
            abi: curvesAbi,
            functionName: "getBuyPrice",
            args: [subject, amount],
        });

        // Assert result type
        const price = result.value as unknown;
        let priceValue: bigint;
        
        if (typeof price === "bigint") {
            priceValue = price;
        } else if (typeof price === "string" || typeof price === "number") {
            priceValue = BigInt(price);
        } else {
            throw new CurvesPluginError("Invalid price format returned from contract");
        }

        return formatPrice(priceValue, {
            unit,
            decimals: 18,
            includeUnit: true,
        });
    } catch (error) {
        if (error instanceof CurvesPluginError) {
            throw new CurvesPluginError(`Get curves token buy price failed: ${error.message}`, error);
        }
        throw new CurvesPluginError(
            `Unexpected error while reading curves token buy price for subject ${subject}`,
            error,
        );
    }
}

/**
 * Sell curves tokens for a specific subject
 */
export async function sellCurvesToken({
    agent,
    subject,
    amount = 1,
}: {
    agent: Agentix<EvmWalletBase>;
    subject: string;
    amount?: number;
}) {
    const walletClient = agent.wallet;
    const curvesAddress = agent.config.curvesAddress || process.env.CURVES_CONTRACT_ADDRESS;
    
    if (!curvesAddress) {
        throw new CurvesPluginError("Curves contract address not configured");
    }

    try {
        const tx = await walletClient.sendTransaction({
            to: curvesAddress,
            abi: curvesAbi,
            functionName: "sellCurvesToken",
            args: [subject as Address, amount],
        });

        return tx.hash;
    } catch (error) {
        if (error instanceof CurvesPluginError) {
            throw new CurvesPluginError(`Sell curves token failed: ${error.message}`, error);
        }
        throw new CurvesPluginError(
            `Unexpected error while selling curves token for subject ${subject}`,
            error,
        );
    }
}

/**
 * Get curves token sell price for a specific subject
 */
export async function getSellPrice({
    agent,
    subject,
    amount = 1,
    unit = "eth",
}: {
    agent: Agentix<EvmWalletBase>;
    subject: string;
    amount?: number;
    unit?: "wei" | "gwei" | "eth";
}) {
    const walletClient = agent.wallet;
    const curvesAddress = agent.config.curvesAddress || process.env.CURVES_CONTRACT_ADDRESS;
    
    if (!curvesAddress) {
        throw new CurvesPluginError("Curves contract address not configured");
    }

    try {
        const result = await walletClient.read({
            address: curvesAddress,
            abi: curvesAbi,
            functionName: "getSellPrice",
            args: [subject as Address, amount],
        });

        // Assert result type
        const price = result.value as unknown;
        let priceValue: bigint;
        
        if (typeof price === "bigint") {
            priceValue = price;
        } else if (typeof price === "string" || typeof price === "number") {
            priceValue = BigInt(price);
        } else {
            throw new CurvesPluginError("Invalid price format returned from contract");
        }

        return formatPrice(priceValue, {
            unit,
            decimals: 18,
            includeUnit: true,
        });
    } catch (error) {
        if (error instanceof CurvesPluginError) {
            throw new CurvesPluginError(`Get curves token sell price failed: ${error.message}`, error);
        }
        throw new CurvesPluginError(
            `Unexpected error while reading curves token sell price for subject ${subject}`,
            error,
        );
    }
}

/**
 * Get Curves minted ERC20 token information for a subject
 */
export async function getCurvesERC20({
    agent,
    subject,
}: {
    agent: Agentix<EvmWalletBase>;
    subject?: string;
}) {
    const walletClient = agent.wallet;
    const curvesAddress = agent.config.curvesAddress || process.env.CURVES_CONTRACT_ADDRESS;
    
    if (!curvesAddress) {
        throw new CurvesPluginError("Curves contract address not configured");
    }

    try {
        const address = subject || walletClient.getAddress();
        const { value } = (await walletClient.read({
            address: curvesAddress,
            abi: curvesAbi,
            functionName: "externalCurvesTokens",
            args: [address],
        })) as {
            value: Array<string>;
        };

        return `ERC20 Token Details:
Name: ${value[0]}
Symbol: ${value[1]}
Contract Address: ${value[2]}`;
    } catch (error) {
        if (error instanceof CurvesPluginError) {
            throw new CurvesPluginError(`Failed to get ERC20 info: ${error.message}`, error);
        }
        throw new CurvesPluginError(
            `Unexpected error while fetching ERC20 info for subject ${subject || "self"}`,
            error,
        );
    }
}

/**
 * Get curves token balance for a subject
 */
export async function getCurvesBalance({
    agent,
    subject,
}: {
    agent: Agentix<EvmWalletBase>;
    subject: string;
}) {
    const walletClient = agent.wallet;
    const curvesAddress = agent.config.curvesAddress || process.env.CURVES_CONTRACT_ADDRESS;
    
    if (!curvesAddress) {
        throw new CurvesPluginError("Curves contract address not configured");
    }

    try {
        const result = await walletClient.read({
            address: curvesAddress,
            abi: curvesAbi,
            functionName: "curvesTokenBalance",
            args: [subject, walletClient.getAddress()],
        });

        return `Curves Token Balance for ${subject}: ${result.value} tokens`;
    } catch (error) {
        if (error instanceof CurvesPluginError) {
            throw new CurvesPluginError(`Failed to get balance: ${error.message}`, error);
        }
        throw new CurvesPluginError(
            `Unexpected error while fetching balance for subject ${subject}`,
            error,
        );
    }
}

/**
 * Withdraw curves tokens to ERC20 tokens
 */
export async function withdrawCurves({
    agent,
    subject,
    amount = 1,
}: {
    agent: Agentix<EvmWalletBase>;
    subject: string;
    amount?: number;
}) {
    const walletClient = agent.wallet;
    const curvesAddress = agent.config.curvesAddress || process.env.CURVES_CONTRACT_ADDRESS;
    
    if (!curvesAddress) {
        throw new CurvesPluginError("Curves contract address not configured");
    }

    try {
        const tx = await walletClient.sendTransaction({
            to: curvesAddress,
            abi: curvesAbi,
            functionName: "withdraw",
            args: [subject, amount],
        });

        return tx.hash;
    } catch (error) {
        if (error instanceof CurvesPluginError) {
            throw new CurvesPluginError(`Withdrawal failed: ${error.message}`, error);
        }
        throw new CurvesPluginError(
            `Unexpected error during withdrawal for subject ${subject}`,
            error,
        );
    }
}

/**
 * Deposit ERC20 tokens to curves tokens
 */
export async function depositCurves({
    agent,
    subject,
    amount = "1",
}: {
    agent: Agentix<EvmWalletBase>;
    subject: string;
    amount?: string;
}) {
    const walletClient = agent.wallet;
    const curvesAddress = agent.config.curvesAddress || process.env.CURVES_CONTRACT_ADDRESS;
    
    if (!curvesAddress) {
        throw new CurvesPluginError("Curves contract address not configured");
    }

    try {
        // Parse input amount to ERC20 minimal denomination (default is 18 decimals)
        const depositAmount = parseUnits(amount, 18);
        
        const tx = await walletClient.sendTransaction({
            to: curvesAddress,
            abi: curvesAbi,
            functionName: "deposit",
            args: [subject, depositAmount],
        });

        return tx.hash;
    } catch (error) {
        if (error instanceof CurvesPluginError) {
            throw new CurvesPluginError(`Deposit failed: ${error.message}`, error);
        }
        throw new CurvesPluginError(
            `Unexpected error during deposit for subject ${subject}`,
            error,
        );
    }
}

/**
 * Set name and symbol for your ERC20 token and mint it
 */
export async function mintCurvesERC20({
    agent,
    name,
    symbol,
}: {
    agent: Agentix<EvmWalletBase>;
    name: string;
    symbol: string;
}) {
    const walletClient = agent.wallet;
    const curvesAddress = agent.config.curvesAddress || process.env.CURVES_CONTRACT_ADDRESS;
    
    if (!curvesAddress) {
        throw new CurvesPluginError("Curves contract address not configured");
    }

    try {
        const tx = await walletClient.sendTransaction({
            to: curvesAddress,
            abi: curvesAbi,
            functionName: "setNameAndSymbol",
            args: [name, symbol, true],
        });

        return tx.hash;
    } catch (error) {
        if (error instanceof CurvesPluginError) {
            throw new CurvesPluginError(
                `Failed to set ERC20 metadata and mint it: ${error.message}`,
                error,
            );
        }
        throw new CurvesPluginError(
            `Unexpected error while setting ERC20 metadata and minting token (name: ${name}, symbol: ${symbol})`,
            error,
        );
    }
} 