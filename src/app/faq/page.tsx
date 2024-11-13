'use client'
import { messages } from "@/services/i18n";
import styles from "./page.module.css";



export default function FaqPage() {
  return (
    <section className={styles.FaqPage}>
      <h1>Frequently Asked Questions</h1>
      <div className={styles.FaqPageContent}>
        <ol>
          <li>
            <h2>Why 1 TON is not 1 {messages.en.mevTon}</h2>
            <p>
              A common query is why users receive fewer {messages.en.mevTon} tokens compared to the TON they stake.
          
          
              {messages.en.mevTon} is a reward-bearing LSTs asset that accrues value and appreciates over time.
      
              Whenever you unstake, you always receive more TON than when you initially staked.
            </p>
          </li>
          <li>
            <h2>What is {messages.en.mevTon}?</h2>
            <p>
              {messages.en.mevTon} is a reward-bearing liquid version of the TON token. It represents the value of staked TON tokens and allows users to retain the liquidity of their staked assets while earning rewards.
            </p>
          </li>
          <li>
            <h2>How can I use {messages.en.mevTon}?</h2>
            <p>
              {messages.en.mevTon} can be used in the same way as TON tokens on supported platforms within TON ecosystem. You can utilize {messages.en.mevTon} for various purposes such as participating in DeFi protocols, trading on decentralized exchanges, or providing liquidity in liquidity pools
            </p>
          </li>
          <li>
            <h2>How do I receive rewards?</h2>
            <p>
              Staking TON tokens allows you to earn rewards daily. The rewards are automatically distributed to the rewards pool. The value of {messages.en.mevTon} increases daily, which is a representation of how much TON each {messages.en.mevTon} is worth. The ratio of {messages.en.mevTon} to TON can be found above.
            </p>
          </li>
          <li>
            <h2>How soon after staking will I begin to receive rewards?</h2>
            <p>
              You will start earning rewards immediately after staking your TON tokens. Rewards are accrued and distributed on a daily basis.
            </p>
          </li>
          <li>
            <h2>You will start earning rewards immediately after staking your TON tokens. Rewards are accrued and distributed on a daily basis.</h2>
            <p>
              No, {messages.en.mevTon} does not charge any fees for the liquid staking services. The only fee’s are dependent on the staking validator where the TON is staked, however this is accounted for in the calculated APY% displayed above. Protocol fees are subject to change in the future through the Volo Governance DAO.
            </p>
          </li>
        </ol>
      </div>
    </section>
  );
}
