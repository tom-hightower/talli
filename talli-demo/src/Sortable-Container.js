import React, { Component } from 'react';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import SliderIcon from '@material-ui/icons/Menu';
import PlusIcon from '@material-ui/icons/ControlPoint';
import './Sortable-Container.css';

const iconStyles = {
  marginRight: 24,
};
const sliderStyle = { marginLeft: '30px', position: 'relative', top: '6px'};

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
  constructor(props) {
    super(props);
    this.state = { items: ['Entry A', 'Entry B', 'Entry C'] };
    this.handleAddEvent = this.handleAddEvent.bind(this);
  }

  handleAddEvent(e) {
    e.preventDefault();
    var num = this.state.items.length;
    if (num < 4) {
      this.setState({ items: this.state.items.concat('Entry D')});
    } else if (num === 4) {
      this.setState({ items: this.state.items.concat('Entry E')});
    } else {
      this.setState({ items: this.state.items.concat('New Entry')});
    }  
  }
    
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
          <PlusIcon style={iconStyles} onClick={this.handleAddEvent}/>
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
