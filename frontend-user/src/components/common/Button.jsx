import PropTypes from 'prop-types';

const Button = ({ text, bgColor = 'bg-sky-500', hoverColor = 'hover:bg-sky-400' }) => {
    return (
        <button className={`text-lg ${bgColor} py-2 px-4 text-white rounded-2xl ${hoverColor}`}>
            {text}
        </button>
    );
};

Button.propTypes = {
    text: PropTypes.string.isRequired,
    bgColor: PropTypes.string,
    hoverColor: PropTypes.string
};

export default Button;