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

export type TokenNotification = {
    $$type: 'TokenNotification';
    queryId: bigint;
    amount: bigint;
    from: Address;
    forward_payload: Slice;
}

export function storeTokenNotification(src: TokenNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1935855772, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.from);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadTokenNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1935855772) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _from = sc_0.loadAddress();
    let _forward_payload = sc_0;
    return { $$type: 'TokenNotification' as const, queryId: _queryId, amount: _amount, from: _from, forward_payload: _forward_payload };
}

function loadTupleTokenNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _from = source.readAddress();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'TokenNotification' as const, queryId: _queryId, amount: _amount, from: _from, forward_payload: _forward_payload };
}

function loadGetterTupleTokenNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _from = source.readAddress();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'TokenNotification' as const, queryId: _queryId, amount: _amount, from: _from, forward_payload: _forward_payload };
}

function storeTupleTokenNotification(source: TokenNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.from);
    builder.writeSlice(source.forward_payload.asCell());
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
    forward_payload: Slice;
}

export function storeDepositNotificationInternal(src: DepositNotificationInternal) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(853477092, 32);
        b_0.storeAddress(src.sender);
        b_0.storeUint(src.amount, 256);
        b_0.storeRef(src.forward_payload.asCell());
    };
}

export function loadDepositNotificationInternal(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 853477092) { throw Error('Invalid prefix'); }
    let _sender = sc_0.loadAddress();
    let _amount = sc_0.loadUintBig(256);
    let _forward_payload = sc_0.loadRef().asSlice();
    return { $$type: 'DepositNotificationInternal' as const, sender: _sender, amount: _amount, forward_payload: _forward_payload };
}

function loadTupleDepositNotificationInternal(source: TupleReader) {
    let _sender = source.readAddress();
    let _amount = source.readBigNumber();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'DepositNotificationInternal' as const, sender: _sender, amount: _amount, forward_payload: _forward_payload };
}

function loadGetterTupleDepositNotificationInternal(source: TupleReader) {
    let _sender = source.readAddress();
    let _amount = source.readBigNumber();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'DepositNotificationInternal' as const, sender: _sender, amount: _amount, forward_payload: _forward_payload };
}

function storeTupleDepositNotificationInternal(source: DepositNotificationInternal) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.sender);
    builder.writeNumber(source.amount);
    builder.writeSlice(source.forward_payload.asCell());
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

export type UpdatePublicKey = {
    $$type: 'UpdatePublicKey';
    publicKey: bigint;
}

export function storeUpdatePublicKey(src: UpdatePublicKey) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3474072042, 32);
        b_0.storeUint(src.publicKey, 256);
    };
}

export function loadUpdatePublicKey(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3474072042) { throw Error('Invalid prefix'); }
    let _publicKey = sc_0.loadUintBig(256);
    return { $$type: 'UpdatePublicKey' as const, publicKey: _publicKey };
}

function loadTupleUpdatePublicKey(source: TupleReader) {
    let _publicKey = source.readBigNumber();
    return { $$type: 'UpdatePublicKey' as const, publicKey: _publicKey };
}

function loadGetterTupleUpdatePublicKey(source: TupleReader) {
    let _publicKey = source.readBigNumber();
    return { $$type: 'UpdatePublicKey' as const, publicKey: _publicKey };
}

function storeTupleUpdatePublicKey(source: UpdatePublicKey) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.publicKey);
    return builder.build();
}

function dictValueParserUpdatePublicKey(): DictionaryValue<UpdatePublicKey> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeUpdatePublicKey(src)).endCell());
        },
        parse: (src) => {
            return loadUpdatePublicKey(src.loadRef().beginParse());
        }
    }
}

export type AddAtomicVault = {
    $$type: 'AddAtomicVault';
    queryId: bigint;
    address: Address;
}

export function storeAddAtomicVault(src: AddAtomicVault) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2574308405, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.address);
    };
}

export function loadAddAtomicVault(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2574308405) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _address = sc_0.loadAddress();
    return { $$type: 'AddAtomicVault' as const, queryId: _queryId, address: _address };
}

function loadTupleAddAtomicVault(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _address = source.readAddress();
    return { $$type: 'AddAtomicVault' as const, queryId: _queryId, address: _address };
}

function loadGetterTupleAddAtomicVault(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _address = source.readAddress();
    return { $$type: 'AddAtomicVault' as const, queryId: _queryId, address: _address };
}

function storeTupleAddAtomicVault(source: AddAtomicVault) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.address);
    return builder.build();
}

function dictValueParserAddAtomicVault(): DictionaryValue<AddAtomicVault> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAddAtomicVault(src)).endCell());
        },
        parse: (src) => {
            return loadAddAtomicVault(src.loadRef().beginParse());
        }
    }
}

export type AddPool = {
    $$type: 'AddPool';
    queryId: bigint;
    curveType: bigint;
    atomicVault0: bigint;
    atomicVault1: bigint;
    feeNominator: bigint;
    feeDenominator: bigint;
}

export function storeAddPool(src: AddPool) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3926930871, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.curveType, 8);
        b_0.storeUint(src.atomicVault0, 4);
        b_0.storeUint(src.atomicVault1, 4);
        b_0.storeUint(src.feeNominator, 64);
        b_0.storeUint(src.feeDenominator, 64);
    };
}

export function loadAddPool(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3926930871) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _curveType = sc_0.loadUintBig(8);
    let _atomicVault0 = sc_0.loadUintBig(4);
    let _atomicVault1 = sc_0.loadUintBig(4);
    let _feeNominator = sc_0.loadUintBig(64);
    let _feeDenominator = sc_0.loadUintBig(64);
    return { $$type: 'AddPool' as const, queryId: _queryId, curveType: _curveType, atomicVault0: _atomicVault0, atomicVault1: _atomicVault1, feeNominator: _feeNominator, feeDenominator: _feeDenominator };
}

function loadTupleAddPool(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _curveType = source.readBigNumber();
    let _atomicVault0 = source.readBigNumber();
    let _atomicVault1 = source.readBigNumber();
    let _feeNominator = source.readBigNumber();
    let _feeDenominator = source.readBigNumber();
    return { $$type: 'AddPool' as const, queryId: _queryId, curveType: _curveType, atomicVault0: _atomicVault0, atomicVault1: _atomicVault1, feeNominator: _feeNominator, feeDenominator: _feeDenominator };
}

function loadGetterTupleAddPool(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _curveType = source.readBigNumber();
    let _atomicVault0 = source.readBigNumber();
    let _atomicVault1 = source.readBigNumber();
    let _feeNominator = source.readBigNumber();
    let _feeDenominator = source.readBigNumber();
    return { $$type: 'AddPool' as const, queryId: _queryId, curveType: _curveType, atomicVault0: _atomicVault0, atomicVault1: _atomicVault1, feeNominator: _feeNominator, feeDenominator: _feeDenominator };
}

function storeTupleAddPool(source: AddPool) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.curveType);
    builder.writeNumber(source.atomicVault0);
    builder.writeNumber(source.atomicVault1);
    builder.writeNumber(source.feeNominator);
    builder.writeNumber(source.feeDenominator);
    return builder.build();
}

function dictValueParserAddPool(): DictionaryValue<AddPool> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAddPool(src)).endCell());
        },
        parse: (src) => {
            return loadAddPool(src.loadRef().beginParse());
        }
    }
}

export type AddPoolLiquidity = {
    $$type: 'AddPoolLiquidity';
    queryId: bigint;
    atomicVault0: bigint;
    atomicVault1: bigint;
    amount0: bigint;
    amount1: bigint;
}

