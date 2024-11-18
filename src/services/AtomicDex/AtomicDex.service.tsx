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

export type AddAtomicWallet = {
    $$type: 'AddAtomicWallet';
    queryId: bigint;
    address: Address;
}

export function storeAddAtomicWallet(src: AddAtomicWallet) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2855416128, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.address);
    };
}

export function loadAddAtomicWallet(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2855416128) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _address = sc_0.loadAddress();
    return { $$type: 'AddAtomicWallet' as const, queryId: _queryId, address: _address };
}

function loadTupleAddAtomicWallet(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _address = source.readAddress();
    return { $$type: 'AddAtomicWallet' as const, queryId: _queryId, address: _address };
}

function loadGetterTupleAddAtomicWallet(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _address = source.readAddress();
    return { $$type: 'AddAtomicWallet' as const, queryId: _queryId, address: _address };
}

function storeTupleAddAtomicWallet(source: AddAtomicWallet) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.address);
    return builder.build();
}

function dictValueParserAddAtomicWallet(): DictionaryValue<AddAtomicWallet> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAddAtomicWallet(src)).endCell());
        },
        parse: (src) => {
            return loadAddAtomicWallet(src.loadRef().beginParse());
        }
    }
}

export type AddPool = {
    $$type: 'AddPool';
    queryId: bigint;
    curveType: bigint;
    atomicWallet0: bigint;
    atomicWallet1: bigint;
    feeNominator: bigint;
    feeDenominator: bigint;
}

export function storeAddPool(src: AddPool) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3189586146, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.curveType, 8);
        b_0.storeUint(src.atomicWallet0, 4);
        b_0.storeUint(src.atomicWallet1, 4);
        b_0.storeUint(src.feeNominator, 64);
        b_0.storeUint(src.feeDenominator, 64);
    };
}

export function loadAddPool(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3189586146) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _curveType = sc_0.loadUintBig(8);
    let _atomicWallet0 = sc_0.loadUintBig(4);
    let _atomicWallet1 = sc_0.loadUintBig(4);
    let _feeNominator = sc_0.loadUintBig(64);
    let _feeDenominator = sc_0.loadUintBig(64);
    return { $$type: 'AddPool' as const, queryId: _queryId, curveType: _curveType, atomicWallet0: _atomicWallet0, atomicWallet1: _atomicWallet1, feeNominator: _feeNominator, feeDenominator: _feeDenominator };
}

function loadTupleAddPool(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _curveType = source.readBigNumber();
    let _atomicWallet0 = source.readBigNumber();
    let _atomicWallet1 = source.readBigNumber();
    let _feeNominator = source.readBigNumber();
    let _feeDenominator = source.readBigNumber();
    return { $$type: 'AddPool' as const, queryId: _queryId, curveType: _curveType, atomicWallet0: _atomicWallet0, atomicWallet1: _atomicWallet1, feeNominator: _feeNominator, feeDenominator: _feeDenominator };
}

function loadGetterTupleAddPool(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _curveType = source.readBigNumber();
    let _atomicWallet0 = source.readBigNumber();
    let _atomicWallet1 = source.readBigNumber();
    let _feeNominator = source.readBigNumber();
    let _feeDenominator = source.readBigNumber();
    return { $$type: 'AddPool' as const, queryId: _queryId, curveType: _curveType, atomicWallet0: _atomicWallet0, atomicWallet1: _atomicWallet1, feeNominator: _feeNominator, feeDenominator: _feeDenominator };
}

function storeTupleAddPool(source: AddPool) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.curveType);
    builder.writeNumber(source.atomicWallet0);
    builder.writeNumber(source.atomicWallet1);
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
    atomicWallet0: bigint;
    atomicWallet1: bigint;
    amount0: bigint;
    amount1: bigint;
}

export function storeAddPoolLiquidity(src: AddPoolLiquidity) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1788615815, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.atomicWallet0, 4);
        b_0.storeUint(src.atomicWallet1, 4);
        b_0.storeUint(src.amount0, 64);
        b_0.storeUint(src.amount1, 64);
    };
}

