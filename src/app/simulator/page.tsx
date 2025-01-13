'use client'
import { useModel } from "@/components/Services/Model";
import { PoolModel } from "@/services/Router";
import { calculateExpectedOut } from "@/utils";
import { fromNano, toNano } from "@ton/core";
import { useEffect, useState } from "react";

enum Direction {
    normal,
    reverse
}

export default function SimulatorPage() {
    const { pools } = useModel();
    const [selectedPool, setSelectedPool] = useState<PoolModel | null>(null);
    const [selectedDirection, setSelectedDirection] = useState<Direction>(Direction.normal);
    const [customReserve0, setCustomReserve0] = useState<bigint>(0n);
    const [customReserve1, setCustomReserve1] = useState<bigint>(0n);
    const [amount, setAmount] = useState<number>(0);

    useEffect(() => {
        setSelectedPool(Object.values(pools)[0]);

    }, [pools]);

    if (selectedPool) {
        selectedPool.reserve0 = customReserve0 || selectedPool.reserve0;
        selectedPool.reserve1 = customReserve1 || selectedPool.reserve1;
    }

    return (
        <div>
            <h1>Simulator</h1>

            <div>
                <h2>Select Pool</h2>
                <select onChange={(e) => setSelectedPool(pools[e.target.value])}>
                    <option value={undefined}>Select Pool</option>
                    {Object.values(pools).map((pool) => (
                        <option key={pool.id} value={pool.id.toString()}>{pool.toString()}</option>
                    ))}
                </select>

                <h2>Select Direction</h2>
                <select onChange={(e) => setSelectedDirection(Direction[e.target.value as keyof typeof Direction])}>
                    <option value={undefined}>Select Direction</option>
                    <option value={Direction[Direction.normal]}>Normal</option>
                    <option value={Direction[Direction.reverse]}>Reverse</option>
                </select>


                <h2>Override Reserves</h2>
                <input type="number" onChange={(e) => setCustomReserve0(BigInt(parseFloat(e.target.value)))} />
                <input type="number" onChange={(e) => setCustomReserve1(BigInt(parseFloat(e.target.value)))} />

                <h2>Enter Amount</h2>
                <input type="number" onChange={(e) => setAmount(parseFloat(e.target.value))} />

                <h2>Result: {
                    selectedPool && amount &&
                    fromNano(calculateExpectedOut(toNano(amount), selectedPool,
                        selectedDirection === Direction.normal ? selectedPool.token0 : selectedPool.token1,
                    ).toString())}</h2>
                <div>

                </div>
            </div>
        </div>
    )
}