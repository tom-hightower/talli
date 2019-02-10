import React from 'react';
import { Slide, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControlLabel, Switch } from '@material-ui/core';
import qr from 'qr-image';
import jsPDF from 'jspdf';
var config = require('../../../config.json');

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class ExportOrgData extends React.Component {
    state = {
        open: false,
        exportEntry: true,
        exportEvent: true
    };

    toggleEntryExport = () => {
        this.setState({
            exportEntry: !this.state.exportEntry,
        });
    }

    toggleEventExport = () => {
        this.setState({
            exportEvent: !this.state.exportEvent,
        });
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    generatePDF = () => {
        if (this.state.exportEntry || this.state.exportEvent) {
            // set up document
            var doc = new jsPDF("portrait", "mm", "letter");
            var title, qr_code;
            var contents = '';

            if (this.state.exportEvent) {
                // add event qr code
                contents = "Event";
                title = "Event ID: " + this.props.event.id;
                qr_code = qr.imageSync('tallivote.com/vote/' + this.props.event.id);
                doc.addImage(qr_code, 'PNG', 58, 20, 100, 100); // (image, type, x, y, w, h)
                doc.text(this.props.event.name, 108, 20, "center"); // (string, x, y, align)
                doc.text(title, 108, 125, "center");
            }

            if (this.state.exportEntry) {
                // add entry qr codes
                contents = contents + "Entries";
                var entry;
                for (var entryID in this.props.event.entries) {
                    entry = this.props.event.entries[entryID];
                    doc.addPage();
                    title = "Entry ID: " + entry['id'];
                    qr_code = qr.imageSync(config.Global.entryQRPrefix + String(entry['id']));
                    doc.addImage(qr_code, 'PNG', 58, 20, 100, 100);
                    doc.text(entry['title'], 108, 20, "center");
                    doc.text(title, 108, 125, "center");
                }
            }
            // save document to local machine
            var nameNoSpaces = this.props.event.name.replace(/\s+/g, '');
            doc.save(nameNoSpaces + contents + 'QRCodes.pdf');
        }
    }

    render() {
        return (
            <div>
                <Dialog open={this.state.open} TransitionComponent={Transition} onClose={this.handleClose}>
                    <DialogTitle> Export </DialogTitle>
                    <DialogContent>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.exportEvent}
                                    onChange={() => this.toggleEventExport()}
                                    value={this.state.exportEvent}
                                    color="primary"
                                />
                            }
                            label="Export Event QR"
                            labelPlacement="start"
                        /> <br/>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.exportEntry}
                                    onChange={() => this.toggleEntryExport()}
                                    value={this.state.exportEntry}
                                    color="primary"
                                />
                            }
                            label="Export Entry QR"
                            labelPlacement="start"
                        /><br/>
                        <Button variant="contained" onClick={this.generatePDF}>Export QR to PDF</Button>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Go Back</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}