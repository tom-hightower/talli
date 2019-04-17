import React, { Component } from 'react';
import { Typography, Button } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { navigate } from 'react-mini-router';
import '../component_style/Voter.css';

/**
 * Rankings have been submitted, unimplemented
 */
export default class RanksSubmitted extends Component {
    render() {
        return (
            <div>
                <div className="SubmissionPage">
                    <Typography variant="h4" align="center" className="submissionText" gutterBottom>
                        Submission Successful.
                    </Typography>
                    <Typography variant="h5" align="center" className="questionText" gutterBottom>
                        Thank you for your participation!
                    </Typography>
                    <div className="buttonContainer">
                        <Button
                            variant="contained"
                            color="default"
                            className="homeButton"
                            onClick={() => navigate('/')}
                        >
                            <HomeIcon />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}
