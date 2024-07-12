import convertUTCToUserTimeZone from '../../helpers/convertUTCtoLocal';
import { DateTime } from "luxon";
import he from 'he';

/* eslint-disable react/prop-types */
const PostPreview = ({ post }) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return (
        <div className='shadow-md rounded-md p-4 h-full hover:bg-slate-200 '>
            <h3 className='text-lg font-bold'>{post.title}&nbsp;</h3>
            <h4 className='text-sm text-zinc-400'>{he.decode(post.author.fullname)}</h4>
            <p className='text-xs italic mb-1'>
                {post.updatedAt === post.createdAt ?
                    convertUTCToUserTimeZone(DateTime.fromISO(post.createdAt), userTimeZone).toLocaleString(DateTime.DATE_FULL) :
                    'Updated: ' + convertUTCToUserTimeZone(DateTime.fromISO(post.updatedAt), userTimeZone).toLocaleString(DateTime.DATE_FULL)}
            </p>
            <p className='text-sm text-gray-500'>{post.text.substring(0, 150)}...</p>
        </div>
    );
};

export default PostPreview;