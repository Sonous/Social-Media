import React from 'react';

const Video = ({ src, className }: React.HTMLProps<HTMLVideoElement>) => {
    return <video src={src} controls  loop disablePictureInPicture className={className}></video>;
};

export default Video;
