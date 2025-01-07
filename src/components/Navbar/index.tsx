'use client';

import Link from 'next/link';
import styles from './index.module.css'
import { NavbarBalance } from './NavbarBalance';
import clsx from 'clsx';
import { Menu } from '@headlessui/react';
import { TonConnectButton, useTonConnectModal } from '@tonconnect/ui-react';
import { MainButton } from '../Button/MainButton';
import { useModel } from '../Services/Model';
import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { WalletSidebar } from '../Modal/WalletSidebar';
import NoSsr from '../Misc/NoSsr';

type BurgerMenuItemProps = {
    href: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

const ShowInDebug = dynamic(() =>
    import('@/services/debug.service').then((mod) => mod.ShowInDebug)
)

// const TonConnectButton = dynamic(() => import('@/components/Button/TonConnectButton').then((mod) => mod.TonConnectButton))

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

function BurgerMenu() {
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
                    <BurgerMenuItem href="/">Dex</BurgerMenuItem>
                </div>
            </Menu.Items >
        </Menu >
    );
}

export const Navbar = () => {
    const { open, state } = useTonConnectModal();
    const { isConnected } = useModel();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <nav className={styles.Navbar}>
                {/* Ton Connect UI have many bugs interacting with NextJs SSR features, so is disabled */}
                <div className={styles.NavbarContainer}>
                    <NoSsr>

                        <div className={styles.NavbarStart}>
                            <div className={styles.NavbarLogo}>
                                <Link href="/">
                                    <img src="/logo.svg" alt="TON Dex" />
                                </Link>
                            </div>
                            <Link className={styles.NavbarItem} href="/">Dex</Link>
                            <ShowInDebug>
                                <Link className={styles.NavbarItem} href="/pools">Pools</Link>
                            </ShowInDebug>
                        </div>
                        <div className={clsx(styles.NavbarEnd, styles.NavbarEndMobile)}>
                            <div className={styles.NavbarBadgeZoneWrapper} style={{ display: !isConnected() ? "none" : "" }}>

                                {/* <NavbarBalance />
                                <div style={{ position: 'relative' }} className={clsx({ isConnected: isConnected() })}>
                                    {isConnected() && <img className={styles.NavbarWalletIcon} aria-hidden="true" src="/icons/wallet.svg" alt="" />}
                                    <TonConnectButton />
                                </div> */}
                            </div>
                            <ShowInDebug>
                                <div style={{ fontSize: '7px', textAlign: 'center', color: 'var(--color-text-debug)' }}>Modal State: <br /> {state?.status}</div>
                            </ShowInDebug>
                            <div className={styles.NavbarBadgeZoneWrapper} style={{ display: !isConnected() ? "" : "none" }}>
                                <MainButton onClick={open}>Connect Wallet</MainButton>
                            </div>

                            {/* <div className={styles.BurgerMenuButton}>
                                <MainButton
                                    square={true}
                                    onClick={() => setIsModalOpen(true)}
                                    variant='secondary'>
                                    <img src="/icons/menu.svg" />
                                </MainButton>
                            </div> */}
                        </div>
                        {/* <TonConnectButton /> */}
                    </NoSsr>

                </div>
            </nav >

        </>
    )
};