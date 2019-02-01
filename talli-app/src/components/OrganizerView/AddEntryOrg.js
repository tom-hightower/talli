import React from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import NewEntryForm from './NewEntryForm';
import EntryImportInfo from './EntryImportInfo';
import '../component_style/Organizer.css';

/**
 * Entry Add/Remove, unimplemented
 * TODO: read existing events from database and render
 */
export default class AddEntryOrg extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            entries: [],
        };

        this.infoPopup = React.createRef();
    }

    openInfo = () => {
        this.infoPopup.current.handleOpen();
    }

    addEntry = () => {
        const newEntries = this.state.entries.slice();
        newEntries.push({
            show: true,
            title: '',
            id: '',
            presenters: '',
            entry_dates: ''
        });
        this.setState({ entries: newEntries });
    }

    updateEntry(status, idx) {
        let updateEntries = this.state.entries;
        updateEntries[idx] = status;
        this.setState({ entries: updateEntries });
    }

    cancelAddition = () => {
        this.props.handler(this.props.orgViews.MAIN);
    }

    submitEntries() {
        // DATABASE:
        // add the entries with shown = true in this.state.entries 
        // to the current event
        let entriesToSend = [];
        for (var entry in this.state.entries) {
            if (entry.show) {
                entriesToSend.push(entry);
            }
        }
        // at this point you can just add all items in 'entriesToSend'
        this.props.handler(this.props.orgViews.MAIN);
    }

    render() {
        let { entries } = this.state;
        return (
            <div className='addEntryForm'>
                <EntryImportInfo ref={this.infoPopup}/>
                <Typography variant='h4' align='center' gutterBottom>Add Entries</Typography>
                <Button variant="contained" className='buttons' name='import_entries'>Import Entries</Button>
                <br/>
                <Button variant="text" className='buttons' onClick={this.openInfo} >Click here for import requirements.</Button>
                <Divider variant="middle" />
                <form className="entryForm" onSubmit={() => this.submitEntries()}>
                    {
                        entries.map((val, idx) => {
                            return (
                                <div key={idx}>
                                    <NewEntryForm updateEntry={(status, index) => this.updateEntry(status, index)} index={idx} />
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
                        onClick={this.cancelAddition}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" className='buttons'>Done</Button>
                </form>
            </div>
        );
    }
}