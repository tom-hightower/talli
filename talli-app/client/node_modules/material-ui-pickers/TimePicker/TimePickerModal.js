"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
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
var React = __importStar(require("react"));
var BasePicker_1 = __importDefault(require("../_shared/BasePicker"));
var ModalWrapper_1 = __importDefault(require("../wrappers/ModalWrapper"));
var TimePicker_1 = __importDefault(require("./TimePicker"));
exports.TimePickerModal = function (props) {
    var value = props.value, format = props.format, autoOk = props.autoOk, onChange = props.onChange, ampm = props.ampm, forwardedRef = props.forwardedRef, seconds = props.seconds, other = __rest(props, ["value", "format", "autoOk", "onChange", "ampm", "forwardedRef", "seconds"]);
    return (React.createElement(BasePicker_1.default, __assign({ mergePreviousDateOnChange: true }, props), function (_a) {
        var date = _a.date, utils = _a.utils, handleAccept = _a.handleAccept, handleChange = _a.handleChange, handleClear = _a.handleClear, handleDismiss = _a.handleDismiss, handleSetTodayDate = _a.handleSetTodayDate, handleTextFieldChange = _a.handleTextFieldChange, isAccepted = _a.isAccepted, pick12hOr24hFormat = _a.pick12hOr24hFormat;
        return (React.createElement(ModalWrapper_1.default, __assign({ ref: forwardedRef, value: value, onClear: handleClear, onAccept: handleAccept, onChange: handleTextFieldChange, onDismiss: handleDismiss, onSetToday: handleSetTodayDate, isAccepted: isAccepted, format: pick12hOr24hFormat(utils.time12hFormat, utils.time24hFormat) }, other),
            React.createElement(TimePicker_1.default, { date: date, onChange: handleChange, ampm: ampm, seconds: seconds })));
    }));
};
exports.default = React.forwardRef(function (props, ref) { return (React.createElement(exports.TimePickerModal, __assign({}, props, { forwardedRef: ref }))); });
