import React from 'react';
import { Typography } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import '../component_style/Organizer.css';
import firebase from '../../firebase.js'

/**
 * Event List, unimplemented
 * TODO: read existing events from database and render
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
                var id = snapshot.child('' + event + '/eventData/' + tempkey + '/id').val();
                var name = snapshot.child('' + event + '/eventData/' + tempkey + '/name').val();
                var location = snapshot.child('' + event + '/eventData/' + tempkey + '/location').val();
                var startDate = snapshot.child('' + event + '/eventData/' + tempkey + '/startDate').val();
                var endDate = snapshot.child('' + event + '/eventData/' + tempkey + '/endDate').val();
                var automate = snapshot.child('' + event + '/eventData/' + tempkey + '/automate').val();
                var startVote = snapshot.child('' + event + '/eventData/' + tempkey + '/startVote').val();
                var endVote = snapshot.child('' + event + '/eventData/' + tempkey + '/endVote').val();

                if (automate) {
                    automate = 'true';
                } else {
                    automate = 'false';
                }
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

    renderProduct = ({id, name, location, startDate, endDate, automate, startVote, endVote}) => <div>id:{id}, name:{name}, location:{location}, startDate:{startDate}, endDate:{endDate}, automate:{automate}, startVote:{startVote}, endVote:{endVote}</div>;



    AddEvent() {
        this.props.handler(this.props.orgViews.CREATE);
        /* unimplemented */
    }

    render() {
        return(
            <div>
                <Typography variant='h4' align='center' gutterBottom>Organizer View</Typography>
                <div className='organizerEvents'>
                    <div className='eventContainer' id='addEvent'>
                        <AddCircleIcon color='primary' id='addCircleIcon' onClick={() => this.AddEvent()}/>
                    </div>
                    <div className='eventContainer' id='openEvent'>
                    </div>
                </div>
                <div>
                    {this.state.events.map(this.renderProduct)}
                </div>
            </div>
        );
    }
}