export function loadAddPoolLiquidity(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1788615815) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _atomicWallet0 = sc_0.loadUintBig(4);
    let _atomicWallet1 = sc_0.loadUintBig(4);
    let _amount0 = sc_0.loadUintBig(64);
    let _amount1 = sc_0.loadUintBig(64);
    return { $$type: 'AddPoolLiquidity' as const, queryId: _queryId, atomicWallet0: _atomicWallet0, atomicWallet1: _atomicWallet1, amount0: _amount0, amount1: _amount1 };
}

function loadTupleAddPoolLiquidity(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _atomicWallet0 = source.readBigNumber();
    let _atomicWallet1 = source.readBigNumber();
    let _amount0 = source.readBigNumber();
    let _amount1 = source.readBigNumber();
    return { $$type: 'AddPoolLiquidity' as const, queryId: _queryId, atomicWallet0: _atomicWallet0, atomicWallet1: _atomicWallet1, amount0: _amount0, amount1: _amount1 };
}

function loadGetterTupleAddPoolLiquidity(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _atomicWallet0 = source.readBigNumber();
    let _atomicWallet1 = source.readBigNumber();
    let _amount0 = source.readBigNumber();
    let _amount1 = source.readBigNumber();
    return { $$type: 'AddPoolLiquidity' as const, queryId: _queryId, atomicWallet0: _atomicWallet0, atomicWallet1: _atomicWallet1, amount0: _amount0, amount1: _amount1 };
}

function storeTupleAddPoolLiquidity(source: AddPoolLiquidity) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.atomicWallet0);
    builder.writeNumber(source.atomicWallet1);
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

export type JoinMember = {
    $$type: 'JoinMember';
    queryId: bigint;
    eviction: Dictionary<number, bigint>;
    atomicWalletId: bigint;
    publicKey: bigint;
    seq: bigint;
    amount: bigint;
}

export function storeJoinMember(src: JoinMember) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3288498465, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeDict(src.eviction, Dictionary.Keys.Int(16), Dictionary.Values.BigInt(257));
        b_0.storeUint(src.atomicWalletId, 7);
        b_0.storeUint(src.publicKey, 256);
        b_0.storeUint(src.seq, 64);
        b_0.storeUint(src.amount, 64);
    };
}

export function loadJoinMember(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3288498465) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _eviction = Dictionary.load(Dictionary.Keys.Int(16), Dictionary.Values.BigInt(257), sc_0);
    let _atomicWalletId = sc_0.loadUintBig(7);
    let _publicKey = sc_0.loadUintBig(256);
    let _seq = sc_0.loadUintBig(64);
    let _amount = sc_0.loadUintBig(64);
    return { $$type: 'JoinMember' as const, queryId: _queryId, eviction: _eviction, atomicWalletId: _atomicWalletId, publicKey: _publicKey, seq: _seq, amount: _amount };
}

function loadTupleJoinMember(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _eviction = Dictionary.loadDirect(Dictionary.Keys.Int(16), Dictionary.Values.BigInt(257), source.readCellOpt());
    let _atomicWalletId = source.readBigNumber();
    let _publicKey = source.readBigNumber();
    let _seq = source.readBigNumber();
    let _amount = source.readBigNumber();
    return { $$type: 'JoinMember' as const, queryId: _queryId, eviction: _eviction, atomicWalletId: _atomicWalletId, publicKey: _publicKey, seq: _seq, amount: _amount };
}

function loadGetterTupleJoinMember(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _eviction = Dictionary.loadDirect(Dictionary.Keys.Int(16), Dictionary.Values.BigInt(257), source.readCellOpt());
    let _atomicWalletId = source.readBigNumber();
    let _publicKey = source.readBigNumber();
    let _seq = source.readBigNumber();
    let _amount = source.readBigNumber();
    return { $$type: 'JoinMember' as const, queryId: _queryId, eviction: _eviction, atomicWalletId: _atomicWalletId, publicKey: _publicKey, seq: _seq, amount: _amount };
}

