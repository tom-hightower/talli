import React, { Component } from 'react';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import SliderIcon from '@material-ui/icons/Sort';
import PlusIcon from '@material-ui/icons/ControlPoint';
import { Typography, Button } from '@material-ui/core';
import BellIcon from '@material-ui/icons/NotificationImportant';
import firebase from '../../firebase';
import '../component_style/RankingContainer.css';
import '../component_style/SubmitContainer.css';

const DragHandle = SortableHandle(() => <span> <SliderIcon className="Sliders" /></span>);

const SortableItem = SortableElement(({ value }) =>
    <li className="rankings">{value}<DragHandle /></li>
);

const SortableList = SortableContainer(({ items }) => {
    return (
        <ol>
            {items.length !== 0 ? <div></div> : <div>Tap the Plus to add an entry</div>}
            {items.map((value, index) => (
                <SortableItem key={`item-${index}`} index={index} value={value.name} />
            ))}
        </ol>
    );
});

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
            var query = firebase.database().ref('organizer/' + this.props.organizer + '/event');
            query.on('value', (snapshot) => {
                let events = snapshot.val();
                if (!events || !events[this.props.eventID]) {
                    //error
                    console.log('DEV ERROR')
                }
                let eventBase = events[this.props.eventID]['eventData'];
                let eventEntries = events[this.props.eventID]['entries'];
                var itemList = this.state.items;
                if (this.props.entryToAdd && !this.state.items.some(e => e.id === this.props.entryToAdd)) {
                    itemList.push({ name: eventEntries[this.props.entryToAdd].title, id: this.props.entryToAdd });
                }
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
                    },
                    items: itemList
                });
            }, () => {
                this.props.updateItemsHandler(this.state.items);
            });
        });
    }

    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState({
            items: arrayMove(this.state.items, oldIndex, newIndex),
        });
    };

    submitConfirm() {
        this.props.updateItemsHandler(this.state.items);
        this.props.handler(this.props.voteViews.CONFIRM);
    }

    render() {
        return (
            <div>
                <Typography variant='h4' align='center' className="eventName" gutterBottom>{this.state.event.name}</Typography>
                <div style={{ textAlign: 'center' }}>
                    <PlusIcon className="AddEvent" onClick={this.handleAddEvent} />
                </div>
                <div>
                    <div className="SortContainer">
                        <SortableList items={this.state.items} onSortEnd={this.onSortEnd} lockAxis='y'
                            useDragHandle={true} helperClass='sortHelp' />
                    </div>
                </div>
                <div className='SubmitDiv'>
                    <BellIcon className='BellIcon' />
                    <div className='SubmitText'>
                        {/* TODO: have this generated off of the end time of the event
                */}
                        Voting closes in xx:xx
                </div>
                    <div className='buttonDiv'>
                        <Button variant="contained" color="primary" onClick={this.submitConfirm}> Submit </Button>
                    </div>
                </div>
            </div>
        );
    }
}