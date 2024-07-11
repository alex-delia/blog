import PropTypes from 'prop-types';

const Button = ({ text, onclick, bgColor = 'bg-indigo-600', hoverColor = 'hover:bg-indigo-500' }) => {
    return (
        <button onClick={onclick} className={`text-lg ${bgColor} py-2 px-4 text-white rounded-2xl ${hoverColor}`}>
            {text}
        </button>
    );
};

Button.propTypes = {
    text: PropTypes.string.isRequired,
    bgColor: PropTypes.string,
    hoverColor: PropTypes.string,
    onclick: PropTypes.func,
};

export default Button;