import { Dialog } from "@headlessui/react";
import style from "./index.module.css";
import clsx from "clsx";

export function ModalHeader(props: { children: React.ReactNode }) {
    return <Dialog.Title className={style.header}>{props.children}</Dialog.Title>;
}

export function ModalSubtitle(props: { children: React.ReactNode }) {
    return <h2 className={style.title}>{props.children}</h2>;
}

export function ModalText(props: { children: React.ReactNode }) {
    return <p className={style.text}>{props.children}</p>;
}

export function ModalBody(props: { children: React.ReactNode }) {
    return <div className={style.panelBody}>{props.children}</div>;
}

export function ModalFooter(props: {
    children: React.ReactNode;
    leftChildren?: React.ReactNode;
}) {
    return (
        <div className={style.panelFooter}>
            {props.leftChildren}
            {props.children}

        </div>
    );
}

export function MainModal(props: {
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
}) {
    return (
        <Dialog
            className={style.modal}
            open={props.isOpen}
            onClose={() => props.onClose?.()}
        >
            <div className={style.backdrop} />
            <Dialog.Panel className={style.panel}>
                <ModalHeader>{props.title}</ModalHeader>

                <ModalBody>{props.children}</ModalBody>
                {props.footer && <ModalFooter>{props.footer}</ModalFooter>}
            </Dialog.Panel>
        </Dialog>
    );
}

export function MiniModal(props: {
    children: React.ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
}): JSX.Element {
    const className = clsx(style.MiniModal, style.modal);
    return (
        <Dialog
            className={className}
            open={props.isOpen}
            onClose={() => props.onClose?.()}
        >
            <div className={style.backdrop} />
            <Dialog.Panel className={style.panel}>{props.children}</Dialog.Panel>
        </Dialog>
    );
}

export function RegularModal(props: {
    children: React.ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
}): JSX.Element {
    const className = clsx(style.RegularModal, style.modal);
    return (
        <Dialog
            className={className}
            open={props.isOpen}
            onClose={() => props.onClose?.()}
        >
            <div className={style.backdrop} />
            <Dialog.Panel className={style.panel}>{props.children}</Dialog.Panel>
        </Dialog>
    );
}
