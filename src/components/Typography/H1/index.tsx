import React from "react";
import styles from "./index.module.css";
import clsx from "clsx";

export const H1 = (props: {
    children: React.ReactNode
    end?: React.ReactNode
    className?: string
}) => {
    const className = clsx(styles.H1, props.className)
    return (
        <div className={className}>

            <h1>
                {props.children}
            </h1>

            <span>
                {props.end}
            </span>
        </div>

    )
}