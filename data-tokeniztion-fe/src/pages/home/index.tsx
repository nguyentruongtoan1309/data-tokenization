import { getDataByRole } from '@/apis/amplify';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/upload/FileUpload';
import { useAppContext } from '@/contexts/AppContext';
import { signOut } from 'aws-amplify/auth';
import { useCallback, useEffect, useMemo, useState } from 'react';
import TableData from './TableData';
import { LoadingSpinner } from '@/components/ui/spinner';
import Pagination from '@/components/pagination';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/main';
import '@aws-amplify/ui-react/styles.css';

const ITEMS_PER_PAGE = 20;

const HomePage = () => {
	const { user } = useAppContext();

	const [page, setPage] = useState<number>(1);
	const [total, setTotal] = useState<number>(0);
	const { isLoading, isFetching, data, refetch } = useQuery({
		staleTime: 60 * 1000,
		queryKey: ['getDataByRole', page],
		queryFn: () => getDataByRole(page),
		retry: false,
		refetchOnWindowFocus: false,
		// keepPreviousData: true,
		// enabled: false,
	});

	useEffect(() => {
		if (data) {
			setTotal((data as any)?.pagination?.totalRecords);
		}
	}, [data]);

	const handleSignOut = async () => {
		await signOut();
	};

	const handleGetDataByRole = async () => {
		await queryClient.invalidateQueries();
	};

	const renderPageRange = useMemo(() => {
		const startIndex = (page - 1) * ITEMS_PER_PAGE + 1;
		const endIndex = Math.min(page * ITEMS_PER_PAGE, total);

		return <div className="text-white">{`Showing ${startIndex} to ${endIndex} of ${total}`}</div>;
	}, [page, total]);

	const pageCount = useMemo(() => {
		if (!total) return 0;
		return Math.ceil(total / ITEMS_PER_PAGE);
	}, [total]);

	const handlePageClick = useCallback((e: { selected: number }) => {
		setPage(e.selected + 1); // start from 0
	}, []);

	return (
		<div className="text-center container mx-auto p-10">
			<h1
				className="mb-10 text-lg lg:text-2xl 2xl:text-[30px] text-white"
				style={{
					textShadow: 'rgb(0, 183, 79) 2px 0px 0px',
				}}
			>
				CHALLENGE 6: DESIGN AND DEVELOP A DATA TOKENIZATION SYSTEM
			</h1>

			<h2 className="mb-5 text-white">Welcome {user?.username}</h2>
			<div className="mb-5">
				<Button className="mx-1 text-white" onClick={handleSignOut}>
					Log out
				</Button>
				<Button className="mx-1 text-white" onClick={handleGetDataByRole} disabled={isLoading}>
					Refetch data
				</Button>
			</div>

			<FileUpload />

			{isFetching ? (
				<div className="flex justify-center py-5">
					<LoadingSpinner className="text-white" size={40} />
				</div>
			) : null}
			{
				!isLoading && (
					data ? <TableData tableData={(data as any)?.data} /> : null
				)
			}
			{total > ITEMS_PER_PAGE ? (
				<>
					<div className="flex items-center justify-end my-10">
						{renderPageRange}
						<Pagination page={page} onChangePage={handlePageClick} pageCount={pageCount} />
					</div>
				</>
			) : null}
		</div>
	);
};

export default HomePage;
