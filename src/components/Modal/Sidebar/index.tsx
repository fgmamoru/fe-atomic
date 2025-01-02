import styles from './Sidebar.module.css';
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

export type SidebarProps = {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    clickOutsideToClose?: boolean;
}


export const SidebarModal = (props: SidebarProps) => {
    return (
        <Dialog
            open={props.isOpen}
            onClose={() => props.onClose?.()}
        >
            <DialogBackdrop
                transition
                className={styles.SidebarBackdrop}
                onClick={() => props.clickOutsideToClose && props.onClose?.()}
            />
            <DialogPanel
                transition
                className={styles.SidebarPanel}
            >
                {props.children}
            </DialogPanel>
        </Dialog>
    )
};

export const Sidebar = (props: SidebarProps) => {
    return (
        <div
        >
            <div
                className={styles.SidebarPanel}
            >
                {props.children}
            </div>
        </div>
    )
};