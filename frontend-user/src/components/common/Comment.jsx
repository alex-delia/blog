import PropTypes from 'prop-types';
import { DateTime } from "luxon";
import convertUTCToUserTimeZone from '../../helpers/convertUTCtoLocal';
import he from 'he';

const Comment = ({ comment, highlightClass }) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return (
        <div className='border-b border-b-slate-400'>
            <div className={`${highlightClass} rounded-3xl p-4 transition-colors duration-1000 ease-in-out`}>
                <div className="flex items-center">
                    <p className="inline-flex items-center mr-3 text-sm font-semibold">
                        {he.decode(comment.user.fullname)}
                    </p>
                    <p className="text-sm text-gray-600">
                        {convertUTCToUserTimeZone(DateTime.fromISO(comment.timestamp), userTimeZone).toLocaleString(DateTime.DATE_MED)}
                    </p>
                </div>
                <p className="text-gray-800">
                    {comment.text}
                </p>
            </div>
        </div>
    );
};

Comment.propTypes = {
    comment: PropTypes.object,
    highlightClass: PropTypes.string,
};

export default Comment;