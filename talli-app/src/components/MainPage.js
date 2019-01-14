import React from 'react';
import { Typography, Button, ListItem, Grid } from '@material-ui/core';
import { navigate } from 'react-mini-router';
import './component_style/MainPage.css'

export default class MainPage extends React.Component {
    ChangeView(page) { navigate(page); }
    
    render() {
        return(
            <div>
                <Typography variant='display1' align='center' gutterBottom>Main Page</Typography>
                <Grid container justify="center">
                    <div className="buttons"> 
                        <ListItem>
                            <Button variant="contained" color="secondary" className="buttons" onClick={() => this.ChangeView('/vote')}>Event Voting</Button>
                        </ListItem>
                        <ListItem>
                            <Button variant="contained" color="primary" className="buttons" onClick={() => this.ChangeView('/organizer')}>Organizer Login</Button>
                        </ListItem>
                    </div>
                </Grid>
            </div>
        );
    }
}