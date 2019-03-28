import React from 'react';
import QrReader from 'react-qr-reader';
import { TextField, Typography, Button } from '@material-ui/core';
import EntryConfirmation from './Dialogs/EntryConfirmation';
import '../component_style/Voter.css';
import firebase from '../../firebase';
import { getCookie } from '../../cookies.js';
import BlockJoin from './Dialogs/BlockJoin';
import EarlyJoin from './Dialogs/EarlyJoin';
import ClosedJoin from './Dialogs/ClosedJoin';
import RejoinClosed from './Dialogs/RejoinClosed';
import NotFound from './Dialogs/NotFound';
import RejoinEvent from './Dialogs/RejoinEvent';

const config = require('../../config.json');

/**
 * Join Event via QR Code or UID
 */
export default class JoinEvent extends React.Component {
    constructor(props) {
        super(props);
        /** ::STATE INFO::
         *  eventID:        Event's UID, obtained either from QRcode or textfield
         *  idFieldValue:   The value currently in the textbox
         */
        this.state = { eventID: '', idFieldValue: '', eventName: '', organizerID: '' };
        this.handleScan = this.handleScan.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleText = this.handleText.bind(this);
        this.handleJoinEvent = this.handleJoinEvent.bind(this);
        this.keyPress = this.keyPress.bind(this);
        this.handleRejoinEvent = this.handleRejoinEvent.bind(this);

        this.confirmChild = React.createRef();
        this.earlyJoinChild = React.createRef();
        this.closedJoinChild = React.createRef();
        this.blockChild = React.createRef();
        this.notFoundChild = React.createRef();
        this.rejoinChild = React.createRef();
        this.rejoinClosedChild = React.createRef();
    }

    componentDidMount() {
        const cookie = getCookie('UserID');
        firebase.database().ref(`attendees/${cookie}`).once('value').then(cookieSnap => {
            const allCookies = cookieSnap.val();
            if (allCookies && allCookies.currentEvent) {
                firebase.database().ref('event/').once('value').then(orgSnap => {
                    const orgID = orgSnap.val()[allCookies.currentEvent];
                    this.setState({ organizerID: (orgID ? orgID['organizer'] : '') }, () => {
                        if (this.state.organizerID && this.state.organizerID !== '') {
                            firebase.database().ref(`/organizer/${this.state.organizerID}/event/${allCookies.currentEvent}`).once('value').then(eventSnap => {
                                const event = eventSnap.val();
                                if (event) {
                                    this.setState({
                                        eventName: event.eventData.name,
                                        eventID: allCookies.currentEvent,
                                    }, () => {
                                        const votingState = this.getVotingState(event['eventData']);
                                        if (votingState === 'closed') {
                                            this.rejoinClosedChild.current.handleOpen();
                                            firebase.database().ref(`attendees/${cookie}/currentEvent`).set('');
                                            return;
                                        }
                                        this.rejoinChild.current.handleOpen();
                                    });
                                }
                            });
                        }
                    });
                });
            } else if (this.props.scanID) {
                this.setState({ eventID: this.props.scanID });
                this.requestConfirm();
            }
        });
    }

    getVotingState(event) {
        const date = new Date().toISOString();
        if (event.startVote === 'none' || (event.startVote > date)) { // not open yet
            return 'before';
        } else if (event.endVote === 'none' || (event.endVote > date)) { // open
            return 'open';
        }
        return 'closed';
    }

    requestConfirm = () => {
        firebase.database().ref('event/').once('value').then((snap) => {
            let orgID = snap.val()[this.state.eventID];
            this.setState({ organizerID: (orgID ? orgID.organizer : '') }, () => {
                if (this.state.organizerID && this.state.organizerID !== '') {
                    firebase.database().ref('/organizer/' + this.state.organizerID + '/event/' + this.state.eventID).once('value').then(snapshot => {
                        const event = snapshot.val();
                        if (!event) {
                            // Event not found
                            this.notFoundChild.current.handleOpen();
                            return;
                        }

                        this.setState({ eventName: event.eventData.name }, () => {
                            // Checks whether an even has not started or has ended
                            const votingState = this.getVotingState(event.eventData);
                            console.log(votingState);
                            if (votingState === 'before') {
                                this.earlyJoinChild.current.handleOpen();
                                return;
                            }

                            if (votingState === 'closed') {
                                this.closedJoinChild.current.handleOpen();
                                return;
                            }
                            // Checks whether the user has submitted for this event previously
                            const cookies = getCookie('UserID');
                            let check = false;
                            firebase.database().ref(`attendees/${cookies}/pastEvents`).once('value').then(snapshot => {
                                const pastEvents = snapshot.val();
                                for (let c in pastEvents) {
                                    if (c === this.state.eventID) {
                                        check = true;
                                        this.blockChild.current.handleOpen();
                                        return;
                                    }
                                }
                                if (!check) {
                                    this.confirmChild.current.handleOpen();
                                }
                            });
                        });
                    });
                } else {
                    // Event not found
                    this.notFoundChild.current.handleOpen();
                }
            });
        });
    }

