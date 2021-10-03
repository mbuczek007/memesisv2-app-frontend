import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useSelector } from 'react-redux';
import AddEntry from './AddEntry';

const AddEntryOverlay = ({ open, handleSetOpen }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    handleSetOpen();
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby='add-entry-dialog'
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id='add-entry-dialo'>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <AddEntry />
      </DialogContent>
    </Dialog>
  );
};

export default AddEntryOverlay;