export function storeAddPoolLiquidity(src: AddPoolLiquidity) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1360054237, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.atomicVault0, 4);
        b_0.storeUint(src.atomicVault1, 4);
        b_0.storeUint(src.amount0, 64);
        b_0.storeUint(src.amount1, 64);
    };
}

export function loadAddPoolLiquidity(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1360054237) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _atomicVault0 = sc_0.loadUintBig(4);
    let _atomicVault1 = sc_0.loadUintBig(4);
    let _amount0 = sc_0.loadUintBig(64);
    let _amount1 = sc_0.loadUintBig(64);
    return { $$type: 'AddPoolLiquidity' as const, queryId: _queryId, atomicVault0: _atomicVault0, atomicVault1: _atomicVault1, amount0: _amount0, amount1: _amount1 };
}

function loadTupleAddPoolLiquidity(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _atomicVault0 = source.readBigNumber();
    let _atomicVault1 = source.readBigNumber();
    let _amount0 = source.readBigNumber();
    let _amount1 = source.readBigNumber();
    return { $$type: 'AddPoolLiquidity' as const, queryId: _queryId, atomicVault0: _atomicVault0, atomicVault1: _atomicVault1, amount0: _amount0, amount1: _amount1 };
}

function loadGetterTupleAddPoolLiquidity(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _atomicVault0 = source.readBigNumber();
    let _atomicVault1 = source.readBigNumber();
    let _amount0 = source.readBigNumber();
    let _amount1 = source.readBigNumber();
    return { $$type: 'AddPoolLiquidity' as const, queryId: _queryId, atomicVault0: _atomicVault0, atomicVault1: _atomicVault1, amount0: _amount0, amount1: _amount1 };
}

function storeTupleAddPoolLiquidity(source: AddPoolLiquidity) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.atomicVault0);
    builder.writeNumber(source.atomicVault1);
    builder.writeNumber(source.amount0);
    builder.writeNumber(source.amount1);
    return builder.build();
}

function dictValueParserAddPoolLiquidity(): DictionaryValue<AddPoolLiquidity> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAddPoolLiquidity(src)).endCell());
        },
        parse: (src) => {
            return loadAddPoolLiquidity(src.loadRef().beginParse());
        }
    }
}

export type RemovePoolLiquidity = {
    $$type: 'RemovePoolLiquidity';
    queryId: bigint;
}

export function storeRemovePoolLiquidity(src: RemovePoolLiquidity) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2134549698, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadRemovePoolLiquidity(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2134549698) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'RemovePoolLiquidity' as const, queryId: _queryId };
}

function loadTupleRemovePoolLiquidity(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'RemovePoolLiquidity' as const, queryId: _queryId };
}

function loadGetterTupleRemovePoolLiquidity(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'RemovePoolLiquidity' as const, queryId: _queryId };
}

function storeTupleRemovePoolLiquidity(source: RemovePoolLiquidity) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserRemovePoolLiquidity(): DictionaryValue<RemovePoolLiquidity> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRemovePoolLiquidity(src)).endCell());
        },
        parse: (src) => {
            return loadRemovePoolLiquidity(src.loadRef().beginParse());
        }
    }
}

export type DepositNotification = {
    $$type: 'DepositNotification';
    atomicVaultId: bigint;
    publicKey: bigint;
    amount: bigint;
}

export function storeDepositNotification(src: DepositNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(368270786, 32);
        b_0.storeUint(src.atomicVaultId, 7);
        b_0.storeUint(src.publicKey, 256);
        b_0.storeUint(src.amount, 64);
    };
}

export function loadDepositNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 368270786) { throw Error('Invalid prefix'); }
    let _atomicVaultId = sc_0.loadUintBig(7);
    let _publicKey = sc_0.loadUintBig(256);
    let _amount = sc_0.loadUintBig(64);
    return { $$type: 'DepositNotification' as const, atomicVaultId: _atomicVaultId, publicKey: _publicKey, amount: _amount };
}

function loadTupleDepositNotification(source: TupleReader) {
    let _atomicVaultId = source.readBigNumber();
    let _publicKey = source.readBigNumber();
    let _amount = source.readBigNumber();
    return { $$type: 'DepositNotification' as const, atomicVaultId: _atomicVaultId, publicKey: _publicKey, amount: _amount };
}

function loadGetterTupleDepositNotification(source: TupleReader) {
    let _atomicVaultId = source.readBigNumber();
    let _publicKey = source.readBigNumber();
    let _amount = source.readBigNumber();
    return { $$type: 'DepositNotification' as const, atomicVaultId: _atomicVaultId, publicKey: _publicKey, amount: _amount };
}

function storeTupleDepositNotification(source: DepositNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.atomicVaultId);
    builder.writeNumber(source.publicKey);
    builder.writeNumber(source.amount);
    return builder.build();
}

function dictValueParserDepositNotification(): DictionaryValue<DepositNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDepositNotification(src)).endCell());
        },
        parse: (src) => {
            return loadDepositNotification(src.loadRef().beginParse());
        }
    }
}

export type DepositToken = {
    $$type: 'DepositToken';
    amount: bigint;
}

export function storeDepositToken(src: DepositToken) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(914629092, 32);
        b_0.storeUint(src.amount, 64);
    };
}

export function loadDepositToken(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 914629092) { throw Error('Invalid prefix'); }
    let _amount = sc_0.loadUintBig(64);
    return { $$type: 'DepositToken' as const, amount: _amount };
}

function loadTupleDepositToken(source: TupleReader) {
    let _amount = source.readBigNumber();
    return { $$type: 'DepositToken' as const, amount: _amount };
}

function loadGetterTupleDepositToken(source: TupleReader) {
    let _amount = source.readBigNumber();
    return { $$type: 'DepositToken' as const, amount: _amount };
}

function storeTupleDepositToken(source: DepositToken) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    return builder.build();
}

function dictValueParserDepositToken(): DictionaryValue<DepositToken> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDepositToken(src)).endCell());
        },
        parse: (src) => {
            return loadDepositToken(src.loadRef().beginParse());
        }
    }
}

export type TopUpGasMember = {
    $$type: 'TopUpGasMember';
    queryId: bigint;
    publicKey: bigint;
}

export function storeTopUpGasMember(src: TopUpGasMember) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(930215976, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.publicKey, 256);
    };
}

export function loadTopUpGasMember(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 930215976) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _publicKey = sc_0.loadUintBig(256);
    return { $$type: 'TopUpGasMember' as const, queryId: _queryId, publicKey: _publicKey };
}

function loadTupleTopUpGasMember(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _publicKey = source.readBigNumber();
    return { $$type: 'TopUpGasMember' as const, queryId: _queryId, publicKey: _publicKey };
}

function loadGetterTupleTopUpGasMember(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _publicKey = source.readBigNumber();
    return { $$type: 'TopUpGasMember' as const, queryId: _queryId, publicKey: _publicKey };
}

function storeTupleTopUpGasMember(source: TopUpGasMember) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.publicKey);
    return builder.build();
}

function dictValueParserTopUpGasMember(): DictionaryValue<TopUpGasMember> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTopUpGasMember(src)).endCell());
        },
        parse: (src) => {
            return loadTopUpGasMember(src.loadRef().beginParse());
        }
    }
}

export type Withdraw = {
    $$type: 'Withdraw';
    queryId: bigint;
    publicKey: bigint;
    amount: bigint;
    signature: Slice;
    atomicVaultId: bigint;
}

export function storeWithdraw(src: Withdraw) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(856879030, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.publicKey, 256);
        b_0.storeUint(src.amount, 64);
        b_0.storeRef(src.signature.asCell());
        b_0.storeUint(src.atomicVaultId, 8);
    };
}

