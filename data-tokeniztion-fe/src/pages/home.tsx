import { getDataByRole } from '@/apis/amplify';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/upload/FileUpload';
import { currentSession } from '@/lib/utils';
import { useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { signOut } from 'aws-amplify/auth';
import { useState } from 'react';
import config from '../../../src/amplifyconfiguration.json';
import awsmobile from '../../../src/aws-exports';

Amplify.configure(config, {
	API: {
		REST: {
			headers: async () => {
				return {
					Authorization: (await currentSession())?.idToken?.toString(),
				} as never;
			},
		},
	},
});
Amplify.configure(awsmobile);

const HomePage = () => {
	const { user } = useAuthenticator((context) => [context.user]);
	const [tableData, setTableData] = useState([]);

	const handleSignOut = async () => {
		await signOut();
	};

	const handleGetDataByRole = async () => {
		try {
			const data = await getDataByRole();
			if (data?.data?.body) {
				setTableData(data?.data?.body);
			}
		} catch (error) {
			console.error('Error fetching data by role:', error);
		}
	};

	// Utility function to truncate strings
	const truncate = (str: string, n: number) => {
		return str.length > n ? str.substring(0, 10) + '...' : str;
	};

	return (
		<div className="text-center p-5">
			<h1 className="mb-5 text-2xl">Home Page</h1>
			<h2 className="mb-5">Welcome {user?.username}</h2>
			<div className="mb-5">
				<Button className="mx-1" onClick={handleSignOut}>
					Log out
				</Button>
				<Button className="mx-1" onClick={handleGetDataByRole}>
					Get data
				</Button>
			</div>
			<FileUpload />
			{tableData.length > 0 && (
				<table className="table-auto mt-5 mx-auto">
					<thead>
						<tr>
							{Object.keys(tableData[0]).map((key) => (
								<th key={key} className="px-4 py-2">
									{key}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{tableData.map((row, rowIndex) => (
							<tr key={rowIndex}>
								{Object.values(row).map((value, colIndex) => (
									<td key={colIndex} className="border px-4 py-2">
										{typeof value === 'string' ? truncate(value, 50) : value}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default HomePage;
