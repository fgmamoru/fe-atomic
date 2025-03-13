import {
    Cell,
    Slice,
    Address,
    Builder,
    beginCell,
    ComputeError,
    TupleItem,
    TupleReader,
    Dictionary,
    contractAddress,
    ContractProvider,
    Sender,
    Contract,
    ContractABI,
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadGetterTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    let sc_0 = slice;
    let _workchain = sc_0.loadIntBig(8);
    let _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function loadTupleStdAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function loadGetterTupleStdAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function storeTupleStdAddress(source: StdAddress) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    let sc_0 = slice;
    let _workchain = sc_0.loadIntBig(32);
    let _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function loadTupleVarAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function loadGetterTupleVarAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function storeTupleVarAddress(source: VarAddress) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadGetterTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadGetterTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadGetterTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function storeTupleDeploy(source: Deploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadGetterTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function storeTupleDeployOk(source: DeployOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadGetterTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function storeTupleFactoryDeploy(source: FactoryDeploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwner = {
    $$type: 'ChangeOwner';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwner(src: ChangeOwner) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2174598809, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwner(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2174598809) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadTupleChangeOwner(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadGetterTupleChangeOwner(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function storeTupleChangeOwner(source: ChangeOwner) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

function dictValueParserChangeOwner(): DictionaryValue<ChangeOwner> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwner(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwner(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwnerOk = {
    $$type: 'ChangeOwnerOk';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwnerOk(src: ChangeOwnerOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(846932810, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwnerOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 846932810) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadTupleChangeOwnerOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadGetterTupleChangeOwnerOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function storeTupleChangeOwnerOk(source: ChangeOwnerOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

function dictValueParserChangeOwnerOk(): DictionaryValue<ChangeOwnerOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwnerOk(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwnerOk(src.loadRef().beginParse());
        }
    }
}

export type TokenNotification = {
    $$type: 'TokenNotification';
    queryId: bigint;
    amount: bigint;
    from: Address;
    forwardPayload: Slice;
}

export function storeTokenNotification(src: TokenNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1935855772, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.from);
        b_0.storeBuilder(src.forwardPayload.asBuilder());
    };
}

export function loadTokenNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1935855772) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _from = sc_0.loadAddress();
    let _forwardPayload = sc_0;
    return { $$type: 'TokenNotification' as const, queryId: _queryId, amount: _amount, from: _from, forwardPayload: _forwardPayload };
}

function loadTupleTokenNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _from = source.readAddress();
    let _forwardPayload = source.readCell().asSlice();
    return { $$type: 'TokenNotification' as const, queryId: _queryId, amount: _amount, from: _from, forwardPayload: _forwardPayload };
}

function loadGetterTupleTokenNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _from = source.readAddress();
    let _forwardPayload = source.readCell().asSlice();
    return { $$type: 'TokenNotification' as const, queryId: _queryId, amount: _amount, from: _from, forwardPayload: _forwardPayload };
}

function storeTupleTokenNotification(source: TokenNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.from);
    builder.writeSlice(source.forwardPayload.asCell());
    return builder.build();
}

function dictValueParserTokenNotification(): DictionaryValue<TokenNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTokenNotification(src)).endCell());
        },
        parse: (src) => {
            return loadTokenNotification(src.loadRef().beginParse());
        }
    }
}

export type AtomicDexWithdrawNotification = {
    $$type: 'AtomicDexWithdrawNotification';
    amount: bigint;
    to: Address;
}

export function storeAtomicDexWithdrawNotification(src: AtomicDexWithdrawNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2769864583, 32);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.to);
    };
}

export function loadAtomicDexWithdrawNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2769864583) { throw Error('Invalid prefix'); }
    let _amount = sc_0.loadCoins();
    let _to = sc_0.loadAddress();
    return { $$type: 'AtomicDexWithdrawNotification' as const, amount: _amount, to: _to };
}

function loadTupleAtomicDexWithdrawNotification(source: TupleReader) {
    let _amount = source.readBigNumber();
    let _to = source.readAddress();
    return { $$type: 'AtomicDexWithdrawNotification' as const, amount: _amount, to: _to };
}

function loadGetterTupleAtomicDexWithdrawNotification(source: TupleReader) {
    let _amount = source.readBigNumber();
    let _to = source.readAddress();
    return { $$type: 'AtomicDexWithdrawNotification' as const, amount: _amount, to: _to };
}

