import React, { Component } from 'react';

export default class Countdown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            days: 0,
            hours: 0,
            min: 0,
            sec: 0,
        };
    }

    componentDidMount() {
        // update every second
        this.interval = setInterval(() => {
            const date = this.calculateCountdown(this.props.date);
            date ? this.setState(date) : this.stop();
        }, 1000);
    }

    componentWillUnmount() {
        this.stop();
    }

    calculateCountdown(endDate) {
        let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000;

        // clear countdown when date is reached
        if (diff <= 0) return false;

        const timeLeft = {
            years: 0,
            days: 0,
            hours: 0,
            min: 0,
            sec: 0,
            millisec: 0,
        };

        // calculate time difference between now and expected date
        if (diff >= (365.25 * 86400)) { // 365.25 * 24 * 60 * 60
            timeLeft.years = Math.floor(diff / (365.25 * 86400));
            diff -= timeLeft.years * 365.25 * 86400;
        }
        if (diff >= 86400) { // 24 * 60 * 60
            timeLeft.days = Math.floor(diff / 86400);
            diff -= timeLeft.days * 86400;
        }
        if (diff >= 3600) { // 60 * 60
            timeLeft.hours = Math.floor(diff / 3600);
            diff -= timeLeft.hours * 3600;
        }
        if (diff >= 60) {
            timeLeft.min = Math.floor(diff / 60);
            diff -= timeLeft.min * 60;
        }
        timeLeft.sec = diff;

        return timeLeft;
    }

    stop() {
        clearInterval(this.interval);
    }

    addLeadingZeros(value) {
        let valueStr = String(value);
        while (valueStr.length < 2) {
            valueStr = `0${valueStr}`;
        }
        return valueStr;
    }

    render() {
        const countDown = this.state;
        let renderCount;


        if (countDown.days > 7) {
            renderCount = (
                <>
                    <strong>{this.addLeadingZeros(countDown.days)}</strong>
                    <span> Days</span>
                </>
            );
        } else if (countDown.days > 0) {
            renderCount = (
                <>
                    <strong>{this.addLeadingZeros(countDown.days)}</strong>
                    <span>{countDown.days === 1 ? ' Day, ' : ' Days, '}</span>
                    <strong>{this.addLeadingZeros(countDown.hours)}</strong>
                    <span>Hours</span>
                </>
            );
        } else if (countDown.hours > 1) {
            renderCount = (
                <>
                    <strong>{this.addLeadingZeros(countDown.hours)}</strong>
                    <span> Hours, </span>
                    <strong>{this.addLeadingZeros(countDown.min)}</strong>
                    <span> Min</span>
                </>
            );
        } else {
            renderCount = (
                <>
                    <strong>{this.addLeadingZeros(countDown.min)}</strong>
                    <span> Min, </span>
                    <strong>{this.addLeadingZeros(countDown.sec)}</strong>
                    <span> Sec</span>

                </>
            );
        }


        return (
            <div className="Countdown">
                {renderCount}
            </div>
        );
    }
}

Countdown.defaultProps = {
    date: new Date()
};
