import React, { Component } from 'react';
import { Slide, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControlLabel, Switch } from '@material-ui/core';
import qr from 'qr-image';
import JsPDF from 'jspdf';

const config = require('../../../config.json');

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class ExportOrgData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            exportEntry: true,
            exportEvent: true
        };
    }

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
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    generatePDF = () => {
        if (this.state.exportEntry || this.state.exportEvent) {
            // set up document
            const doc = new JsPDF('portrait', 'mm', 'letter');
            let title = '';
            let qrCode;
            let contents = '';

            if (this.state.exportEvent) {
                // add event qr code
                contents = 'Event';
                title = `Event ID: ${this.props.event.id}`;
                qrCode = qr.imageSync(`${config.Global.hostURL}/vote/${this.props.event.id}`);
                doc.addImage(qrCode, 'PNG', 18, 40, 180, 180); // (image, type, x, y, w, h)
                doc.text(this.props.event.name, 108, 40, 'center'); // (string, x, y, align)
                doc.text(title, 108, 225, 'center');
                doc.setFontType("bold");
                doc.text("Join the voting at tallivote.com!", 108, 20, 'center');
                doc.setFontType("regular");
                doc.setFont("helvetica");
            }

            if (this.state.exportEntry) {
                // add entry qr codes
                contents += 'Entries';
                let entry, entryTitle;
                let offset = 0;
                for (let entryID in this.props.event.entries) {
                    entry = this.props.event.entries[entryID];
                    if (offset === 0) { doc.addPage(); }
                    title = `Entry ID: ${entry.id}`;
                    entryTitle = doc.splitTextToSize(entry.title, 180);
                    qrCode = qr.imageSync(config.Global.entryQRPrefix + String(entry.id));
                    doc.addImage(qrCode, 'PNG', 58, 20 + offset, 100, 100); // QR code
                    doc.text(entryTitle, 108, 20 + offset, 'center'); // entry title
                    doc.text(title, 108, 118 + offset, 'center'); // entry id
                    offset = (offset === 0) ? 140 : 0;
                }
            }
            // save document to local machine
            const nameNoSpaces = this.props.event.name.replace(/\s+/g, '');
            doc.save(`${nameNoSpaces}${contents}QRCodes.pdf`);
        }
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    onClose={this.handleClose}
                >
                    <DialogTitle> Export </DialogTitle>
                    <DialogContent>
                        <FormControlLabel
                            control={(
                                <Switch
                                    checked={this.state.exportEvent}
                                    onChange={() => this.toggleEventExport()}
                                    value={this.state.exportEvent}
                                    color="primary"
                                />
                            )}
                            label="Export Event QR"
                            labelPlacement="start"
                        /> <br />
                        <FormControlLabel
                            control={(
                                <Switch
                                    checked={this.state.exportEntry}
                                    onChange={() => this.toggleEntryExport()}
                                    value={this.state.exportEntry}
                                    color="primary"
                                />
                            )}
                            label="Export Entry QR"
                            labelPlacement="start"
                        />
                        <br /><br />
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
