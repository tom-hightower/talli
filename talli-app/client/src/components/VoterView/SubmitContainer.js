import React from 'react';
import BellIcon from '@material-ui/icons/NotificationImportant';
import { Button } from '@material-ui/core';
import '../component_style/SubmitContainer.css';

export default class SubmitContainer extends React.Component {

    render() {
        return (
            <div className='SubmitDiv'>
                <BellIcon className='BellIcon' />
                <div className='SubmitText'>
                    {/* TODO: have this generated off of the end time of the event
                */}
                    Voting closes in xx:xx
                </div>
                <div className='buttonDiv'>
                    <Button variant="contained" color="primary" onClick={this.handleSubmit.bind(this)}> Submit </Button>
                </div>
            </div>
        );
    }

    handleSubmit() {
        this.props.submitRankings();
        this.props.handler(this.props.voteViews.CONFIRM);
    }
}