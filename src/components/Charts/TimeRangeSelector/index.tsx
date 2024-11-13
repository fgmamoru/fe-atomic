import clsx from "clsx";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { DayOrEpoch, TimeRange } from "@/types";

export const TimeRangeSelectorButton = ({
    children,
    onClick,
    active,
}: {
    children: string,
    onClick: () => void
    active: boolean
}) => {
    const className = clsx(styles.TimeRangeSelectorButton, {
        [styles.TimeRangeSelectorButtonActive]: active
    })

    return (
        <button
            className={className}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export type TimeRangeSelectorProps = {
    onChange?: (value: TimeRange) => void
    ranges?: TimeRange[]
}

const TimeRangeTextMap = {
    [TimeRange.DAY]: 'Day',
    [TimeRange.WEEK]: 'Week',
    [TimeRange.MONTH]: 'Month',
    [TimeRange.YEAR]: 'Year',
    [TimeRange.ALL]: 'All time'
}

export const TimeRangeSelector = ({
    onChange,
    ranges = [TimeRange.DAY, TimeRange.WEEK, TimeRange.MONTH, TimeRange.YEAR, TimeRange.ALL]
}: TimeRangeSelectorProps) => {
    const [value, setValue] = useState<TimeRange>(TimeRange.DAY);
    useEffect(() => {
        setValue(ranges[0]);
    }, [])

    useEffect(() => {
        onChange?.(value);
    }, [value]);

    return (
        <div className={styles.TimeRangeSelector}>
            {ranges.map((range) => (
                <TimeRangeSelectorButton
                    key={range}
                    active={value === range}
                    onClick={() => setValue(range)}
                >
                    {TimeRangeTextMap[range]}
                </TimeRangeSelectorButton>
            ))}
        </div>
    )
}

export const DaysEpochSelector = ({
    onChange
}: {
    onChange?: (value: DayOrEpoch) => void
}) => {
    const [value, setValue] = useState<DayOrEpoch>(DayOrEpoch.DAY);
    useEffect(() => {
        onChange?.(value);
    }, [value]);

    return (
        <div className={styles.TimeRangeSelector}>
            <TimeRangeSelectorButton
                active={value === DayOrEpoch.DAY}
                onClick={() => setValue(DayOrEpoch.DAY)}
            >Day</TimeRangeSelectorButton>
            <TimeRangeSelectorButton
                active={value === DayOrEpoch.EPOCH}
                onClick={() => setValue(DayOrEpoch.EPOCH)}
            >Epoch</TimeRangeSelectorButton>
        </div>
    )
}

export const CustomSelector = ({ options, onChange }: {
    onChange?: (value: string) => void
    options: { label: string }[]
}) => {
    const [value, setValue] = useState(options[0].label);
    useEffect(() => {
        onChange?.(value);
    }, [value]);
    return (
        <div className={styles.TimeRangeSelector}>
            {options.map((option) => (
                <TimeRangeSelectorButton
                    key={option.label}
                    active={value === option.label}
                    onClick={() => setValue(option.label)}
                >
                    {option.label}
                </TimeRangeSelectorButton>
            ))}
        </div>
    )

}