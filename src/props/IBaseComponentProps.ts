import React from "react";

export interface IBaseComponentProps {
    id?: string;
    name?: string;
    classList?: string[]
    style?: React.CSSProperties
}