import React from 'react';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import '../../component_style/Organizer.css';
import { TextField } from '@material-ui/core';
import firebase from '../../../firebase';

export default class AddVoteEntryForm extends React.Component {
    state = {
        show: true,
        id: '',
        title: '',
        rank: this.props.entriesInVote[this.props.index].rank,
        entries: [],
        duplicate: false,
        valid: false,
    }

    componentDidMount() {
        const query = firebase.database().ref(`organizer/${this.props.googleId}/event/${this.props.event.id}`);
        query.on('value', (snapshot) => {
            const entriesRef = snapshot.val();
            const { entries } = entriesRef;
            this.setState({
                entries,
            });
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
        this.setState({ rank: this.props.entriesInVote[this.props.index].rank });
        let title = "";
        const entry = this.state.entries[event.target.value];
        if (entry) {
            title = entry.title;
        }
        if (title !== '') {
            this.setState({
                [name]: event.target.value,
                title,
                valid: true,
            }, () => {
                this.props.updateEntry(this.state, this.props.index);
            });
        } else {
            this.setState({
                [name]: event.target.value,
                title: '',
                valid: false,
            }, () => {
                this.props.updateEntry(this.state, this.props.index);
            });
        }
        this.setState({ duplicate: false });
        for (let i = 0; i < this.props.entriesInVote.length; i++) {
            const item = this.props.entriesInVote[i];
            if (item.show && i !== this.props.index) {
                if (item.id === event.target.value) {
                    this.setState({ duplicate: true });
                }
            }
        }
    };

    render() {
        if (this.state.show && this.state.valid && !this.state.duplicate) {
            return (
                <div className="addEntry">
                    <br />
                    <label className="rankingLabel" id={this.props.index}>{this.props.entriesInVote[this.props.index].rank}.</label>
                    <div>
                        <TextField
                            required="true"
                            label="Entry ID"
                            margin="dense"
                            className="entryFormText"
                            value={this.state.idAndTitle}
                            onChange={this.handleChange('id')}
                        />
                        <TextField
                            disabled
                            label="Title"
                            margin="dense"
                            className="entryFormText"
                            value={this.state.title}
                        />
                    </div>
                    <RemoveCircleOutlineIcon className="removeCircleOutlineIcon" color="primary" id="entryIcon" onClick={this.delEntry} />
                </div>
            );
        } else if (this.state.show && !this.state.duplicate) {
            return (
                <div className="addEntry">
                    <br />
                    <label className="rankingLabel" id={this.props.index}>{this.props.entriesInVote[this.props.index].rank}.</label>
                    <div>
                        <TextField
                            error
                            required="true"
                            label="Entry ID"
                            margin="dense"
                            className="entryFormText"
                            value={this.state.idAndTitle}
                            onChange={this.handleChange('id')}
                        />
                        <TextField
                            disabled
                            label=" "
                            margin="dense"
                            className="entryFormText"
                            value="Enter a Valid Entry ID"
                        />
                    </div>
                    <RemoveCircleOutlineIcon className='removeCircleOutlineIcon' color='primary' id='entryIcon' onClick={this.delEntry} />
                </div>
            );
        } else if (this.state.show && this.state.duplicate) {
            return (
                <div className='addEntry'>
                    <br />
                    <label className='rankingLabel'>{this.props.entriesInVote[this.props.index].rank}.</label>
                    <div>
                        <TextField
                            error
                            required="true"
                            label="Entry ID"
                            margin="dense"
                            className="entryFormText"
                            value={this.state.idAndTitle}
                            onChange={this.handleChange('id')}
                        />
                        <TextField
                            disabled
                            label=" "
                            margin="dense"
                            className="entryFormText"
                            value="Duplicate Entry ID"
                        />
                    </div>
                    <RemoveCircleOutlineIcon className='removeCircleOutlineIcon' color='primary' id='entryIcon' onClick={this.delEntry} />
                </div>
            );
        } else {
            return null;
        }
    }
}
