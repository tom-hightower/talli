import React from 'react';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import '../../component_style/Organizer.css';
import { TextField } from '@material-ui/core';

export default class AddVoteEntryForm extends React.Component {
    state = {
        show: true,
        id: '',
        rank: '',
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
    };

    render() {
        if (this.state.show) {
            return (
                <div className='addEntry'>
                <br />
                    <div>
                        <TextField
                            required
                            label="Entry ID"
                            margin="dense"
                            className="entryFormText"
                            value={this.state.id}
                            onChange={this.handleChange('id')}
                        />
                        <TextField
                            required
                            label="Entry Rank"
                            margin="dense"
                            className="entryFormText"
                            value={this.state.rank}
                            onChange={this.handleChange('rank')}
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