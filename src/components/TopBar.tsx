interface TopBarProps {
    children?: React.ReactNode;
}

export default function TopBar({children}:TopBarProps) {
    return <div className="h-16 md:h-12 w-full bg-blue-mid dark:dark-card-bg topbar flex items-center">
        {children}
    </div>
}