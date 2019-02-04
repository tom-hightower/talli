import React from 'react';
import { Typography, Button } from '@material-ui/core';
import '../component_style/ViewEvent.css';
import firebase from '../../firebase';
import ExportOrgData from './Dialogs/ExportOrgData';
import EditEntries from './Dialogs/EditEntries';
import EditEvent from './Dialogs/EditEvent';
import EditVoting from './Dialogs/EditVoting';

/**
 * OrganizerView > ViewEvent
 * Allows organizers to view the details of an event
 * that they have already created.
 * TODO: read existing events from database and render
 */
export default class ViewEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: 'main',
            event: {
                id: '', 
                name: '', 
                location:'', 
                startDate: '', 
                endDate: '', 
                automate: false, 
                startVote: '', 
                endVote: ''
            },
        };
        this.exportChild = React.createRef();
        this.eventChild = React.createRef();
        this.entryChild = React.createRef();
        this.votingChild = React.createRef();
    }

    componentDidMount() {
        var query = firebase.database().ref('event');
        query.on('value', (snapshot) => {
            let events = snapshot.val();
            var key = events[this.props.curEvent]['eventData']
            var tempkey;
            for (var k in key) {
                tempkey = k;
            }
            let eventBase = events[this.props.curEvent].eventData[tempkey];
            this.setState({ 
                event: {
                    id: eventBase['id'],
                    name: eventBase['name'],
                    location: eventBase['location'],
                    startDate: eventBase['startDate'],
                    endDate: eventBase['endDate'],
                    automate: eventBase['automate'],
                    startVote: eventBase['startVote'],
                    endVote: eventBase['endVote']
                }
            });
        });
    }

    handleExport = () => {
        this.exportChild.current.handleOpen();
    }

    handleEntryEdit = () => {
        this.entryChild.current.handleOpen();
    }

    handleEventEdit = () => {
        this.eventChild.current.handleOpen();
    }

    handleOpenCloseVoting = () => {
        this.votingChild.current.handleOpen();
    }

    goBack = () => {
        this.props.handler(this.props.orgViews.MAIN);
    }

    render() {
        return (
            <div className="main">
                <ExportOrgData ref={this.exportChild} event={this.state.event}/>
                <EditEntries ref={this.entryChild}/>
                <EditEvent ref={this.eventChild}/>
                <EditVoting ref={this.votingChild}/>
                <Typography variant="h3" align='center' gutterBottom>{this.state.event.name}</Typography>
                <div className="options">
                    <Button className="button1" variant="contained" color="primary">Manage Event</Button>
                    <Button className="button1" variant="contained">View Results</Button>
                </div>
                <div className="box">
                    <Button className="listButtons" onClick={this.handleExport}>Export Event & Entry QR Codes</Button>
                    <Button className="listButtons" onClick={this.handleEntryEdit}>View/Add/Edit Entries</Button>
                    <Button className="listButtons" onClick={this.handleEventEdit}>View/Edit Event Details</Button>
                    <Button className="listButtons" onClick={this.handleOpenCloseVoting}>Open/Close Voting</Button>
                </div>
                <Button
                    variant="contained"
                    className="buttons"
                    type="button"
                    onClick={this.goBack} >
                    Back
                </Button>
            </div>
        )
    }
}