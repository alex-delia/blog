import PropTypes from 'prop-types';

const ConfirmDeleteModal = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 z-10 bg-opacity-80 bg-gray-800 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
                <p className="mb-4">Do you really want to delete this post? </p>
                <p className='mb-4'>All comments associated with this post will also be deleted.</p>
                <p className='mb-4'>This process cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={onConfirm}
                    >
                        Yes, Delete
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

ConfirmDeleteModal.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default ConfirmDeleteModal;