export function loadWithdraw(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 856879030) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _publicKey = sc_0.loadUintBig(256);
    let _amount = sc_0.loadUintBig(64);
    let _signature = sc_0.loadRef().asSlice();
    let _atomicVaultId = sc_0.loadUintBig(8);
    return { $$type: 'Withdraw' as const, queryId: _queryId, publicKey: _publicKey, amount: _amount, signature: _signature, atomicVaultId: _atomicVaultId };
}

function loadTupleWithdraw(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _publicKey = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _signature = source.readCell().asSlice();
    let _atomicVaultId = source.readBigNumber();
    return { $$type: 'Withdraw' as const, queryId: _queryId, publicKey: _publicKey, amount: _amount, signature: _signature, atomicVaultId: _atomicVaultId };
}

function loadGetterTupleWithdraw(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _publicKey = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _signature = source.readCell().asSlice();
    let _atomicVaultId = source.readBigNumber();
    return { $$type: 'Withdraw' as const, queryId: _queryId, publicKey: _publicKey, amount: _amount, signature: _signature, atomicVaultId: _atomicVaultId };
}

function storeTupleWithdraw(source: Withdraw) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.publicKey);
    builder.writeNumber(source.amount);
    builder.writeSlice(source.signature.asCell());
    builder.writeNumber(source.atomicVaultId);
    return builder.build();
}

function dictValueParserWithdraw(): DictionaryValue<Withdraw> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeWithdraw(src)).endCell());
        },
        parse: (src) => {
            return loadWithdraw(src.loadRef().beginParse());
        }
    }
}

export type LiquidateMember = {
    $$type: 'LiquidateMember';
    queryId: bigint;
    publicKey: bigint;
    atomicVaultId: bigint;
    amount: bigint;
}

export function storeLiquidateMember(src: LiquidateMember) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(901583315, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.publicKey, 256);
        b_0.storeUint(src.atomicVaultId, 7);
        b_0.storeUint(src.amount, 64);
    };
}

export function loadLiquidateMember(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 901583315) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _publicKey = sc_0.loadUintBig(256);
    let _atomicVaultId = sc_0.loadUintBig(7);
    let _amount = sc_0.loadUintBig(64);
    return { $$type: 'LiquidateMember' as const, queryId: _queryId, publicKey: _publicKey, atomicVaultId: _atomicVaultId, amount: _amount };
}

function loadTupleLiquidateMember(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _publicKey = source.readBigNumber();
    let _atomicVaultId = source.readBigNumber();
    let _amount = source.readBigNumber();
    return { $$type: 'LiquidateMember' as const, queryId: _queryId, publicKey: _publicKey, atomicVaultId: _atomicVaultId, amount: _amount };
}

function loadGetterTupleLiquidateMember(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _publicKey = source.readBigNumber();
    let _atomicVaultId = source.readBigNumber();
    let _amount = source.readBigNumber();
    return { $$type: 'LiquidateMember' as const, queryId: _queryId, publicKey: _publicKey, atomicVaultId: _atomicVaultId, amount: _amount };
}

function storeTupleLiquidateMember(source: LiquidateMember) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.publicKey);
    builder.writeNumber(source.atomicVaultId);
    builder.writeNumber(source.amount);
    return builder.build();
}

function dictValueParserLiquidateMember(): DictionaryValue<LiquidateMember> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeLiquidateMember(src)).endCell());
        },
        parse: (src) => {
            return loadLiquidateMember(src.loadRef().beginParse());
        }
    }
}

export type SwapOrder = {
    $$type: 'SwapOrder';
    atomicVault0: bigint;
    atomicVault1: bigint;
    expectedIn: bigint;
    expectedOut: bigint;
}

export function storeSwapOrder(src: SwapOrder) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2078147303, 32);
        b_0.storeUint(src.atomicVault0, 7);
        b_0.storeUint(src.atomicVault1, 7);
        b_0.storeUint(src.expectedIn, 64);
        b_0.storeUint(src.expectedOut, 64);
    };
}

export function loadSwapOrder(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2078147303) { throw Error('Invalid prefix'); }
    let _atomicVault0 = sc_0.loadUintBig(7);
    let _atomicVault1 = sc_0.loadUintBig(7);
    let _expectedIn = sc_0.loadUintBig(64);
    let _expectedOut = sc_0.loadUintBig(64);
    return { $$type: 'SwapOrder' as const, atomicVault0: _atomicVault0, atomicVault1: _atomicVault1, expectedIn: _expectedIn, expectedOut: _expectedOut };
}

function loadTupleSwapOrder(source: TupleReader) {
    let _atomicVault0 = source.readBigNumber();
    let _atomicVault1 = source.readBigNumber();
    let _expectedIn = source.readBigNumber();
    let _expectedOut = source.readBigNumber();
    return { $$type: 'SwapOrder' as const, atomicVault0: _atomicVault0, atomicVault1: _atomicVault1, expectedIn: _expectedIn, expectedOut: _expectedOut };
}

function loadGetterTupleSwapOrder(source: TupleReader) {
    let _atomicVault0 = source.readBigNumber();
    let _atomicVault1 = source.readBigNumber();
    let _expectedIn = source.readBigNumber();
    let _expectedOut = source.readBigNumber();
    return { $$type: 'SwapOrder' as const, atomicVault0: _atomicVault0, atomicVault1: _atomicVault1, expectedIn: _expectedIn, expectedOut: _expectedOut };
}

function storeTupleSwapOrder(source: SwapOrder) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.atomicVault0);
    builder.writeNumber(source.atomicVault1);
    builder.writeNumber(source.expectedIn);
    builder.writeNumber(source.expectedOut);
    return builder.build();
}

function dictValueParserSwapOrder(): DictionaryValue<SwapOrder> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSwapOrder(src)).endCell());
        },
        parse: (src) => {
            return loadSwapOrder(src.loadRef().beginParse());
        }
    }
}

export type MultiSwapInternal = {
    $$type: 'MultiSwapInternal';
    queryId: bigint;
    publicKey: bigint;
    signature: Slice;
    orders: Slice;
    validUntil: bigint;
}

export function storeMultiSwapInternal(src: MultiSwapInternal) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(899562728, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.publicKey, 256);
        b_0.storeRef(src.signature.asCell());
        b_0.storeRef(src.orders.asCell());
        b_0.storeUint(src.validUntil, 64);
    };
}

export function loadMultiSwapInternal(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 899562728) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _publicKey = sc_0.loadUintBig(256);
    let _signature = sc_0.loadRef().asSlice();
    let _orders = sc_0.loadRef().asSlice();
    let _validUntil = sc_0.loadUintBig(64);
    return { $$type: 'MultiSwapInternal' as const, queryId: _queryId, publicKey: _publicKey, signature: _signature, orders: _orders, validUntil: _validUntil };
}

function loadTupleMultiSwapInternal(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _publicKey = source.readBigNumber();
    let _signature = source.readCell().asSlice();
    let _orders = source.readCell().asSlice();
    let _validUntil = source.readBigNumber();
    return { $$type: 'MultiSwapInternal' as const, queryId: _queryId, publicKey: _publicKey, signature: _signature, orders: _orders, validUntil: _validUntil };
}

function loadGetterTupleMultiSwapInternal(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _publicKey = source.readBigNumber();
    let _signature = source.readCell().asSlice();
    let _orders = source.readCell().asSlice();
    let _validUntil = source.readBigNumber();
    return { $$type: 'MultiSwapInternal' as const, queryId: _queryId, publicKey: _publicKey, signature: _signature, orders: _orders, validUntil: _validUntil };
}