function storeTupleJoinMember(source: JoinMember) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeCell(source.eviction.size > 0 ? beginCell().storeDictDirect(source.eviction, Dictionary.Keys.Int(16), Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeNumber(source.atomicWalletId);
    builder.writeNumber(source.publicKey);
    builder.writeNumber(source.seq);
    builder.writeNumber(source.amount);
    return builder.build();
}

function dictValueParserJoinMember(): DictionaryValue<JoinMember> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJoinMember(src)).endCell());
        },
        parse: (src) => {
            return loadJoinMember(src.loadRef().beginParse());
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

export type LiquidateMember = {
    $$type: 'LiquidateMember';
    queryId: bigint;
    publicKey: bigint;
    atomicWalletId: bigint;
    amount: bigint;
}

export function storeLiquidateMember(src: LiquidateMember) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2725139430, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.publicKey, 256);
        b_0.storeUint(src.atomicWalletId, 7);
        b_0.storeUint(src.amount, 64);
    };
}

export function loadLiquidateMember(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2725139430) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _publicKey = sc_0.loadUintBig(256);
    let _atomicWalletId = sc_0.loadUintBig(7);
    let _amount = sc_0.loadUintBig(64);
    return { $$type: 'LiquidateMember' as const, queryId: _queryId, publicKey: _publicKey, atomicWalletId: _atomicWalletId, amount: _amount };
}

function loadTupleLiquidateMember(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _publicKey = source.readBigNumber();
    let _atomicWalletId = source.readBigNumber();
    let _amount = source.readBigNumber();
    return { $$type: 'LiquidateMember' as const, queryId: _queryId, publicKey: _publicKey, atomicWalletId: _atomicWalletId, amount: _amount };
}

function loadGetterTupleLiquidateMember(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _publicKey = source.readBigNumber();
    let _atomicWalletId = source.readBigNumber();
    let _amount = source.readBigNumber();
    return { $$type: 'LiquidateMember' as const, queryId: _queryId, publicKey: _publicKey, atomicWalletId: _atomicWalletId, amount: _amount };
}

function storeTupleLiquidateMember(source: LiquidateMember) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.publicKey);
    builder.writeNumber(source.atomicWalletId);
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

export type LiquidateMemberAtomicWalletNotification = {
    $$type: 'LiquidateMemberAtomicWalletNotification';
    queryId: bigint;
    publicKey: bigint;
    balance: bigint;
}

export function storeLiquidateMemberAtomicWalletNotification(src: LiquidateMemberAtomicWalletNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2068225744, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.publicKey, 256);
        b_0.storeCoins(src.balance);
    };
}

export function loadLiquidateMemberAtomicWalletNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2068225744) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _publicKey = sc_0.loadUintBig(256);
    let _balance = sc_0.loadCoins();
    return { $$type: 'LiquidateMemberAtomicWalletNotification' as const, queryId: _queryId, publicKey: _publicKey, balance: _balance };
}

function loadTupleLiquidateMemberAtomicWalletNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _publicKey = source.readBigNumber();
    let _balance = source.readBigNumber();
    return { $$type: 'LiquidateMemberAtomicWalletNotification' as const, queryId: _queryId, publicKey: _publicKey, balance: _balance };
}

function loadGetterTupleLiquidateMemberAtomicWalletNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _publicKey = source.readBigNumber();
    let _balance = source.readBigNumber();
    return { $$type: 'LiquidateMemberAtomicWalletNotification' as const, queryId: _queryId, publicKey: _publicKey, balance: _balance };
}

function storeTupleLiquidateMemberAtomicWalletNotification(source: LiquidateMemberAtomicWalletNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.publicKey);
    builder.writeNumber(source.balance);
    return builder.build();
}

function dictValueParserLiquidateMemberAtomicWalletNotification(): DictionaryValue<LiquidateMemberAtomicWalletNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeLiquidateMemberAtomicWalletNotification(src)).endCell());
        },
        parse: (src) => {
            return loadLiquidateMemberAtomicWalletNotification(src.loadRef().beginParse());
        }
    }
}

export type SwapOrder = {
    $$type: 'SwapOrder';
    atomicWallet0: bigint;
    atomicWallet1: bigint;
    expectedIn: bigint;
    expectedOut: bigint;
}

export function storeSwapOrder(src: SwapOrder) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(317368512, 32);
        b_0.storeUint(src.atomicWallet0, 7);
        b_0.storeUint(src.atomicWallet1, 7);
        b_0.storeUint(src.expectedIn, 64);
        b_0.storeUint(src.expectedOut, 64);
    };
}

