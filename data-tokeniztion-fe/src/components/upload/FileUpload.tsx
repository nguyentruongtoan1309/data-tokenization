import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { uploadData } from 'aws-amplify/storage';
import { toast } from 'react-toastify';

// interface IFile {
//     url: string,
//     name: string,
// }

// interface File {
//     name: string;
//     size: number;
//     type: string;
//     extension: string;
//     content: ArrayBuffer;
// }

function FileUpload() {
    const [files, setFiles] = useState<any>([]);

    const handleFileChange = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files.length) {
            // const newFiles: IFile[] = Array.from(target.files).map((file) => ({
            //     url: URL.createObjectURL(file),
            //     name: file.name,
            // }));
            setFiles(target.files as any);
        }
    };

    const uploadFiles = async () => {
        if (!files.length) {
            toast.error("Please choose file !", {
                position: 'top-right'
            });
            return;
        }

        const fileName = files[0].name;

        try {
            const result = await uploadData({
                path: `rawDara/${fileName}`,
                data: files[0] as any,
                options: {
                    onProgress: ({ transferredBytes, totalBytes }) => {
                        if (totalBytes) {
                            console.log(
                                `Upload progress ${Math.round((transferredBytes / totalBytes) * 100)
                                } %`
                            );
                        }
                    }
                }
            }).result;
            console.log('Succeeded: ', result);
        } catch (error) {
            toast.error((error as Error)?.message, {
                position: 'top-right'
            });
        }
    };

    return (
        <div className="grid text-center w-full justify-center items-center gap-1.5">
            <Input id="file" type="file" onChange={handleFileChange} />
            <Button onClick={uploadFiles}>Upload</Button>
        </div>
    );
}

export default FileUpload;