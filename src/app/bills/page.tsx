'use client'
import { TicketList } from "@/components/PageSpecific/Tickets";
import styles from "./page.module.css";

export default function ProgressPage() {
  return (
    <div className={
      styles.ProgressPage
    }>
      <h1>Bills</h1>
      <TicketList />

    </div>
  )
}