    handleScan(data) {
        if (data && data.toLowerCase().includes((`${config.Global.hostURL}/vote/`).toLowerCase())) {
            const id = data.substring(data.indexOf('/vote/') + 6).replace(/\W/g, '');
            const cookie = getCookie('UserID');
            firebase.database().ref(`event/${id}`).once('value').then(snapshot => {
                const event = snapshot.val();
                const hasRankings = event ? (event.attendees ? (event.attendees[cookie] ? true : false) : false) : false;
                if (id === this.state.eventID || hasRankings) {
                    this.handleRejoinEvent();
                    return;
                }
            });
            this.setState({ eventID: id });
            this.requestConfirm();
        }
    }

    handleText() {
        const cookie = getCookie('UserID');
        firebase.database().ref(`/`).once('value').then(snapshot => {
            const root = snapshot.val();
            const currentEventId = root.attendees[cookie].currentEvent;
            const event = root.event[this.state.idFieldValue];
            const hasRankings = event ? (event.attendees ? (event.attendees[cookie] ? true : false) : false) : false;
            if (this.state.idFieldValue === currentEventId || hasRankings) {
                this.handleRejoinEvent();
                return;
            }
        });
        this.setState({ eventID: this.state.idFieldValue });
        if (this.state.idFieldValue.length > 2) {
            this.requestConfirm();
        }
    }

    handleRejoinEvent() {
        const cookie = getCookie('UserID');
        firebase.database().ref(`event/${this.state.eventID}/attendees/${cookie}/rankings/`).once("value").then(rankSnap => {
            const rankings = rankSnap.val();
            const items = [];
            if (rankings) {
                for (const item in rankings) {
                    if (item) {
                        items[rankings[item] - 1] = item;
                    }
                }
            }
            firebase.database().ref('organizer/').once('value').then(snapshot => {
                const organizer = snapshot.val();
                const event = organizer[this.state.organizerID].event[this.state.eventID];
                const itemList = [];
                for (let i = 0; i < items.length; i++) {
                    const entry = event.entries[items[i]];
                    if (entry) {
                        itemList.push({
                            name: entry.title,
                            id: entry.id.toString(),
                            presenters: entry.presenters,
                            showInfo: false,
                        });
                    }
                }
                this.props.updateItemsHandler(itemList);
            })
                .then(() => {
                    this.handleJoinEvent();
                });
        });
    }

    handleJoinEvent() {
        const cookie = getCookie('UserID');
        const itemsRef = firebase.database().ref(`attendees/${cookie}`);
        itemsRef.child("currentEvent").set(this.state.eventID);
        this.props.handler(this.props.voteViews.RANK, this.state.eventID, this.state.organizerID);
    }

    handleError(err) { }

    keyPress(e) {
        if (e.key === 'Enter') {
            this.handleText();
        }
    }

    render() {
        return (
            <div>
                <RejoinEvent entryName={this.state.eventName} ref={this.rejoinChild} handler={this.handleRejoinEvent} />
                <NotFound ref={this.notFoundChild} idType={'Event'} id={this.state.eventID} />
                <EntryConfirmation entryName={this.state.eventName} ref={this.confirmChild} handler={this.handleJoinEvent} />
                <BlockJoin entryName={this.state.eventName} idType={'Event'} ref={this.blockChild} />
                <EarlyJoin eventName={this.state.eventName} ref={this.earlyJoinChild} />
                <ClosedJoin eventName={this.state.eventName} ref={this.closedJoinChild} />
                <RejoinClosed eventName={this.state.eventName} ref={this.rejoinClosedChild} />
                <QrReader delay={300} onScan={this.handleScan} onError={this.handleError} style={{ width: '80%', margin: '20px auto 0px' }} />
                <Typography variant='h5' align='center' className="QRText">Scan QR Code or enter Event ID:</Typography>
                <div className="textField">
                    <TextField
                        id="outlined-dense"
                        label="Event ID"
                        margin="dense"
                        variant="outlined"
                        value={this.state.idFieldValue}
                        onKeyDown={this.keyPress}
                        onChange={e => this.setState({ idFieldValue: e.target.value })}
                    />
                </div>
                <div className="submitButtonContainer">
                    <Button variant="contained" color="primary" className="homeButton" onClick={this.handleText}>
                        Join
                    </Button>
                </div>
            </div>
        );
    }
}
