import React from 'react';
import { Typography, Button, TextField } from '@material-ui/core';
import openSocket from 'socket.io-client';
import firebase from '../../firebase';
import ExportOrgData from './Dialogs/ExportOrgData';
import EditEntries from './Dialogs/EditEntries';
import EditEvent from './Dialogs/EditEvent';
import EditVoting from './Dialogs/EditVoting';
import AddEntries from './Dialogs/AddEntries';
import EditWeights from './Dialogs/EditWeights';
import AddBallot from './Dialogs/AddBallot';
import '../component_style/ViewEvent.css';
import ShowError from './Dialogs/ShowError';
import ConfirmFinalize from './Dialogs/ConfirmFinalize';

const socket = openSocket('http://localhost:5000');

/**
 * OrganizerView > ViewEvent
 * Allows organizers to view the details of an event
 * that they have already created.
 */
export default class ViewEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: 'main',
            event: {
                id: '',
                name: '',
                location: '',
                startDate: '',
                endDate: '',
                automate: false,
                startVote: '',
                endVote: '',
                sheetURL: 'Google Sheet URL',
                entries: []
            },
        };
        this.exportChild = React.createRef();
        this.eventChild = React.createRef();
        this.entryChild = React.createRef();
        this.addChild = React.createRef();
        this.votingChild = React.createRef();
        this.weightsChild = React.createRef();
        this.addVoteChild = React.createRef();
        this.errorChild = React.createRef();
        this.finalizeChild = React.createRef();
    }

    componentDidMount() {
        const googleId = this.props.user.googleId;
        var query = firebase.database().ref(`organizer/${googleId}/event`);
        query.on('value', (snapshot) => {
            const events = snapshot.val();
            if (events && events[this.props.curEvent]) {
                const eventBase = events[this.props.curEvent].eventData;
                const eventEntries = events[this.props.curEvent].entries;
                this.setState({
                    view: this.state.view,
                    event: {
                        id: eventBase['id'],
                        name: eventBase['name'],
                        location: eventBase['location'],
                        startDate: eventBase['startDate'],
                        endDate: eventBase['endDate'],
                        automate: eventBase['automate'],
                        startVote: eventBase['startVote'],
                        endVote: eventBase['endVote'],
                        sheetURL: eventBase['sheetURL'],
                        entries: eventEntries
                    }
                });
            }
        });

        socket.on('error', (data) => {
            console.log(data.error);
            this.handleError(data.error);
        });
    }

    componentWillUnmount() {
        socket.removeListener('error');
    }

    handleExport = () => {
        this.exportChild.current.handleOpen();
    }

    handleEntryEdit(entryID) {
        this.entryChild.current.handleOpen(entryID);
    }

    handleOpenEntries = () => {
        this.setState({
            view: 'entries',
            event: this.state.event
        });
    }

    handleAddEntry = () => {
        this.addChild.current.handleOpen();
    }

    handleEventEdit = () => {
        this.eventChild.current.handleOpen();
    }

    handleOpenCloseVoting = () => {
        this.votingChild.current.handleOpen();
    }

    handleWeights = () => {
        this.weightsChild.current.handleOpen();
    }

    handleError = (message) => {
        this.errorChild.current.handleOpen(message);
    }

    handleAddVote = () => {
        this.addVoteChild.current.handleOpen();
    }

    goBack = () => {
        if (this.state.view === 'main' || this.state.view === "results") {
            this.props.handler(this.props.orgViews.MAIN);
        } else if (this.state.view === 'entries') {
            this.setState({
                view: 'main',
                event: this.state.event
            });
        }
    }

    viewResults = () => {
        this.setState({
            view: "results"
        });
    }

    manageEvent = () => {
        this.setState({
            view: "main"
        });
    }

    finalizeConfirm = () => {
        this.finalizeChild.current.handleOpen();
    }

    finalizeResults = () => {
        socket.emit('finalize_results', {
            googleId: this.props.user.googleId,
            eventId: this.state.event.id
        });
    }

    keyPress(e) {
        if (e.key === 'Enter') {
            this.handleSubmit();
        }
    }

    handleURLChange = (e) => {
        e.preventDefault();
        const newEvent = this.state.event;
        newEvent.sheetURL = e.target.value;
        this.setState({
            view: this.state.view,
            event: newEvent
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        socket.emit('send_url', {
            url: this.state.event.sheetURL,
            googleId: this.props.user.googleId,
            eventId: this.state.event.id,
        });
    }

    sendEntries = () => {
        socket.emit('send_entries', {
            googleId: this.props.user.googleId,
            eventId: this.state.event.id,
            entries: this.state.event.entries
        });
    }

    render() {
        return (
            <div className="main">
                {
                    this.props.user != null &&
                    <div>
                        <ExportOrgData ref={this.exportChild} event={this.state.event} />
                        <EditEntries ref={this.entryChild} event={this.state.event} googleId={this.props.user.googleId} />
                        <ConfirmFinalize ref={this.finalizeChild} handler={this.finalizeResults} />
                        <AddEntries ref={this.addChild} event={this.state.event} googleId={this.props.user.googleId} />
                        <EditEvent ref={this.eventChild} event={this.state.event} googleId={this.props.user.googleId} handler={this.props.handler} orgViews={this.props.orgViews} />
                        <AddBallot ref={this.addVoteChild} event={this.state.event} googleId={this.props.user.googleId} />
                        <EditVoting ref={this.votingChild} event={this.state.event} googleId={this.props.user.googleId} />
                        <EditWeights ref={this.weightsChild} event={this.state.event} googleId={this.props.user.googleId} />
                        <ShowError ref={this.errorChild} event={this.state.event} googleId={this.props.googleID} />
                        <Typography variant="h3" align='center' gutterBottom>{this.state.event.name}</Typography>
                    </div>
                }
                {
                    this.state.view === 'main' &&
                    <div>
                        <div className="options">
                            <Button className="button1" variant="contained" color="primary" onClick={this.manageEvent}>Manage Event</Button>
                            <Button className="button1" variant="contained" onClick={this.viewResults}>View Results</Button>
                        </div>
                        <div className="box">
                            <Button className="listButtons" onClick={this.handleExport}>Export Event & Entry QR Codes</Button>
                            <Button className="listButtons" onClick={this.handleOpenEntries}>View/Add/Edit Entries</Button>
                            <Button className="listButtons" onClick={this.handleEventEdit}>View/Edit Event Details</Button>
                            <Button className="listButtons" onClick={this.handleOpenCloseVoting}>Open/Close Voting</Button>
                        </div>
                    </div>
                }
                {
                    this.state.view === 'entries' && this.state.event.entries !== undefined &&
                    <div>
                        <div className="options">
                            <Button className="button1" variant="contained" color="primary" onClick={this.manageEvent}>Manage Event</Button>
                            <Button className="button1" variant="contained" onClick={this.viewResults}>View Results</Button>
                        </div>
                        <div className="box">
                            {
                                Object.values(this.state.event.entries).map((entry, index) => (
                                    <Button key={index} className="listButtons" onClick={() => this.handleEntryEdit(entry.id)}>
                                        {entry.title} by {entry.presenters}
                                    </Button>
                                ))
                            }
                            <Button className="listButtons" color="primary" onClick={this.handleAddEntry}>Add New Entry</Button>
                        </div>
                    </div>
                }
                {
                    this.state.view === 'entries' && this.state.event.entries === undefined &&
                    <div>
                        <div className="options">
                            <Button className="button1" variant="contained" color="primary" onClick={this.manageEvent}>Manage Event</Button>
                            <Button className="button1" variant="contained" onClick={this.viewResults}>View Results</Button>
                        </div>
                        <div className="box">
                            <Button className="listButtons" color="primary" onClick={this.handleAddEntry}>Add New Entry</Button>
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
                        <br />
                        <div className="saveItems">
                            <div className="sheetsExport">
                                <Typography variant="h5">Set up Google Sheets to export results:</Typography>
                                <br />
                                <div className="instructions">
                                    <div>1. Create a Google Sheet in your desired location</div>
                                    <div>
                                        2. Share the spreadsheet with editing rights with:
                                        <br />
                                        <div className="main">
                                            <b>talli-455@talli-229017.iam.gserviceaccount.com</b>
                                        </div>
                                    </div>
                                    <div>
                                        3. Grab the spreadsheet's URL and paste it here:
                                        <div className="main">
                                            <TextField
                                                id="standard-dense"
                                                label="Spreadsheet URL"
                                                margin="dense"
                                                className="sheetURL"
                                                value={this.state.event.sheetURL}
                                                onKeyDown={this.keyPress}
                                                onChange={this.handleURLChange}
                                            />
                                            <br />
                                            <Button variant="contained" size="small" color="default" onClick={this.handleSubmit}>
                                                Submit
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="manualBallots">
                                <Typography variant="h5">Add paper ballot(s) manually into system:</Typography>
                                <br />
                                <div className="addVoteBox">
                                    <Button className="listButtons" onClick={this.handleAddVote}>Add Vote</Button>
                                </div>
                                <br />
                                <div>
                                    <Typography variant="h5">Results Controls:</Typography>
                                    <Button variant="contained" className="buttons weights" type="button" onClick={this.handleWeights}>Apply Custom Weights</Button>
                                    <Button variant="contained" className="buttons" type="button" onClick={this.sendEntries}>Sync entries</Button>
                                    <br />
                                    <Button variant="contained" className="buttons" color="primary" type="button" onClick={this.finalizeConfirm}>Finalize Results</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <br />
                <Button
                    variant="contained"
                    className="buttons"
                    type="button"
                    onClick={this.goBack}
                >
                    Back
                </Button>
            </div>
        );
    }
}
