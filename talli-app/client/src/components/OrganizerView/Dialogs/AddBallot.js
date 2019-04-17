import React, { Component } from 'react';
import { Slide, Dialog, DialogTitle, DialogContent, Button } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import firebase from '../../../firebase';
import AddBallotEntry from './AddBallotEntry';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class AddVotes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            entries: [],
            voteID: '',
        };
    }

    addEntry = () => {
        let rank = 0;
        for (let i = 0; i < this.state.entries.length; i++) {
            const item = this.state.entries[i];
            if (item.show) {
                rank++;
            }
        }
        rank++;
        const newEntries = this.state.entries.slice();
        newEntries.push({
            show: true,
            id: '',
            rank,
        });
        this.setState({ entries: newEntries });
    }

    submitVote = event => {
        event.preventDefault();
        let hasError = false;
        let numOfEntries = 0;
        for (let i = 0; i < this.state.entries.length; i++) {
            const checkItem = this.state.entries[i];
            if (checkItem.show) {
                if (checkItem.duplicate || !checkItem.valid) {
                    hasError = true;
                }
                numOfEntries++;
            }
        }
        if (!hasError && numOfEntries > 0) {
            const ballotsRef = firebase.database().ref(`event/${this.props.event.id}/manual`);
            ballotsRef.once('value', (snapshot) => {
                let ballots = snapshot.val();
                let index;
                if (ballots === null) {
                    index = '0';
                } else {
                    index = ballots.length + '';
                }
                let entries = {};
                let i = 1;
                for (let entry of this.state.entries) {
                    let entryData = this.props.event.entries[entry.id];
                    entries[i] = entryData;
                    i++;
                }

                ballotsRef.child(index).set(entries);

                this.setState({ entries: [] });
                this.handleClose();
            });
        }
    }

    handleOpen = () => {
        this.setState({
            open: true,
        });
    }

    handleClose = () => {
        this.setState({ entries: [] });
        this.setState({ open: false });
    }

    updateEntry(status, idx) {
        const updateEntries = this.state.entries;
        updateEntries[idx] = status;
        for (let i = 0; i < updateEntries.length; i++) {
            const item = updateEntries[i];
            if (item.show && i !== idx) {
                updateEntries[idx].duplicate = item.id === updateEntries[idx].id;
            }
        }
        if (!updateEntries[idx].show) {
            for (let i = idx + 1; i < this.state.entries.length; i++) {
                if (updateEntries[i].show) {
                    updateEntries[i].rank -= 1;
                }
            }
        }
        this.setState({ entries: updateEntries });
    }

    render() {
        const { entries } = this.state;
        return (
            <div>
                <Dialog open={this.state.open} TransitionComponent={Transition} onClose={this.handleClose}>
                    <DialogTitle> Add Vote </DialogTitle>
                    <DialogContent>
                        Click the circle-add button to fill in each entry.
                        <br />
                        <form className="addEntryForm" onSubmit={this.submitVote}>
                            {
                                entries.map((val, idx) => {
                                    return (
                                        <div key={val.id}>
                                            <AddBallotEntry
                                                event={this.props.event}
                                                googleId={this.props.googleId}
                                                entriesInVote={entries}
                                                updateEntry={(status, index) => this.updateEntry(status, index)}
                                                index={idx}
                                            />
                                        </div>
                                    );
                                })
                            }
                            <br />
                            <AddCircleIcon color="primary" id="entryIcon" onClick={this.addEntry} />
                            <br />
                            <br />
                            <Button
                                variant="contained"
                                className="buttons"
                                type="button"
                                onClick={this.handleClose}
                            >
                                Cancel
                            </Button>
                            {'  '}
                            <Button type="submit" variant="contained" color="primary" className="buttons">Submit</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}
