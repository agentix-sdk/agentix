import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";


import availableDriftMarketsAction from "./actions/availableMarkets";
import createDriftUserAccountAction from "./actions/createDriftUserAccount";
import createVaultAction from "./actions/createVault";
import depositIntoDriftVaultAction from "./actions/depositIntoVault";
import depositToDriftUserAccountAction from "./actions/depositToDriftUserAccount";
import deriveDriftVaultAddressAction from "./actions/deriveVaultAddress";
import doesUserHaveDriftAcccountAction from "./actions/doesUserHaveDriftAccount";
import driftUserAccountInfoAction from "./actions/driftUserAccountInfo";
import entryQuoteOfDriftPerpTradeAction from "./actions/entryQuoteOfPerpTrade";
import getDriftLendAndBorrowAPYAction from "./actions/getLendAndBorrowAPY";
import driftPerpMarketFundingRateAction from "./actions/perpMarketFundingRate";
import requestUnstakeFromDriftInsuranceFundAction from "./actions/requestUnstakeFromDriftInsuranceFund";
import requestWithdrawalFromDriftVaultAction from "./actions/requestWithdrawalFromVault";
import stakeToDriftInsuranceFundAction from "./actions/stakeToDriftInsuranceFund";
import swapSpotTokenOnDriftAction from "./actions/swapSpotToken";
import tradeDelegatedDriftVaultAction from "./actions/tradeDelegatedDriftVault";
import tradeDriftPerpAccountAction from "./actions/tradePerpAccount";
import unstakeFromDriftInsuranceFundAction from "./actions/unstakeFromDriftInsuranceFund";
import updateDriftVaultDelegateAction from "./actions/updateDriftVaultDelegate";
import updateDriftVaultAction from "./actions/updateVault";
import vaultInfoAction from "./actions/vaultInfo";
import withdrawFromDriftAccountAction from "./actions/withdrawFromDriftAccount";
import withdrawFromDriftVaultAction from "./actions/withdrawFromVault";

import {
    calculatePerpMarketFundingRate,
    createDriftUserAccount,
    createVault,
    depositIntoVault,
    depositToDriftUserAccount,
    deriveDriftVaultAddress,
    doesUserHaveDriftAccount,
    driftPerpTrade,
    driftUserAccountInfo,
    getAvailableDriftPerpMarkets,
    getAvailableDriftSpotMarkets,
    getEntryQuoteOfPerpTrade,
    getFundingRateAsPercentage,
    getL2OrderBook,
    getLendingAndBorrowAPY,
    getMarketIndexAndType,
    getVaultAddress,
    getVaultInfo,
    requestUnstakeFromDriftInsuranceFund,
    requestWithdrawalFromVault,
    stakeToDriftInsuranceFund,
    swapSpotToken,
    tradeDriftVault,
    unstakeFromDriftInsuranceFund,
    updateVault,
    updateVaultDelegate,
    validateAndEncodeAddress,
    withdrawFromDriftUserAccount,
    withdrawFromDriftVault,
  } from "./tools";

class DriftPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            driftPerpTrade,
            deriveDriftVaultAddress,
            calculatePerpMarketFundingRate,
            createDriftVault: createVault,
            createDriftUserAccount,
            depositIntoDriftVault: depositIntoVault,
            depositToDriftUserAccount,
            doesUserHaveDriftAccount,
            driftUserAccountInfo,
            getAvailableDriftPerpMarkets,
            getAvailableDriftSpotMarkets,
            getLendingAndBorrowAPY,
            updateVault,
            withdrawFromDriftVault,
            withdrawFromDriftUserAccount,
            requestWithdrawalFromVault,
            updateDriftVaultDelegate: updateVaultDelegate,
            getVaultInfo,
            getVaultAddress,
            tradeDriftVault,
            swapSpotToken,
            stakeToDriftInsuranceFund,
            requestUnstakeFromDriftInsuranceFund,
            unstakeFromDriftInsuranceFund,
            getDriftMarketIndexAndType: getMarketIndexAndType,
            getDriftFundingRateAsPercentage: getFundingRateAsPercentage,
            getEntryQuoteOfDriftPerpTrade: getEntryQuoteOfPerpTrade,
            validateAndEncodeDriftAddress: validateAndEncodeAddress,
            getDriftL2OrderBook: getL2OrderBook,
        };

        const actions = [
            availableDriftMarketsAction,
            createDriftUserAccountAction,
            createVaultAction,
            depositIntoDriftVaultAction,
            depositToDriftUserAccountAction,
            deriveDriftVaultAddressAction,
            doesUserHaveDriftAcccountAction,
            driftUserAccountInfoAction,
            entryQuoteOfDriftPerpTradeAction,
            getDriftLendAndBorrowAPYAction,
            driftPerpMarketFundingRateAction,
            requestUnstakeFromDriftInsuranceFundAction,
            vaultInfoAction,
            withdrawFromDriftVaultAction,
            withdrawFromDriftAccountAction,
            updateDriftVaultAction,
            updateDriftVaultDelegateAction,
            unstakeFromDriftInsuranceFundAction,
            tradeDriftPerpAccountAction,
            tradeDelegatedDriftVaultAction,
            swapSpotTokenOnDriftAction,
            stakeToDriftInsuranceFundAction,
            requestWithdrawalFromDriftVaultAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("drift", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default DriftPlugin;
