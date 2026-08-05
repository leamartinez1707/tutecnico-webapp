const ErrorMessage = ({ children }: { children: React.ReactNode }) => {
    return (
        <div
            className="text-red-500 font-medium text-sm"
        >{children}</div>
    )
}

export default ErrorMessage