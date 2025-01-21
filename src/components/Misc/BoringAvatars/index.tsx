import * as React from "react";

const ELEMENTS = 5;
const SIZE = 80;

export const RandomAvatar = (props: {
    name:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | null
    | undefined;
    colors?: string[];
    size: string | number | undefined;
    title: any;
    square: any;
    className?: string;
}) => {
    const colors = props.colors || [
        "#4800bd",
        "#44a7e1",
        "#00c65b",
        "#ecd400",
        "#f97700",
        "#fe1a51",
    ]; // colors based on mamoru colors
    if (!props.name) return null;

    const properties = generateColors(props.name, colors);

    return (
        <svg
            viewBox={"0 0 " + SIZE + " " + SIZE}
            fill="none"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            width={props.size}
            height={props.size}
            className={props.className}
        >
            {props.title && <title>{props.name}</title>}
            <mask
                id="mask__marble"
                maskUnits="userSpaceOnUse"
                x={0}
                y={0}
                width={SIZE}
                height={SIZE}
            >
                <rect
                    width={SIZE}
                    height={SIZE}
                    rx={props.square ? undefined : SIZE * 2}
                    fill="#FFFFFF"
                />
            </mask>
            <g mask="url(#mask__marble)">
                <rect width={SIZE} height={SIZE} fill={properties[0].color} />
                <path
                    filter="url(#prefix__filter0_f)"
                    d="M32.414 59.35L50.376 70.5H72.5v-71H33.728L26.5 13.381l19.057 27.08L32.414 59.35z"
                    fill={properties[1].color}
                    transform={
                        "translate(" +
                        properties[1].translateX +
                        " " +
                        properties[1].translateY +
                        ") rotate(" +
                        properties[1].rotate +
                        " " +
                        SIZE / 2 +
                        " " +
                        SIZE / 2 +
                        ") scale(" +
                        properties[2].scale +
                        ")"
                    }
                />
                <path
                    filter="url(#prefix__filter0_f)"
                    style={{
                        mixBlendMode: "overlay",
                    }}
                    d="M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z"
                    fill={properties[2].color}
                    transform={
                        "translate(" +
                        properties[2].translateX +
                        " " +
                        properties[2].translateY +
                        ") rotate(" +
                        properties[2].rotate +
                        " " +
                        SIZE / 2 +
                        " " +
                        SIZE / 2 +
                        ") scale(" +
                        properties[2].scale +
                        ")"
                    }
                />
                <path
                    filter="url(#prefix__filter0_f)"
                    style={{
                        mixBlendMode: "overlay",
                    }}
                    d="M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z"
                    fill={properties[3].color}
                    transform={
                        "translate(" +
                        properties[3].translateX +
                        " " +
                        properties[3].translateY +
                        ") rotate(" +
                        properties[3].rotate +
                        " " +
                        SIZE / 2 +
                        " " +
                        SIZE / 2 +
                        ") scale(" +
                        properties[3].scale +
                        ")"
                    }
                />
                <path
                    filter="url(#prefix__filter0_f)"
                    style={{
                        mixBlendMode: "plus-lighter",
                    }}
                    d="M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z"
                    fill={properties[4].color}
                    transform={
                        "translate(" +
                        properties[4].translateX +
                        " " +
                        properties[4].translateY +
                        ") rotate(" +
                        properties[4].rotate +
                        " " +
                        SIZE / 2 +
                        " " +
                        SIZE / 2 +
                        ") scale(" +
                        properties[4].scale +
                        ")"
                    }
                />
            </g>
            <defs>
                <filter
                    id="prefix__filter0_f"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    {/* <feFlood floodOpacity={-1} result="BackgroundImageFix" /> */}
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation={4} result="effect1_foregroundBlur" />
                </filter>
            </defs>
        </svg>
    );
};

export const hashCode = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        const character = name.charCodeAt(i);
        hash = (hash << 5) - hash + character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

export const getModulus = (num: number, max: number) => {
    return num % max;
};

export const getDigit = (number: number, ntn: number) => {
    return Math.floor((number / Math.pow(10, ntn)) % 10);
};

export const getBoolean = (number: any, ntn: any) => {
    return !(getDigit(number, ntn) % 2);
};

export const getAngle = (x: number, y: number) => {
    return (Math.atan2(y, x) * 180) / Math.PI;
};

export const getUnit = (
    number: number,
    range: number,
    index?: number | undefined
) => {
    const value = number % range;

    if (index && getDigit(number, index) % 2 === 0) {
        return -value;
    } else return value;
};

export const getRandomColor = (
    number: number,
    colors: any[],
    range: number
) => {
    return colors[number % range];
};

export const getContrast = (hexcolor: string) => {
    // If a leading # is provided, remove it
    if (hexcolor.slice(0, 1) === "#") {
        hexcolor = hexcolor.slice(1);
    }

    // Convert to RGB value
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);

    // Get YIQ ratio
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    // Check contrast
    return yiq >= 128 ? "#000000" : "#FFFFFF";
};

function generateColors(name: any, colors: any) {
    const numFromName = hashCode(name);
    const range = colors && colors.length;

    const elementsProperties = Array.from({ length: ELEMENTS }, (_, i) => ({
        color: getRandomColor(numFromName + i, colors, range),
        translateX: getUnit(numFromName * (i + 1), SIZE / 10, 1),
        translateY: getUnit(numFromName * (i + 1), SIZE / 10, 2),
        scale: 1.2 + getUnit(numFromName * (i + 1), SIZE / 20) / 10,
        rotate: getUnit(numFromName * (i + 1), 360, 1),
    }));

    return elementsProperties;
}
