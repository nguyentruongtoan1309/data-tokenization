import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { uploadData } from 'aws-amplify/storage';
import { toast } from 'react-toastify';
import { currentSession } from '@/lib/utils';

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
	const [isValidFile, setIsValidFile] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		const fetchUserGroups = async () => {
			const accessToken = (await currentSession())?.accessToken;
			if ((accessToken?.payload['cognito:groups'] || [])?.includes('Admins')) {
				setIsAdmin(true);
			}
		};

		fetchUserGroups();
	}, []);

	const handleFileChange = (e: React.ChangeEvent) => {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length) {
			const file = target.files[0];
			const fileType = file.type;

			// Check if the file is a CSV
			if (fileType !== 'text/csv') {
				toast.error('Please upload a CSV file!', {
					position: 'top-right',
				});
				setIsValidFile(false);
				return;
			}

			setFiles([file]);
			setIsValidFile(true);
		} else {
			setIsValidFile(false);
		}
	};

	const uploadFiles = async () => {
		if (!files.length) {
			toast.error('Please choose a file!', {
				position: 'top-right',
			});
			return;
		}

		const file = files[0];
		const fileName = file.name;

		try {
			const result = await uploadData({
				path: `rawData/${fileName}`,
				data: file,
				options: {
					contentType: 'text/csv', // Add metadata for content type
					onProgress: ({ transferredBytes, totalBytes }) => {
						if (totalBytes) {
							console.log(`Upload progress ${Math.round((transferredBytes / totalBytes) * 100)}%`);
						}
					},
				},
			}).result;
			// console.log('Succeeded: ', result);
			alert('Upload successfully');
		} catch (error) {
			toast.error((error as Error)?.message, {
				position: 'top-right',
			});
		}
	};

	if (isAdmin) {
		return (
			<div className="grid text-center w-full justify-center items-center gap-1.5">
				<Input id="file" type={'file'} accept={'.csv'} onChange={handleFileChange} className="text-white" />
				<Button className="text-white" onClick={uploadFiles} disabled={!isValidFile}>
					Upload
				</Button>
			</div>
		);
	}

	return <div></div>;
}

export default FileUpload;
