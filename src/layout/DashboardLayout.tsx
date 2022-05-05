
export default function DashboardLayout({children}:{children:any}) {
    
    if(!Array.isArray(children) || children.length !== 2 ) throw new Error('Dashboard should have 2 children'); 
    
    return <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2">
            {children[0]}
        </div>
        <div className="w-full md:w-1/2">
            {children[1]}
        </div>
    </div>
}