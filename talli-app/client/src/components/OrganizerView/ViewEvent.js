import React from 'react';
import { Typography, Button } from '@material-ui/core';
import '../component_style/ViewEvent.css';
import firebase from '../../firebase';
import ExportOrgData from './Dialogs/ExportOrgData';
import EditEntries from './Dialogs/EditEntries';
import EditEvent from './Dialogs/EditEvent';
import EditVoting from './Dialogs/EditVoting';
import AddEntries from './Dialogs/AddEntries';
import EditWeights from './Dialogs/EditWeights';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:5000');


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
    }

    componentDidMount() {
        var googleId = this.props.user.googleId;
        var query = firebase.database().ref('organizer/' + googleId + '/event');
        query.on('value', (snapshot) => {
            let events = snapshot.val();
            let eventBase = events[this.props.curEvent]['eventData'];
            let eventEntries = events[this.props.curEvent]['entries'];
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
        });
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
        })
    }

    manageEvent = () => {
        this.setState({
            view: "main"
        })
    }

    handleURLChange = (e) => {
        this.setState({
            event: {
                sheetURL: e.target.value
            }
        });
        socket.emit('send_url', {
            url: e.target.value,
            googleId: this.props.user.googleId,
            eventId: this.state.event.id
        });
    }



    render() {
        return (
            <div className="main">
                {
                    this.props.user != null &&
                    <div> 
                        <ExportOrgData ref={this.exportChild} event={this.state.event}/>
                        <EditEntries ref={this.entryChild} event={this.state.event} googleId={this.props.user.googleId}/>
                        <AddEntries ref={this.addChild} event={this.state.event} googleId={this.props.user.googleId}/>
                        <EditEvent ref={this.eventChild} event={this.state.event} googleId={this.props.user.googleId}/>
                        <EditVoting ref={this.votingChild} event={this.state.event} googleId={this.props.user.googleId}/>
                        <EditWeights ref={this.weightsChild} event={this.state.event} googleId={this.props.user.googleId} />
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
                                
                                Object.values(this.state.event.entries).map((entry, index) => 
                                    <Button className="listButtons" onClick={() => this.handleEntryEdit(entry.id)}>
                                        {entry.title} by {entry.presenters}
                                    </Button>
                                )
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
                        <Typography variant="h5">Set up Google Sheets to export results:</Typography>
                        <br />
                        <div className="instructions">
                            <div>1. Create a Google Sheet in your desired location</div>
                            <div>
                                {/* TODO: This should automatically save, probably to firebase */}
                                <form><label>2. Grab the spreadsheet's URL and paste it here: <input type="text" value={this.state.event.sheetURL} onChange={this.handleURLChange} className="sheetURL"></input></label></form>
                            </div>
                            <div>3. Share the spreadsheet with editing rights with <b>talli-455@talli-229017.iam.gserviceaccount.com</b></div>
                        </div>
                        <Button variant="contained" className="buttons" type="button" onClick={this.handleWeights}>Apply Custom Weights</Button>
                    </div>
                }
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