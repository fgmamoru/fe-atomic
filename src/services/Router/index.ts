import { Currency, CurveTypes, ExpandedAtomicPool, RouteSpeed } from "@/types";
import { DEFAULT_POOLS } from "../Defaults";
import { calculateExpectedOut } from "@/utils";
import debug from 'debug';
import { toNano } from "@ton/core";


const defaultTxFee = 50n

export class Pool implements ExpandedAtomicPool {
    expandedPool: ExpandedAtomicPool;
    $$type: "AtomicPool";
    lpTokenSupply: bigint;
    reserve0: bigint;
    reserve1: bigint;
    feeNominator: bigint;
    feeDenominator: bigint;
    collectedFees0: bigint;
    collectedFees1: bigint;
    token0: Currency;
    token1: Currency;
    curveType: CurveTypes;
    contractId: string;

    constructor(expandedPool: ExpandedAtomicPool) {
        this.expandedPool = expandedPool;
        this.$$type = 'AtomicPool';
        this.lpTokenSupply = expandedPool.lpTokenSupply;
        this.reserve0 = expandedPool.reserve0;
        this.reserve1 = expandedPool.reserve1;
        this.feeNominator = expandedPool.feeNominator;
        this.feeDenominator = expandedPool.feeDenominator;
        this.collectedFees0 = expandedPool.collectedFees0;
        this.collectedFees1 = expandedPool.collectedFees1;
        this.token0 = expandedPool.token0;
        this.token1 = expandedPool.token1;
        this.curveType = expandedPool.curveType;
        this.contractId = expandedPool.contractId;
    }


    get Token0Symbol(): string {
        return this.expandedPool.token0.symbol;
    }

    get Token1Symbol(): string {
        return this.expandedPool.token1.symbol;
    }

    includes(token: Currency): boolean {
        return token === this.expandedPool.token0 || token === this.expandedPool.token1;
    }

    getInverseCurrency(currency: Currency): Currency {
        return currency === this.expandedPool.token0 ? this.expandedPool.token1 : this.expandedPool.token0;
    }

    toString(): string {
        return `$[id:${this.contractId}[${this.Token0Symbol}-${this.Token1Symbol}]]`;
    }
    toStringInverse(): string {
        return `[id:${this.contractId}[${this.Token1Symbol}-${this.Token0Symbol}]]`;
    }
    toStringFrom(token: Currency): string {
        return token === this.expandedPool.token0 ? this.toString() : this.toStringInverse();
    }
}

export class Route {
    pools: Pool[];
    path: Currency[];
    input: Currency;
    output: Currency;
    debugLog: debug.Debugger;

    constructor(pools: Pool[], path: Currency[]) {
        this.pools = pools;
        this.input = path[0];
        this.output = path[path.length - 1];
        this.path = path;
        this.debugLog = debug('app:Route');
    }

    public getPrice(
        inputAmount: bigint,
    ): bigint {
        let result: bigint = inputAmount;
        let currentCurrency: Currency = this.input;
        for (const pool of this.pools) {

            const intermediateResult = calculateExpectedOut(result, pool, currentCurrency.id)
            currentCurrency = pool.getInverseCurrency(currentCurrency);
            result = intermediateResult;
            // result = intermediateResult - defaultTxFee;
        }

        return result - toNano(1)
    }

    /**
     * Prints the route as a string
     * @example [[ETH-DAI]] -> [[DAI-USDC]] -> [[USDC-ETH]]
     */
    toString(): string {
        let resultArr = [];
        let currentCurrency: Currency = this.input;

        for (const pool of this.pools) {
            resultArr.push(pool.toStringFrom(currentCurrency));
            currentCurrency = pool.getInverseCurrency(currentCurrency);
        }
        return `[[${this.constructor.name}(${this.speed}) ${resultArr.join(' -> ')}]]`;
    }
    /**
     * If all pools of the routes are in the same pool, the speed is Fast
     */
    get speed(): RouteSpeed {
        this.debugLog('get #speed');
        const firstPool = this.pools[0];
        for (const pool of this.pools) {
            this.debugLog(`get #speed: ${pool.contractId} !== ${firstPool.contractId}`);
            if (pool.contractId !== firstPool.contractId) {
                return RouteSpeed.Slow;
            }
        }
        return RouteSpeed.Fast;
    }
}

/**
 * Uniswap inspired router for routing transactions
 */
class Router {
    private pools: Pool[];
    defaultMaximumHops: number;
    debugLog: debug.Debugger;

