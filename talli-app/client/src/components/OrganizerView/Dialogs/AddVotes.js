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
        const newEntries = this.state.entries.slice();
        newEntries.push({
            show: true,
            id: '',
            rank: '',
        });
        this.setState({ entries: newEntries });
    }

    updateEntry(status, idx) {
        let updateEntries = this.state.entries;
        updateEntries[idx] = status;
        this.setState({ entries: updateEntries });
    }

    submitVote = () => {
        const itemRef = firebase.database().ref('event/'+ this.props.event.id + '/nonDigitVote');
        itemRef.once('value', (snapshot) => {
            let nonDigitVoteSize = snapshot.child("count").val();
            console.log(nonDigitVoteSize);
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
                        Click the circle-add button to fill in each entry and its rank.
                        <br />
                        <form className="entryForm" onSubmit={this.submitVote}>
                            {
                                this.state.entries.map((val, idx) => {
                                    return (
                                        <div key={idx}>
                                            <AddVoteEntryForm event={this.props.event} googleId={this.props.googleId} updateEntry={(status, index) => this.updateEntry(status, index)} index={idx} />
                                        </div>
                                    )
                                })
                            }
                            <AddCircleIcon color='primary' id='entryIcon' onClick={this.addEntry}/>
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
                            <Button type="submit" variant="contained" color="primary" className='buttons'>Done</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}