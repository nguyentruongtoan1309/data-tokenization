import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Utility function to truncate strings
const truncate = (str: string, n: number) => {
	return str.length > n ? str.substring(0, 10) + '...' : str;
};

const TableData: React.FC<{ tableData: Array<any> }> = ({ tableData }) => {
	return (
		tableData?.length > 0 ? (
			<Table className='my-5 mx-auto bg-[var(--bg-table)]'>
				<TableHeader>
					<TableRow>
						{Object.keys(tableData[0]).map((key) => (
							<TableHead key={key} className="px-4 py-2">
								{key}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{tableData.map((row, rowIndex) => (
						<TableRow key={rowIndex}>
							{Object.values(row).map((value, colIndex) => (
								<TableCell key={colIndex} className="border px-4 py-2">
									{typeof value === 'string' ? truncate(value, 50) : `${value}`}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		) : <div className='text-center text-white my-10'>No data available</div>
	);
};

export default TableData;
