import * as React from 'react';
import { Theme } from '@material-ui/core';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import DateTimePickerView, { DateTimePickerViewType } from '../../constants/DateTimePickerView';
export interface DateTimePickerTabsProps extends WithStyles<typeof styles, true> {
    view: DateTimePickerViewType;
    onChange: (view: DateTimePickerView) => void;
    dateRangeIcon: React.ReactNode;
    timeIcon: React.ReactNode;
}
export declare const DateTimePickerTabs: React.SFC<DateTimePickerTabsProps>;
export declare const styles: (theme: Theme) => {
    tabs: {
        color: string;
        backgroundColor: string;
    };
};
declare const _default: React.ComponentType<(Pick<Pick<DateTimePickerTabsProps & {
    children?: React.ReactNode;
}, "view" | "children" | "onChange" | "theme" | "dateRangeIcon" | "timeIcon"> & import("@material-ui/core").StyledComponentProps<"tabs">, "view" | "children" | "onChange" | "classes" | "dateRangeIcon" | "timeIcon"> & Partial<import("@material-ui/core").WithTheme>) | (Pick<Pick<DateTimePickerTabsProps & {
    children?: React.ReactNode;
}, "view" | "children" | "onChange" | "theme" | "dateRangeIcon" | "timeIcon"> & import("@material-ui/core").StyledComponentProps<"tabs"> & {
    children?: React.ReactNode;
}, "view" | "children" | "onChange" | "classes" | "dateRangeIcon" | "timeIcon"> & Partial<import("@material-ui/core").WithTheme>)>;
export default _default;
