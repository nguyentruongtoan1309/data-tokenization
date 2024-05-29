import { getDataByRole } from '@/apis/amplify';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/upload/FileUpload';
import { useAppContext } from '@/contexts/AppContext';
import '@aws-amplify/ui-react/styles.css';
import { signOut } from 'aws-amplify/auth';
import { useState } from 'react';
import TableData from './TableData';
import { LoadingSpinner } from '@/components/ui/spinner';

const HomePage = () => {
	const { user } = useAppContext();
	const [tableData, setTableData] = useState([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSignOut = async () => {
		await signOut();
	};

	const handleGetDataByRole = async () => {
		try {
			setIsLoading(true);
			const data = await getDataByRole();
			if (data?.data) {
				setTableData(data?.data);
				setIsLoading(false);
			}
		} catch (error) {
			console.error('Error fetching data by role:', error);
			setIsLoading(false);
		}
	};

	return (
		<div className="text-center p-5">
			<h1 className="mb-5 text-2xl">Home Page</h1>
			<h2 className="mb-5">Welcome {user?.username}</h2>
			<div className="mb-5">
				<Button className="mx-1" onClick={handleSignOut}>
					Log out
				</Button>
				<Button className="mx-1" onClick={handleGetDataByRole} disabled={isLoading}>
					Get data
				</Button>
			</div>
			<FileUpload />
			{isLoading ? (
				<div className="flex justify-center py-5">
					<LoadingSpinner />
				</div>
			) : null}
			<TableData tableData={tableData} />
		</div>
	);
};

export default HomePage;
