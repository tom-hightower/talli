import React from 'react';
import { Slide, Dialog, DialogTitle, DialogContent, Button } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import firebase from '../../../firebase';
import AddBallotEntry from './AddBallotEntry';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class AddVotes extends React.Component {
    state = {
        open: false,
        entries: [],
        voteID: '',
    };

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

    updateEntry(status, idx) {
        let updateEntries = this.state.entries;
        updateEntries[idx] = status;
        if (!this.state.entries[idx].show) {
            for (let i = idx + 1; i < this.state.entries.length; i++) {
                if (updateEntries[i].show) {
                    updateEntries[i].rank -= 1;
                }
            }
        }
        this.setState({ entries: updateEntries });
    }

    submitVote = () => {
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
            const itemRef = firebase.database().ref(`event/${this.props.event.id}/ballots/manual`);
            itemRef.once('value', (snapshot) => {
                let nonDigitVoteSize = snapshot.child("count").val();
                if (nonDigitVoteSize === "" || nonDigitVoteSize === null) {
                    nonDigitVoteSize = 0;
                }
                nonDigitVoteSize += 1;
                this.setState({ voteID: nonDigitVoteSize });
                itemRef.child('count').set(this.state.voteID);
                for (let x = 0; x < this.state.entries.length; x++) {
                    const item = this.state.entries[x];
                    if (item.show) {
                        const itemsRef = firebase.database().ref(`event/${this.props.event.id}/ballots/manual/vote${this.state.voteID}`);
                        itemsRef.child(item.id).set(item.rank);
                    }
                }
                this.setState({ entries: [] });
                this.handleClose();
            });
        }
    }

    handleOpen = () => {
        this.setState({
            open: true,
        });
    };

    handleClose = () => {
        this.setState({ entries: [] });
        this.setState({ open: false });
    };

    render() {
        let { entries } = this.state;
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
                                        <div key={idx}>
                                            <AddBallotEntry event={this.props.event} googleId={this.props.googleId} entriesInVote={entries} updateEntry={(status, index) => this.updateEntry(status, index)} index={idx} />
                                        </div>
                                    );
                                })
                            }
                            <br />
                            <AddCircleIcon color='primary' id='entryIcon' onClick={this.addEntry} />
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
                            {"  "}
                            <Button type="submit" variant="contained" color="primary" className='buttons'>Submit</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}
