import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CloseIcon from '@mui/icons-material/HighlightOff';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);

    function handleUndo() {
        //Only allow undo to occur if the user doesnt have a text field open
        if (!store.isItemEditActive){
            store.undo();
        }
    }
    function handleRedo() {
        if (!store.isItemEditActive){
            store.redo();
        }
    }
    function handleClose() {
        if (!store.isItemEditActive){
            store.closeCurrentList();
        }
    }
    let isUndo = store.isListNameEditActive || store.isItemEditActive || !store.hasUndo;
    let isRedo = store.isListNameEditActive || store.isItemEditActive || !store.hasRedo;
    let isClosed = store.isListNameEditActive || store.isItemEditActive|| !store.currentList;
    // function handleUndoFP(){
    //     if (store.listNameActive || store.itemActive || !store.hasUndo){
    //         return <></>
    //     }
    //    return <UndoIcon />
    // }
    // function handleRedoFP(){
    //     if (store.listNameActive || store.itemActive || !store.hasRedo){
    //         return <></>
    //     }
    //    return <RedoIcon />
    // }
    // function handleCloseFP(){
    //     if (store.listNameActive || store.itemActive || !store.currentList){
    //         return <></>
    //     }
    //    return <CloseIcon />
    // }
    return (
        <div id="edit-toolbar">
            <Button 
                id='undo-button'
                disabled={isUndo}
                onClick={handleUndo}
                variant="contained">
                    <UndoIcon />
            </Button>
            <Button 
                disabled={isRedo}
                id='redo-button'
                onClick={handleRedo}
                variant="contained">
                    <RedoIcon />
            </Button>
            <Button 
                disabled={isClosed}
                id='close-button'
                onClick={handleClose}
                variant="contained">
                   <CloseIcon />
            </Button>
        </div>
    )
}

export default EditToolbar;