import PropTypes from 'prop-types';

const Button = ({ text, onClick, bgColor = 'bg-indigo-600', hoverColor = 'hover:bg-indigo-500' }) => {
    return (
        <button onClick={onClick} className={`text-lg ${bgColor} py-2 px-4 text-white rounded-2xl hover:${hoverColor}`}>
            {text}
        </button>
    );
};

Button.propTypes = {
    text: PropTypes.string.isRequired,
    bgColor: PropTypes.string,
    hoverColor: PropTypes.string,
    onClick: PropTypes.func,
};

export default Button;