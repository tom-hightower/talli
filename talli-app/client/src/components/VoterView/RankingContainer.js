import React, { Component } from 'react';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import SliderIcon from '@material-ui/icons/Sort';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Typography, Button } from '@material-ui/core';
import BellIcon from '@material-ui/icons/NotificationImportant';
import openSocket from 'socket.io-client';
import firebase from '../../firebase';
import { getCookie } from '../../cookies';
import SubmitConfirm from './Dialogs/SubmitConfirm';
import Countdown from './Countdown';
import EventClosed from './Dialogs/EventClosed';
import '../component_style/RankingContainer.css';

const config = require('../../config.json');

const socket = openSocket(
    (config.Global.devMode ?
        `http://localhost:${config.Global.serverPort}` :
        `${(config.Global.sslEnabled ? "https" : "http")}://${config.Global.hostURL}:${config.Global.serverPort}`
    )
);
const DragHandle = SortableHandle(() => <span><SliderIcon className="Sliders" /></span>);

export default class SortContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            event: {
                id: '',
                name: '',
                location: '',
                startDate: '',
                endDate: '',
                automate: false,
                startVote: '',
                endVote: '',
                entries: []
            },
        };
        this.handleAddEvent = this.handleAddEvent.bind(this);
        this.submitConfirm = this.submitConfirm.bind(this);
        this.submitted = this.submitted.bind(this);
        this.countdownFinished = this.countdownFinished.bind(this);

        this.confirmChild = React.createRef();
        this.closedChild = React.createRef();
    }

    handleAddEvent(e) {
        e.preventDefault();
        this.props.updateItemsHandler(this.state.items);
        this.props.handler(this.props.voteViews.ADD);
    }

    componentDidMount() {
        this.setState({
            items: this.props.rankItems,
        }, () => {
            firebase.database().ref(`/organizer/${this.props.organizer}/event/`).once('value').then(snapshot => {
                const events = snapshot.val();
                if (!events || !events[this.props.eventID]) {
                    // Error
                    console.log('DEV ERROR');
                }
                const eventBase = events[this.props.eventID].eventData;
                const eventEntries = events[this.props.eventID].entries;
                const itemList = this.state.items;
                if (eventEntries && this.props.entryToAdd && !this.state.items.some(e => e.id === this.props.entryToAdd)) {
                    const entryId = this.props.entryToAdd;
                    itemList.push({
                        name: eventEntries[entryId].title,
                        id: entryId,
                        presenters: eventEntries[entryId].presenters,
                        entry_dates: eventEntries[entryId].entry_dates,
                        showInfo: false,
                    });
                    this.updateDatabaseRankings(itemList);
                }
                this.setState({
                    event: {
                        id: eventBase.id,
                        name: eventBase.name,
                        location: eventBase.location,
                        startDate: eventBase.startDate,
                        endDate: eventBase.endDate,
                        automate: eventBase.automate,
                        startVote: eventBase.startVote,
                        endVote: eventBase.endVote,
                        entries: eventEntries
                    },
                    items: itemList,
                }, () => {
                    this.props.updateItemsHandler(this.state.items);
                });
            });
        });
    }

    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState({
            items: arrayMove(this.state.items, oldIndex, newIndex),
        });
        this.updateDatabaseRankings(this.state.items);
    };

    updateDatabaseRankings(items) {
        const cookie = getCookie('UserID');
        const ref = firebase.database().ref(`event/${this.props.eventID}/attendees/${cookie}/rankings/`);
        for (let i = 0; i < items.length; i++) {
            ref.child(i + 1).set(items[i]);
        }
    }

    submitConfirm() {
        this.props.updateItemsHandler(this.state.items);
        this.confirmChild.current.handleOpen();
    }

    submitted() {
        const items = this.state.items;
        const organizerId = this.props.organizer;
        const eventId = this.state.event.id;
        socket.emit('send_votes', {
            eventId,
            organizerId,
            votes: items
        });
        this.props.handler(this.props.voteViews.SUBMITTED);
    }

    countdownFinished() {
        const cookie = getCookie('UserID');
        const itemsRef = firebase.database().ref(`attendees/${cookie}`);
        itemsRef.child('currentEvent').set('');
        itemsRef.child(`pastEvents/${this.props.eventID}/`).set(this.props.eventID);
        this.closedChild.current.handleOpen();
    }

    toggleShowInfo = (item) => {
        const oldItems = this.state.items;
        oldItems[item].showInfo = !oldItems[item].showInfo;
        this.setState({
            items: oldItems
        });
    }

    render() {
        const SortableItem = SortableElement(({ value, item }) => (
            <li className="rankings" onClick={() => this.toggleShowInfo(item)}>
                <div id='rankNumber'>{item + 1}</div>
                <div id='rankTitle'>
                    {value.name}
                    {
                        value.showInfo ?
                            (
                                <div id="expandedInfo">
                                    <b>By:</b> {value.presenters} <br />
                                    <b>Attendance:</b> {value.entry_dates}
                                </div>
                            ) : ''
                    }
                </div>
                <DragHandle id='rankHandle' />
            </li>
        ));

        const SortableList = SortableContainer(({ items }) => {
            return (
                <ul>
                    {items.length !== 0 ? <div /> : <div>Tap the Plus to add an entry</div>}
                    {items.map((value, index) => (
                        <SortableItem
                            key={`item-${index}`}
                            item={index}
                            index={index}
                            value={value}
                        />
                    ))}
                </ul>
            );
        });

        return (
            <div>
                <EventClosed handler={this.submitted} ref={this.closedChild} eventName={this.state.event.name} />
                <SubmitConfirm handler={this.submitted} ref={this.confirmChild} items={this.state.items} eventID={this.state.event.id} />
                <Typography variant="h4" align="center" className="eventName" gutterBottom>{this.state.event.name}</Typography>
                <div style={{ textAlign: 'center' }}>
                    <AddCircleIcon className="AddEvent" id="addEntry" color="secondary" onClick={this.handleAddEvent} />
                </div>
                <div>
                    <div className="SortContainer">
                        <SortableList
                            items={this.state.items}
                            onSortEnd={this.onSortEnd}
                            lockAxis="y"
                            useDragHandle
                            helperClass="sortHelp"
                        />
                    </div>
                </div>

                {(this.state.event.endVote !== 'none') ? (
                    <div className="SubmitDiv">
                        <BellIcon className="BellIcon" />
                        <div className="SubmitText">
                            Voting will close in:
                                <Countdown date={this.state.event.endVote} onFinished={this.countdownFinished} />
                        </div>
                        <div className="buttonDiv">
                            <Button variant="contained" color="primary" onClick={this.submitConfirm}> Submit </Button>
                        </div>
                    </div>
                ) : (
                        <div className="CenterSubmitDiv">
                            <div className="CenterButtonDiv">
                                <Button variant="contained" color="primary" onClick={this.submitConfirm}> Submit </Button>
                            </div>
                        </div>
                    )}
            </div>
        );
    }
}
