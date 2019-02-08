import { WithStyles } from '@material-ui/core/styles/withStyles';
import * as React from 'react';
import { Theme } from '@material-ui/core';
import { ClockTypeType } from '../../constants/ClockType';
export interface ClockProps extends WithStyles<typeof styles> {
    type: ClockTypeType;
    value: number;
    onChange: (value: number, isFinish?: boolean) => void;
    ampm?: boolean;
    children: Array<React.ReactElement<any>>;
}
export declare class Clock extends React.Component<ClockProps> {
    static propTypes: any;
    static defaultProps: {
        ampm: boolean;
    };
    isMoving: boolean;
    setTime(e: any, isFinish?: boolean): void;
    handleTouchMove: (e: React.TouchEvent<Element>) => void;
    handleTouchEnd: (e: React.TouchEvent<Element>) => void;
    handleMove: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    handleMouseUp: (e: React.MouseEvent<Element, MouseEvent>) => void;
    hasSelected: () => boolean;
    render(): JSX.Element;
}
export declare const styles: (theme: Theme) => Record<"container" | "clock" | "squareMask" | "pin", import("@material-ui/core/styles/withStyles").CSSProperties>;
declare const _default: React.ComponentType<(Pick<ClockProps, "children" | "value" | "onChange" | "ampm" | "type"> & import("@material-ui/core").StyledComponentProps<"container" | "clock" | "squareMask" | "pin">) | (Pick<ClockProps & {
    children?: React.ReactNode;
}, "children" | "value" | "onChange" | "ampm" | "type"> & import("@material-ui/core").StyledComponentProps<"container" | "clock" | "squareMask" | "pin">)>;
export default _default;
