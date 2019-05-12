import React, { Component } from 'react';
import { Typography, Button, TextField, Tooltip } from '@material-ui/core';
import openSocket from 'socket.io-client';
import CheckCircle from '@material-ui/icons/CheckCircle';
import firebase from '../../firebase';
import ExportOrgData from './Dialogs/ExportOrgData';
import EditEntries from './Dialogs/EditEntries';
import EditEvent from './Dialogs/EditEvent';
import EditVoting from './Dialogs/EditVoting';
import AddEntries from './Dialogs/AddEntries';
import EditWeights from './Dialogs/EditWeights';
import AddBallot from './Dialogs/AddBallot';
import ShowError from './Dialogs/ShowError';
import ConfirmFinalize from './Dialogs/ConfirmFinalize';
import '../component_style/ViewEvent.css';

const config = require('../../config.json');

const socket = openSocket(
    (config.Global.devMode ?
        `http://localhost:${config.Global.serverPort}` :
        `${(config.Global.sslEnabled ? "https" : "http")}://${config.Global.hostURL}`
    )
);

/**
 * OrganizerView > ViewEvent
 * Allows organizers to view the details of an event
 * that they have already created.
 */
export default class ViewEvent extends Component {
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
            urlConfirm: false,
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
        const query = firebase.database().ref(`organizer/${googleId}/event`);
        query.on('value', (snapshot) => {
            const events = snapshot.val();
            if (events && events[this.props.curEvent]) {
                const eventBase = events[this.props.curEvent].eventData;
                const eventEntries = events[this.props.curEvent].entries;
                this.setState({
                    view: this.state.view,
                    event: {
                        id: eventBase.id,
                        name: eventBase.name,
                        location: eventBase.location,
                        startDate: eventBase.startDate,
                        endDate: eventBase.endDate,
                        automate: eventBase.automate,
                        startVote: eventBase.startVote,
                        endVote: eventBase.endVote,
                        sheetURL: eventBase.sheetURL,
                        entries: eventEntries,
                        weights: eventBase.weights
                    },
                    urlConfirm: this.state.urlConfirm,
                    totalBallots: 0,
                    totalSubmitted: 0,
                    topThree: {
                        first: '',
                        second: '',
                        third: ''
                    }
                }, () => {
                    this.refreshStats();
                    socket.emit('send_url', {
                        url: this.state.event.sheetURL,
                        googleId: this.props.user.googleId,
                        eventId: this.state.event.id,
                    });
                });
            }
        });

        socket.on('error', (data) => {
            console.log(data.error);
            this.handleError(data.error);
        });

