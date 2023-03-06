import Logo from "../logo"

export default function orgsidebar() {
    return (
        <>
            <div className="bg-white dark:bg-gray-800 shadow w-[270px] h-full overflow-y-auto fixed z-[10] left-0 top-0">
                <div className="h-[65px] p-3">
                    <Logo width="188" />
                </div>
                <div className="p-3">
List
                </div>
            </div>
        </>
    )
}