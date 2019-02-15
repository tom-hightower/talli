import React from 'react';
import { Typography, Button } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import '../component_style/Voter.css';
import {getCookie} from '../../cookies.js'
import firebase from '../../firebase.js';

/**
 * Confirm that the attendee wants to submit, unimplemented
 */
export default class SubmitConfirm extends React.Component {
    SubmitRankings() {
        // TODO: Handle Ranking submission and flagging UID as submitted here

        var cookies_value = getCookie('UserID');
        const itemsRef = firebase.database().ref('cookies/' + cookies_value);
        itemsRef.child(this.props.eventID).set(this.props.eventID);
        this.props.handler(this.props.voteViews.SUBMITTED);
    }

    render() {
        return (
            <div>
                <div className="SubmissionPage">
                    <Typography variant='h4' align='center' className='submissionText' gutterBottom>
                        You may only submit your rankings once.
                    </Typography>
                    <Typography variant='h5' align='center' className='questionText' gutterBottom>
                        Would you like to continue?
                    </Typography>
                    <div className="buttonContainer">
                        <Button variant="contained" color="default" className="goBackButton" onClick={() => this.props.handler(this.props.voteViews.RANK)}>
                            <CloseIcon />
                        </Button>
                        <Button variant="contained" color="default" className="confirmButton" onClick={() => this.SubmitRankings()}>
                            <CheckIcon />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}