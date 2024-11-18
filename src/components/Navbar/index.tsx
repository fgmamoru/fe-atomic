'use client';

import Link from 'next/link';
import styles from './index.module.css'
import { NavbarBalance } from './NavbarBalance';
import clsx from 'clsx';
import { Menu } from '@headlessui/react';
import { NavBarUnstakingPending } from './NavBarUnstakingPending';
import { TonConnectButton, useTonConnectModal } from '@tonconnect/ui-react';
import { MainButton } from '../Button/MainButton';
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useModel } from '../Services/Model';
import { messages } from '@/services/i18n';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

type BurgerMenuItemProps = {
    href: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

const ShowInDebug = dynamic(() =>
    import('@/services/debug.service').then((mod) => mod.ShowInDebug)
)

function BurgerMenuItem({ href, children, style }: BurgerMenuItemProps): JSX.Element {
    return (
        <Menu.Item>
            <Link
                style={style}
                className={styles.BurgerMenuItem} href={href}>
                {children}
            </Link>
        </Menu.Item>
    )
}

function BurgerMenu({ bills }: { bills: Array<any> }) {
    return (
        <Menu>
            <div className={styles.BurgerMenuButton}>
                <MainButton
                    square={true}
                    component={Menu.Button}
                    variant='secondary'>
                    <img src="/icons/menu.svg" />
                </MainButton>
            </div>

            <Menu.Items className={styles.BurgerMenuItemsOverlay}>
                <div className={styles.BurgerMenuItems}>
                    <BurgerMenuItem href="/dex">Dex</BurgerMenuItem>
                </div>
            </Menu.Items >
        </Menu >
    );
}

export const Navbar = () => {
    const [tonConnectUi] = useTonConnectUI();
    const { open } = useTonConnectModal();
    const { address } = useModel();
    const isConnected = tonConnectUi?.connected || address;

    const bills: Array<any> = []
    return (
        <nav className={styles.Navbar}>
            <div className={styles.NavbarContainer}>
                <div className={styles.NavbarStart}>
                    <div className={styles.NavbarLogo}>
                        <Link href="/">
                            <img src="/logo.svg" alt="MevtonTON Staking" />
                        </Link>
                    </div>
                    <Link className={styles.NavbarItem} href="/dex">Dex</Link>
                    <Suspense fallback={<></>}>
                        <ShowInDebug>
                            <Link className={styles.NavbarItem} href="/admin" style={{ color: 'blue' }}>Admin</Link>
                        </ShowInDebug>
                    </Suspense>

                </div>
                <div className={clsx(styles.NavbarEnd, styles.NavbarEndMobile)}>
                    {/* {
            bills?.length ? <NavBarUnstakingPending /> : null
          } */}
                    {
                        address ? <div className={styles.NavbarBadgeZoneWrapper}>
                            <NavbarBalance />
                            <div style={{ position: 'relative' }} className={clsx({ isConnected: isConnected })}>
                                {isConnected && <img className={styles.NavbarWalletIcon} aria-hidden="true" src="/icons/wallet.svg" alt="" />}
                                <TonConnectButton />
                            </div>
                        </div> : <MainButton onClick={open}>Connect Wallet</MainButton>
                    }
                    <BurgerMenu bills={bills} />
                </div>
                {/* <div className={clsx(styles.NavbarEnd, styles.NavbarEndMobile)}>
          <TonConnectButton  />
        </div> */}

            </div>

        </nav >
    )
};