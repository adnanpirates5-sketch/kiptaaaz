import React from "react";
import "./Modal.css";  // Make sure to import the styles

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;  // Don't render the modal if it's not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>X</button>
                {children} {/* The children prop will be the Terms and Conditions content */}
            </div>
        </div>
    );
};

export default Modal;