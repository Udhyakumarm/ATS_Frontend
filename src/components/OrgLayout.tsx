import Head from "next/head";
import OrgSideBar from "./organization/SideBar";
import OrgTopBar from "./organization/TopBar";

export default function OrgLayout({children, pageTitle, pageDesc}:any) {
    return (
        <>
            <Head>
				<title>{pageTitle}</title>
				<meta name="description" content={pageDesc} />
			</Head>
			<main>
				<OrgSideBar />
				<OrgTopBar />
				<div id="overlay" className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"></div>
				<div className="layoutWrap p-4 lg:p-8">
                    {children}
                </div>
            </main>
        </>
    )
}