function storeTupleMultiSwapInternal(source: MultiSwapInternal) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.publicKey);
    builder.writeSlice(source.signature.asCell());
    builder.writeSlice(source.orders.asCell());
    builder.writeNumber(source.validUntil);
    return builder.build();
}

function dictValueParserMultiSwapInternal(): DictionaryValue<MultiSwapInternal> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMultiSwapInternal(src)).endCell());
        },
        parse: (src) => {
            return loadMultiSwapInternal(src.loadRef().beginParse());
        }
    }
}

export type MultiSwapBackend = {
    $$type: 'MultiSwapBackend';
    queryId: bigint;
    publicKey: bigint;
    signature: Slice;
    orders: Slice;
    validUntil: bigint;
}

export function storeMultiSwapBackend(src: MultiSwapBackend) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1787647764, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.publicKey, 256);
        b_0.storeRef(src.signature.asCell());
        b_0.storeRef(src.orders.asCell());
        b_0.storeUint(src.validUntil, 64);
    };
}

export function loadMultiSwapBackend(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1787647764) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _publicKey = sc_0.loadUintBig(256);
    let _signature = sc_0.loadRef().asSlice();
    let _orders = sc_0.loadRef().asSlice();
    let _validUntil = sc_0.loadUintBig(64);
    return { $$type: 'MultiSwapBackend' as const, queryId: _queryId, publicKey: _publicKey, signature: _signature, orders: _orders, validUntil: _validUntil };
}

function loadTupleMultiSwapBackend(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _publicKey = source.readBigNumber();
    let _signature = source.readCell().asSlice();
    let _orders = source.readCell().asSlice();
    let _validUntil = source.readBigNumber();
    return { $$type: 'MultiSwapBackend' as const, queryId: _queryId, publicKey: _publicKey, signature: _signature, orders: _orders, validUntil: _validUntil };
}

function loadGetterTupleMultiSwapBackend(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _publicKey = source.readBigNumber();
    let _signature = source.readCell().asSlice();
    let _orders = source.readCell().asSlice();
    let _validUntil = source.readBigNumber();
    return { $$type: 'MultiSwapBackend' as const, queryId: _queryId, publicKey: _publicKey, signature: _signature, orders: _orders, validUntil: _validUntil };
}

function storeTupleMultiSwapBackend(source: MultiSwapBackend) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.publicKey);
    builder.writeSlice(source.signature.asCell());
    builder.writeSlice(source.orders.asCell());
    builder.writeNumber(source.validUntil);
    return builder.build();
}

function dictValueParserMultiSwapBackend(): DictionaryValue<MultiSwapBackend> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMultiSwapBackend(src)).endCell());
        },
        parse: (src) => {
            return loadMultiSwapBackend(src.loadRef().beginParse());
        }
    }
}

export type GenerateSwapHash = {
    $$type: 'GenerateSwapHash';
    seq: bigint;
    order: SwapOrder;
    validUntil: bigint;
}

export function storeGenerateSwapHash(src: GenerateSwapHash) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2777786029, 32);
        b_0.storeUint(src.seq, 32);
        b_0.store(storeSwapOrder(src.order));
        b_0.storeUint(src.validUntil, 64);
    };
}

export function loadGenerateSwapHash(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2777786029) { throw Error('Invalid prefix'); }
    let _seq = sc_0.loadUintBig(32);
    let _order = loadSwapOrder(sc_0);
    let _validUntil = sc_0.loadUintBig(64);
    return { $$type: 'GenerateSwapHash' as const, seq: _seq, order: _order, validUntil: _validUntil };
}

function loadTupleGenerateSwapHash(source: TupleReader) {
    let _seq = source.readBigNumber();
    const _order = loadTupleSwapOrder(source);
    let _validUntil = source.readBigNumber();
    return { $$type: 'GenerateSwapHash' as const, seq: _seq, order: _order, validUntil: _validUntil };
}

function loadGetterTupleGenerateSwapHash(source: TupleReader) {
    let _seq = source.readBigNumber();
    const _order = loadGetterTupleSwapOrder(source);
    let _validUntil = source.readBigNumber();
    return { $$type: 'GenerateSwapHash' as const, seq: _seq, order: _order, validUntil: _validUntil };
}

function storeTupleGenerateSwapHash(source: GenerateSwapHash) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.seq);
    builder.writeTuple(storeTupleSwapOrder(source.order));
    builder.writeNumber(source.validUntil);
    return builder.build();
}

function dictValueParserGenerateSwapHash(): DictionaryValue<GenerateSwapHash> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeGenerateSwapHash(src)).endCell());
        },
        parse: (src) => {
            return loadGenerateSwapHash(src.loadRef().beginParse());
        }
    }
}

export type GenerateMultiSwapHash = {
    $$type: 'GenerateMultiSwapHash';
    seq: bigint;
    orders: Slice;
    validUntil: bigint;
}

export function storeGenerateMultiSwapHash(src: GenerateMultiSwapHash) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2518665663, 32);
        b_0.storeUint(src.seq, 32);
        b_0.storeRef(src.orders.asCell());
        b_0.storeUint(src.validUntil, 64);
    };
}

export function loadGenerateMultiSwapHash(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2518665663) { throw Error('Invalid prefix'); }
    let _seq = sc_0.loadUintBig(32);
    let _orders = sc_0.loadRef().asSlice();
    let _validUntil = sc_0.loadUintBig(64);
    return { $$type: 'GenerateMultiSwapHash' as const, seq: _seq, orders: _orders, validUntil: _validUntil };
}

function loadTupleGenerateMultiSwapHash(source: TupleReader) {
    let _seq = source.readBigNumber();
    let _orders = source.readCell().asSlice();
    let _validUntil = source.readBigNumber();
    return { $$type: 'GenerateMultiSwapHash' as const, seq: _seq, orders: _orders, validUntil: _validUntil };
}

function loadGetterTupleGenerateMultiSwapHash(source: TupleReader) {
    let _seq = source.readBigNumber();
    let _orders = source.readCell().asSlice();
    let _validUntil = source.readBigNumber();
    return { $$type: 'GenerateMultiSwapHash' as const, seq: _seq, orders: _orders, validUntil: _validUntil };
}

function storeTupleGenerateMultiSwapHash(source: GenerateMultiSwapHash) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.seq);
    builder.writeSlice(source.orders.asCell());
    builder.writeNumber(source.validUntil);
    return builder.build();
}

function dictValueParserGenerateMultiSwapHash(): DictionaryValue<GenerateMultiSwapHash> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeGenerateMultiSwapHash(src)).endCell());
        },
        parse: (src) => {
            return loadGenerateMultiSwapHash(src.loadRef().beginParse());
        }
    }
}

export type TopUp = {
    $$type: 'TopUp';
}

export function storeTopUp(src: TopUp) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(652854853, 32);
    };
}

export function loadTopUp(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 652854853) { throw Error('Invalid prefix'); }
    return { $$type: 'TopUp' as const };
}

function loadTupleTopUp(source: TupleReader) {
    return { $$type: 'TopUp' as const };
}

function loadGetterTupleTopUp(source: TupleReader) {
    return { $$type: 'TopUp' as const };
}

function storeTupleTopUp(source: TopUp) {
    let builder = new TupleBuilder();
    return builder.build();
}

function dictValueParserTopUp(): DictionaryValue<TopUp> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTopUp(src)).endCell());
        },
        parse: (src) => {
            return loadTopUp(src.loadRef().beginParse());
        }
    }
}

export type AtomicVault = {
    $$type: 'AtomicVault';
    address: Address;
    activeMembers: bigint;
    liquidable: bigint;
}

export function storeAtomicVault(src: AtomicVault) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.address);
        b_0.storeUint(src.activeMembers, 64);
        b_0.storeUint(src.liquidable, 96);
    };
}

