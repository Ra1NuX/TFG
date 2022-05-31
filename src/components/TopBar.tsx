interface TopBarProps {
    children?: React.ReactChild[]
}

export default function TopBar({children}:TopBarProps) {
    return <div className="h-10 w-full bg-blue-mid dark:dark-card-bg topbar flex items-center justify-end">
        {children}
    </div>
}