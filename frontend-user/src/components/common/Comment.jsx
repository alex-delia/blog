import PropTypes from 'prop-types';
import { DateTime } from "luxon";
import convertUTCToUserTimeZone from '../../helpers/convertUTCtoLocal';
import he from 'he';

const Comment = ({ comment }) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return (
        <div className='mb-3'>
            <div className="flex items-center">
                <p className="inline-flex items-center mr-3 text-sm font-semibold">
                    {he.decode(comment.user.fullname)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {convertUTCToUserTimeZone(DateTime.fromISO(comment.timestamp), userTimeZone).toLocaleString(DateTime.DATE_MED)}
                </p>
            </div>
            <p className="text-gray-800 dark:text-gray-400">
                {comment.text}
            </p>
        </div>
    );
};

Comment.propTypes = {
    comment: PropTypes.object,
};

export default Comment;