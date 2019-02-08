import React from 'react';
import { Slide, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControlLabel, Switch } from '@material-ui/core';
import qr from 'qr-image';
import jsPDF from 'jspdf';

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

            if (this.state.exportEvent) {
                // add event qr code
                title = this.props.event.name + " Event ID: " + this.props.event.id;
                qr_code = qr.imageSync('https://twitter.com/');
                doc.addImage(qr_code, 'PNG', 58, 10, 100, 100);
                doc.text(title, 108, 20, "center");
            }

            if (this.state.exportEntry) {
                // add entry qr codes
                for (var i = 100; i < 600; i += 100) {
                    doc.addPage();
                    title = "Entry ID: " + i;
                    qr_code = qr.imageSync(String(i));
                    doc.addImage(qr_code, 'PNG', 58, 10, 100, 100);
                    doc.text(title, 108, 20, "center");
                }
            }
            // save document to local machine
            doc.save('testPDF.pdf');
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