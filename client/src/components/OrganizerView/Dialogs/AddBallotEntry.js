import React, { Component } from 'react';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import '../../component_style/Organizer.css';
import { TextField } from '@material-ui/core';
import firebase from '../../../firebase';

export default class AddVoteEntryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            id: '',
            title: '',
            rank: '',
            entries: [],
            duplicate: false,
            valid: false,
        };
    }

    componentDidMount() {
        const query = firebase.database().ref(`organizer/${this.props.googleId}/event/${this.props.event.id}`);
        query.on('value', (snapshot) => {
            const entriesRef = snapshot.val();
            const { entries } = entriesRef;
            this.setState({
                entries,
                rank: this.props.entriesInVote[this.props.index].rank,
                id: this.props.entriesInVote[this.props.index].id,
                title: this.props.entriesInVote[this.props.index].title,
                valid: this.props.entriesInVote[this.props.index].valid,
                duplicate: this.props.entriesInVote[this.props.index].duplicate,
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


    handleIdChange = event => {
        this.setState({
            rank: this.props.entriesInVote[this.props.index].rank,
            id: event.target.value
        }, () => {
            let title = '';
            const entry = this.state.entries[this.state.id];
            if (entry) {
                title = entry.title;
            }
            this.setState({
                title,
                valid: title !== '',
            }, () => {
                if (this.state.valid) {
                    this.props.updateEntry(this.state, this.props.index);
                }
            });
        });
    }

    render() {
        if (this.state.show && this.state.valid && !this.state.duplicate) {
            return (
                <div className="addEntry">
                    <br />
                    <label className="rankingLabel" id={this.props.index}>{this.props.entriesInVote[this.props.index].rank}.</label>
                    <div>
                        <TextField
                            required
                            label="Entry ID"
                            margin="dense"
                            className="entryFormText"
                            value={this.state.id}
                            onChange={this.handleIdChange}
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
        }
        if (this.state.show && !this.state.duplicate) {
            return (
                <div className="addEntry">
                    <br />
                    <label className="rankingLabel" id={this.props.index}>{this.props.entriesInVote[this.props.index].rank}.</label>
                    <div>
                        <TextField
                            error
                            required
                            label="Entry ID"
                            margin="dense"
                            className="entryFormText"
                            value={this.state.id}
                            onChange={this.handleIdChange}
                        />
                        <TextField
                            disabled
                            label=" "
                            margin="dense"
                            className="entryFormText"
                            value="Enter a Valid Entry ID"
                        />
                    </div>
                    <RemoveCircleOutlineIcon className="removeCircleOutlineIcon" color="primary" id="entryIcon" onClick={this.delEntry} />
                </div>
            );
        }
        if (this.state.show && this.state.duplicate) {
            return (
                <div className="addEntry">
                    <br />
                    <label className="rankingLabel">{this.props.entriesInVote[this.props.index].rank}.</label>
                    <div>
                        <TextField
                            error
                            required
                            label="Entry ID"
                            margin="dense"
                            className="entryFormText"
                            value={this.state.id}
                            onChange={this.handleIdChange}
                        />
                        <TextField
                            disabled
                            label=" "
                            margin="dense"
                            className="entryFormText"
                            value="Duplicate Entry ID"
                        />
                    </div>
                    <RemoveCircleOutlineIcon className="removeCircleOutlineIcon" color="primary" id="entryIcon" onClick={this.delEntry} />
                </div>
            );
        }
        return null;
    }
}