export function loadSwapOrder(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 317368512) { throw Error('Invalid prefix'); }
    let _atomicWallet0 = sc_0.loadUintBig(7);
    let _atomicWallet1 = sc_0.loadUintBig(7);
    let _expectedIn = sc_0.loadUintBig(64);
    let _expectedOut = sc_0.loadUintBig(64);
    return { $$type: 'SwapOrder' as const, atomicWallet0: _atomicWallet0, atomicWallet1: _atomicWallet1, expectedIn: _expectedIn, expectedOut: _expectedOut };
}

function loadTupleSwapOrder(source: TupleReader) {
    let _atomicWallet0 = source.readBigNumber();
    let _atomicWallet1 = source.readBigNumber();
    let _expectedIn = source.readBigNumber();
    let _expectedOut = source.readBigNumber();
    return { $$type: 'SwapOrder' as const, atomicWallet0: _atomicWallet0, atomicWallet1: _atomicWallet1, expectedIn: _expectedIn, expectedOut: _expectedOut };
}

function loadGetterTupleSwapOrder(source: TupleReader) {
    let _atomicWallet0 = source.readBigNumber();
    let _atomicWallet1 = source.readBigNumber();
    let _expectedIn = source.readBigNumber();
    let _expectedOut = source.readBigNumber();
    return { $$type: 'SwapOrder' as const, atomicWallet0: _atomicWallet0, atomicWallet1: _atomicWallet1, expectedIn: _expectedIn, expectedOut: _expectedOut };
}

function storeTupleSwapOrder(source: SwapOrder) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.atomicWallet0);
    builder.writeNumber(source.atomicWallet1);
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

export type MultiSwap = {
    $$type: 'MultiSwap';
    queryId: bigint;
    publicKey: bigint;
    signature: Slice;
    orders: Slice;
    validUntil: bigint;
}

export function storeMultiSwap(src: MultiSwap) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1283989889, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.publicKey, 256);
        b_0.storeRef(src.signature.asCell());
        b_0.storeRef(src.orders.asCell());
        b_0.storeUint(src.validUntil, 64);
    };
}

export function loadMultiSwap(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1283989889) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _publicKey = sc_0.loadUintBig(256);
    let _signature = sc_0.loadRef().asSlice();
    let _orders = sc_0.loadRef().asSlice();
    let _validUntil = sc_0.loadUintBig(64);
    return { $$type: 'MultiSwap' as const, queryId: _queryId, publicKey: _publicKey, signature: _signature, orders: _orders, validUntil: _validUntil };
}

function loadTupleMultiSwap(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _publicKey = source.readBigNumber();
    let _signature = source.readCell().asSlice();
    let _orders = source.readCell().asSlice();
    let _validUntil = source.readBigNumber();
    return { $$type: 'MultiSwap' as const, queryId: _queryId, publicKey: _publicKey, signature: _signature, orders: _orders, validUntil: _validUntil };
}

function loadGetterTupleMultiSwap(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _publicKey = source.readBigNumber();
    let _signature = source.readCell().asSlice();
    let _orders = source.readCell().asSlice();
    let _validUntil = source.readBigNumber();
    return { $$type: 'MultiSwap' as const, queryId: _queryId, publicKey: _publicKey, signature: _signature, orders: _orders, validUntil: _validUntil };
}

function storeTupleMultiSwap(source: MultiSwap) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.publicKey);
    builder.writeSlice(source.signature.asCell());
    builder.writeSlice(source.orders.asCell());
    builder.writeNumber(source.validUntil);
    return builder.build();
}

function dictValueParserMultiSwap(): DictionaryValue<MultiSwap> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMultiSwap(src)).endCell());
        },
        parse: (src) => {
            return loadMultiSwap(src.loadRef().beginParse());
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
        b_0.storeUint(2411880372, 32);
        b_0.storeUint(src.seq, 32);
        b_0.store(storeSwapOrder(src.order));
        b_0.storeUint(src.validUntil, 64);
    };
}

export function loadGenerateSwapHash(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2411880372) { throw Error('Invalid prefix'); }
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

export type AtomicWallet = {
    $$type: 'AtomicWallet';
    address: Address;
    activeMembers: bigint;
    liquidable: bigint;
}

export function storeAtomicWallet(src: AtomicWallet) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.address);
        b_0.storeUint(src.activeMembers, 64);
        b_0.storeUint(src.liquidable, 96);
    };
}

