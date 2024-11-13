'use client'
import React, { useEffect } from "react";
import styles from "./page.module.css";
import { StakeSwitch } from "@/components/Button/StakeSwitch";
import { CardSection } from "@/components/Card";
import { Card } from "@/components/Card/Card";
import { Divider } from "@/components/Misc/Divider";
import Stake from "@/components/Stake";
import UnStake from "@/components/UnStake";
import { useModel } from "@/components/Services/Model";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { messages } from "@/services/i18n";
import { WaitingTransactionModal } from "@/components/Modal/WaitingTransactionModal";
import { GivingUpTransactionModal } from "@/components/Modal/GivingUpTransactionModal";
import { PageLayoutNarrow, PageWrapper } from "@/components/Layout/PageLayout";


const Home = (() => {
  return (
    <HomeInner />
  );
});


const HomeInner = (() => {
  const model = useModel();
  if (!model.inited) {
    return <div className={styles.Page}>
      <div className={styles.PageContainer}>
        <h1 data-testid="main-title">Get {messages.en.mevTon}</h1>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
          loading...
        </div>
      </div>
    </div>
  }

  return (
    <PageWrapper>
      <PageLayoutNarrow>
        <h1 data-testid="main-title">Get {messages.en.mevTon}</h1>
        <Card>
          <CardSection>
            <StakeSwitch onChange={(value) => model.setActiveTab(value === 0 ? 'stake' : 'unstake')} />
          </CardSection >
          <Divider />
          {
            model.activeTab === 'stake' ? <Stake /> : <UnStake />
          }
        </Card>
        <WaitingTransactionModal isOpen={model.waitForTransaction === 'wait'} />
        <GivingUpTransactionModal isOpen={model.waitForTransaction === 'timeout'} />
      </PageLayoutNarrow>
    </PageWrapper>
  );
})


export default Home;