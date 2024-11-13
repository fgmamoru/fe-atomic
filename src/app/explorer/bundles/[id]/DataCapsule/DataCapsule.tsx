import style from './DataCapsule.module.css';
import { ReactNode } from "react";

type DataCapsuleProps = {
    name: ReactNode;
    value: ReactNode;
};

export const DataCapsule = (props: DataCapsuleProps) => {
    return (
        <div className={style.DataCapsule}>
            <div className={style.DataCapsuleTitle}>{props.name}</div>
            <div className={style.DataCapsuleValue}><pre>{props.value}</pre></div>
        </div>
    )
};