function storeTupleAtomicDexWithdrawNotification(source: AtomicDexWithdrawNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    builder.writeAddress(source.to);
    return builder.build();
}

function dictValueParserAtomicDexWithdrawNotification(): DictionaryValue<AtomicDexWithdrawNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAtomicDexWithdrawNotification(src)).endCell());
        },
        parse: (src) => {
            return loadAtomicDexWithdrawNotification(src.loadRef().beginParse());
        }
    }
}

export type UpdateAtomicDexAddress = {
    $$type: 'UpdateAtomicDexAddress';
    newAtomicDexAddr: Address;
}

export function storeUpdateAtomicDexAddress(src: UpdateAtomicDexAddress) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2439694949, 32);
        b_0.storeAddress(src.newAtomicDexAddr);
    };
}

export function loadUpdateAtomicDexAddress(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2439694949) { throw Error('Invalid prefix'); }
    let _newAtomicDexAddr = sc_0.loadAddress();
    return { $$type: 'UpdateAtomicDexAddress' as const, newAtomicDexAddr: _newAtomicDexAddr };
}

function loadTupleUpdateAtomicDexAddress(source: TupleReader) {
    let _newAtomicDexAddr = source.readAddress();
    return { $$type: 'UpdateAtomicDexAddress' as const, newAtomicDexAddr: _newAtomicDexAddr };
}

function loadGetterTupleUpdateAtomicDexAddress(source: TupleReader) {
    let _newAtomicDexAddr = source.readAddress();
    return { $$type: 'UpdateAtomicDexAddress' as const, newAtomicDexAddr: _newAtomicDexAddr };
}

function storeTupleUpdateAtomicDexAddress(source: UpdateAtomicDexAddress) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.newAtomicDexAddr);
    return builder.build();
}

function dictValueParserUpdateAtomicDexAddress(): DictionaryValue<UpdateAtomicDexAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeUpdateAtomicDexAddress(src)).endCell());
        },
        parse: (src) => {
            return loadUpdateAtomicDexAddress(src.loadRef().beginParse());
        }
    }
}

export type UpdateCustodyWalletAddress = {
    $$type: 'UpdateCustodyWalletAddress';
    jettonWalletAddr: Address;
}

export function storeUpdateCustodyWalletAddress(src: UpdateCustodyWalletAddress) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(321056099, 32);
        b_0.storeAddress(src.jettonWalletAddr);
    };
}

export function loadUpdateCustodyWalletAddress(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 321056099) { throw Error('Invalid prefix'); }
    let _jettonWalletAddr = sc_0.loadAddress();
    return { $$type: 'UpdateCustodyWalletAddress' as const, jettonWalletAddr: _jettonWalletAddr };
}

function loadTupleUpdateCustodyWalletAddress(source: TupleReader) {
    let _jettonWalletAddr = source.readAddress();
    return { $$type: 'UpdateCustodyWalletAddress' as const, jettonWalletAddr: _jettonWalletAddr };
}

function loadGetterTupleUpdateCustodyWalletAddress(source: TupleReader) {
    let _jettonWalletAddr = source.readAddress();
    return { $$type: 'UpdateCustodyWalletAddress' as const, jettonWalletAddr: _jettonWalletAddr };
}

function storeTupleUpdateCustodyWalletAddress(source: UpdateCustodyWalletAddress) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.jettonWalletAddr);
    return builder.build();
}

function dictValueParserUpdateCustodyWalletAddress(): DictionaryValue<UpdateCustodyWalletAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeUpdateCustodyWalletAddress(src)).endCell());
        },
        parse: (src) => {
            return loadUpdateCustodyWalletAddress(src.loadRef().beginParse());
        }
    }
}

export type DepositNotificationInternal = {
    $$type: 'DepositNotificationInternal';
    sender: Address;
    amount: bigint;
    publicKey: Slice;
}

export function storeDepositNotificationInternal(src: DepositNotificationInternal) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2395986710, 32);
        b_0.storeAddress(src.sender);
        b_0.storeUint(src.amount, 256);
        b_0.storeRef(src.publicKey.asCell());
    };
}

export function loadDepositNotificationInternal(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2395986710) { throw Error('Invalid prefix'); }
    let _sender = sc_0.loadAddress();
    let _amount = sc_0.loadUintBig(256);
    let _publicKey = sc_0.loadRef().asSlice();
    return { $$type: 'DepositNotificationInternal' as const, sender: _sender, amount: _amount, publicKey: _publicKey };
}

