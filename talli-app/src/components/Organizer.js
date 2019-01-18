import React from 'react';
import { Typography } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { navigate } from 'react-mini-router';
import './component_style/Organizer.css';

/**
 * Organizer/Event Management view, unimplemented
 * TO DO: read existing events from database and render
 */
export default class Organizer extends React.Component {
    ChangeView(page) { navigate(page); }
    render() {
        return(
            <div>
                <Typography variant='display1' align='center' gutterBottom>Organizer View</Typography>
                <div className='organizerEvents'>
                    <div className='eventContainer' id='addEvent'>
                        <AddCircleIcon color='primary' id='addCircleIcon' onClick={() => this.ChangeView('/createevent')}/>
                    </div>
                    <div className='eventContainer' id='openEvent'>
                    </div>
                </div>
            </div>
        );
    }
}