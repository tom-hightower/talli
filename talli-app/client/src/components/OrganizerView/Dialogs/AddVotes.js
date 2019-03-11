import React from 'react';
import { Slide, Dialog, DialogTitle, DialogContent, Button } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import firebase from '../../../firebase';
import AddVoteEntryForm from './AddVoteEntryForm';

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
        for (var i = 0; i < this.state.entries.length; i++) {
            let item = this.state.entries[i];
            if (item.show) {
                rank++;
            }
        }
        rank++;
        const newEntries = this.state.entries.slice();
        newEntries.push({
            show: true,
            id: '',
            rank: rank,
        });
        this.setState({ entries: newEntries });
    }

    updateEntry(status, idx) {
        let updateEntries = this.state.entries;
        updateEntries[idx] = status;
        if (!this.state.entries[idx].show) {
            for (var i = idx + 1; i < this.state.entries.length; i++) {
                if (updateEntries[i].show) {
                    updateEntries[i].rank -= 1;
                }
            }
        }
        this.setState({ entries: updateEntries });
    }

    submitVote = () => {
        let hasError = false;
        for (var i = 0; i < this.state.entries.length; i++) {
            let checkItem = this.state.entries[i];
            if (checkItem.show) {
                if (checkItem.duplicate || !checkItem.valid) {
                    hasError = true;
                }
            }
        }
        if (!hasError) {
            const itemRef = firebase.database().ref('event/'+ this.props.event.id + '/nonDigitVote');
            itemRef.once('value', (snapshot) => {
                let nonDigitVoteSize = snapshot.child("count").val();
                if (nonDigitVoteSize === "" || nonDigitVoteSize === null) {
                    nonDigitVoteSize = 0;
                }
                nonDigitVoteSize += 1;
                this.setState({ voteID: nonDigitVoteSize});
                itemRef.child('count').set(this.state.voteID);
                for (var i = 0; i < this.state.entries.length; i++) {
                    let item = this.state.entries[i];
                    if (item.show) {
                        const itemsRef = firebase.database().ref('event/'+ this.props.event.id + '/nonDigitVote/vote' + this.state.voteID);
                        itemsRef.child(item.id).set(item.rank);
                    }
                }
                this.setState({ entries: [] })
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
        this.setState({ entries: [] })
        this.setState({ open: false });
    };

    render() {
        return (
            <div>
                <Dialog open={this.state.open} TransitionComponent={Transition} onClose={this.handleClose}>
                    <DialogTitle> Add Vote </DialogTitle>
                    <DialogContent>
                        Click the circle-add button to fill in each entry.
                        <br />
                        <form className="addEntryForm" onSubmit={this.submitVote}>
                            {
                                this.state.entries.map((val, idx) => {

                                    return (
                                        <div key={idx}>
                                            <AddVoteEntryForm event={this.props.event} googleId={this.props.googleId} entriesInVote={this.state.entries} updateEntry={(status, index) => this.updateEntry(status, index)} index={idx} />
                                        </div>
                                    )
                                })
                            }
                            <br />
                            <AddCircleIcon color='primary' id='entryIcon' onClick={this.addEntry}/>
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