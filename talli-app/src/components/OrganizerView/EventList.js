import React from 'react';
import { Typography, Grid, Button } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import '../component_style/Organizer.css';
import firebase from '../../firebase.js'

/**
 * Event List, unimplemented
 */
export default class EventList extends React.Component {

    state = {
        events: []
    }

    componentDidMount() {
        var query = firebase.database().ref('event');
        let allEvents = [];
        query.on('value', (snapshot) => {
            let events = snapshot.val();
            for (let event in events) {
                var key = events[event]['eventData']
                var tempkey;
                for (var k in key) {
                    tempkey = k;
                }
                let refPrefix = '' + event + '/eventData/' + tempkey;
                var id = snapshot.child(refPrefix + '/id').val();
                var name = snapshot.child(refPrefix + '/name').val();
                var location = snapshot.child(refPrefix + '/location').val();
                var startDate = snapshot.child(refPrefix + '/startDate').val();
                var endDate = snapshot.child(refPrefix + '/endDate').val();
                var automate = snapshot.child(refPrefix + '/automate').val();
                var startVote = snapshot.child(refPrefix + '/startVote').val();
                var endVote = snapshot.child(refPrefix + '/endVote').val();

                allEvents.push({
                    id: id,
                    name: name,
                    location: location,
                    startDate: startDate,
                    endDate: endDate,
                    automate: automate,
                    startVote: startVote,
                    endVote: endVote
                });
            }
            this.setState({
                events: allEvents
            });
        })
    }

    parseDate(localeDate) {
        let ind = localeDate.indexOf(",");
        return localeDate.substring(0, ind);
    }

    AddEvent() {
        this.props.handler(this.props.orgViews.CREATE);
        /* unimplemented */
    }

    viewEvent(id) {
        this.props.setEvent(id);
        this.props.handler(this.props.orgViews.VIEW);
    }

    render() {
        console.log(this.props.user.googleId);
        return (
            <div>
                <Typography variant='h4' align='center' gutterBottom>Hello, {sessionStorage.getItem('name')}</Typography>
                <Grid container className='organizerEvents'>
                    <Grid item className='eventContainer' id='addEvent'>
                        <AddCircleIcon color='primary' id='addCircleIcon' onClick={() => this.AddEvent()} />
                    </Grid>
                    {this.state.events.map((event, index) => (
                        <Button className='eventContainer' variant="contained" color="primary" id='openEvent' onClick={() => this.viewEvent(event.id)} key={index}>
                            {event.name}
                            <br/>
                            {this.parseDate(event.startDate)} - {this.parseDate(event.endDate)}
                            <br/>
                            <br/>
                            Voting period is {event.automate ? "automated." : "not automated."}
                        </Button>
                    ))}
                </Grid>
                <div>
                </div>
            </div>
        );
    }
}
