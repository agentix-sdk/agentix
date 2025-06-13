import { EvmWalletBase } from "agentix";
import { Agentix } from "agentix";
import {
    BalancerApi,
    ChainId,
    Token,
    TokenAmount,
    Swap,
    SwapKind,
    Slippage,
    PERMIT2,
    erc20Abi,
    permit2Abi,
    MaxSigDeadline,
    SwapBuildCallInput,
    SwapBuildOutputExactIn,
    BALANCER_ROUTER,
    BALANCER_BATCH_ROUTER,
    PermitDetails,
    AddLiquidity,
    AddLiquidityKind,
    AddLiquidityInput,
    RemoveLiquidity,
    RemoveLiquidityKind,
    RemoveLiquidityInput,
    InputAmount,
    ExactInQueryOutput
} from "@balancer/sdk";

/**
 * Get a Balancer API client for the specified chain
 */
function getBalancerApi(apiUrl: string, chainId: ChainId) {
    return new BalancerApi(apiUrl, chainId);
}

/**
 * Swap a token on Balancer using Smart Order Router
 * @returns Transaction result with amount out and transaction hash
 */
export async function swapOnBalancer({
    agent,
    tokenIn,
    tokenOut,
    tokenInDecimals,
    tokenOutDecimals,
    amountIn,
    slippage = "0.1",
    deadline,
    wethIsEth = false
}: {
    agent: Agentix<EvmWalletBase>,
    tokenIn: string,
    tokenOut: string,
    tokenInDecimals: number,
    tokenOutDecimals: number,
    amountIn: string,
    slippage?: string,
    deadline?: number,
    wethIsEth?: boolean,
}) {
    const walletClient = agent.wallet;
    const chainId = walletClient.getChain().id as ChainId;
    const config = agent.config;
    const rpcUrl = config.balancerRpcUrl;
    const apiUrl = config.balancerApiUrl || "https://api-v3.balancer.fi/";
    
    const balancerApi = getBalancerApi(apiUrl, chainId);

    const tokenInObj = new Token(chainId, tokenIn as `0x${string}`, tokenInDecimals);
    const tokenOutObj = new Token(chainId, tokenOut as `0x${string}`, tokenOutDecimals);
    const swapAmount = TokenAmount.fromRawAmount(tokenInObj, amountIn);
    const txDeadline = deadline
        ? BigInt(Math.floor(Date.now() / 1000) + (deadline || 3600))
        : 999999999999999999n; // Infinite deadline if not provided

    const sorPaths = await balancerApi.sorSwapPaths.fetchSorSwapPaths({
        chainId,
        tokenIn: tokenInObj.address,
        tokenOut: tokenOutObj.address,
        swapKind: SwapKind.GivenIn,
        swapAmount,
        useProtocolVersion: 3,
    });

    const swap = new Swap({
        chainId,
        paths: sorPaths,
        swapKind: SwapKind.GivenIn,
    });

    const queryOutput = (await swap.query(rpcUrl)) as ExactInQueryOutput;

    const slippageObj = Slippage.fromPercentage(`${Number(slippage)}`);

    // Check if Permit2 is approved
    const allowance = await walletClient.read({
        address: tokenInObj.address,
        abi: erc20Abi,
        functionName: "allowance",
        args: [walletClient.getAddress() as `0x${string}`, PERMIT2[chainId]],
    });

    if (BigInt(allowance.value as string) < BigInt(amountIn)) {
        await walletClient.sendTransaction({
            to: tokenInObj.address,
            abi: erc20Abi,
            functionName: "approve",
            args: [PERMIT2[chainId], amountIn],
        });
    }

    const swapBuildCallInput: SwapBuildCallInput = {
        sender: walletClient.getAddress() as `0x${string}`,
        recipient: walletClient.getAddress() as `0x${string}`,
        slippage: slippageObj,
        deadline: txDeadline,
        wethIsEth,
        queryOutput,
    };

    // Sign Permit2
    const maxAmountIn = queryOutput.amountIn;

    const spender = queryOutput.pathAmounts ? BALANCER_BATCH_ROUTER[chainId] : BALANCER_ROUTER[chainId];

    const nonceQuery = await walletClient.read({
        abi: permit2Abi,
        address: PERMIT2[chainId],
        functionName: "allowance",
        args: [walletClient.getAddress() as `0x${string}`, tokenInObj.address, spender],
    });

    const details: PermitDetails = {
        token: tokenInObj.address,
        amount: maxAmountIn.amount,
        expiration: Number(txDeadline),
        nonce: (nonceQuery.value as [number, number, number])[2],
    };

    const batch = {
        details: [details],
        spender,
        sigDeadline: MaxSigDeadline,
    };

    const PERMIT2_DOMAIN_NAME = "Permit2";
    const domain = {
        name: PERMIT2_DOMAIN_NAME,
        chainId,
        verifyingContract: PERMIT2[chainId],
    };

    const permitData = {
        domain,
        types: {
            PermitDetails: [
                { name: "token", type: "address" },
                { name: "amount", type: "uint160" },
                { name: "expiration", type: "uint48" },
                { name: "nonce", type: "uint48" },
            ],
            PermitBatch: [
                { name: "details", type: "PermitDetails[]" },
                { name: "spender", type: "address" },
                { name: "sigDeadline", type: "uint256" },
            ],
        },
        primaryType: "PermitBatch",
        values: batch,
    };

    const signature = await walletClient.signTypedData({
        domain,
        types: permitData.types,
        primaryType: permitData.primaryType,
        message: permitData.values,
    });

    const callData = swap.buildCallWithPermit2(swapBuildCallInput, {
        signature: signature.signature as `0x${string}`,
        batch,
    }) as SwapBuildOutputExactIn;

    const tx = await walletClient.sendTransaction({
        to: callData.to as `0x${string}`,
        value: callData.value,
        data: callData.callData,
    });

    return {
        success: true,
        data: {
            amountOut: callData.minAmountOut.amount.toString(),
            txHash: tx.hash,
        },
    };
}

