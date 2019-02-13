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
                endVote: '',
                entries: []
            },
        };
        this.exportChild = React.createRef();
        this.eventChild = React.createRef();
        this.entryChild = React.createRef();
        this.votingChild = React.createRef();
    }

    componentDidMount() {
        var googleId = this.props.user.googleId;
        var query = firebase.database().ref('organizer/' + googleId + '/event');
        query.on('value', (snapshot) => {
            let events = snapshot.val();
            let eventBase = events[this.props.curEvent]['eventData'];
            let eventEntries = events[this.props.curEvent]['entries'];
            this.setState({
                event: {
                    id: eventBase['id'],
                    name: eventBase['name'],
                    location: eventBase['location'],
                    startDate: eventBase['startDate'],
                    endDate: eventBase['endDate'],
                    automate: eventBase['automate'],
                    startVote: eventBase['startVote'],
                    endVote: eventBase['endVote'],
                    entries: eventEntries
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

    viewResults = () => {
        this.setState({
            view: "results"
        })
    }

    manageEvent = () => {
        this.setState({
            view: "main"
        })
    }

    render() {
        // TODO: put these in their own components
        let mainContent = this.state.view === "main" ? (
            <div>
                <ExportOrgData ref={this.exportChild} event={this.state.event}/>
                <EditEntries ref={this.entryChild}/>
                <EditEvent ref={this.eventChild}/>
                <EditVoting ref={this.votingChild}/>
                <div className="box">
                    <Button className="listButtons" onClick={this.handleExport}>Export Event & Entry QR Codes</Button>
                    <Button className="listButtons" onClick={this.handleEntryEdit}>View/Add/Edit Entries</Button>
                    <Button className="listButtons" onClick={this.handleEventEdit}>View/Edit Event Details</Button>
                    <Button className="listButtons" onClick={this.handleOpenCloseVoting}>Open/Close Voting</Button>
                </div>
            </div>
        ) : (
            <div className="viewResults">
                View Results
            </div>
        );
        return (
            <div className="main">
                <Typography variant="h3" align='center' gutterBottom>{this.state.event.name}</Typography>
                <div className="options">
                    {/* TODO: Change css of these button according to the current state */}
                    <Button className="button1" variant="contained" color="primary" onClick={this.manageEvent}>Manage Event</Button>
                    <Button className="button1" variant="contained" onClick={this.viewResults}>View Results</Button>
                </div>
                <div>
                    { mainContent }
                </div>
                <br />
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