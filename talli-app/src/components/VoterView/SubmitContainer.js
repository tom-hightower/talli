import React from 'react';
import BellIcon from '@material-ui/icons/NotificationImportant';

export default class SubmitContainer extends React.Component {


    render() {
        return(
          <div className='SubmitDiv'>
              <BellIcon className='BellIcon' />
              <div className='SubmitText'>
                {/* TODO: have this generated off of the end time of the event
                */}
                Voting closes in xx:xx
            </div>
            <div className='buttonDiv'>
              <button className='buttonOut'>
                Submit
              </button>
            </div>
          </div>
        );
      }
}