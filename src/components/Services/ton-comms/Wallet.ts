import { Address, Contract, ContractProvider, Dictionary } from '@ton/ton'

export interface WalletState {
    tokens: bigint
    staking: Dictionary<bigint, bigint>
    unstaking: bigint
}

export interface WalletFees {
    sendTokensFee: bigint
    unstakeFee: bigint
}

export interface WalletTimes {
    currentRoundSince: bigint
    participantSince: bigint
    participantUntil: bigint
    nextRoundSince: bigint
    nextRoundUntil: bigint
    stakeHeldFor: bigint
}

export class Wallet implements Contract {
    constructor(readonly address: Address) { }

    static createFromAddress(address: Address) {
        return new Wallet(address)
    }

    async getWalletState(provider: ContractProvider): Promise<WalletState> {
        const { stack } = await provider.get('get_wallet_state', [])

        const r = {
            tokens: stack.readBigNumber(),
            staking: Dictionary.loadDirect(
                Dictionary.Keys.BigUint(32),
                Dictionary.Values.BigVarUint(4),
                stack.readCellOpt(),
            ),
            unstaking: stack.readBigNumber(),
        }
        return r
    }

    async getWalletFees(provider: ContractProvider): Promise<WalletFees> {
        try {
            const { stack } = await provider.get('get_wallet_fees', [])
            return {
                sendTokensFee: stack.readBigNumber(),
                unstakeFee: stack.readBigNumber(),
            }
        } catch (error) {
            return {
                sendTokensFee: 0n,
                unstakeFee: 0n,
            }
        }

    }
}
