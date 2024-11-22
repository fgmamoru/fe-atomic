'use client'
import React, { useState } from "react";
import { useModel } from "@/components/Services/Model";
import { PageLayoutNarrow, PageWrapper } from "@/components/Layout/PageLayout";
import { Card } from "@/components/Card/Card";
import { CardSection } from "@/components/Card";
import { CustomSelector } from "@/components/Charts/TimeRangeSelector";
import { DexSwapTab } from "./components/Swap";
import { DexDepositTab } from "./components/Deposit";
import { DexWithdrawTab } from "./components/Withdraw";
import { AtomicSpeedCardWrapper } from "@/components/Misc/StakeStats/AtomicSpeedWrapper";
import { Stars } from "@/components/Misc/Stars";

type Tab = 'Swap' | 'Deposit' | 'Withdraw';

const DexPage = (() => {
    const [tab, setTab] = useState<Tab>('Swap');

    return (
        <PageWrapper>
            <PageLayoutNarrow>
                <AtomicSpeedCardWrapper active={true}>
                    <Card>
                        <CardSection>
                            <div>
                                <CustomSelector
                                    options={[{
                                        label: 'Swap',
                                    }, {
                                        label: 'Deposit',
                                    }, {
                                        label: 'Withdraw',
                                    }]}
                                    onChange={(val) => setTab(val as Tab)}
                                />
                            </div>
                        </CardSection>
                        <CardSection>
                            {
                                tab === 'Swap' ? <DexSwapTab /> : null
                            }
                            {
                                tab === 'Deposit' ? <DexDepositTab /> : null
                            }
                            {
                                tab === 'Withdraw' ? <DexWithdrawTab /> : null
                            }
                        </CardSection>
                    </Card>
                </AtomicSpeedCardWrapper>
            </PageLayoutNarrow>
        </PageWrapper>
    );
})


export default DexPage;                 