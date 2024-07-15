import convertUTCToUserTimeZone from '../../helpers/convertUTCtoLocal';
import { DateTime } from "luxon";
import he from 'he';
import DOMPurify from 'dompurify';

/* eslint-disable react/prop-types */
const PostPreview = ({ post }) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Decode the HTML entities
    const decodedTitle = he.decode(post.title);
    const decodedText = he.decode(post.text);

    // Sanitize the decoded HTML
    const sanitizedTitle = DOMPurify.sanitize(decodedTitle);
    const sanitizedText = DOMPurify.sanitize(decodedText);

    post.title = sanitizedTitle;
    post.text = sanitizedText;

    return (
        <div className='shadow-md rounded-md p-4 h-full hover:bg-slate-200 '>
            <h3 className='text-lg font-bold'>{post.title}&nbsp;</h3>
            <h4 className='text-sm text-zinc-400'>{he.decode(post.author.fullname)}</h4>
            <p className='text-xs italic mb-1'>
                {post.updatedAt === post.createdAt ?
                    convertUTCToUserTimeZone(DateTime.fromISO(post.createdAt), userTimeZone).toLocaleString(DateTime.DATE_FULL) :
                    'Updated: ' + convertUTCToUserTimeZone(DateTime.fromISO(post.updatedAt), userTimeZone).toLocaleString(DateTime.DATE_FULL)}
            </p>
            <div className='text-sm text-gray-500' dangerouslySetInnerHTML={{ __html: post.text.substring(0, 150) }}></div>
        </div>
    );
};

export default PostPreview;