        socket.on('url_confirm', () => {
            this.setState({
                view: this.state.view,
                event: this.state.event,
                urlConfirm: true,
            });
        });
    }

    componentWillUnmount() {
        socket.removeAllListeners();
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
        if (this.state.view === "results") {
            this.errorChild.current.handleOpen(message);
        }
        if (message === "Could not get sheet information" || message === "Error with sheet authentication") {
            this.setState({
                view: this.state.view,
                event: this.state.event,
                urlConfirm: false,
            });
        }
    }

    handleAddVote = () => {
        this.addVoteChild.current.handleOpen();
    }

    goBack = () => {
        if (this.state.view === 'main' || this.state.view === 'results') {
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
            view: 'results'
        });
    }

    manageEvent = () => {
        this.setState({
            view: 'main'
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

    getTopVotes(topVotes, rankings) {
        const words = ['first', 'second', 'third'];
        const newTop = topVotes;
        for (let i = 1; i <= 3; i++) {
            if (rankings[i]) {
                if (!newTop[rankings[i].id]) newTop[rankings[i].id] = 0;
                newTop[rankings[i].id] += this.state.event.weights[words[i - 1]];
            }
        }
        return newTop;
    }

    refreshStats = () => {
        firebase.database().ref(`event/${this.state.event.id}/`).once('value').then(snap => {
            const event = snap.val();
            let totalBallots = 0;
            if (event.attendees) totalBallots += Object.keys(event.attendees).length;
            if (event.manual) totalBallots += Object.keys(event.manual).length;
            let totalSubmitted = 0;
            let topVotes = {};
            const sortVotes = [];
            if (event.attendees) {
                for (let user in event.attendees) {
                    if (event.attendees[user].submitted) {
                        totalSubmitted += 1;
                    }
                    const rankings = event.attendees[user].rankings;
                    topVotes = this.getTopVotes(topVotes, rankings);
                }
            }
            if (event.manual) {
                for (let user in event.manual) {
                    totalSubmitted += 1;
                    const rankings = event.manual[user];
                    topVotes = this.getTopVotes(topVotes, rankings);
                }
            }
            for (let ballot in topVotes) {
                sortVotes.push([ballot, topVotes[ballot]]);
            }
            sortVotes.sort((a, b) => b[1] - a[1]);
            const { entries } = this.state.event;
            const topThree = {
                first: (entries && sortVotes[0][0]) ? entries[sortVotes[0][0]].title : '',
                second: (entries && sortVotes[1][0]) ? entries[sortVotes[1][0]].title : '',
                third: (entries && sortVotes[2][0]) ? entries[sortVotes[2][0]].title : '',
            };
            this.setState({
                totalBallots,
                totalSubmitted,
                topThree
            });
        });
    }

    render() {
        return (
            <div className="main">
                {
                    this.props.user != null && (
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
                            <Typography variant="h3" align="center" gutterBottom>{this.state.event.name}</Typography>
                        </div>
                    )
                }
                {
                    this.state.view === 'main' && (
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
                    )
                }
                {
                    this.state.view === 'entries' && this.state.event.entries !== undefined && (
                        <div>
                            <div className="options">
                                <Button className="button1" variant="contained" color="primary" onClick={this.manageEvent}>Manage Event</Button>
                                <Button className="button1" variant="contained" onClick={this.viewResults}>View Results</Button>
                            </div>
                            <div className="box">
                                {
                                    Object.values(this.state.event.entries).map((entry, index) => (
                                        <Button
                                            key={entry.id}
                                            className="listButtons"
                                            onClick={() => this.handleEntryEdit(entry.id)}
                                            index={index}
                                        >
                                            {entry.title} by {entry.presenters}
                                        </Button>
                                    ))
                                }
                                <Button className="listButtons" color="primary" onClick={this.handleAddEntry}>Add New Entry</Button>
                            </div>
                        </div>
                    )
                }
                {
                    this.state.view === 'entries' && this.state.event.entries === undefined && (
                        <div>
                            <div className="options">
                                <Button className="button1" variant="contained" color="primary" onClick={this.manageEvent}>Manage Event</Button>
                                <Button className="button1" variant="contained" onClick={this.viewResults}>View Results</Button>
                            </div>
                            <div className="box">
                                <Button className="listButtons" color="primary" onClick={this.handleAddEntry}>Add New Entry</Button>
                            </div>
                        </div>
                    )
                }
                {
                    this.state.view === "results" && (
                        <div className="viewResults">
                            <div className="options">
                                <Button className="button1" variant="contained" onClick={this.manageEvent}>Manage Event</Button>
                                <Button className="button1" variant="contained" color="primary" onClick={this.viewResults}>View Results</Button>
                            </div>
                            <br />
                            <div className="saveItems">
                                <div className="sheetsExport">
                                    <div className="instructions">
                                        <Typography id="itemTitle" variant="h5">Set Up Your Results</Typography>
                                        <div>1. Create a Google Sheet in your desired location</div>
                                        <div>
                                            2. Share the spreadsheet with editing rights with:
                                        <br />
                                            <div className="main">
                                                <b>talli-455@talli-229017.iam.gserviceaccount.com</b>
                                            </div>
                                        </div>
                                        <div>
                                            3. Grab the spreadsheet&apos;s URL and paste it here:
                                            <div className="main">
                                                <div className="urlField">
                                                    <TextField
                                                        id="standard-dense"
                                                        label="Spreadsheet URL"
                                                        margin="dense"
                                                        className="sheetURL"
                                                        value={this.state.event.sheetURL}
                                                        onKeyDown={this.keyPress}
                                                        onChange={this.handleURLChange}
                                                    />
                                                    {
                                                        this.state.urlConfirm &&
                                                        <CheckCircle id="checkmark" color="primary" />
                                                    }
                                                    <br />
                                                </div>
                                                <Button variant="contained" size="small" color="default" onClick={this.handleSubmit}>
                                                    Submit
                                                </Button>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="statistics">
                                        <Typography id="itemTitle" variant="h5">Voting Statistics</Typography>
                                        <div>Total Ballots: {this.state.totalBallots}</div>
                                        <div>Submitted Ballots: {this.state.totalSubmitted}</div>
                                        <div>
                                            Current Top 3:
                                            <div id="top3">
                                                <div>1. {this.state.topThree.first}</div>
                                                <div>2. {this.state.topThree.second}</div>
                                                <div>3. {this.state.topThree.third}</div>
                                            </div>
                                        </div>
                                        <div className="refreshButton">
                                            <Button variant="contained" size="small" color="default" onClick={this.refreshStats}>
                                                Refresh Statistics
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="bottomMenu">
                                    <div className="resultsOption">
                                        <Tooltip
                                            title="Updates linked google sheet with current list of entries. It's best to do this before the event starts!"
                                            placement="bottom"
                                        >
                                            <Button className="listButtons" onClick={this.sendEntries}>
                                                Sync entries
                                            </Button>
                                        </Tooltip>
                                    </div>
                                    <div className="resultsOption">
                                        <Tooltip
                                            title="Adjust the weights applied to first, second, and third place votes"
                                        >
                                            <Button className="listButtons" onClick={this.handleWeights}>Apply Custom Weights</Button>
                                        </Tooltip>
                                    </div>
                                    <div className="resultsOption">
                                        <Tooltip
                                            title="Manually add a ballot to the results."
                                            placement="bottom"
                                        >
                                            <Button className="listButtons" onClick={this.handleAddVote}>
                                                Add Vote
                                            </Button>
                                        </Tooltip>
                                    </div>
                                    <div className="resultsOption">
                                        <Tooltip
                                            title="Updates linked google sheet with all voting ballots submitted or manually entered"
                                        >
                                            <Button className="listButtons" onClick={this.finalizeConfirm}>
                                                Finalize Results
                                            </Button>
                                        </Tooltip>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )
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
