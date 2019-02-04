import React from 'react';
import { Typography, Button } from '@material-ui/core';
// import '../component_style/Organizer.css';
import '../component_style/ViewEvent.css';
import qr from 'qr-image';
import jsPDF from 'jspdf';

/**
 * OrganizerView > ViewEvent
 * Allows organizers to view the details of an event
 * that they have already created.
 * TODO: read existing events from database and render
 */
export default class ViewEvent extends React.Component {
    constructor() {
        super();
        this.state = {
            view: 'main',
            // mock entries for ui testing purposes
            // Aren't used here so we probably can just delete these if they are on the wrong page
            entries: [
                "Entry 1 (Dates attending) - Presenter 1, Presenter 2",
                "Entry 2 (Dates attending) - Presenter 1",
                "Entry 3 (Dates attending) - Presenter 1, Presenter 2"
            ],
        };
    }

    goBack = () => {
        this.props.handler(this.props.orgViews.MAIN);
    }

    generatePDF = () => {
        // set up document
        var doc = new jsPDF("portrait", "mm","letter");
        var title, qr_code;

        // add event qr code
        title = "[Event Name]" + " Event ID: " + "[Event ID]";
        qr_code = qr.imageSync('https://twitter.com/');
        doc.addImage(qr_code, 'PNG', 58, 10, 100, 100);
        doc.text(title, 108, 20, "center");

        // add entry qr codes
        for (var i = 100; i < 600; i+=100) {
          doc.addPage();
          title = "Entry ID: " + i;
          qr_code = qr.imageSync(String(i));
          doc.addImage(qr_code, 'PNG', 58, 10, 100, 100);
          doc.text(title, 108, 20, "center");
        }

        // save document to local machine
        doc.save('testPDF.pdf');
    }

    render() {
        return (
            <div className="main">
                <Typography variant="h3" align='center' gutterBottom>Sample Event</Typography>
                <div className="options">
                    {/* TODO: Couldn't figure out how to add spacing between these buttons lol */}
                    <Button className="button1" variant="contained" color="primary">Manage Event</Button>
                    <Button variant="contained">View Results</Button>
                </div>
                <div className="box">
                    {/* TODO: Each of these should take the user to the specified page when clicked */}
                    <div onClick={this.generatePDF}>Export Event & Entry QR Codes</div>
                    <div>View/Add/Edit Entries</div>
                    <div>View/Edit Event Details</div>
                    <div>Open/Close Voting</div>
                </div>
                <Button
                    variant="contained"
                    className="buttons"
                    type="button"
                    onClick={this.goBack} >
                    Back
                </Button>
            </div>
        )
    }
}