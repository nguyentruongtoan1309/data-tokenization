import React, { useState } from 'react';

function FileUpload() {
	const [files, setFiles] = useState([]);

	const handleFileChange = (event: any) => {
		setFiles(event.target.files);
	};

	const uploadFiles = async () => {
		for (const file of files) {
			const presignedUrl = await getPresignedUrl(((file as any).name as string) || crypto.randomUUID());
			await uploadFileToS3(presignedUrl, file);
		}
		alert('All files uploaded successfully!');
	};

	const getPresignedUrl = async (fileName: string) => {
		const response = await fetch('http://localhost:3000/generate-presigned-url', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ fileName }),
		});

		const data = await response.json();
		return data.url;
	};

	const uploadFileToS3 = async (url: string, file: string) => {
		await fetch(url, {
			method: 'PUT',
			body: file,
		});
	};

	return (
		<div>
			<input type="file" multiple onChange={handleFileChange} />
			<button onClick={uploadFiles}>Upload</button>
		</div>
	);
}

export default FileUpload;
