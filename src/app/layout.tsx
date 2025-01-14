"use client";

import { Navbar } from "@/components/Navbar";
import "./globals.css";
import { TonConnectButton, TonConnectUIProvider, useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { useModel } from "@/components/Services/Model";
import { useEffect } from "react";
import { messages } from "@/services/i18n";
import { Footer } from "@/components/Footer/Footer";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/components/Services/atomic-api";
import { API_SCHEME, HOST } from "@/services/config.service";
import { Stars } from "@/components/Misc/Stars";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import NoSsr from "@/components/Misc/NoSsr";
import { WalletSidebar } from "@/components/Modal/WalletSidebar";
import { DepositModal } from "@/components/Modal/DepositModal";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    if (typeof localStorage !== 'undefined') {
        localStorage.debug = 'app:*'
    }
    const { isDepositModalOpen, setDepositModalOpen } = useModel();

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <title>{messages.en.ton}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content={messages.en.ton} />
                <meta name="keywords" content={messages.en.ton} />
                <meta name="author" content={messages.en.ton} />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
            </head>

            <body>
                <TonConnectUIProvider manifestUrl="https://fe-atomic.vercel.app/tonconnect.json">
                    <DepositModal isOpen={isDepositModalOpen} onClose={() => setDepositModalOpen(false)} />

                    <Content>
                        {children}
                    </Content>

                    <ToastContainer />
                </TonConnectUIProvider>
                <Stars />
            </body>
        </html>
    )
}

function Content({ children }: { children: React.ReactNode }) {
    const address = useTonAddress();

    return <div style={{ display: 'flex' }}>
        <div style={{ width: '100%' }}>
            <Navbar />
            <WrapperLayout>
                {children}
            </WrapperLayout>
        </div>

        {
            address && <NoSsr>
                <div>
                    <WalletSidebar
                        onClose={() => true}
                        isOpen={true}
                    />
                </div>

            </NoSsr>
        }

    </div>

}

function WrapperLayout({ children }: { children: React.ReactNode }) {
    const model = useModel();
    const [tonConnectUi] = useTonConnectUI();



    useEffect(() => {
        if (!tonConnectUi) return;
        model.init(tonConnectUi);
    }, [tonConnectUi]);

    return (
        <>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </>
    )
}

