import React from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import '../component_style/Organizer.css';
import { TextField } from '@material-ui/core';

export default class NewEntryForm extends React.Component {
    state = {
        show: true,
        submitted: false,
        title: '',
        id: '',
        presenters: '',
        entry_dates: '',
    }

    saveEntry = () => {
        this.setState({
            show: true,
            submitted: true,
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

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        if (this.state.show) {
            return (
                <div className='addEntry'>
                    <div>
                        <TextField
                            required
                            label="Entry Title"
                            margin="dense"
                            className="entryFormText"
                            value={this.state.title}
                            onChange={this.handleChange('title')}
                        />
                        <TextField
                            label="ID (auto if blank)"
                            margin="dense"
                            className="entryFormText"
                            value={this.state.id}
                            onChange={this.handleChange('id')}
                        />
                        <br />
                        <TextField
                            required
                            label="Presenters"
                            margin="dense"
                            className="entryFormText"
                            value={this.state.presenters}
                            onChange={this.handleChange('presenters')}
                        />
                        <TextField
                            required
                            label="Date(s) Attending"
                            margin="dense"
                            className="entryFormText"
                            value={this.state.entry_dates}
                            onChange={this.handleChange('entry_dates')}
                        />
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