import React, { Component } from 'react';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { TextField } from '@material-ui/core';
import '../component_style/Organizer.css';

export default class NewEntryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            title: '',
            id: '',
            presenters: '',
            entry_dates: '',
            info_url: '',
        };
    }

    componentDidMount() {
        this.setState({
            show: true,
            title: this.props.currValue.title,
            id: this.props.currValue.id,
            presenters: this.props.currValue.presenters,
            entry_dates: this.props.currValue.entry_dates,
            info_url: this.props.currValue.info_url,
        });
    }

    delEntry = () => {
        this.setState({
            show: false,
        }, () => {
            this.props.updateEntry(this.state, this.props.index);
        });
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        }, () => {
            this.props.updateEntry(this.state, this.props.index);
        });
    }

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
                        <TextField
                            label="Project Info URL"
                            margin="dense"
                            className="entryFormText"
                            value={this.state.info_url}
                            onChange={this.handleChange('info_url')}
                        />
                    </div>
                    <RemoveCircleOutlineIcon color='primary' id='entryIcon' onClick={this.delEntry} />
                </div>
            );
        }
        return null;
    }
}
