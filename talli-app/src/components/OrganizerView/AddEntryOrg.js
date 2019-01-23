import React from 'react';
import { Typography } from '@material-ui/core';
import NewEntryForm from './NewEntryForm';
import '../component_style/Organizer.css';

/**
 * Entry Add/Remove, unimplemented
 * TODO: read existing events from database and render
 */
export default class AddEntryOrg extends React.Component {
    state = {
        entries: [
            {
                title: '',
                id: '',
                presenters: '',
                dates: ''
            }
        ],
    };

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

    render() {
        let {entries} = this.state;
        return (
            <div className='addEntryForm'>
                <Typography variant='h4' align='center' gutterBottom>Add Entries</Typography>
                <button className='buttons' name='import_entries'>Import Entries</button>
                <p>Click here for import requirements.</p>
                <hr/>
                <form className='entryForm'>
                {
                    entries.map((val, idx)=> {
                        return (
                            <div>
                              <NewEntryForm addEntry={this.addEntry} />
                            </div>
                        )
                    })
                }
                <br />
                <button className='buttons'>Done</button>
                </form>
            </div>
        );
    }
}