export function loadAtomicWallet(slice: Slice) {
    let sc_0 = slice;
    let _address = sc_0.loadAddress();
    let _activeMembers = sc_0.loadUintBig(64);
    let _liquidable = sc_0.loadUintBig(96);
    return { $$type: 'AtomicWallet' as const, address: _address, activeMembers: _activeMembers, liquidable: _liquidable };
}

function loadTupleAtomicWallet(source: TupleReader) {
    let _address = source.readAddress();
    let _activeMembers = source.readBigNumber();
    let _liquidable = source.readBigNumber();
    return { $$type: 'AtomicWallet' as const, address: _address, activeMembers: _activeMembers, liquidable: _liquidable };
}

function loadGetterTupleAtomicWallet(source: TupleReader) {
    let _address = source.readAddress();
    let _activeMembers = source.readBigNumber();
    let _liquidable = source.readBigNumber();
    return { $$type: 'AtomicWallet' as const, address: _address, activeMembers: _activeMembers, liquidable: _liquidable };
}

function storeTupleAtomicWallet(source: AtomicWallet) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.address);
    builder.writeNumber(source.activeMembers);
    builder.writeNumber(source.liquidable);
    return builder.build();
}

function dictValueParserAtomicWallet(): DictionaryValue<AtomicWallet> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAtomicWallet(src)).endCell());
        },
        parse: (src) => {
            return loadAtomicWallet(src.loadRef().beginParse());
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
        b_0.storeUint(src.balance11, 64);
        b_0.storeUint(src.balance12, 64);
        b_0.storeUint(src.balance13, 64);
        b_0.storeUint(src.balance14, 64);
        let b_1 = new Builder();
        b_1.storeUint(src.unused, 15);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadAtomicMemberRecord(slice: Slice) {
    let sc_0 = slice;
    let _id = sc_0.loadUintBig(16);
    let _seq = sc_0.loadUintBig(32);
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
    let _balance11 = sc_0.loadUintBig(64);
    let _balance12 = sc_0.loadUintBig(64);
    let _balance13 = sc_0.loadUintBig(64);
    let _balance14 = sc_0.loadUintBig(64);
    let sc_1 = sc_0.loadRef().beginParse();
    let _unused = sc_1.loadUintBig(15);
    return { $$type: 'AtomicMemberRecord' as const, id: _id, seq: _seq, balance0: _balance0, balance1: _balance1, balance2: _balance2, balance3: _balance3, balance4: _balance4, balance5: _balance5, balance6: _balance6, balance7: _balance7, balance8: _balance8, balance9: _balance9, balance10: _balance10, balance11: _balance11, balance12: _balance12, balance13: _balance13, balance14: _balance14, unused: _unused };
}

function loadTupleAtomicMemberRecord(source: TupleReader) {
    let _id = source.readBigNumber();
    let _seq = source.readBigNumber();
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
    source = source.readTuple();
    let _balance12 = source.readBigNumber();
    let _balance13 = source.readBigNumber();
    let _balance14 = source.readBigNumber();
    let _unused = source.readBigNumber();
    return { $$type: 'AtomicMemberRecord' as const, id: _id, seq: _seq, balance0: _balance0, balance1: _balance1, balance2: _balance2, balance3: _balance3, balance4: _balance4, balance5: _balance5, balance6: _balance6, balance7: _balance7, balance8: _balance8, balance9: _balance9, balance10: _balance10, balance11: _balance11, balance12: _balance12, balance13: _balance13, balance14: _balance14, unused: _unused };
}

function loadGetterTupleAtomicMemberRecord(source: TupleReader) {
    let _id = source.readBigNumber();
    let _seq = source.readBigNumber();
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
    return { $$type: 'AtomicMemberRecord' as const, id: _id, seq: _seq, balance0: _balance0, balance1: _balance1, balance2: _balance2, balance3: _balance3, balance4: _balance4, balance5: _balance5, balance6: _balance6, balance7: _balance7, balance8: _balance8, balance9: _balance9, balance10: _balance10, balance11: _balance11, balance12: _balance12, balance13: _balance13, balance14: _balance14, unused: _unused };
}

function storeTupleAtomicMemberRecord(source: AtomicMemberRecord) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.id);
    builder.writeNumber(source.seq);
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
    registeredAtomicWallets: bigint;
    atomicWallets: Dictionary<number, AtomicWallet>;
    atomicPools: Dictionary<number, AtomicPool>;
    memberCursor: bigint;
    registeredMembers: bigint;
    atomicMembers: Dictionary<bigint, AtomicMemberRecord>;
}

