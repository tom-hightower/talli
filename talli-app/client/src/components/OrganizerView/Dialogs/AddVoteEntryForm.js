import React from 'react';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import '../../component_style/Organizer.css';
import { TextField } from '@material-ui/core';
import firebase from '../../../firebase';

export default class AddVoteEntryForm extends React.Component {
    state = {
        show: true,
        id: '',
        idAndTitle: '',
        rank: '',
        entries: [],
    }

    delEntry = () => {
        this.setState({
            show: false,
        }, () => {
            this.props.updateEntry(this.state, this.props.index);
        });
    }

    componentDidMount() {
        var query = firebase.database().ref('organizer/' + this.props.googleId + '/event/' + this.props.event.id);
        query.on('value', (snapshot) => {
            let entriesRef = snapshot.val();
            let entries = entriesRef['entries']
            console.log(entries)
            this.setState({
                entries: entries
            });
        });
    }

    handleChange = name => event => {
        var title = ""
        var entry = this.state.entries[event.target.value]
        if (entry) {
            title = entry['title']
        }
        if (title !== '') {
            this.setState({
                [name]: ' ' + event.target.value + ' (' + title + ')',
                id: event.target.value,
            }, () => {
                this.props.updateEntry(this.state, this.props.index);
            });
        } else {
            if (event.target.value === ' ') {
                this.setState({
                    [name]: '',
                }, () => {
                    this.props.updateEntry(this.state, this.props.index);
                });
            } else {
                this.setState({
                    [name]: event.target.value,
                }, () => {
                    this.props.updateEntry(this.state, this.props.index);
                });
            }
        }
    };

    render() {
        if (this.state.show) {
            return (
                <div className='addEntry'>
                <br />
                    <div>
                        <TextField
                            required = "true"
                            label="Entry ID"
                            margin="dense"
                            className="entryFormText"
                            value={this.state.idAndTitle}
                            onChange={this.handleChange('idAndTitle')}
                        />
                        <TextField
                            required = "true"
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