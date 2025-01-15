'use client';

import Link from 'next/link';
import styles from './index.module.css'
import clsx from 'clsx';
import { Menu } from '@headlessui/react';
import { useTonConnectModal } from '@tonconnect/ui-react';
import { MainButton } from '../Button/MainButton';
import { useIsConnected, useModel } from '../Services/Model';
import dynamic from 'next/dynamic';
import NoSsr from '../Misc/NoSsr';
import { NavbarCloseButton } from './NavbarCloseButton';

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
    const { open } = useTonConnectModal();
    const isConnected = useIsConnected();
    const { setSidebarOpen, isSidebarOpen } = useModel();

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

                            <div className={styles.NavbarBadgeZoneWrapper} style={{ display: !isConnected ? "none" : "" }}>
                                <NavbarCloseButton
                                    onClick={() => {
                                        setSidebarOpen(!isSidebarOpen);
                                    }}
                                    isClosed={!isSidebarOpen}
                                />
                            </div>
                            <div className={styles.NavbarBadgeZoneWrapper} style={{ display: !isConnected ? "" : "none" }}>
                                <MainButton onClick={open}>Connect Wallet</MainButton>
                            </div>

                        </div>
                    </NoSsr>

                </div>
            </nav >

        </>
    )
};