import React from 'react';
import Modal from 'react-modal';

const SaveConfirmationDialog = ({ isOpen, onConfirm, onClose }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Save Confirmation"
        >
            <h2>Save Confirmation</h2>
            <p>Are you sure you want to save?</p>
            <div className="modal-button-group">
                <button className="modal-button" onClick={onConfirm}>Yes</button>
                <button className="modal-button no" onClick={onClose}>No</button>
            </div>
        </Modal>
    );
};

export default SaveConfirmationDialog;
