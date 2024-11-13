'use client';
import { CardSection } from "@/components/Card";
import { Card } from "@/components/Card/Card";
import { Grid1, Grid3 } from "@/components/Layout/Grid";
import { PageLayout } from "@/components/Layout/PageLayout";
import { DataCapsule } from "./DataCapsule/DataCapsule";
import { useRouter, useSearchParams } from 'next/navigation'
import { IBundle } from "@/types";
import { formatDistanceToNow } from 'date-fns';
import { BundleMessage } from "./BundleMessage/BundleMessage";
import { useQuery } from "@tanstack/react-query";
import { getRootUrl } from "@/components/Services/mevton-api";
import { ExternalLinkIcon } from "@/components/Icons/ExternalLinkIcon";

export default function BundleDetailPage({ params }: { params: { id: string } }) {
    const { isPending, isError, data, error } = useQuery<IBundle | null>({
        queryKey: ['bundle', params.id],
        queryFn: async (): Promise<IBundle | null> => {
            const url = `${getRootUrl()}/api/bundles/${params.id}`;
            const response = await fetch(url);
            const body = await response.json();

            if (!response.ok) {

                throw new Error(body.message || 'Failed to fetch bundle');
            }
            return body;
        },
    })

    if (isPending) {
        return <PageLayout>Loading...</PageLayout>
    }

    console.log(data, isError)


    if (!data || isError) {
        return <PageLayout>{error?.message}</PageLayout>
    }


    return (
        <PageLayout>
            <h1>Bundle Details</h1>
            <Card>
                <CardSection>
                    <h2>Bundle Information</h2>
                    <Grid3>
                        <DataCapsule name="Bundle ID" value={data?.id} />
                        <DataCapsule name="Timestamp" value={new Date(data?.createdAt || '').toISOString()} />
                        <DataCapsule name="Time ago" value={`${formatDistanceToNow(new Date(data?.createdAt || ''))}`} />
                        <DataCapsule name="Tip" value={<span>{data?.tip_amount} Ton <img height={14} src="/icons/ton.svg" aria-hidden /></span>} />
                        <DataCapsule name="Produced Peer ID" value={data?.produced_peer_id} />
                        <DataCapsule name="Produced Validator Address" value={<a target="_blank" href={`https://tonscan.org/address/${data?.produced_validator_address}`}>{data?.produced_validator_address}<ExternalLinkIcon /></a>} />
                        <DataCapsule name="Block ID" value={<a target="_blank" href={`https://tonscan.com/blocks/${data?.block_id}`} >${data?.block_id}<ExternalLinkIcon /></a>} />
                    </Grid3>
                </CardSection>
            </Card>

            <Card>
                <CardSection>
                    <h2>Messages</h2>
                    <Grid1>
                        {(data?.messages || '').split(',').map((message, index) =>
                            <BundleMessage key={index}>{message}</BundleMessage>
                        )}
                    </Grid1>
                </CardSection>
            </Card>
        </PageLayout>
    )
}
