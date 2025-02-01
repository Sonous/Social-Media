import React from 'react'

const Video = ({ src, className }: React.HTMLProps<HTMLVideoElement>) => {
  return (
    <div>
        <video src={src} controls autoPlay loop disablePictureInPicture className={className} ></video>
    </div>
  )
}

export default Video