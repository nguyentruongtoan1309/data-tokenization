import { memo } from 'react';
import ReactPaginate from 'react-paginate';
import './styles.scss';

const Pagination = ({ page, onChangePage, pageCount, pageRange = 5 }) => {
    return (
		<ReactPaginate
			className='pagination'
			breakLabel='...'
            forcePage={page - 1}
			// nextLabel='next >'
			onPageChange={onChangePage}
			pageRangeDisplayed={pageRange}
			pageCount={pageCount}
			// previousLabel='< previous'
			renderOnZeroPageCount={null}
		/>
	);
};

export default memo(Pagination);
