import React, { Component } from 'react';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import SliderIcon from '@material-ui/icons/UnfoldMore';
import PlusIcon from '@material-ui/icons/ControlPoint';
import './Sortable-Container.css';

const iconStyles = {
  marginRight: 24,
};
const sliderStyle = { paddingTop: '10px', marginLeft: 10, paddingLeft: '10px', height: '150%', };

const DragHandle = SortableHandle(() => <span> <SliderIcon style={sliderStyle} /></span>);

const SortableItem = SortableElement(({value}) =>
  <li>{value}<DragHandle /></li>
);

const SortableList = SortableContainer(({items}) => {
  return (
    <ol>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </ol>
  );
});

class SortContainer extends Component {
  state = {
      items: ['Entry A', 'Entry B', 'Entry C'],
  };
  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    });
  };
  render() {
    return (
      <div>  
        <div class="eventName">
          <p>Event 1</p>
        </div>
        <div class="AddEvent">  
          <PlusIcon style={iconStyles} />
        </div>
        <div class="SortBorder">
          <div class="SortContainer">
            <SortableList items={this.state.items} onSortEnd={this.onSortEnd} lockAxis='y'
            useDragHandle='true' helperClass='sortHelp' />
          </div>
        </div>
      </div>
    );
  }
}

export default SortContainer;
