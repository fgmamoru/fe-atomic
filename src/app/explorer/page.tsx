'use client'
import pageStyle from '../../app/page.module.css'
import styles from "./page.module.css";
import { CardSection } from "@/components/Card";
import { Card } from "@/components/Card/Card";
import { ChartTitle } from "@/components/Charts/TItle";
import { TotalBundlesChart } from "@/components/Charts/TotalBundlesChart";
import { TimeRange } from "@/types";
import { TimeRangeSelector } from "@/components/Charts/TimeRangeSelector";
import { useState } from "react";
import { BundlesTable } from "./BundlesTable";
import { TotalTipsChart } from "@/components/Charts/TotalTipsChart";
import { LargestBundlesBySigner } from "@/components/Charts/LargestBundlesBySigner";
import { Grid2 } from "@/components/Layout/Grid";
import { TotalBundlesPerSlothBarChart } from "@/components/Charts/TotalBundlesPerSlothBarChart";
import { useExplorerModel } from "@/components/Services/Model/explorer.model";

export default function ExplorerPage() {
    const [range, setRange] = useState<TimeRange>(TimeRange.WEEK);
    const { statistics } = useExplorerModel();
    return (
        <section className={pageStyle.Page}>
            <div className={styles.PageContainer}>

                <h1>Bundler Explorer</h1>
                <TimeRangeSelector
                    onChange={(val) => setRange(val)}
                    ranges={[TimeRange.WEEK, TimeRange.MONTH, TimeRange.YEAR]}
                />
                <Grid2>
                    <Card dark>
                        <CardSection>
                            <div>
                                <ChartTitle
                                    value={statistics?.data?.totalBundleCount?.value || 0}
                                    unit="# bundles"
                                    tag="h2">Total Bundles</ChartTitle>
                                <TotalBundlesChart range={range} />
                            </div>
                        </CardSection>
                    </Card>

                    <Card dark>
                        <CardSection>
                            <div>
                                <ChartTitle
                                    value={statistics?.data?.totalTipAmount?.value || 0}
                                    unit="TON"
                                    tag="h2"
                                >Tips</ChartTitle>
                                <TotalTipsChart range={range} />
                            </div>
                        </CardSection>
                    </Card>
                </Grid2>


                <Card dark>
                    <CardSection>
                        <div>
                            <ChartTitle
                                tag="h2"
                            >Latest Bundles</ChartTitle>
                            <BundlesTable />
                        </div>
                    </CardSection>
                </Card>

                <Card dark>
                    <CardSection>
                        <div>
                            <ChartTitle
                                tag="h2"
                            >Bundle Stats by SeqNo</ChartTitle>
                            <TotalBundlesPerSlothBarChart />
                        </div>
                    </CardSection>
                </Card>


                <Card dark>
                    <CardSection>
                        <div>
                            <ChartTitle
                                tag="h2"
                            >Largest Bundles by Validator</ChartTitle>
                            <LargestBundlesBySigner range={range} />
                        </div>
                    </CardSection>
                </Card>

            </div>

        </section>
    );
}
