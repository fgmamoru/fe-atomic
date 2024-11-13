import { NavbarBadgeCard } from "../NavbarBadgeCard"
import Link from "next/link";

export const NavBarUnstakingPending = () => {
  const tickets = []
return (
  <Link href="/tickets" style={{textDecoration:'none'}}>
    <NavbarBadgeCard >
      <div style={{width:'max-content', display:'flex', flexDirection:'column'}}>
        <NavbarBadgeCard.Label>Unstaking Pending</NavbarBadgeCard.Label>
        <NavbarBadgeCard.Value > {tickets?.length||0} tickets </NavbarBadgeCard.Value>
      </div>
    </NavbarBadgeCard>
  </Link>
  )
}