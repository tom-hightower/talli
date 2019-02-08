"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PropTypes = __importStar(require("prop-types"));
var React = __importStar(require("react"));
var PickerToolbar_1 = __importDefault(require("../_shared/PickerToolbar"));
var ToolbarButton_1 = __importDefault(require("../_shared/ToolbarButton"));
var WithUtils_1 = require("../_shared/WithUtils");
var Calendar_1 = __importDefault(require("./components/Calendar"));
var YearSelection_1 = __importDefault(require("./components/YearSelection"));
var DatePicker = /** @class */ (function (_super) {
    __extends(DatePicker, _super);
    function DatePicker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            showYearSelection: Boolean(_this.props.openToYearSelection),
        };
        _this.handleYearSelect = function (date) {
            _this.props.onChange(date, false);
            _this.openCalendar();
        };
        _this.openYearSelection = function () {
            _this.setState({ showYearSelection: true });
        };
        _this.openCalendar = function () {
            _this.setState({ showYearSelection: false });
        };
        return _this;
    }
    Object.defineProperty(DatePicker.prototype, "date", {
        get: function () {
            return this.props.date;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, "minDate", {
        get: function () {
            return this.props.utils.date(this.props.minDate);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, "maxDate", {
        get: function () {
            return this.props.utils.date(this.props.maxDate);
        },
        enumerable: true,
        configurable: true
    });
    DatePicker.prototype.render = function () {
        var showYearSelection = this.state.showYearSelection;
        var _a = this.props, disablePast = _a.disablePast, disableFuture = _a.disableFuture, onChange = _a.onChange, animateYearScrolling = _a.animateYearScrolling, leftArrowIcon = _a.leftArrowIcon, rightArrowIcon = _a.rightArrowIcon, renderDay = _a.renderDay, utils = _a.utils, shouldDisableDate = _a.shouldDisableDate, allowKeyboardControl = _a.allowKeyboardControl;
        return (React.createElement(React.Fragment, null,
            React.createElement(PickerToolbar_1.default, null,
                React.createElement(ToolbarButton_1.default, { variant: "subtitle1", onClick: this.openYearSelection, selected: showYearSelection, label: utils.getYearText(this.date) }),
                React.createElement(ToolbarButton_1.default, { variant: "h4", onClick: this.openCalendar, selected: !showYearSelection, label: utils.getDatePickerHeaderText(this.date) })),
            this.props.children,
            showYearSelection ? (React.createElement(YearSelection_1.default, { date: this.date, onChange: this.handleYearSelect, minDate: this.minDate, maxDate: this.maxDate, disablePast: disablePast, disableFuture: disableFuture, animateYearScrolling: animateYearScrolling })) : (React.createElement(Calendar_1.default, { date: this.date, onChange: onChange, disablePast: disablePast, disableFuture: disableFuture, minDate: this.minDate, maxDate: this.maxDate, leftArrowIcon: leftArrowIcon, rightArrowIcon: rightArrowIcon, renderDay: renderDay, shouldDisableDate: shouldDisableDate, allowKeyboardControl: allowKeyboardControl }))));
    };
    DatePicker.propTypes = {
        openToYearSelection: PropTypes.bool,
    };
    DatePicker.defaultProps = {
        minDate: '1900-01-01',
        maxDate: '2100-01-01',
        openToYearSelection: false,
    };
    return DatePicker;
}(React.PureComponent));
exports.DatePicker = DatePicker;
exports.default = WithUtils_1.withUtils()(DatePicker);
