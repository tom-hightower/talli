import React from 'react';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import '../component_style/Organizer.css';
import { TextField } from '@material-ui/core';

export default class NewEntryForm extends React.Component {
    state = {
        show: true,
        title: '',
        id: '',
        presenters: '',
        entry_dates: '',
    }

    delEntry = () => {
        this.setState({
            show: false,
        });
        this.props.updateEntry(this.state, this.props.index);
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
        this.props.updateEntry(this.state, this.props.index);
    };

    render() {
        if (this.state.show) {
            return (
                <div className='addEntry'>
                <br />
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
                    <RemoveCircleOutlineIcon color='primary' id='entryIcon' onClick={this.delEntry}/>
                </div>
            );
        } else {
            return null;
        }
    }
}