function loadTupleDepositNotificationInternal(source: TupleReader) {
    let _sender = source.readAddress();
    let _amount = source.readBigNumber();
    let _publicKey = source.readCell().asSlice();
    return { $$type: 'DepositNotificationInternal' as const, sender: _sender, amount: _amount, publicKey: _publicKey };
}

function loadGetterTupleDepositNotificationInternal(source: TupleReader) {
    let _sender = source.readAddress();
    let _amount = source.readBigNumber();
    let _publicKey = source.readCell().asSlice();
    return { $$type: 'DepositNotificationInternal' as const, sender: _sender, amount: _amount, publicKey: _publicKey };
}

function storeTupleDepositNotificationInternal(source: DepositNotificationInternal) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.sender);
    builder.writeNumber(source.amount);
    builder.writeSlice(source.publicKey.asCell());
    return builder.build();
}

function dictValueParserDepositNotificationInternal(): DictionaryValue<DepositNotificationInternal> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDepositNotificationInternal(src)).endCell());
        },
        parse: (src) => {
            return loadDepositNotificationInternal(src.loadRef().beginParse());
        }
    }
}

export type JettonTransfer = {
    $$type: 'JettonTransfer';
    queryId: bigint;
    amount: bigint;
    destination: Address;
    responseDestination: Address | null;
    customPayload: Cell | null;
    forwardTonAmount: bigint;
    forwardPayload: Slice;
}

export function storeJettonTransfer(src: JettonTransfer) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(260734629, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.destination);
        b_0.storeAddress(src.responseDestination);
        if (src.customPayload !== null && src.customPayload !== undefined) { b_0.storeBit(true).storeRef(src.customPayload); } else { b_0.storeBit(false); }
        b_0.storeCoins(src.forwardTonAmount);
        b_0.storeBuilder(src.forwardPayload.asBuilder());
    };
}

export function loadJettonTransfer(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 260734629) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _destination = sc_0.loadAddress();
    let _responseDestination = sc_0.loadMaybeAddress();
    let _customPayload = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _forwardTonAmount = sc_0.loadCoins();
    let _forwardPayload = sc_0;
    return { $$type: 'JettonTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, responseDestination: _responseDestination, customPayload: _customPayload, forwardTonAmount: _forwardTonAmount, forwardPayload: _forwardPayload };
}

function loadTupleJettonTransfer(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _destination = source.readAddress();
    let _responseDestination = source.readAddressOpt();
    let _customPayload = source.readCellOpt();
    let _forwardTonAmount = source.readBigNumber();
    let _forwardPayload = source.readCell().asSlice();
    return { $$type: 'JettonTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, responseDestination: _responseDestination, customPayload: _customPayload, forwardTonAmount: _forwardTonAmount, forwardPayload: _forwardPayload };
}

function loadGetterTupleJettonTransfer(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _destination = source.readAddress();
    let _responseDestination = source.readAddressOpt();
    let _customPayload = source.readCellOpt();
    let _forwardTonAmount = source.readBigNumber();
    let _forwardPayload = source.readCell().asSlice();
    return { $$type: 'JettonTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, responseDestination: _responseDestination, customPayload: _customPayload, forwardTonAmount: _forwardTonAmount, forwardPayload: _forwardPayload };
}

function storeTupleJettonTransfer(source: JettonTransfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.destination);
    builder.writeAddress(source.responseDestination);
    builder.writeCell(source.customPayload);
    builder.writeNumber(source.forwardTonAmount);
    builder.writeSlice(source.forwardPayload.asCell());
    return builder.build();
}

function dictValueParserJettonTransfer(): DictionaryValue<JettonTransfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadJettonTransfer(src.loadRef().beginParse());
        }
    }
}

export type LiquidateMemberAtomicVaultNotification = {
    $$type: 'LiquidateMemberAtomicVaultNotification';
    queryId: bigint;
    publicKey: bigint;
    balance: bigint;
}

export function storeLiquidateMemberAtomicVaultNotification(src: LiquidateMemberAtomicVaultNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1387626523, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.publicKey, 256);
        b_0.storeCoins(src.balance);
    };
}

export function loadLiquidateMemberAtomicVaultNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1387626523) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _publicKey = sc_0.loadUintBig(256);
    let _balance = sc_0.loadCoins();
    return { $$type: 'LiquidateMemberAtomicVaultNotification' as const, queryId: _queryId, publicKey: _publicKey, balance: _balance };
}

function loadTupleLiquidateMemberAtomicVaultNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _publicKey = source.readBigNumber();
    let _balance = source.readBigNumber();
    return { $$type: 'LiquidateMemberAtomicVaultNotification' as const, queryId: _queryId, publicKey: _publicKey, balance: _balance };
}

function loadGetterTupleLiquidateMemberAtomicVaultNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _publicKey = source.readBigNumber();
    let _balance = source.readBigNumber();
    return { $$type: 'LiquidateMemberAtomicVaultNotification' as const, queryId: _queryId, publicKey: _publicKey, balance: _balance };
}

function storeTupleLiquidateMemberAtomicVaultNotification(source: LiquidateMemberAtomicVaultNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.publicKey);
    builder.writeNumber(source.balance);
    return builder.build();
}

function dictValueParserLiquidateMemberAtomicVaultNotification(): DictionaryValue<LiquidateMemberAtomicVaultNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeLiquidateMemberAtomicVaultNotification(src)).endCell());
        },
        parse: (src) => {
            return loadLiquidateMemberAtomicVaultNotification(src.loadRef().beginParse());
        }
    }
}

export type TonTokenTransfer = {
    $$type: 'TonTokenTransfer';
    queryId: bigint;
    amount: bigint;
    publicKey: Slice;
}

export function storeTonTokenTransfer(src: TonTokenTransfer) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3403647592, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeRef(src.publicKey.asCell());
    };
}

export function loadTonTokenTransfer(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3403647592) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _publicKey = sc_0.loadRef().asSlice();
    return { $$type: 'TonTokenTransfer' as const, queryId: _queryId, amount: _amount, publicKey: _publicKey };
}

function loadTupleTonTokenTransfer(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _publicKey = source.readCell().asSlice();
    return { $$type: 'TonTokenTransfer' as const, queryId: _queryId, amount: _amount, publicKey: _publicKey };
}

function loadGetterTupleTonTokenTransfer(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _publicKey = source.readCell().asSlice();
    return { $$type: 'TonTokenTransfer' as const, queryId: _queryId, amount: _amount, publicKey: _publicKey };
}

function storeTupleTonTokenTransfer(source: TonTokenTransfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeSlice(source.publicKey.asCell());
    return builder.build();
}

function dictValueParserTonTokenTransfer(): DictionaryValue<TonTokenTransfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTonTokenTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadTonTokenTransfer(src.loadRef().beginParse());
        }
    }
}

export type Mint = {
    $$type: 'Mint';
    amount: bigint;
    receiver: Address;
}

export function storeMint(src: Mint) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(4235234258, 32);
        b_0.storeInt(src.amount, 257);
        b_0.storeAddress(src.receiver);
    };
}

export function loadMint(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4235234258) { throw Error('Invalid prefix'); }
    let _amount = sc_0.loadIntBig(257);
    let _receiver = sc_0.loadAddress();
    return { $$type: 'Mint' as const, amount: _amount, receiver: _receiver };
}

function loadTupleMint(source: TupleReader) {
    let _amount = source.readBigNumber();
    let _receiver = source.readAddress();
    return { $$type: 'Mint' as const, amount: _amount, receiver: _receiver };
}

function loadGetterTupleMint(source: TupleReader) {
    let _amount = source.readBigNumber();
    let _receiver = source.readAddress();
    return { $$type: 'Mint' as const, amount: _amount, receiver: _receiver };
}

function storeTupleMint(source: Mint) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    builder.writeAddress(source.receiver);
    return builder.build();
}

function dictValueParserMint(): DictionaryValue<Mint> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMint(src)).endCell());
        },
        parse: (src) => {
            return loadMint(src.loadRef().beginParse());
        }
    }
}

export type TokenBurnNotification = {
    $$type: 'TokenBurnNotification';
    queryId: bigint;
    amount: bigint;
    owner: Address;
    response_destination: Address | null;
}

export function storeTokenBurnNotification(src: TokenBurnNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2078119902, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.response_destination);
    };
}

export function loadTokenBurnNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2078119902) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _owner = sc_0.loadAddress();
    let _response_destination = sc_0.loadMaybeAddress();
    return { $$type: 'TokenBurnNotification' as const, queryId: _queryId, amount: _amount, owner: _owner, response_destination: _response_destination };
}

function loadTupleTokenBurnNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _owner = source.readAddress();
    let _response_destination = source.readAddressOpt();
    return { $$type: 'TokenBurnNotification' as const, queryId: _queryId, amount: _amount, owner: _owner, response_destination: _response_destination };
}

function loadGetterTupleTokenBurnNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _owner = source.readAddress();
    let _response_destination = source.readAddressOpt();
    return { $$type: 'TokenBurnNotification' as const, queryId: _queryId, amount: _amount, owner: _owner, response_destination: _response_destination };
}

function storeTupleTokenBurnNotification(source: TokenBurnNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.response_destination);
    return builder.build();
}

function dictValueParserTokenBurnNotification(): DictionaryValue<TokenBurnNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTokenBurnNotification(src)).endCell());
        },
        parse: (src) => {
            return loadTokenBurnNotification(src.loadRef().beginParse());
        }
    }
}

export type AtomicTonVault$Data = {
    $$type: 'AtomicTonVault$Data';
    owner: Address;
    nonce: bigint;
    atomicDexAddr: Address;
}

export function storeAtomicTonVault$Data(src: AtomicTonVault$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeInt(src.nonce, 257);
        b_0.storeAddress(src.atomicDexAddr);
    };
}

export function loadAtomicTonVault$Data(slice: Slice) {
    let sc_0 = slice;
    let _owner = sc_0.loadAddress();
    let _nonce = sc_0.loadIntBig(257);
    let _atomicDexAddr = sc_0.loadAddress();
    return { $$type: 'AtomicTonVault$Data' as const, owner: _owner, nonce: _nonce, atomicDexAddr: _atomicDexAddr };
}

function loadTupleAtomicTonVault$Data(source: TupleReader) {
    let _owner = source.readAddress();
    let _nonce = source.readBigNumber();
    let _atomicDexAddr = source.readAddress();
    return { $$type: 'AtomicTonVault$Data' as const, owner: _owner, nonce: _nonce, atomicDexAddr: _atomicDexAddr };
}

function loadGetterTupleAtomicTonVault$Data(source: TupleReader) {
    let _owner = source.readAddress();
    let _nonce = source.readBigNumber();
    let _atomicDexAddr = source.readAddress();
    return { $$type: 'AtomicTonVault$Data' as const, owner: _owner, nonce: _nonce, atomicDexAddr: _atomicDexAddr };
}

function storeTupleAtomicTonVault$Data(source: AtomicTonVault$Data) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeNumber(source.nonce);
    builder.writeAddress(source.atomicDexAddr);
    return builder.build();
}

function dictValueParserAtomicTonVault$Data(): DictionaryValue<AtomicTonVault$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAtomicTonVault$Data(src)).endCell());
        },
        parse: (src) => {
            return loadAtomicTonVault$Data(src.loadRef().beginParse());
        }
    }
}

type AtomicTonVault_init_args = {
    $$type: 'AtomicTonVault_init_args';
    atomicDexAddress: Address;
    nonce: bigint;
}

function initAtomicTonVault_init_args(src: AtomicTonVault_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.atomicDexAddress);
        b_0.storeInt(src.nonce, 257);
    };
}