export function loadAtomicVault(slice: Slice) {
    let sc_0 = slice;
    let _address = sc_0.loadAddress();
    let _activeMembers = sc_0.loadUintBig(64);
    let _liquidable = sc_0.loadUintBig(96);
    return { $$type: 'AtomicVault' as const, address: _address, activeMembers: _activeMembers, liquidable: _liquidable };
}

function loadTupleAtomicVault(source: TupleReader) {
    let _address = source.readAddress();
    let _activeMembers = source.readBigNumber();
    let _liquidable = source.readBigNumber();
    return { $$type: 'AtomicVault' as const, address: _address, activeMembers: _activeMembers, liquidable: _liquidable };
}

function loadGetterTupleAtomicVault(source: TupleReader) {
    let _address = source.readAddress();
    let _activeMembers = source.readBigNumber();
    let _liquidable = source.readBigNumber();
    return { $$type: 'AtomicVault' as const, address: _address, activeMembers: _activeMembers, liquidable: _liquidable };
}

function storeTupleAtomicVault(source: AtomicVault) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.address);
    builder.writeNumber(source.activeMembers);
    builder.writeNumber(source.liquidable);
    return builder.build();
}

function dictValueParserAtomicVault(): DictionaryValue<AtomicVault> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAtomicVault(src)).endCell());
        },
        parse: (src) => {
            return loadAtomicVault(src.loadRef().beginParse());
        }
    }
}

export type AtomicPool = {
    $$type: 'AtomicPool';
    lpTokenSupply: bigint;
    curveType: bigint;
    reserve0: bigint;
    reserve1: bigint;
    feeNominator: bigint;
    feeDenominator: bigint;
    collectedFees0: bigint;
    collectedFees1: bigint;
}

export function storeAtomicPool(src: AtomicPool) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.lpTokenSupply, 64);
        b_0.storeUint(src.curveType, 8);
        b_0.storeUint(src.reserve0, 128);
        b_0.storeUint(src.reserve1, 128);
        b_0.storeUint(src.feeNominator, 32);
        b_0.storeUint(src.feeDenominator, 32);
        b_0.storeUint(src.collectedFees0, 128);
        b_0.storeUint(src.collectedFees1, 128);
    };
}

export function loadAtomicPool(slice: Slice) {
    let sc_0 = slice;
    let _lpTokenSupply = sc_0.loadUintBig(64);
    let _curveType = sc_0.loadUintBig(8);
    let _reserve0 = sc_0.loadUintBig(128);
    let _reserve1 = sc_0.loadUintBig(128);
    let _feeNominator = sc_0.loadUintBig(32);
    let _feeDenominator = sc_0.loadUintBig(32);
    let _collectedFees0 = sc_0.loadUintBig(128);
    let _collectedFees1 = sc_0.loadUintBig(128);
    return { $$type: 'AtomicPool' as const, lpTokenSupply: _lpTokenSupply, curveType: _curveType, reserve0: _reserve0, reserve1: _reserve1, feeNominator: _feeNominator, feeDenominator: _feeDenominator, collectedFees0: _collectedFees0, collectedFees1: _collectedFees1 };
}

function loadTupleAtomicPool(source: TupleReader) {
    let _lpTokenSupply = source.readBigNumber();
    let _curveType = source.readBigNumber();
    let _reserve0 = source.readBigNumber();
    let _reserve1 = source.readBigNumber();
    let _feeNominator = source.readBigNumber();
    let _feeDenominator = source.readBigNumber();
    let _collectedFees0 = source.readBigNumber();
    let _collectedFees1 = source.readBigNumber();
    return { $$type: 'AtomicPool' as const, lpTokenSupply: _lpTokenSupply, curveType: _curveType, reserve0: _reserve0, reserve1: _reserve1, feeNominator: _feeNominator, feeDenominator: _feeDenominator, collectedFees0: _collectedFees0, collectedFees1: _collectedFees1 };
}

function loadGetterTupleAtomicPool(source: TupleReader) {
    let _lpTokenSupply = source.readBigNumber();
    let _curveType = source.readBigNumber();
    let _reserve0 = source.readBigNumber();
    let _reserve1 = source.readBigNumber();
    let _feeNominator = source.readBigNumber();
    let _feeDenominator = source.readBigNumber();
    let _collectedFees0 = source.readBigNumber();
    let _collectedFees1 = source.readBigNumber();
    return { $$type: 'AtomicPool' as const, lpTokenSupply: _lpTokenSupply, curveType: _curveType, reserve0: _reserve0, reserve1: _reserve1, feeNominator: _feeNominator, feeDenominator: _feeDenominator, collectedFees0: _collectedFees0, collectedFees1: _collectedFees1 };
}

function storeTupleAtomicPool(source: AtomicPool) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.lpTokenSupply);
    builder.writeNumber(source.curveType);
    builder.writeNumber(source.reserve0);
    builder.writeNumber(source.reserve1);
    builder.writeNumber(source.feeNominator);
    builder.writeNumber(source.feeDenominator);
    builder.writeNumber(source.collectedFees0);
    builder.writeNumber(source.collectedFees1);
    return builder.build();
}

function dictValueParserAtomicPool(): DictionaryValue<AtomicPool> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAtomicPool(src)).endCell());
        },
        parse: (src) => {
            return loadAtomicPool(src.loadRef().beginParse());
        }
    }
}

export type AtomicMemberRecord = {
    $$type: 'AtomicMemberRecord';
    id: bigint;
    seq: bigint;
    address: Address;
    balance0: bigint;
    balance1: bigint;
    balance2: bigint;
    balance3: bigint;
    balance4: bigint;
    balance5: bigint;
    balance6: bigint;
    balance7: bigint;
    balance8: bigint;
    balance9: bigint;
    balance10: bigint;
    balance11: bigint;
    balance12: bigint;
    balance13: bigint;
    balance14: bigint;
    unused: bigint;
}

export function storeAtomicMemberRecord(src: AtomicMemberRecord) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.id, 16);
        b_0.storeUint(src.seq, 32);
        b_0.storeAddress(src.address);
        b_0.storeUint(src.balance0, 64);
        b_0.storeUint(src.balance1, 64);
        b_0.storeUint(src.balance2, 64);
        b_0.storeUint(src.balance3, 64);
        b_0.storeUint(src.balance4, 64);
        b_0.storeUint(src.balance5, 64);
        b_0.storeUint(src.balance6, 64);
        b_0.storeUint(src.balance7, 64);
        b_0.storeUint(src.balance8, 64);
        b_0.storeUint(src.balance9, 64);
        b_0.storeUint(src.balance10, 64);
        let b_1 = new Builder();
        b_1.storeUint(src.balance11, 64);
        b_1.storeUint(src.balance12, 64);
        b_1.storeUint(src.balance13, 64);
        b_1.storeUint(src.balance14, 64);
        b_1.storeUint(src.unused, 15);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadAtomicMemberRecord(slice: Slice) {
    let sc_0 = slice;
    let _id = sc_0.loadUintBig(16);
    let _seq = sc_0.loadUintBig(32);
    let _address = sc_0.loadAddress();
    let _balance0 = sc_0.loadUintBig(64);
    let _balance1 = sc_0.loadUintBig(64);
    let _balance2 = sc_0.loadUintBig(64);
    let _balance3 = sc_0.loadUintBig(64);
    let _balance4 = sc_0.loadUintBig(64);
    let _balance5 = sc_0.loadUintBig(64);
    let _balance6 = sc_0.loadUintBig(64);
    let _balance7 = sc_0.loadUintBig(64);
    let _balance8 = sc_0.loadUintBig(64);
    let _balance9 = sc_0.loadUintBig(64);
    let _balance10 = sc_0.loadUintBig(64);
    let sc_1 = sc_0.loadRef().beginParse();
    let _balance11 = sc_1.loadUintBig(64);
    let _balance12 = sc_1.loadUintBig(64);
    let _balance13 = sc_1.loadUintBig(64);
    let _balance14 = sc_1.loadUintBig(64);
    let _unused = sc_1.loadUintBig(15);
    return { $$type: 'AtomicMemberRecord' as const, id: _id, seq: _seq, address: _address, balance0: _balance0, balance1: _balance1, balance2: _balance2, balance3: _balance3, balance4: _balance4, balance5: _balance5, balance6: _balance6, balance7: _balance7, balance8: _balance8, balance9: _balance9, balance10: _balance10, balance11: _balance11, balance12: _balance12, balance13: _balance13, balance14: _balance14, unused: _unused };
}

