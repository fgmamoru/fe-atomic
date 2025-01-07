'use client'
import { useModel } from "@/components/Services/Model";
import DataTable, { TableColumn } from 'react-data-table-component';
import { fromNano } from "@ton/core";
import { PoolModel } from "@/services/Router";

const columns: TableColumn<PoolModel>[] = [{
    name: 'From / To',
    selector: (row) => `${row.token0.symbol} / ${row.token1.symbol}`,
}, {
    name: 'Curve Type',
    selector: (row) => row.curveType === 0 ? 'Unbalanced' : 'Balanced',
},
// {
//     name: 'Contract ID',
//     selector: 'contractId',
// }, 
{
    name: 'Reserves',
    selector: (row) => `${fromNano(row.reserve0.toString())} / ${fromNano(row.reserve1.toString())}`,
},
]


export default function PoolPage() {
    const { pools } = useModel();
    const poolArray = Object.values(pools);

    return (
        <DataTable
            columns={columns}
            data={poolArray}
        ></DataTable>
    )
}