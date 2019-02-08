import * as React from 'react';
import { WithStyles } from '@material-ui/core';
import { WithUtilsProps } from '../_shared/WithUtils';
import ClockType from '../constants/ClockType';
import { MeridiemMode } from '../DateTimePicker/components/DateTimePickerHeader';
import { MaterialUiPickersDate } from '../typings/date';
export interface BaseTimePickerProps {
    /** 12h/24h view for hour selection clock */
    ampm?: boolean;
    /** Show the seconds view */
    seconds?: boolean;
}
export interface TimePickerProps extends BaseTimePickerProps, WithUtilsProps, WithStyles<typeof styles, true> {
    date: MaterialUiPickersDate;
    onChange: (date: MaterialUiPickersDate, isFinished?: boolean) => void;
}
interface TimePickerState {
    openView: ClockType;
    meridiemMode: MeridiemMode;
}
export declare class TimePicker extends React.Component<TimePickerProps> {
    static propTypes: any;
    static defaultProps: {
        children: null;
        ampm: boolean;
        seconds: boolean;
    };
    state: TimePickerState;
    setMeridiemMode: (mode: MeridiemMode) => () => void;
    handleChange: ({ time, isFinish, openMinutes, openSeconds, }: {
        time: any;
        isFinish?: boolean | undefined;
        openMinutes: boolean;
        openSeconds: boolean;
    }) => void;
    handleHourChange: (time: any, isFinish?: boolean | undefined) => void;
    handleMinutesChange: (time: any, isFinish?: boolean | undefined) => void;
    handleSecondsChange: (time: any, isFinish?: boolean | undefined) => void;
    openSecondsView: () => void;
    openMinutesView: () => void;
    openHourView: () => void;
    render(): JSX.Element;
}
export declare const styles: () => Record<"separator" | "toolbar" | "ampmSelection" | "ampmLabel" | "hourMinuteLabel" | "toolbarLeftPadding" | "ampmSelectionWithSeconds" | "hourMinuteLabelReverse", import("@material-ui/core/styles/withStyles").CSSProperties>;
declare const _default: React.ComponentType<Pick<Pick<TimePickerProps, "onChange" | "ampm" | "date" | "classes" | "theme" | "innerRef" | "seconds"> & {
    children?: React.ReactNode;
}, "children" | "onChange" | "ampm" | "date" | "seconds"> & import("@material-ui/core").StyledComponentProps<"separator" | "toolbar" | "ampmSelection" | "ampmLabel" | "hourMinuteLabel" | "toolbarLeftPadding" | "ampmSelectionWithSeconds" | "hourMinuteLabelReverse">>;
export default _default;
