import React from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import '../component_style/Organizer.css';

export default class NewEntryForm extends React.Component {
    state = {
        show: true,
        submitted: false
    }

    saveEntry = () => {
        this.setState({
            show: true,
            submitted: true
        });
        this.props.addEntry();
        // this will write the data to the database
    }

    delEntry = () => {
        this.setState({
            show: false,
            submitted: false
        });
        // this will remove from the database
    }

    render() {
        if (this.state.show) {
            return (
                <div className='addEntry'>
                    <div>
                        <input type='text' name='entry_name' id='entry_name' placeholder='Entry Title'/>
                        <input type='text' name='entry_id' id='entry_id' placeholder='ID (leave blank to autogenerate)'/>
                        <br />
                        <input type='text' name='entry_presenters' id='entry_presenters' placeholder='Presenters'/>
                        <input type='text' name='entry_dates' id='entry_dates' placeholder='Date(s) Attending'/>
                    </div>
                    {
                        !(this.state.submitted)
                        && <AddCircleIcon color='primary' id='entryIcon' onClick={this.saveEntry}/>
                    }
                    {
                        this.state.submitted
                        && <RemoveCircleOutlineIcon color='primary' id='entryIcon' onClick={this.delEntry}/>
                    }
                    
                </div>
            );
        } else {
            return null;
        }
    }
}