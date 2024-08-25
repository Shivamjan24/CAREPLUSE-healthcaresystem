import { convertFileToUrl } from '@/lib/utils';
import Image from 'next/image';
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

type fileup = {
    files: File[] | undefined,
    onChange: (files: File[]) => void;
};

const FileUploader = ({ files, onChange }: fileup) => {
    const onDrop = useCallback((files: File[]) => {
        onChange(files);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="p-4 border border-dotted border-white cursor-pointer flex flex-col items-center justify-center">
                {files && files?.length > 0 ? (
                    <Image
                        src={convertFileToUrl(files[0])}
                        width={1000}
                        height={1000}
                        alt="uploaded image"
                        className="max-h-[400px] overflow-hidden object-cover"
                    />) :
                    (
                        <>
                            {isDragActive ?
                                <p>Drop the files here ...</p> :
                                <p>Drag 'n' drop some files here, or click to select files</p>
                            }
                            <Image
                                src="/assets/icons/upload.svg"
                                width={40}
                                height={40}
                                alt="upload"
                            />
                        </>)}
            </div>
        </div>
    )
}

export default FileUploader

