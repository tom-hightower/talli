import React, { Component } from 'react';
import { Typography, Grid, Button } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { navigate } from 'react-mini-router';
import '../component_style/Organizer.css';
import firebase from '../../firebase';

/**
 * OrganizerView > EventList
 * Organizer landing page which shows them all
 * of their events and the option to add a new one.
 */
export default class EventList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: []
        };
    }

    componentDidMount() {
        const googleId = sessionStorage.getItem('id');
        if (googleId) {
            const query = firebase.database().ref(`organizer/${googleId}/event`);
            const allEvents = [];
            query.on('value', (snapshot) => {
                const events = snapshot.val();
                for (let event in events) {
                    const refPrefix = `${event}/eventData`;
                    const id = snapshot.child(`${refPrefix}/id`).val();
                    const name = snapshot.child(`${refPrefix}/name`).val();
                    const location = snapshot.child(`${refPrefix}/location`).val();
                    const startDate = snapshot.child(`${refPrefix}/startDate`).val();
                    const endDate = snapshot.child(`${refPrefix}/endDate`).val();
                    const automate = snapshot.child(`${refPrefix}/automate`).val();
                    const startVote = snapshot.child(`${refPrefix}/startVote`).val();
                    const endVote = snapshot.child(`${refPrefix}/endVote`).val();

                    allEvents.push({
                        id,
                        name,
                        location,
                        startDate,
                        endDate,
                        automate,
                        startVote,
                        endVote
                    });
                }
                this.setState({
                    events: allEvents
                });
            });
        }
    }

    parseDate(isoDate) {
        const dateString = `${isoDate.substring(5, 7)}/${isoDate.substring(8, 10)}/${isoDate.substring(0, 4)}`;
        return dateString;
    }

    AddEvent() {
        this.props.handler(this.props.orgViews.CREATE);
    }

    viewEvent(id) {
        this.props.setEvent(id);
        this.props.handler(this.props.orgViews.VIEW);
    }

    render() {
        const organizerId = sessionStorage.getItem('id');
        if (!organizerId) {
            navigate('/');
        }
        return (
            <div>
                <Typography variant="h4" align="center" gutterBottom>{sessionStorage.getItem('name')}&apos;s Events</Typography>
                <Grid container className="organizerEvents">
                    <Grid item className="eventContainer" id="addEvent">
                        <AddCircleIcon color="primary" id="addCircleIcon" onClick={() => this.AddEvent()} />
                    </Grid>
                    {this.state.events.map((event, index) => (
                        <Button
                            className="eventContainer"
                            variant="contained"
                            color="primary"
                            id="openEvent"
                            onClick={() => this.viewEvent(event.id)}
                            key={event.id}
                        >
                            {event.name}
                            <br />
                            {this.parseDate(event.startDate)} - {this.parseDate(event.endDate)}
                            <br />
                            <br />
                            Voting period is {event.automate ? "automated." : "not automated."}
                        </Button>
                    ))}
                </Grid>
                <div />
            </div>
        );
    }
}