    constructor(
    ) {
        this.pools = [];
        this.defaultMaximumHops = 2;
        this.debugLog = debug('app:Router');
    }

    public addPool(pool: ExpandedAtomicPool): void {
        this.pools.push(
            new Pool(pool)
        );
    }

    /**
     * Get a list of all tokens in the router
     */
    public getAllTokens(): Set<Currency> {
        const tokens = new Set<Currency>();
        this.pools.forEach(pool => {
            tokens.add(pool.expandedPool.token0);
            tokens.add(pool.expandedPool.token1);
        });
        return tokens;
    }

    /**
     * Takes all tokens and returns a list of all possible pairs by combining them
     */
    public getAllPairs(): [Currency, Currency][] {
        const tokens = this.getAllTokens();
        const pairs: [Currency, Currency][] = [];
        tokens.forEach(token1 => {
            tokens.forEach(token2 => {
                if (token1 !== token2) {
                    pairs.push([token1, token2]);
                }
            });
        });
        return pairs;
    }

    /**
     * Get all routes between two tokens with a maximum of the maximumHops using the available pools
     */
    public getAllRoutes(
        tokenIn: Currency,
        tokenOut: Currency,
        maximumHops: number = this.defaultMaximumHops,
        currentPools: Pool[] = [],
        id?: string
    ): Route[] {
        if (id) { id = `${id}:${Math.random().toString(36).substring(4)}` }
        else { id = Math.random().toString(36).substring(4) }
        const debugLog = debug(`app:Router:getAllRoutes:${id}`);
        debugLog(`#getAllRoutes(${tokenIn.symbol}, ${tokenOut.symbol}, ${maximumHops}, ${currentPools})`);
        const routes: Route[] = [];

        const pools = this.pools;

        debugLog(`-- pools: ${pools.map(pool => pool.toString()).join(', ')}`);
        for (const pool of pools) {
            debugLog(`-- checking pool ${pool.toString()}`);
            if (currentPools.includes(pool)) {
                debugLog(`---- ${pool.toString()} already in path`);
                continue;
            }
            if (!pool.includes(tokenOut) && maximumHops <= 0) {
                debugLog(`---- ${pool.toString()} does not include token OUT ${tokenOut.symbol} and maximumHops is ${maximumHops}`);
                continue;
            }

            if (!pool.includes(tokenIn)) {
                debugLog(`---- ${pool.toString()} does not include token IN  ${tokenIn.symbol}`);
                continue;

            }

            const outToken = pool.getInverseCurrency(tokenIn);

            if (outToken === tokenOut) {
                debugLog(`---- ${pool.toString()} is the last pool`);
                routes.push(new Route([...currentPools, pool], [tokenIn, outToken]));
            } else if (currentPools.length < maximumHops) {
                debugLog(`---- ${pool.toString()} is not the last pool`);
                const newRoutes = this.getAllRoutes(outToken, tokenOut, maximumHops - 1, [...currentPools, pool], id);
                debugLog(`---- ${pool.toString()} has ${newRoutes.length} new routes`);
                for (const route of newRoutes) {
                    routes.push(
                        new Route(route.pools, [tokenIn, tokenOut])
                    );
                }
            }
        }
        debugLog(`--getAllRoutes finished, ${routes.length} routes found`);
        return routes;
    }

    public getBestRoute(
        tokenIn: Currency,
        tokenOut: Currency,
        amountIn: bigint,
        maximumHops: number = this.defaultMaximumHops,
    ): Route | null {
        const routes = this.getAllRoutes(tokenIn, tokenOut, maximumHops);
        let bestRoute: Route | null = null;
        let bestPrice: bigint = 0n;
        for (const route of routes) {
            const price = route.getPrice(amountIn);
            if (price > bestPrice) {
                bestPrice = price;
                bestRoute = route;
            }
        }
        return bestRoute;
    }

    public getBestRouteFromRoutes(
        routes: Route[],
        amountIn: bigint,
    ): Route | null {
        let bestRoute: Route | null = null;
        let bestPrice: bigint = -1000000000000000000000000000000n;
        for (const route of routes) {
            const price = route.getPrice(amountIn);
            if (price > bestPrice) {
                bestPrice = price;
                bestRoute = route;
            }
        }
        return bestRoute;
    }

}

export const router = new Router();

DEFAULT_POOLS.forEach(pool => {
    router.addPool(pool);
});

