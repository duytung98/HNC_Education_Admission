import PropTypes from 'prop-types';
import './GlobalStyle.scss';

//GlobalStyle component chứa các style global cho app
function GlobalStyle({ children }) {
    return (
        children
    );
}

GlobalStyle.propTypes = {
    children: PropTypes.element
}

export default GlobalStyle;