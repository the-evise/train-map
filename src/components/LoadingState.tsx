type LoadingStateProps = {
    message?: string
}

const LoadingState = ({ message = 'Loading stations...' }: LoadingStateProps) => {
    return (
        <div className="flex items-center gap-3 text-slate-300">
            <span className="h-2 w-2 animate-ping rounded-full bg-cyan-300" />
            <span className="text-sm">{message}</span>
        </div>
    )
}

export default LoadingState