function loadTupleAtomicMemberRecord(source: TupleReader) {
    let _id = source.readBigNumber();
    let _seq = source.readBigNumber();
    let _address = source.readAddress();
    let _balance0 = source.readBigNumber();
    let _balance1 = source.readBigNumber();
    let _balance2 = source.readBigNumber();
    let _balance3 = source.readBigNumber();
    let _balance4 = source.readBigNumber();
    let _balance5 = source.readBigNumber();
    let _balance6 = source.readBigNumber();
    let _balance7 = source.readBigNumber();
    let _balance8 = source.readBigNumber();
    let _balance9 = source.readBigNumber();
    let _balance10 = source.readBigNumber();
    source = source.readTuple();
    let _balance11 = source.readBigNumber();
    let _balance12 = source.readBigNumber();
    let _balance13 = source.readBigNumber();
    let _balance14 = source.readBigNumber();
    let _unused = source.readBigNumber();
    return { $$type: 'AtomicMemberRecord' as const, id: _id, seq: _seq, address: _address, balance0: _balance0, balance1: _balance1, balance2: _balance2, balance3: _balance3, balance4: _balance4, balance5: _balance5, balance6: _balance6, balance7: _balance7, balance8: _balance8, balance9: _balance9, balance10: _balance10, balance11: _balance11, balance12: _balance12, balance13: _balance13, balance14: _balance14, unused: _unused };
}

function loadGetterTupleAtomicMemberRecord(source: TupleReader) {
    let _id = source.readBigNumber();
    let _seq = source.readBigNumber();
    let _address = source.readAddress();
    let _balance0 = source.readBigNumber();
    let _balance1 = source.readBigNumber();
    let _balance2 = source.readBigNumber();
    let _balance3 = source.readBigNumber();
    let _balance4 = source.readBigNumber();
    let _balance5 = source.readBigNumber();
    let _balance6 = source.readBigNumber();
    let _balance7 = source.readBigNumber();
    let _balance8 = source.readBigNumber();
    let _balance9 = source.readBigNumber();
    let _balance10 = source.readBigNumber();
    let _balance11 = source.readBigNumber();
    let _balance12 = source.readBigNumber();
    let _balance13 = source.readBigNumber();
    let _balance14 = source.readBigNumber();
    let _unused = source.readBigNumber();
    return { $$type: 'AtomicMemberRecord' as const, id: _id, seq: _seq, address: _address, balance0: _balance0, balance1: _balance1, balance2: _balance2, balance3: _balance3, balance4: _balance4, balance5: _balance5, balance6: _balance6, balance7: _balance7, balance8: _balance8, balance9: _balance9, balance10: _balance10, balance11: _balance11, balance12: _balance12, balance13: _balance13, balance14: _balance14, unused: _unused };
}

function storeTupleAtomicMemberRecord(source: AtomicMemberRecord) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.id);
    builder.writeNumber(source.seq);
    builder.writeAddress(source.address);
    builder.writeNumber(source.balance0);
    builder.writeNumber(source.balance1);
    builder.writeNumber(source.balance2);
    builder.writeNumber(source.balance3);
    builder.writeNumber(source.balance4);
    builder.writeNumber(source.balance5);
    builder.writeNumber(source.balance6);
    builder.writeNumber(source.balance7);
    builder.writeNumber(source.balance8);
    builder.writeNumber(source.balance9);
    builder.writeNumber(source.balance10);
    builder.writeNumber(source.balance11);
    builder.writeNumber(source.balance12);
    builder.writeNumber(source.balance13);
    builder.writeNumber(source.balance14);
    builder.writeNumber(source.unused);
    return builder.build();
}

function dictValueParserAtomicMemberRecord(): DictionaryValue<AtomicMemberRecord> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAtomicMemberRecord(src)).endCell());
        },
        parse: (src) => {
            return loadAtomicMemberRecord(src.loadRef().beginParse());
        }
    }
}

export type AtomicDex$Data = {
    $$type: 'AtomicDex$Data';
    registeredAtomicVaults: bigint;
    atomicVaults: Dictionary<bigint, AtomicVault>;
    atomicPools: Dictionary<bigint, AtomicPool>;
    memberCursor: bigint;
    registeredMembers: bigint;
    atomicMembers: Dictionary<bigint, AtomicMemberRecord>;
    pub: bigint;
    owner: Address;
}

export function storeAtomicDex$Data(src: AtomicDex$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.registeredAtomicVaults, 4);
        b_0.storeDict(src.atomicVaults, Dictionary.Keys.BigInt(257), dictValueParserAtomicVault());
        b_0.storeDict(src.atomicPools, Dictionary.Keys.BigInt(257), dictValueParserAtomicPool());
        b_0.storeInt(src.memberCursor, 257);
        b_0.storeInt(src.registeredMembers, 257);
        let b_1 = new Builder();
        b_1.storeDict(src.atomicMembers, Dictionary.Keys.BigInt(257), dictValueParserAtomicMemberRecord());
        b_1.storeUint(src.pub, 256);
        b_1.storeAddress(src.owner);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadAtomicDex$Data(slice: Slice) {
    let sc_0 = slice;
    let _registeredAtomicVaults = sc_0.loadUintBig(4);
    let _atomicVaults = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserAtomicVault(), sc_0);
    let _atomicPools = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserAtomicPool(), sc_0);
    let _memberCursor = sc_0.loadIntBig(257);
    let _registeredMembers = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _atomicMembers = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserAtomicMemberRecord(), sc_1);
    let _pub = sc_1.loadUintBig(256);
    let _owner = sc_1.loadAddress();
    return { $$type: 'AtomicDex$Data' as const, registeredAtomicVaults: _registeredAtomicVaults, atomicVaults: _atomicVaults, atomicPools: _atomicPools, memberCursor: _memberCursor, registeredMembers: _registeredMembers, atomicMembers: _atomicMembers, pub: _pub, owner: _owner };
}

function loadTupleAtomicDex$Data(source: TupleReader) {
    let _registeredAtomicVaults = source.readBigNumber();
    let _atomicVaults = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAtomicVault(), source.readCellOpt());
    let _atomicPools = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAtomicPool(), source.readCellOpt());
    let _memberCursor = source.readBigNumber();
    let _registeredMembers = source.readBigNumber();
    let _atomicMembers = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAtomicMemberRecord(), source.readCellOpt());
    let _pub = source.readBigNumber();
    let _owner = source.readAddress();
    return { $$type: 'AtomicDex$Data' as const, registeredAtomicVaults: _registeredAtomicVaults, atomicVaults: _atomicVaults, atomicPools: _atomicPools, memberCursor: _memberCursor, registeredMembers: _registeredMembers, atomicMembers: _atomicMembers, pub: _pub, owner: _owner };
}

