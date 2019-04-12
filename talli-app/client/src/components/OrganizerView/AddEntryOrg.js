import React, { Component } from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import NewEntryForm from './NewEntryForm';
import EntryImportInfo from './Dialogs/EntryImportInfo';
import '../component_style/Organizer.css';
import firebase from '../../firebase';

/**
 * OrganizerView > AddEntryOrg
 * Allows organizers to add entries to their event
 * after setting up the event details (NewEventForm).
 */
export default class AddEntryOrg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: [],
            alert: ''
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
            entryDates: ''
        });
        this.setState({
            entries: newEntries,
            alert: this.state.alert
        });
    }

    updateEntry(status, idx) {
        const updateEntries = this.state.entries;
        updateEntries[idx] = status;
        this.setState({
            entries: updateEntries,
            alert: this.state.alert
        });
    }

    cancelAddition = () => {
        this.props.handler(this.props.orgViews.MAIN);
    }

    submitEntries() {
        // DATABASE:
        // add the entries with shown = true in this.state.entries
        // to the current event
        const googleId = this.props.user.googleId;
        const eventID = this.props.curEvent;
        const base = 1000 + Math.floor((Math.random() * 8000) + 1);
        for (let i = 0; i < this.state.entries.length; i++) {
            const item = this.state.entries[i];
            if (item.show) {
                item.id = base + i;
                const itemsRef = firebase.database().ref(`organizer/${googleId}/event/${eventID}/entries`);
                itemsRef.child(item.id).set(item);
            }
        }
        this.props.handler(this.props.orgViews.MAIN);
    }

    readCSV = event => {
        const f = event.target.files[0];
        if (f) {
            const r = new FileReader();
            let a;
            r.onload = (e) => {
                const contents = r.result;
                a = r.result;
                const lines = contents.split(/[\r\n]+/g);
                const tempEnt = [];
                let line;
                let lineTitle;
                let linePres;
                let lineDate;
                let lineURL;
                for (let i = 1; i < lines.length; i++) {
                    line = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                    console.log(line)
                    if (line.length !== 3 && line.length !== 0 && line.length !== 4) {
                        a = 'File format is incorrect. Please see "Import Requirements" for correct formatting.';
                        this.setState({ entries: this.state.entries, alert: a });
                        return;
                    }
                    lineTitle = line[0];
                    linePres = line[1];
                    lineDate = line[2];
                    lineURL = line[3] ? line[3] : '';
                    if (lineTitle && linePres && lineDate) {
                        tempEnt.push({
                            show: true,
                            title: lineTitle,
                            id: '',
                            presenters: linePres,
                            entry_dates: lineDate,
                            info_url: lineURL,
                        });
                    } else {
                        a = 'Some required data is missing. Please see "Import Requirements" for correct formatting.';
                        this.setState({ entries: this.state.entries, alert: a });
                        return;
                    }
                }
                // concat entries here
                a = `Success! Entries from ${f.name} were imported.`;
                this.setState({
                    entries: this.state.entries.concat(tempEnt),
                    alert: a
                });
            };
            r.readAsText(f);
        } else {
            this.setState({ alert: 'Unable to read file.' });
        }
    }

    render() {
        const { entries } = this.state;
        return (
            <div className="addEntryForm">
                <EntryImportInfo ref={this.infoPopup} />
                <Typography variant="h4" align="center" gutterBottom>Add Entries</Typography>
                <Button variant="contained" component="label" className="buttons" name="import_entries">
                    Import Entries
                    <input type="file" accept=".csv" style={{ display: 'none' }} onChange={e => this.readCSV(e)} />
                </Button>
                <br /><br />
                <Typography variant="subtitle1" align="center">{this.state.alert}</Typography>
                <Button variant="text" className="buttons" onClick={this.openInfo}>Click here for import requirements.</Button>
                <Divider variant="middle" />
                <form className="entryForm" onSubmit={() => this.submitEntries()}>
                    {
                        entries.map((val, idx) => {
                            return (
                                <div key={val.id}>
                                    <NewEntryForm
                                        currValue={val}
                                        updateEntry={(status, index) => this.updateEntry(status, index)}
                                        index={idx}
                                    />
                                </div>
                            );
                        })
                    }
                    <AddCircleIcon color="primary" id="entryIcon" onClick={this.addEntry} />
                    <br />
                    <Button
                        variant="contained"
                        className="buttons"
                        type="button"
                        onClick={this.cancelAddition}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary" className="buttons">Done</Button>
                </form>
            </div>
        );
    }
}
