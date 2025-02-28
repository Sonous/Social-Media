import React from 'react';
import { useNavigate } from 'react-router';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className='flex-center flex-col h-svh gap-5'>
            <h1 className='text-xl font-semibold'>Sorry, this page isn't available.</h1>
            <p>
                The link you followed may be broken, or the page may have been removed.{' '}
                <span className="text-blue-500 cursor-pointer hover:text-blue-700" onClick={() => navigate('/')}>
                    Go back to Sonous.
                </span>
            </p>
        </div>
    );
};

export default NotFound;
