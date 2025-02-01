import { nanoid } from '@reduxjs/toolkit';
import { ImageUp } from 'lucide-react';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function DropZone({ setMedias }: { setMedias: MediaState['setMedias']}) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setMedias((prev) => {
            const files = acceptedFiles.map(file => ({
                file,
                fileId: nanoid()
            }))

            if (prev) {
                return [...prev, ...files];
            }
            return files;
        });
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, 
        accept: {
            "image/*": [],
            'video/*': [],
        }
    });

    return (
        <div className="p-5" {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the files here ...</p>
            ) : (
                <>
                    <div className="flex-center flex-col">
                        <ImageUp size={60} strokeWidth={1} />
                        <p className="text-center text-[18px]">Drag photos and videos here or click to select files</p>
                    </div>
                </>
            )}
        </div>
    );
}

export default DropZone;