export function storeAtomicDex$Data(src: AtomicDex$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.registeredAtomicWallets, 4);
        b_0.storeDict(src.atomicWallets, Dictionary.Keys.Uint(4), dictValueParserAtomicWallet());
        b_0.storeDict(src.atomicPools, Dictionary.Keys.Uint(8), dictValueParserAtomicPool());
        b_0.storeInt(src.memberCursor, 257);
        b_0.storeInt(src.registeredMembers, 257);
        b_0.storeDict(src.atomicMembers, Dictionary.Keys.BigInt(257), dictValueParserAtomicMemberRecord());
    };
}

export function loadAtomicDex$Data(slice: Slice) {
    let sc_0 = slice;
    let _registeredAtomicWallets = sc_0.loadUintBig(4);
    let _atomicWallets = Dictionary.load(Dictionary.Keys.Uint(4), dictValueParserAtomicWallet(), sc_0);
    let _atomicPools = Dictionary.load(Dictionary.Keys.Uint(8), dictValueParserAtomicPool(), sc_0);
    let _memberCursor = sc_0.loadIntBig(257);
    let _registeredMembers = sc_0.loadIntBig(257);
    let _atomicMembers = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserAtomicMemberRecord(), sc_0);
    return { $$type: 'AtomicDex$Data' as const, registeredAtomicWallets: _registeredAtomicWallets, atomicWallets: _atomicWallets, atomicPools: _atomicPools, memberCursor: _memberCursor, registeredMembers: _registeredMembers, atomicMembers: _atomicMembers };
}

function loadTupleAtomicDex$Data(source: TupleReader) {
    let _registeredAtomicWallets = source.readBigNumber();
    let _atomicWallets = Dictionary.loadDirect(Dictionary.Keys.Uint(4), dictValueParserAtomicWallet(), source.readCellOpt());
    let _atomicPools = Dictionary.loadDirect(Dictionary.Keys.Uint(8), dictValueParserAtomicPool(), source.readCellOpt());
    let _memberCursor = source.readBigNumber();
    let _registeredMembers = source.readBigNumber();
    let _atomicMembers = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAtomicMemberRecord(), source.readCellOpt());
    return { $$type: 'AtomicDex$Data' as const, registeredAtomicWallets: _registeredAtomicWallets, atomicWallets: _atomicWallets, atomicPools: _atomicPools, memberCursor: _memberCursor, registeredMembers: _registeredMembers, atomicMembers: _atomicMembers };
}

function loadGetterTupleAtomicDex$Data(source: TupleReader) {
    let _registeredAtomicWallets = source.readBigNumber();
    let _atomicWallets = Dictionary.loadDirect(Dictionary.Keys.Uint(4), dictValueParserAtomicWallet(), source.readCellOpt());
    let _atomicPools = Dictionary.loadDirect(Dictionary.Keys.Uint(8), dictValueParserAtomicPool(), source.readCellOpt());
    let _memberCursor = source.readBigNumber();
    let _registeredMembers = source.readBigNumber();
    let _atomicMembers = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAtomicMemberRecord(), source.readCellOpt());
    return { $$type: 'AtomicDex$Data' as const, registeredAtomicWallets: _registeredAtomicWallets, atomicWallets: _atomicWallets, atomicPools: _atomicPools, memberCursor: _memberCursor, registeredMembers: _registeredMembers, atomicMembers: _atomicMembers };
}

