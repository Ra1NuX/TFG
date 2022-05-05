interface TopBarProps {
    children?: React.ReactElement
}

export default function TopBar({children}:TopBarProps) {
    return <div className="h-12 w-full bg-blue-600 dark:dark-card-bg topbar flex items-center justify-end">
        {children}
    </div>
}