
interface PaginationButtonProps {
    children: React.ReactNode
    onClick: () => void
    disabled?: boolean
}

const PaginationButton = ({ children, onClick, disabled }: PaginationButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className='px-4 py-2 mx-1 bg-black text-white rounded enabled:hover:bg-black duration-150 disabled:opacity-50'
        >
            {children}
        </button>
    )
}

export default PaginationButton