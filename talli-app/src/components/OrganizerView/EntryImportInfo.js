import React from 'react';
import { Dialog, DialogTitle, DialogContent, Slide } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import '../component_style/EntryImportInfo.css';

/**
 * OrganizerView > AddEntryOrg > EntryImportInfo
 * Pop up message for showing import requirements
 * for automatically syncing of entries.
 */
function Transition(props) {
    return <Slide direction="up" {...props} />;
  }

export default class EntryImportInfo extends React.Component {
    state = {
        open: false,
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        return (
            <div>
                <Dialog open={this.state.open} TransitionComponent={Transition} onClose={this.handleClose}>
                    <CloseIcon onClick={this.handleClose}/>
                    <DialogTitle>
                        Import Information
                    </DialogTitle>
                    <DialogContent>
                        Accepted file type: .csv <br/><br/>
                        Accepted file format: 4 columns in the order of Entry Titles, IDs, Presenters, Date(s) Attending
                        <br/><br/>
                        *Entry Titles and Presenters are required, but if you do not have IDs or Dates, still include the columns.
                        <br/><br/>
                        Example file:
                        <table id='table'>
                            <tbody>
                                <tr>
                                    <td>Entry Title</td>
                                    <td>ID</td>
                                    <td>Presenters</td>
                                    <td>Date(s) Attending</td>
                                </tr>
                                <tr><td></td><td></td><td></td><td></td></tr>
                                <tr><td></td><td></td><td></td><td></td></tr>
                                <tr><td></td><td></td><td></td><td></td></tr>
                            </tbody>
                        </table>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}