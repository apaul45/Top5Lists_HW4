import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
/*
    This modal is shown when the user asks to delete a list. Note 
    that before this is shown a list has to be marked for deletion,
    which means its id has to be known so that we can retrieve its
    information and display its name in this modal. If the user presses
    confirm, it will be deleted.
    
    @author McKilla Gorilla
*/
function DeleteModal() {
    const { store } = useContext(GlobalStoreContext);
    let name ="";
    let isOpen = false;
    //If there's a list to delete: 1- Set the name of the 
    //list to be deleted and 2- show the modal
    if (store.listMarkedForDeletion) {
        name = store.listMarkedForDeletion.name;
        isOpen=true;
    }
    function handleDeleteList(event) {
        store.deleteMarkedList();
    }
    function handleCloseModal(event) {
        store.unmarkListForDeletion();
    }
    return (
        <div>
        <Modal
          open={isOpen}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Delete the {name} Top 5 List?
            </Typography>
            <Button id="dialog-yes-button"
            className =  "modal-button"
            onClick={handleDeleteList}>
            Confirm
            </Button>
            <Button id="dialog-no-button"
            className =  "modal-button"
            onClick={handleCloseModal}>
            Cancel
            </Button>
          </Box>
        </Modal>
      </div>
        // <div
        //     className="modal"
        //     id="delete-modal"
        //     data-animation="slideInOutLeft">
        //     <div className="modal-dialog">
        //         <header className="dialog-header">
        //             Delete the {name} Top 5 List?
        //         </header>
        //         <div id="confirm-cancel-container">
        //             <button
        //                 id="dialog-yes-button"
        //                 className="modal-button"
        //                 onClick={handleDeleteList}
        //             >Confirm</button>
        //             <button
        //                 id="dialog-no-button"
        //                 className="modal-button"
        //                 onClick={handleCloseModal}
        //             >Cancel</button>
        //         </div>
        //     </div>
        // </div>
    );
}

export default DeleteModal;