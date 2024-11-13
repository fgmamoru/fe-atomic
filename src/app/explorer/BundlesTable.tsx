import { IBundle } from '@/types';
import DataTable, { TableColumn } from 'react-data-table-component';
import { formatDistanceToNow } from 'date-fns';
import { useExplorerModel } from '@/components/Services/Model/explorer.model';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLinkIcon } from '@/components/Icons/ExternalLinkIcon';

const columns: TableColumn<IBundle>[] = [
    {
        name: 'Bundle #',
        selector: (row) => row.id,
    },
    {
        name: 'Signer',
        cell: (row) => <a href={`https://tonscan.org/address/${row.produced_validator_address}`}>{row.produced_validator_address}<ExternalLinkIcon /></a>,
    },
    {
        name: 'Validator Tip',
        selector: (row) => `${row.tip_amount} Ton`,
    },
    {
        name: 'Created At',
        selector: (row) => formatDistanceToNow(new Date(row.createdAt), { addSuffix: true }),
    }
];

export const BundlesTable = () => {
    const { init, bundles } = useExplorerModel();
    useEffect(() => { init() }, []);
    const router = useRouter();
    return (
        <div>
            <DataTable
                columns={columns}
                data={bundles?.data}
                pagination
                onRowClicked={(row) => {
                    router.push(`/explorer/bundles/${row.id}`)
                }}

            />
        </div>

    )
}