/**
 * Add liquidity to a Balancer pool
 * @returns Transaction result with BPT out and transaction hash
 */
export async function addLiquidity({
    agent,
    pool,
    amounts,
    kind = "Unbalanced" as const,
    slippage = "0.1",
    deadline,
    wethIsEth = false
}: {
    agent: Agentix<EvmWalletBase>,
    pool: string,
    amounts: Array<{ token: string, amount: string, decimals: number }>,
    kind?: "Unbalanced" | "Exact",
    slippage?: string,
    deadline?: number,
    wethIsEth?: boolean,
}) {
    const walletClient = agent.wallet;
    const chainId = walletClient.getChain().id as ChainId;
    const config = agent.config;
    const rpcUrl = config.balancerRpcUrl;
    const apiUrl = config.balancerApiUrl || "https://api-v3.balancer.fi/";
    
    const balancerApi = getBalancerApi(apiUrl, chainId);

    const poolState = await balancerApi.pools.fetchPoolState(pool as `0x${string}`);

    const amountsIn = amounts.map((amount) => ({
        rawAmount: BigInt(amount.amount),
        decimals: amount.decimals,
        address: amount.token as `0x${string}`,
    }));

    const addLiquidityInput: AddLiquidityInput = {
        chainId,
        rpcUrl,
        amountsIn,
        kind: AddLiquidityKind.Unbalanced,
    };

    const addLiquidityInstance = new AddLiquidity();
    const queryOutput = await addLiquidityInstance.query(addLiquidityInput, poolState);

    const call = addLiquidityInstance.buildCall({
        ...queryOutput,
        slippage: Slippage.fromPercentage(`${Number(slippage)}`),
        chainId,
        wethIsEth,
    });

    const tx = await walletClient.sendTransaction({
        to: call.to as `0x${string}`,
        value: call.value,
        data: call.callData,
    });

    return {
        success: true,
        data: {
            bptOut: queryOutput.bptOut.amount.toString(),
            txHash: tx.hash,
        },
    };
}

/**
 * Remove liquidity from a Balancer pool
 * @returns Transaction result with amounts out and transaction hash
 */
export async function removeLiquidity({
    agent,
    pool,
    bptAmountIn,
    kind = "Proportional" as const,
    slippage = "0.1",
    wethIsEth = false
}: {
    agent: Agentix<EvmWalletBase>,
    pool: string,
    bptAmountIn: string,
    kind?: "Proportional" | "Single",
    slippage?: string,
    wethIsEth?: boolean,
}) {
    const walletClient = agent.wallet;
    const chainId = walletClient.getChain().id as ChainId;
    const config = agent.config;
    const rpcUrl = config.balancerRpcUrl;
    const apiUrl = config.balancerApiUrl || "https://api-v3.balancer.fi/";
    
    const balancerApi = getBalancerApi(apiUrl, chainId);

    const poolState = await balancerApi.pools.fetchPoolState(pool as `0x${string}`);

    const bptIn: InputAmount = {
        rawAmount: BigInt(bptAmountIn),
        decimals: 18, // BPT tokens always have 18 decimals
        address: poolState.address,
    };

    const removeLiquidityInput: RemoveLiquidityInput = {
        chainId,
        rpcUrl,
        bptIn,
        kind: RemoveLiquidityKind.Proportional,
    };

    const removeLiquidityInstance = new RemoveLiquidity();
    const queryOutput = await removeLiquidityInstance.query(removeLiquidityInput, poolState);

    const call = removeLiquidityInstance.buildCall({
        ...queryOutput,
        slippage: Slippage.fromPercentage(`${Number(slippage)}`),
        chainId,
        wethIsEth,
    });

    const tx = await walletClient.sendTransaction({
        to: call.to as `0x${string}`,
        value: call.value,
        data: call.callData,
    });

    return {
        success: true,
        data: {
            amountsOut: queryOutput.amountsOut.map((amount) => ({
                token: amount.token.address,
                amount: amount.amount.toString(),
            })),
            txHash: tx.hash,
        },
    };
} 