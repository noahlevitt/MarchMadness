import React from 'react';
import './ConfirmModal.css'; // optional styling file

const ConfirmModal = ({ isOpen, onConfirm, onCancel, gameId, amount }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Confirm Your Bet</h3>
                <p>Game ID: {gameId}</p>
                <p>Bet Amount: ${amount}</p>
                <div className="modal-buttons">
                    <button onClick={onConfirm}>Confirm</button>
                    <button onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;