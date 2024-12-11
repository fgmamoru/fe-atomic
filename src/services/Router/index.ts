import { Currency, CurveTypes, ExpandedAtomicPool, RouteSpeed } from "@/types";
import { DEFAULT_POOLS } from "../Defaults";
import { calculateExpectedOut } from "@/utils";

const defaultTxFee = 50n

class Pool implements ExpandedAtomicPool {
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
        return `[[${this.Token0Symbol}-${this.Token1Symbol}]]`;
    }
    toStringInverse(): string {
        return `[[${this.Token1Symbol}-${this.Token0Symbol}]]`;
    }
    toStringFrom(token: Currency): string {
        return token === this.expandedPool.token0 ? this.toString() : this.toStringInverse();
    }
}

class Route {
    pools: Pool[];
    path: Currency[];
    input: Currency;
    output: Currency;

    constructor(pools: Pool[], path: Currency[]) {
        this.pools = pools;
        this.input = path[0];
        this.output = path[path.length - 1];
        this.path = path;
    }

    public getPrice(
        inputAmount: bigint,
    ): bigint {
        let result: bigint = 0n;
        let currentCurrency: Currency = this.input;
        for (const pool of this.pools) {

            const intermediateResult = calculateExpectedOut(inputAmount, pool, currentCurrency.id)
            currentCurrency = pool.getInverseCurrency(currentCurrency);
            result = intermediateResult - defaultTxFee;
        }

        return result;
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
        return `[[${this.constructor.name}(Fast) ${resultArr.join(' -> ')}]]`;
    }
    /**
     * If all pools of the routes are in the same pool, the speed is Fast
     */
    get speed(): RouteSpeed {
        const firstPool = this.pools[0];
        for (const pool of this.pools) {
            if (pool !== firstPool) {
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

    constructor(
    ) {
        this.pools = [];
        this.defaultMaximumHops = 3;
    }

    addPool(pool: ExpandedAtomicPool): void {
        this.pools.push(
            new Pool(pool)
        );
    }

    /**
     * Get a list of all tokens in the router
     */
    getAllTokens(): Set<Currency> {
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
    getAllPairs(): [Currency, Currency][] {
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
    getAllRoutes(
        tokenIn: Currency,
        tokenOut: Currency,
        maximumHops: number = this.defaultMaximumHops,
        currentPath: Pool[] = [],
    ): Route[] {
        const routes: Route[] = [];

        const pools = this.pools;

        for (const pool of pools) {
            if (currentPath.includes(pool) || !pool.includes(tokenIn))
                continue;

            const outToken = pool.token0 === tokenIn ? pool.token1 : pool.token0;

            if (outToken === tokenOut) {
                routes.push(new Route([...currentPath, pool], [tokenIn, outToken]));
            } else if (currentPath.length < maximumHops) {
                const newRoutes = this.getAllRoutes(outToken, tokenOut, maximumHops, [...currentPath, pool]);
                routes.push(...newRoutes.map(route => new Route([...currentPath, pool, ...route.pools], [tokenIn, ...route.path])));
            }
        }

        return routes;
    }

    getBestRoute(
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


}

const router = new Router();

DEFAULT_POOLS.forEach(pool => {
    router.addPool(pool);
});

