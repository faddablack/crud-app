import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react'

function Alert({isOpen, message, isDelete, isClose}){
     const modalPrimaryButtonRef = React.useRef();
  const modalCloseButtonRef = React.useRef();

  return (
    <React.Fragment>
      <Dialog
        open={isOpen}
        onClose={() => isClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        role="alertdialog"
      >
        <DialogTitle id="alert-dialog-title">
          {"You are about to delete a task!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
             Do you really want to delete the task <code>{message}</code>?
                  This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => isClose(false)} autoFocus>
            Close
          </Button>
          <Button color='error' onClick={() => isDelete()}>Delete</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default Alert;