function storeTupleAtomicDex$Data(source: AtomicDex$Data) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.registeredAtomicWallets);
    builder.writeCell(source.atomicWallets.size > 0 ? beginCell().storeDictDirect(source.atomicWallets, Dictionary.Keys.Uint(4), dictValueParserAtomicWallet()).endCell() : null);
    builder.writeCell(source.atomicPools.size > 0 ? beginCell().storeDictDirect(source.atomicPools, Dictionary.Keys.Uint(8), dictValueParserAtomicPool()).endCell() : null);
    builder.writeNumber(source.memberCursor);
    builder.writeNumber(source.registeredMembers);
    builder.writeCell(source.atomicMembers.size > 0 ? beginCell().storeDictDirect(source.atomicMembers, Dictionary.Keys.BigInt(257), dictValueParserAtomicMemberRecord()).endCell() : null);
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
    2893: { message: `Invalid fee params received` },
    4082: { message: `Unknown member` },
    8680: { message: `Already registered atomicWallet` },
    9182: { message: `Invalid balance to deposit` },
    9603: { message: `Not registered` },
    13295: { message: `Authentication failed` },
    15373: { message: `Failed expectedOut condition` },
    16513: { message: `Pool should contain different atomic wallets` },
    18469: { message: `Refered atomicWallet1 out of range` },
    20298: { message: `Unknown pool` },
    21101: { message: `Already registered` },
    22172: { message: `Too many atomicWallets registered` },
    22546: { message: `Pool is already present` },
    22565: { message: `Not enough balance` },
    25145: { message: `Invalid orders binary size` },
    26483: { message: `Unknown curve received` },
    36245: { message: `Swap request is expired` },
    36754: { message: `Unknown atomic wallet id` },
    50613: { message: `Refered atomicWallet0 out of range` },
    53288: { message: `Unknown wallet atomicWallet1` },
    63845: { message: `Unknown wallet atomicWallet0` },
}

