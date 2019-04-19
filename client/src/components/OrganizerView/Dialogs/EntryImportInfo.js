import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, Slide } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import '../../component_style/EntryImportInfo.css';

/**
 * OrganizerView > AddEntryOrg > EntryImportInfo
 * Pop up message for showing import requirements
 * for automatically syncing of entries.
 */
function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class EntryImportInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }

    handleOpen = () => {
        this.setState({ open: true });
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    onClose={this.handleClose}
                >
                    <CloseIcon onClick={this.handleClose} />
                    <DialogTitle>
                        Import Information
                    </DialogTitle>
                    <DialogContent>
                        Accepted file type: .csv <br /><br />
                        Accepted file format: 3 columns in the order of Entry Titles, Presenters, Date(s)
                        Attending. An optional Entry Info URL column is also accepted after the Date(s)
                        column.
                        <br /><br />
                        *Data is read assuming there is a header row, so the first row will be skipped.
                        <br /><br />
                        Example file:
                        <table id="table">
                            <tbody>
                                <tr>
                                    <td>Entry Title</td>
                                    <td>Presenters</td>
                                    <td>Date(s) Attending</td>
                                    <td>Entry Info URL (optional)</td>
                                </tr>
                                <tr><td /><td /><td /><td /></tr>
                                <tr><td /><td /><td /><td /></tr>
                                <tr><td /><td /><td /><td /></tr>
                            </tbody>
                        </table>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}
