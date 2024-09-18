import React, { useState, useRef, useEffect } from 'react';
import { IBaseComponentProps } from '../props/IBaseComponentProps';
import Styles from "./Accordion.module.css"

interface AccordionProps extends IBaseComponentProps {
    getHeader: () => React.ReactNode;
    children: React.ReactNode;
}

export function Accordion(props: AccordionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [height, setHeight] = useState<number | 'auto'>(0);
    const contentRef = useRef<HTMLDivElement>(null);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (isOpen) {
            setHeight(contentRef.current?.scrollHeight || 'auto');
        } else {
            setHeight(0);
        }
    }, [isOpen]);

    return (
        <div className={`${Styles.accordion_parent} ${props.classList?.join(" ")}`} style={props.style}>
            <div
                onClick={toggleAccordion}
            >
                {props.getHeader()}
            </div>
            <div
                ref={contentRef}
                style={{
                    height: height,
                    overflow: 'hidden',
                    transition: 'height 0.3s ease',
                }}
            >
                {props.children}
            </div>
        </div>
    );
};