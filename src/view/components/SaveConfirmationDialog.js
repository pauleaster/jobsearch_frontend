import React from 'react';
import Modal from 'react-modal';

const SaveConfirmationDialog = ({ 
    isOpen, 
    onConfirm, 
    onClose, 
    onRequestClose 
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose ?? onClose}
            contentLabel="Save Confirmation"
            className="modal-content"
            overlayClassName="modal-overlay"
        >
            <h2 className="modal-title">Save Confirmation</h2>
            <p className="modal-text">Are you sure you want to save?</p>
            <div className="modal-button-group">
                <button className="modal-button no" onClick={onClose}>No</button>
                <button className="modal-button" onClick={onConfirm}>Yes</button>
            </div>
        </Modal>
    );
};

export default SaveConfirmationDialog;