function loadGetterTupleAtomicDex$Data(source: TupleReader) {
    let _registeredAtomicVaults = source.readBigNumber();
    let _atomicVaults = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAtomicVault(), source.readCellOpt());
    let _atomicPools = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAtomicPool(), source.readCellOpt());
    let _memberCursor = source.readBigNumber();
    let _registeredMembers = source.readBigNumber();
    let _atomicMembers = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAtomicMemberRecord(), source.readCellOpt());
    let _pub = source.readBigNumber();
    let _owner = source.readAddress();
    return { $$type: 'AtomicDex$Data' as const, registeredAtomicVaults: _registeredAtomicVaults, atomicVaults: _atomicVaults, atomicPools: _atomicPools, memberCursor: _memberCursor, registeredMembers: _registeredMembers, atomicMembers: _atomicMembers, pub: _pub, owner: _owner };
}

function storeTupleAtomicDex$Data(source: AtomicDex$Data) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.registeredAtomicVaults);
    builder.writeCell(source.atomicVaults.size > 0 ? beginCell().storeDictDirect(source.atomicVaults, Dictionary.Keys.BigInt(257), dictValueParserAtomicVault()).endCell() : null);
    builder.writeCell(source.atomicPools.size > 0 ? beginCell().storeDictDirect(source.atomicPools, Dictionary.Keys.BigInt(257), dictValueParserAtomicPool()).endCell() : null);
    builder.writeNumber(source.memberCursor);
    builder.writeNumber(source.registeredMembers);
    builder.writeCell(source.atomicMembers.size > 0 ? beginCell().storeDictDirect(source.atomicMembers, Dictionary.Keys.BigInt(257), dictValueParserAtomicMemberRecord()).endCell() : null);
    builder.writeNumber(source.pub);
    builder.writeAddress(source.owner);
    return builder.build();
}

function dictValueParserAtomicDex$Data(): DictionaryValue<AtomicDex$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAtomicDex$Data(src)).endCell());
        },
        parse: (src) => {
            return loadAtomicDex$Data(src.loadRef().beginParse());
        }
    }
}

type AtomicDex_init_args = {
    $$type: 'AtomicDex_init_args';
}

function initAtomicDex_init_args(src: AtomicDex_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
    };
}

