import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    setCurrentPage: (page: number) => void;
}

const PaginationUi = ({ currentPage, totalPages, onPageChange, setCurrentPage }: PaginationProps) => {

    const handleChange = (_: unknown, value: number) => {
        setCurrentPage(value);
        onPageChange(value);
    };
    if (totalPages === 0) return null;
    return (
        <Stack spacing={2} alignItems='center' padding={{ xs: 1, sm: 2 }}>
            <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handleChange}
            variant="outlined"
            shape="rounded"
            size="medium"
            siblingCount={0}
            boundaryCount={1}
            sx={{
                '& .MuiPaginationItem-root': {
                color: '#d4d4d8', // zinc-300
                backgroundColor: '#18181b', // zinc-900
                borderColor: '#3f3f46', // zinc-700
                fontSize: { xs: '0.875rem', sm: '1rem' },
                minWidth: { xs: '32px', sm: '40px' },
                height: { xs: '32px', sm: '40px' },
                '&:hover': {
                    backgroundColor: '#27272a', // zinc-800
                    borderColor: '#52525b', // zinc-600
                },
                '&.Mui-selected': {
                    backgroundColor: '#2563eb', // blue-600
                    color: '#ffffff',
                    borderColor: '#2563eb',
                    '&:hover': {
                    backgroundColor: '#1d4ed8', // blue-700
                    borderColor: '#1d4ed8',
                    },
                },
                },
            }}
            />
        </Stack>
    );
};

export default PaginationUi;