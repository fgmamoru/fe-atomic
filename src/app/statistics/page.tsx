'use client'
import React, { useEffect } from "react";
import styles from "../page.module.css";
import pageStyles from "./page.module.css";
import { CardSection } from "@/components/Card";

import { TVLChart } from "@/components/Charts/TVLChart";
import { ChartTitle } from "@/components/Charts/TItle";
import { TotalBundlesChart } from "@/components/Charts/TotalBundlesChart";
import { TotalMevRecordsChart } from "@/components/Charts/TotalMevRecordsChart";
import { ApyChart } from "@/components/Charts/ApyChart";
import { DaysEpochSelector, TimeRangeSelector } from "@/components/Charts/TimeRangeSelector";
import { H1 } from "@/components/Typography/H1";
import { Card } from "@/components/Card/Card";
import { useModel, useStatisticsModel } from "@/components/Services/Model";
import { messages } from "@/services/i18n";


export default function StatisticsPage() {
  const stats  = useStatisticsModel();
  const model = useModel();
  
  useEffect(() => {
    stats.getStatistics();
  }, []);

  return (
    <div className={styles.Page}>
      <div className={pageStyles.PageContainer}>
        
        <H1>Stats</H1>
        <div className={styles.SelectorContainer}>
          <DaysEpochSelector />
          <TimeRangeSelector 
            onChange={(val)=>{
              stats.setSelectedTimeRange(val);
            }}
          />
        </div>
        

        <Card>
          <CardSection>
            <div>
            <ChartTitle
              unit="TON"
              value={model.currentlyStaked()}
            >{messages.en.mevTon} TVL: </ChartTitle>
            <TVLChart range={stats.selectedTimeRange}/>
            </div>
          </CardSection>
        </Card>
        <br />
        <Card>
          <CardSection>
            <ChartTitle
              value={model.apy()}
              unit="%"
            >{messages.en.mevTon} APY</ChartTitle>
            < ApyChart range={stats.selectedTimeRange}/>
          </CardSection>
        </Card>

        <br />

        <Card>
          <CardSection>
            <div>
            <ChartTitle
              value={stats.bundles}
            >Total Bundles</ChartTitle>
            <TotalBundlesChart range={stats.selectedTimeRange}/>
            </div>
          </CardSection>
        </Card>

        <br />

        <Card>
          <CardSection>
            <div>

            <ChartTitle
              value={stats.mevRecords}
              unit="TON"
            >Total MEV Records:</ChartTitle>
            < TotalMevRecordsChart range={stats.selectedTimeRange}/>
            </div>

          </CardSection>
        </Card>



      </div>
    </div>
  );
}
