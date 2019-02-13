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
        return (
            <div className="main">
                <Typography variant="h3" align='center' gutterBottom>{this.state.event.name}</Typography>
                <div>
                    {
                        this.state.view === "main" &&
                        <div>
                            <div className="options">
                                <Button className="button1" variant="contained" color="primary" onClick={this.manageEvent}>Manage Event</Button>
                                <Button className="button1" variant="contained" onClick={this.viewResults}>View Results</Button>
                            </div>
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
                    }
                    {
                        this.state.view === "results" &&
                        <div className="viewResults">
                            <div className="options">
                                <Button className="button1" variant="contained" onClick={this.manageEvent}>Manage Event</Button>
                                <Button className="button1" variant="contained" color="primary" onClick={this.viewResults}>View Results</Button>
                            </div>
                            <Typography variant="h5">Set up google sheets for results:</Typography>
                            <br />
                            <div className="instructions">
                                <div>1. Create a Google Sheet in your desired location</div>
                                <div>
                                    {/* TODO: This should automatically save, probably to firebase */}
                                    2. Grab the spreadsheet ID from the URL and paste it here: <input className="sheetId"></input>
                                    <div className="note">- https://docs.google.com/spreadsheets/d/<b>SPREADSHEET ID</b>/edit#gid=0</div>
                                </div>
                                <div>3. Share the spreadsheet with editing rights with <b>talli-455@talli-229017.iam.gserviceaccount.com</b></div>
                            </div>
                        </div>
                    }
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