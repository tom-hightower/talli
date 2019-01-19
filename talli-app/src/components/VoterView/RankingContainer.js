import React, { Component } from 'react';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import SliderIcon from '@material-ui/icons/Sort';
import PlusIcon from '@material-ui/icons/ControlPoint';
import '../component_style/RankingContainer.css';

const DragHandle = SortableHandle(() => <span> <SliderIcon className="Sliders" /></span>);

const SortableItem = SortableElement(({ value }) =>
    <li className="rankings">{value}<DragHandle /></li>
);

const SortableList = SortableContainer(({ items }) => {
    return (
        <ol>
            {items.map((value, index) => (
                <SortableItem key={`item-${index}`} index={index} value={value} />
            ))}
        </ol>
    );
});

export default class SortContainer extends Component {
    constructor(props) {
        super(props);
        /**
         * TODO: This list should be populated as empty for first-time
         *       voters or with the previous entries for voters returning
         *       to their previous session
         */ 
        this.state = { items: ['Entry A', 'Entry B', 'Entry C'] };
        this.handleAddEvent = this.handleAddEvent.bind(this);
    }

    handleAddEvent(e) {
        e.preventDefault();
        this.props.handler(this.props.voteViews.ADD);
    }

    // TODO: Set event name here
    eventName = 'My Event';

    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState({
            items: arrayMove(this.state.items, oldIndex, newIndex),
        });
    };
    render() {
        return (
            <div>
                <div className="eventName">
                    <p>{this.eventName}</p>
                </div>
                <div className="AddEvent">
                    <PlusIcon className="Icons" onClick={this.handleAddEvent} />
                </div>
                <div>
                    <div className="SortContainer">
                        <SortableList items={this.state.items} onSortEnd={this.onSortEnd} lockAxis='y'
                            useDragHandle='true' helperClass='sortHelp' />
                    </div>
                </div>
            </div>
        );
    }
}