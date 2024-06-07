import React, { useState } from 'react';

const SubmissionAgreementModal = ({ isOpen, onClose, onAgree }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [authorship, setAuthorship] = useState('');

  const handleAgree = () => {
    if (isChecked && authorship !== '') {
      onAgree();
      onClose();
    } else {
      alert('Please accept the Submission Agreement');
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content bg-white w-1/3 mx-auto mt-48 rounded-lg overflow-hidden shadow-lg">
        <div className="modal-header bg-gray-200 py-4 px-6">
          <h2 className="text-lg font-semibold text-gray-800">Submission Agreement</h2>
        </div>
        <div className="modal-body p-6">
          <p className="text-sm text-gray-700 mb-4">Read and accept the Submission Agreement (opens a new window) before proceeding</p>
          <label className="flex items-center">
            <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} className="form-checkbox h-5 w-5 text-blue-500" />
            <span className="ml-2 text-sm text-gray-800 font-semibold">By submitting to NUST Preprint Server, I have read and accept the Submission Agreement</span>
          </label>
          <hr className="my-6 border-gray-300" />
          <p className="text-sm text-gray-700 mb-4 font-semibold">Authorship</p>
          <div className="flex items-center mb-4">
            <input type="radio" id="author" name="authorship" value="author" checked={authorship === 'author'} onChange={() => setAuthorship('author')} className="form-radio h-5 w-5 text-blue-500" />
            <label htmlFor="author" className="ml-2 text-sm text-gray-800 font-semibold">I am submitting as an author of this article</label>
          </div>
          <div className="flex items-center">
            <input type="radio" id="third-party" name="authorship" value="third-party" checked={authorship === 'third-party'} onChange={() => setAuthorship('third-party')} className="form-radio h-5 w-5 text-blue-500" />
            <label htmlFor="third-party" className="ml-2 text-sm text-gray-800 font-semibold">I am not an author but have obtained pre-authorization to submit as a third-party submitter</label>
          </div>
        </div>
        <div className="modal-footer bg-gray-200 py-4 px-6">
          <button className="btn btn-primary" onClick={handleAgree}>Continue</button>
          <button className="btn btn-secondary ml-2" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionAgreementModal;