async function AtomicDex_init() {
    const __code = Cell.fromBase64('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');
    const __system = Cell.fromBase64('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');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initAtomicDex_init_args({ $$type: 'AtomicDex_init_args' })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const AtomicDex_errors: { [key: number]: { message: string } } = {
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
    1039: { message: `Not implemented` },
    1283: { message: `No forward payload` },
    2893: { message: `Invalid fee params received` },
    4082: { message: `Unknown member` },
    9182: { message: `Invalid balance to deposit` },
    9603: { message: `Not registered` },
    13295: { message: `Authentication failed` },
    15373: { message: `Failed expectedOut condition` },
    16513: { message: `Pool should contain different atomic wallets` },
    17520: { message: `Unknown atomic vault address` },
    18508: { message: `Unknown wallet atomicVault1` },
    19954: { message: `Referred atomicVault0 out of range` },
    20298: { message: `Unknown pool` },
    21101: { message: `Already registered` },
    22546: { message: `Pool is already present` },
    22565: { message: `Not enough balance` },
    23545: { message: `Unknown wallet atomicVault0` },
    25145: { message: `Invalid orders binary size` },
    26483: { message: `Unknown curve received` },
    31926: { message: `Too many atomicVaults registered` },
    36245: { message: `Swap request is expired` },
    36754: { message: `Unknown atomic wallet id` },
    42629: { message: `Referred atomicVault1 out of range` },
    54999: { message: `Already registered atomicVault` },
}

const AtomicDex_types: ABIType[] = [
    { "name": "StateInit", "header": null, "fields": [{ "name": "code", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
    { "name": "StdAddress", "header": null, "fields": [{ "name": "workchain", "type": { "kind": "simple", "type": "int", "optional": false, "format": 8 } }, { "name": "address", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
    { "name": "VarAddress", "header": null, "fields": [{ "name": "workchain", "type": { "kind": "simple", "type": "int", "optional": false, "format": 32 } }, { "name": "address", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "Context", "header": null, "fields": [{ "name": "bounced", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "sender", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "raw", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "SendParameters", "header": null, "fields": [{ "name": "bounce", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "to", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "mode", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "body", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "code", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": true } }] },
    { "name": "ChangeOwner", "header": 2174598809, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "newOwner", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "ChangeOwnerOk", "header": 846932810, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "newOwner", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "Deploy", "header": 2490013878, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "DeployOk", "header": 2952335191, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "FactoryDeploy", "header": 1829761339, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "cashback", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "TokenNotification", "header": 1935855772, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "from", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "forward_payload", "type": { "kind": "simple", "type": "slice", "optional": false, "format": "remainder" } }] },
    { "name": "AtomicDexWithdrawNotification", "header": 2769864583, "fields": [{ "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "to", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "UpdateAtomicDexAddress", "header": 2439694949, "fields": [{ "name": "newAtomicDexAddr", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "UpdateCustodyWalletAddress", "header": 321056099, "fields": [{ "name": "jettonWalletAddr", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "DepositNotificationInternal", "header": 853477092, "fields": [{ "name": "sender", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "forward_payload", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "JettonTransfer", "header": 260734629, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "destination", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "responseDestination", "type": { "kind": "simple", "type": "address", "optional": true } }, { "name": "customPayload", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "forwardTonAmount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "forwardPayload", "type": { "kind": "simple", "type": "slice", "optional": false, "format": "remainder" } }] },
    { "name": "LiquidateMemberAtomicVaultNotification", "header": 1387626523, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "publicKey", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "balance", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }] },
    { "name": "UpdatePublicKey", "header": 3474072042, "fields": [{ "name": "publicKey", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
    { "name": "AddAtomicVault", "header": 2574308405, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "address", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "AddPool", "header": 3926930871, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "curveType", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 8 } }, { "name": "atomicVault0", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 4 } }, { "name": "atomicVault1", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 4 } }, { "name": "feeNominator", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "feeDenominator", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "AddPoolLiquidity", "header": 1360054237, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "atomicVault0", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 4 } }, { "name": "atomicVault1", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 4 } }, { "name": "amount0", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "amount1", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "RemovePoolLiquidity", "header": 2134549698, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "DepositNotification", "header": 368270786, "fields": [{ "name": "atomicVaultId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 7 } }, { "name": "publicKey", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "DepositToken", "header": 914629092, "fields": [{ "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "TopUpGasMember", "header": 930215976, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "publicKey", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
    { "name": "Withdraw", "header": 856879030, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "publicKey", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "signature", "type": { "kind": "simple", "type": "slice", "optional": false } }, { "name": "atomicVaultId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 8 } }] },
    { "name": "LiquidateMember", "header": 901583315, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "publicKey", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "atomicVaultId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 7 } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "SwapOrder", "header": 2078147303, "fields": [{ "name": "atomicVault0", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 7 } }, { "name": "atomicVault1", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 7 } }, { "name": "expectedIn", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "expectedOut", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "MultiSwapInternal", "header": 899562728, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "publicKey", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "signature", "type": { "kind": "simple", "type": "slice", "optional": false } }, { "name": "orders", "type": { "kind": "simple", "type": "slice", "optional": false } }, { "name": "validUntil", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "MultiSwapBackend", "header": 1787647764, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "publicKey", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "signature", "type": { "kind": "simple", "type": "slice", "optional": false } }, { "name": "orders", "type": { "kind": "simple", "type": "slice", "optional": false } }, { "name": "validUntil", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "GenerateSwapHash", "header": 2777786029, "fields": [{ "name": "seq", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "order", "type": { "kind": "simple", "type": "SwapOrder", "optional": false } }, { "name": "validUntil", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "GenerateMultiSwapHash", "header": 2518665663, "fields": [{ "name": "seq", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "orders", "type": { "kind": "simple", "type": "slice", "optional": false } }, { "name": "validUntil", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "TopUp", "header": 652854853, "fields": [] },
    { "name": "AtomicVault", "header": null, "fields": [{ "name": "address", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "activeMembers", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "liquidable", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 96 } }] },
    { "name": "AtomicPool", "header": null, "fields": [{ "name": "lpTokenSupply", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "curveType", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 8 } }, { "name": "reserve0", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 128 } }, { "name": "reserve1", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 128 } }, { "name": "feeNominator", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "feeDenominator", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "collectedFees0", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 128 } }, { "name": "collectedFees1", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 128 } }] },
    { "name": "AtomicMemberRecord", "header": null, "fields": [{ "name": "id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 16 } }, { "name": "seq", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "address", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "balance0", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance1", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance2", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance3", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance4", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance5", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance6", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance7", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance8", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance9", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance10", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance11", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance12", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance13", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance14", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "unused", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 15 } }] },
    { "name": "AtomicDex$Data", "header": null, "fields": [{ "name": "registeredAtomicVaults", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 4 } }, { "name": "atomicVaults", "type": { "kind": "dict", "key": "int", "value": "AtomicVault", "valueFormat": "ref" } }, { "name": "atomicPools", "type": { "kind": "dict", "key": "int", "value": "AtomicPool", "valueFormat": "ref" } }, { "name": "memberCursor", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "registeredMembers", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "atomicMembers", "type": { "kind": "dict", "key": "int", "value": "AtomicMemberRecord", "valueFormat": "ref" } }, { "name": "pub", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "owner", "type": { "kind": "simple", "type": "address", "optional": false } }] },
]

const AtomicDex_getters: ABIGetter[] = [
    { "name": "multiSwapHash", "arguments": [{ "name": "msg", "type": { "kind": "simple", "type": "GenerateMultiSwapHash", "optional": false } }], "returnType": { "kind": "simple", "type": "int", "optional": false, "format": 257 } },
    { "name": "atomicVaults", "arguments": [], "returnType": { "kind": "dict", "key": "int", "value": "AtomicVault", "valueFormat": "ref" } },
    { "name": "atomicVault", "arguments": [{ "name": "atomicVaultId", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }], "returnType": { "kind": "simple", "type": "AtomicVault", "optional": true } },
    { "name": "atomicVaultFromAddress", "arguments": [{ "name": "vaultAddress", "type": { "kind": "simple", "type": "address", "optional": false } }], "returnType": { "kind": "simple", "type": "AtomicVault", "optional": true } },
    { "name": "atomicPools", "arguments": [], "returnType": { "kind": "dict", "key": "int", "value": "AtomicPool", "valueFormat": "ref" } },
    { "name": "atomicMemberRecord", "arguments": [{ "name": "member", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }], "returnType": { "kind": "simple", "type": "AtomicMemberRecord", "optional": true } },
    { "name": "owner", "arguments": [], "returnType": { "kind": "simple", "type": "address", "optional": false } },
]

export const AtomicDex_getterMapping: { [key: string]: string } = {
    'multiSwapHash': 'getMultiSwapHash',
    'atomicVaults': 'getAtomicVaults',
    'atomicVault': 'getAtomicVault',
    'atomicVaultFromAddress': 'getAtomicVaultFromAddress',
    'atomicPools': 'getAtomicPools',
    'atomicMemberRecord': 'getAtomicMemberRecord',
    'owner': 'getOwner',
}

const AtomicDex_receivers: ABIReceiver[] = [
    { "receiver": "internal", "message": { "kind": "typed", "type": "TopUp" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "AddAtomicVault" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "AddPool" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "AddPoolLiquidity" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "RemovePoolLiquidity" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "DepositNotification" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "DepositNotificationInternal" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "TopUpGasMember" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "LiquidateMember" } },
    { "receiver": "external", "message": { "kind": "typed", "type": "MultiSwapInternal" } },
    { "receiver": "external", "message": { "kind": "typed", "type": "MultiSwapBackend" } },
    { "receiver": "external", "message": { "kind": "typed", "type": "Withdraw" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "Deploy" } },
]

export class AtomicDex implements Contract {

    static async init() {
        return await AtomicDex_init();
    }

    static async fromInit() {
        const init = await AtomicDex_init();
        const address = contractAddress(0, init);
        return new AtomicDex(address, init);
    }

    static fromAddress(address: Address) {
        return new AtomicDex(address);
    }

    readonly address: Address;
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types: AtomicDex_types,
        getters: AtomicDex_getters,
        receivers: AtomicDex_receivers,
        errors: AtomicDex_errors,
    };

    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }

    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean | null | undefined }, message: TopUp | AddAtomicVault | AddPool | AddPoolLiquidity | RemovePoolLiquidity | DepositNotification | DepositNotificationInternal | TopUpGasMember | LiquidateMember | Deploy) {

        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TopUp') {
            body = beginCell().store(storeTopUp(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AddAtomicVault') {
            body = beginCell().store(storeAddAtomicVault(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AddPool') {
            body = beginCell().store(storeAddPool(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AddPoolLiquidity') {
            body = beginCell().store(storeAddPoolLiquidity(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'RemovePoolLiquidity') {
            body = beginCell().store(storeRemovePoolLiquidity(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'DepositNotification') {
            body = beginCell().store(storeDepositNotification(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'DepositNotificationInternal') {
            body = beginCell().store(storeDepositNotificationInternal(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TopUpGasMember') {
            body = beginCell().store(storeTopUpGasMember(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'LiquidateMember') {
            body = beginCell().store(storeLiquidateMember(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }

        await provider.internal(via, { ...args, body: body });

    }

    async sendExternal(provider: ContractProvider, message: MultiSwapInternal | MultiSwapBackend | Withdraw) {

        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'MultiSwapInternal') {
            body = beginCell().store(storeMultiSwapInternal(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'MultiSwapBackend') {
            body = beginCell().store(storeMultiSwapBackend(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Withdraw') {
            body = beginCell().store(storeWithdraw(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }

        await provider.external(body);

    }

    async getMultiSwapHash(provider: ContractProvider, msg: GenerateMultiSwapHash) {
        let builder = new TupleBuilder();
        builder.writeTuple(storeTupleGenerateMultiSwapHash(msg));
        let source = (await provider.get('multiSwapHash', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }

    async getAtomicVaults(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('atomicVaults', builder.build())).stack;
        let result = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAtomicVault(), source.readCellOpt());
        return result;
    }

    async getAtomicVault(provider: ContractProvider, atomicVaultId: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(atomicVaultId);
        let source = (await provider.get('atomicVault', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleAtomicVault(result_p) : null;
        return result;
    }

    async getAtomicVaultFromAddress(provider: ContractProvider, vaultAddress: Address) {
        let builder = new TupleBuilder();
        builder.writeAddress(vaultAddress);
        let source = (await provider.get('atomicVaultFromAddress', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleAtomicVault(result_p) : null;
        return result;
    }

    async getAtomicPools(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('atomicPools', builder.build())).stack;
        let result = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAtomicPool(), source.readCellOpt());
        return result;
    }

    async getAtomicMemberRecord(provider: ContractProvider, member: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(member);
        let source = (await provider.get('atomicMemberRecord', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleAtomicMemberRecord(result_p) : null;
        return result;
    }

    async getOwner(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('owner', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }

}