const AtomicDex_types: ABIType[] = [
    { "name": "StateInit", "header": null, "fields": [{ "name": "code", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
    { "name": "StdAddress", "header": null, "fields": [{ "name": "workchain", "type": { "kind": "simple", "type": "int", "optional": false, "format": 8 } }, { "name": "address", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
    { "name": "VarAddress", "header": null, "fields": [{ "name": "workchain", "type": { "kind": "simple", "type": "int", "optional": false, "format": 32 } }, { "name": "address", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "Context", "header": null, "fields": [{ "name": "bounced", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "sender", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "raw", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "SendParameters", "header": null, "fields": [{ "name": "bounce", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "to", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "mode", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "body", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "code", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": true } }] },
    { "name": "Deploy", "header": 2490013878, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "DeployOk", "header": 2952335191, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "FactoryDeploy", "header": 1829761339, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "cashback", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "AddAtomicWallet", "header": 2855416128, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "address", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "AddPool", "header": 3189586146, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "curveType", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 8 } }, { "name": "atomicWallet0", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 4 } }, { "name": "atomicWallet1", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 4 } }, { "name": "feeNominator", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "feeDenominator", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "AddPoolLiquidity", "header": 1788615815, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "atomicWallet0", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 4 } }, { "name": "atomicWallet1", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 4 } }, { "name": "amount0", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "amount1", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "RemovePoolLiquidity", "header": 2134549698, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "JoinMember", "header": 3288498465, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "eviction", "type": { "kind": "dict", "key": "int", "keyFormat": 16, "value": "int" } }, { "name": "atomicWalletId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 7 } }, { "name": "publicKey", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "seq", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "TopUpGasMember", "header": 930215976, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "publicKey", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
    { "name": "LiquidateMember", "header": 2725139430, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "publicKey", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "atomicWalletId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 7 } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "LiquidateMemberAtomicWalletNotification", "header": 2068225744, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "publicKey", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "balance", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }] },
    { "name": "SwapOrder", "header": 317368512, "fields": [{ "name": "atomicWallet0", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 7 } }, { "name": "atomicWallet1", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 7 } }, { "name": "expectedIn", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "expectedOut", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "MultiSwap", "header": 1283989889, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "publicKey", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "signature", "type": { "kind": "simple", "type": "slice", "optional": false } }, { "name": "orders", "type": { "kind": "simple", "type": "slice", "optional": false } }, { "name": "validUntil", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "GenerateSwapHash", "header": 2411880372, "fields": [{ "name": "seq", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "order", "type": { "kind": "simple", "type": "SwapOrder", "optional": false } }, { "name": "validUntil", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "GenerateMultiSwapHash", "header": 2518665663, "fields": [{ "name": "seq", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "orders", "type": { "kind": "simple", "type": "slice", "optional": false } }, { "name": "validUntil", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "AtomicWallet", "header": null, "fields": [{ "name": "address", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "activeMembers", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "liquidable", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 96 } }] },
    { "name": "AtomicPool", "header": null, "fields": [{ "name": "lpTokenSupply", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "curveType", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 8 } }, { "name": "reserve0", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 128 } }, { "name": "reserve1", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 128 } }, { "name": "feeNominator", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "feeDenominator", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "collectedFees0", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 128 } }, { "name": "collectedFees1", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 128 } }] },
    { "name": "AtomicMemberRecord", "header": null, "fields": [{ "name": "id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 16 } }, { "name": "seq", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "balance0", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance1", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance2", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance3", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance4", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance5", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance6", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance7", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance8", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance9", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance10", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance11", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance12", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance13", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "balance14", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "unused", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 15 } }] },
    { "name": "AtomicDex$Data", "header": null, "fields": [{ "name": "registeredAtomicWallets", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 4 } }, { "name": "atomicWallets", "type": { "kind": "dict", "key": "uint", "keyFormat": 4, "value": "AtomicWallet", "valueFormat": "ref" } }, { "name": "atomicPools", "type": { "kind": "dict", "key": "uint", "keyFormat": 8, "value": "AtomicPool", "valueFormat": "ref" } }, { "name": "memberCursor", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "registeredMembers", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "atomicMembers", "type": { "kind": "dict", "key": "int", "value": "AtomicMemberRecord", "valueFormat": "ref" } }] },
]

const AtomicDex_getters: ABIGetter[] = [
    { "name": "multiSwapHash", "arguments": [{ "name": "msg", "type": { "kind": "simple", "type": "GenerateMultiSwapHash", "optional": false } }], "returnType": { "kind": "simple", "type": "int", "optional": false, "format": 257 } },
    { "name": "atomicWallets", "arguments": [], "returnType": { "kind": "dict", "key": "uint", "keyFormat": 4, "value": "AtomicWallet", "valueFormat": "ref" } },
    { "name": "atomicPools", "arguments": [], "returnType": { "kind": "dict", "key": "uint", "keyFormat": 8, "value": "AtomicPool", "valueFormat": "ref" } },
    { "name": "atomicMemberRecord", "arguments": [{ "name": "publicKey", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }], "returnType": { "kind": "simple", "type": "AtomicMemberRecord", "optional": true } },
]

export const AtomicDex_getterMapping: { [key: string]: string } = {
    'multiSwapHash': 'getMultiSwapHash',
    'atomicWallets': 'getAtomicWallets',
    'atomicPools': 'getAtomicPools',
    'atomicMemberRecord': 'getAtomicMemberRecord',
}

const AtomicDex_receivers: ABIReceiver[] = [
    { "receiver": "internal", "message": { "kind": "typed", "type": "AddAtomicWallet" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "AddPool" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "AddPoolLiquidity" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "RemovePoolLiquidity" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "JoinMember" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "TopUpGasMember" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "LiquidateMember" } },
    { "receiver": "external", "message": { "kind": "typed", "type": "MultiSwap" } },
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

    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean | null | undefined }, message: AddAtomicWallet | AddPool | AddPoolLiquidity | RemovePoolLiquidity | JoinMember | TopUpGasMember | LiquidateMember | Deploy) {

        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AddAtomicWallet') {
            body = beginCell().store(storeAddAtomicWallet(message)).endCell();
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
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'JoinMember') {
            body = beginCell().store(storeJoinMember(message)).endCell();
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

    async sendExternal(provider: ContractProvider, message: MultiSwap) {

        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'MultiSwap') {
            body = beginCell().store(storeMultiSwap(message)).endCell();
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

    async getAtomicWallets(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('atomicWallets', builder.build())).stack;
        let result = Dictionary.loadDirect(Dictionary.Keys.Uint(4), dictValueParserAtomicWallet(), source.readCellOpt());
        return result;
    }

    async getAtomicPools(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('atomicPools', builder.build())).stack;
        let result = Dictionary.loadDirect(Dictionary.Keys.Uint(8), dictValueParserAtomicPool(), source.readCellOpt());
        return result;
    }

    async getAtomicMemberRecord(provider: ContractProvider, publicKey: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(publicKey);
        let source = (await provider.get('atomicMemberRecord', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleAtomicMemberRecord(result_p) : null;
        return result;
    }

}