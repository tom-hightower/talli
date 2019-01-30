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
            title: '',
            id: '',
            presenters: '',
            dates: ''
        });
        this.setState({ entries: newEntries });
    }

    cancelAddition = () => {
        this.props.handler(this.props.orgViews.MAIN);
        // delete the event and any entries added to the current event
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
                <form className="entryForm">
                    {
                        entries.map((val, idx) => {
                            return (
                                <div>
                                    <NewEntryForm addEntry={this.addEntry} />
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