async function AtomicTonVault_init(atomicDexAddress: Address, nonce: bigint) {
    const __code = Cell.fromBase64('te6ccgECFAEAA4kAART/APSkE/S88sgLAQIBYgIDA3rQAdDTAwFxsKMB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiFRQUwNvBPhhAvhi2zxVEts88uCCEAQFAgEgCwwD5gGSMH/gcCHXScIflTAg1wsf3iCCEMrfimi6jpkw0x8BghDK34pouvLggdM/+gDUAdBDMGwT4CCCEKUYx4e64wKCEJRqmLa6jqfTHwGCEJRqmLa68uCB0z8BMcgBghCv+Q9XWMsfyz/J+EIBcG3bPH/gMHAGBwgApMj4QwHMfwHKAFUgWiDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFhKBAQHPAAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbJ7VQB5DKBL6UixwCz8vSCAOMtItcL/8MA8vSCANVX+EFvJBNfAyK+8vQgdPsCcIMG+EJANMhVIIIQjs/bFlAEyx9YINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8Wy//IWM8WyQHMySNVIH9VMG1t2zwwfwkBmDDTHwGCEKUYx4e68uCB+gD6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIEmwSggDrw/hCUkDHBfL0gEBYbX8EUDNtbds8MH8JATxtbSJus5lbIG7y0IBvIgGRMuIQJHADBIBCUCPbPDAJAcrIcQHKAVAHAcoAcAHKAlAFINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WUAP6AnABymgjbrORf5MkbrPilzMzAXABygDjDSFus5x/AcoAASBu8tCAAcyVMXABygDiyQH7CAoAmH8BygDIcAHKAHABygAkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDiJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4nABygACfwHKAALJWMwCEb4o7tnm2eNhjBANAgEgDg8AAiICEblsDbPNs8bDGBARABG4K+7UTQ0gABgBwO1E0NQB+GPSAAGOSPpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgBgQEB1wD6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIQzBsE+D4KNcLCoMJuvLgiRIACPgnbxABVvpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgBgQEB1wBZAtEB2zwTAAb4QgI=');
    const __system = Cell.fromBase64('te6cckECFgEAA5MAAQHAAQEFoPgvAgEU/wD0pBP0vPLICwMCAWIEDAN60AHQ0wMBcbCjAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhUUFMDbwT4YQL4Yts8VRLbPPLgghEFCwPmAZIwf+BwIddJwh+VMCDXCx/eIIIQyt+KaLqOmTDTHwGCEMrfimi68uCB0z/6ANQB0EMwbBPgIIIQpRjHh7rjAoIQlGqYtrqOp9MfAYIQlGqYtrry4IHTPwExyAGCEK/5D1dYyx/LP8n4QgFwbds8f+AwcAYHCAHkMoEvpSLHALPy9IIA4y0i1wv/wwDy9IIA1Vf4QW8kE18DIr7y9CB0+wJwgwb4QkA0yFUgghCOz9sWUATLH1gg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbL/8hYzxbJAczJI1Ugf1UwbW3bPDB/CQGYMNMfAYIQpRjHh7ry4IH6APpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgSbBKCAOvD+EJSQMcF8vSAQFhtfwRQM21t2zwwfwkBPG1tIm6zmVsgbvLQgG8iAZEy4hAkcAMEgEJQI9s8MAkByshxAcoBUAcBygBwAcoCUAUg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxZQA/oCcAHKaCNus5F/kyRus+KXMzMBcAHKAOMNIW6znH8BygABIG7y0IABzJUxcAHKAOLJAfsICgCYfwHKAMhwAcoAcAHKACRus51/AcoABCBu8tCAUATMljQDcAHKAOIkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDicAHKAAJ/AcoAAslYzACkyPhDAcx/AcoAVSBaINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WEoEBAc8AASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFsntVAIBIA0PAhG+KO7Z5tnjYYwRDgACIgIBIBAVAhG5bA2zzbPGwxgRFAHA7UTQ1AH4Y9IAAY5I+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAGBAQHXAPpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhDMGwT4Pgo1wsKgwm68uCJEgFW+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAGBAQHXAFkC0QHbPBMABvhCAgAI+CdvEAARuCvu1E0NIAAYoHKKWg==');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initAtomicTonVault_init_args({ $$type: 'AtomicTonVault_init_args', atomicDexAddress, nonce })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const AtomicTonVault_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack underflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    11: { message: `'Unknown' error` },
    12: { message: `Fatal error` },
    13: { message: `Out of gas error` },
    14: { message: `Virtualization error` },
    32: { message: `Action list is invalid` },
    33: { message: `Action list is too long` },
    34: { message: `Action is invalid or not supported` },
    35: { message: `Invalid source address in outbound message` },
    36: { message: `Invalid destination address in outbound message` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    39: { message: `Outbound message does not fit into a cell after rewriting` },
    40: { message: `Cannot process a message` },
    41: { message: `Library reference is null` },
    42: { message: `Library change action error` },
    43: { message: `Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree` },
    50: { message: `Account state size exceeded limits` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
    137: { message: `Masterchain support is not enabled for this contract` },
    12197: { message: `No Public Key` },
    54615: { message: `Insufficient balance` },
    58157: { message: `Invalid Public Key` },
    60355: { message: `AtomicVault: Unauthorized sender` },
}

const AtomicTonVault_types: ABIType[] = [
    { "name": "StateInit", "header": null, "fields": [{ "name": "code", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
    { "name": "StdAddress", "header": null, "fields": [{ "name": "workchain", "type": { "kind": "simple", "type": "int", "optional": false, "format": 8 } }, { "name": "address", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
    { "name": "VarAddress", "header": null, "fields": [{ "name": "workchain", "type": { "kind": "simple", "type": "int", "optional": false, "format": 32 } }, { "name": "address", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "Context", "header": null, "fields": [{ "name": "bounced", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "sender", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "raw", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "SendParameters", "header": null, "fields": [{ "name": "bounce", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "to", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "mode", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "body", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "code", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": true } }] },
    { "name": "Deploy", "header": 2490013878, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "DeployOk", "header": 2952335191, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "FactoryDeploy", "header": 1829761339, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "cashback", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "ChangeOwner", "header": 2174598809, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "newOwner", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "ChangeOwnerOk", "header": 846932810, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "newOwner", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "TokenNotification", "header": 1935855772, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "from", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "forwardPayload", "type": { "kind": "simple", "type": "slice", "optional": false, "format": "remainder" } }] },
    { "name": "AtomicDexWithdrawNotification", "header": 2769864583, "fields": [{ "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "to", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "UpdateAtomicDexAddress", "header": 2439694949, "fields": [{ "name": "newAtomicDexAddr", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "UpdateCustodyWalletAddress", "header": 321056099, "fields": [{ "name": "jettonWalletAddr", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "DepositNotificationInternal", "header": 2395986710, "fields": [{ "name": "sender", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "publicKey", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "JettonTransfer", "header": 260734629, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "destination", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "responseDestination", "type": { "kind": "simple", "type": "address", "optional": true } }, { "name": "customPayload", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "forwardTonAmount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "forwardPayload", "type": { "kind": "simple", "type": "slice", "optional": false, "format": "remainder" } }] },
    { "name": "LiquidateMemberAtomicVaultNotification", "header": 1387626523, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "publicKey", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "balance", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }] },
    { "name": "TonTokenTransfer", "header": 3403647592, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "publicKey", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "Mint", "header": 4235234258, "fields": [{ "name": "amount", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "receiver", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "TokenBurnNotification", "header": 2078119902, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "owner", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "response_destination", "type": { "kind": "simple", "type": "address", "optional": true } }] },
    { "name": "AtomicTonVault$Data", "header": null, "fields": [{ "name": "owner", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "nonce", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "atomicDexAddr", "type": { "kind": "simple", "type": "address", "optional": false } }] },
]

const AtomicTonVault_getters: ABIGetter[] = [
    { "name": "balance", "arguments": [], "returnType": { "kind": "simple", "type": "int", "optional": false, "format": 257 } },
    { "name": "owner", "arguments": [], "returnType": { "kind": "simple", "type": "address", "optional": false } },
]

export const AtomicTonVault_getterMapping: { [key: string]: string } = {
    'balance': 'getBalance',
    'owner': 'getOwner',
}

const AtomicTonVault_receivers: ABIReceiver[] = [
    { "receiver": "internal", "message": { "kind": "typed", "type": "TonTokenTransfer" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "AtomicDexWithdrawNotification" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "Deploy" } },
]

export class AtomicTonVault implements Contract {

    static async init(atomicDexAddress: Address, nonce: bigint) {
        return await AtomicTonVault_init(atomicDexAddress, nonce);
    }

    static async fromInit(atomicDexAddress: Address, nonce: bigint) {
        const init = await AtomicTonVault_init(atomicDexAddress, nonce);
        const address = contractAddress(0, init);
        return new AtomicTonVault(address, init);
    }

    static fromAddress(address: Address) {
        return new AtomicTonVault(address);
    }

    readonly address: Address;
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types: AtomicTonVault_types,
        getters: AtomicTonVault_getters,
        receivers: AtomicTonVault_receivers,
        errors: AtomicTonVault_errors,
    };

    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }

    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean | null | undefined }, message: TonTokenTransfer | AtomicDexWithdrawNotification | Deploy) {

        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TonTokenTransfer') {
            body = beginCell().store(storeTonTokenTransfer(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AtomicDexWithdrawNotification') {
            body = beginCell().store(storeAtomicDexWithdrawNotification(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }

        await provider.internal(via, { ...args, body: body });

    }

    async getBalance(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('balance', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }

    async getOwner(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('owner', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }

}