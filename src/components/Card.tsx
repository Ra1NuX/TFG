interface CardProps extends React.ComponentPropsWithoutRef<"div"> {}

export default function Card({children, ...props}:CardProps) {
    return <div className="white dark:dark m-2 rounded shadow-lg p-6" {...props}>
        {children}
    </div>
}