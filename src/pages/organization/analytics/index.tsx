import OrgSideBar from "@/components/organization/SideBar";
import OrgTopBar from "@/components/organization/TopBar";
import Head from "next/head";
import Image from "next/image";
import { Tab } from "@headlessui/react";
import { Fragment, useState } from "react";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import postedJobsIcon from '/public/images/icons/post-new-job.png'
import bulbIcon from '/public/images/icons/bulb.png'
import folderIcon from '/public/images/icons/folder.png'
import sourcedIcon from '/public/images/icons/sourced.png'
import calendarIcon from '/public/images/icons/calendar.png'
import thumbsUpIcon from '/public/images/icons/thumbs-up.png'
import thumbsDownIcon from '/public/images/icons/thumbs-down.png'
import FormField from "@/components/FormField";
import bambooHrIcon from '/public/images/social/bambooHr-icon.png'
import linkedInIcon from '/public/images/social/linkedin-icon.png'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function Analytics() {
    const [sklLoad] = useState(true);
    const tabHeading_1 = [
        {
            title: 'Overview'
        },
        {
            title: 'Performance'
        }
    ]
    const quicklinks = [
		{
			name: (<>Jobs <br/> Posted</>),
			icon: postedJobsIcon,
            count: ''
		},
        {
			name: (<>Active <br/> Jobs</>),
			icon: bulbIcon,
            count: '50'
		},
        {
			name: (<>Archive <br/> Jobs</>),
			icon: folderIcon,
            count: '50'
		},
        {
			name: (<>Sourced <br/> Applicants</>),
			icon: sourcedIcon,
            count: '50'
		},
        {
			name: (<>Interview <br/> Scheduled</>),
			icon: calendarIcon,
            count: '50'
		},
        {
			name: (<>Average time <br/> to hire</>),
			icon: thumbsUpIcon,
            count: '50'
		},
        {
			name: (<>Average time <br/> to reject</>),
			icon: thumbsDownIcon,
            count: '50'
		},
    ]
    const options = {
		chart: {
		  type: 'spline'
		},
		title: {
		  text: ''
		},
		series: [
		  {
			data: [1, 2, 1, 4, 3, 6]
		  }
		]
	};
    const sourceOptions = {
		chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45
            }
        },
        title: {
            text: '',
        },
        subtitle: {
            text: '',
        },
        plotOptions: {
            pie: {
                innerSize: 100,
                depth: 45
            }
        },
        series: [{
            name: 'Medals',
            data: [
                ['Norway', 16],
                ['Germany', 12],
                ['USA', 8],
                ['Sweden', 8],
                ['Netherlands', 8],
                ['ROC', 6],
                ['Austria', 7],
                ['Canada', 4],
                ['Japan', 3]
    
            ]
        }]
	};
    const interviewOptions = {
		chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        accessibility: {
            announceNewData: {
                enabled: true
            }
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: 'Total percent market share'
            }
    
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.1f}%'
                }
            }
        },
    
        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
        },
    
        series: [
            {
                name: 'Browsers',
                colorByPoint: true,
                data: [
                    {
                        name: 'Chrome',
                        y: 63.06,
                        drilldown: 'Chrome'
                    },
                    {
                        name: 'Safari',
                        y: 19.84,
                        drilldown: 'Safari'
                    },
                    {
                        name: 'Firefox',
                        y: 4.18,
                        drilldown: 'Firefox'
                    },
                    {
                        name: 'Edge',
                        y: 4.12,
                        drilldown: 'Edge'
                    },
                    {
                        name: 'Opera',
                        y: 2.33,
                        drilldown: 'Opera'
                    },
                    {
                        name: 'Internet Explorer',
                        y: 0.45,
                        drilldown: 'Internet Explorer'
                    },
                    {
                        name: 'Other',
                        y: 1.582,
                        drilldown: null
                    }
                ]
            }
        ],
        drilldown: {
            breadcrumbs: {
                position: {
                    align: 'right'
                }
            },
            series: [
                {
                    name: 'Chrome',
                    id: 'Chrome',
                    data: [
                        [
                            'v65.0',
                            0.1
                        ],
                        [
                            'v64.0',
                            1.3
                        ],
                        [
                            'v63.0',
                            53.02
                        ],
                        [
                            'v62.0',
                            1.4
                        ],
                        [
                            'v61.0',
                            0.88
                        ],
                        [
                            'v60.0',
                            0.56
                        ],
                        [
                            'v59.0',
                            0.45
                        ],
                        [
                            'v58.0',
                            0.49
                        ],
                        [
                            'v57.0',
                            0.32
                        ],
                        [
                            'v56.0',
                            0.29
                        ],
                        [
                            'v55.0',
                            0.79
                        ],
                        [
                            'v54.0',
                            0.18
                        ],
                        [
                            'v51.0',
                            0.13
                        ],
                        [
                            'v49.0',
                            2.16
                        ],
                        [
                            'v48.0',
                            0.13
                        ],
                        [
                            'v47.0',
                            0.11
                        ],
                        [
                            'v43.0',
                            0.17
                        ],
                        [
                            'v29.0',
                            0.26
                        ]
                    ]
                },
                {
                    name: 'Firefox',
                    id: 'Firefox',
                    data: [
                        [
                            'v58.0',
                            1.02
                        ],
                        [
                            'v57.0',
                            7.36
                        ],
                        [
                            'v56.0',
                            0.35
                        ],
                        [
                            'v55.0',
                            0.11
                        ],
                        [
                            'v54.0',
                            0.1
                        ],
                        [
                            'v52.0',
                            0.95
                        ],
                        [
                            'v51.0',
                            0.15
                        ],
                        [
                            'v50.0',
                            0.1
                        ],
                        [
                            'v48.0',
                            0.31
                        ],
                        [
                            'v47.0',
                            0.12
                        ]
                    ]
                },
                {
                    name: 'Internet Explorer',
                    id: 'Internet Explorer',
                    data: [
                        [
                            'v11.0',
                            6.2
                        ],
                        [
                            'v10.0',
                            0.29
                        ],
                        [
                            'v9.0',
                            0.27
                        ],
                        [
                            'v8.0',
                            0.47
                        ]
                    ]
                },
                {
                    name: 'Safari',
                    id: 'Safari',
                    data: [
                        [
                            'v11.0',
                            3.39
                        ],
                        [
                            'v10.1',
                            0.96
                        ],
                        [
                            'v10.0',
                            0.36
                        ],
                        [
                            'v9.1',
                            0.54
                        ],
                        [
                            'v9.0',
                            0.13
                        ],
                        [
                            'v5.1',
                            0.2
                        ]
                    ]
                },
                {
                    name: 'Edge',
                    id: 'Edge',
                    data: [
                        [
                            'v16',
                            2.6
                        ],
                        [
                            'v15',
                            0.92
                        ],
                        [
                            'v14',
                            0.4
                        ],
                        [
                            'v13',
                            0.1
                        ]
                    ]
                },
                {
                    name: 'Opera',
                    id: 'Opera',
                    data: [
                        [
                            'v50.0',
                            0.96
                        ],
                        [
                            'v49.0',
                            0.82
                        ],
                        [
                            'v12.1',
                            0.14
                        ]
                    ]
                }
            ]
        }
	};
    return(
        <>
            <Head>
				<title>Analytics</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<main>
				<OrgSideBar />
				<OrgTopBar />
				<div id="overlay" className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"></div>
				<div className="layoutWrap p-4 lg:p-8">
                    <div className="rounded-normal bg-white shadow-normal dark:bg-gray-800">
                        <Tab.Group>
                            <div className={"border-b px-4 pt-3"}>
                                <Tab.List className={"w-full max-w-[1100px] mx-auto"}>
                                    {tabHeading_1.map((item, i)=> 
                                    <Tab key={i} as={Fragment}>
                                        {({ selected }) => (
                                            <button
                                                className={
                                                    "border-b-4 py-3 mr-16 font-semibold focus:outline-none" +
                                                    " " +
                                                    (selected ? "border-primary text-primary" : "border-transparent text-darkGray dark:text-gray-400")
                                                }
                                            >
                                                {item.title}
                                            </button>
                                        )}
                                    </Tab>
                                    )}
                                </Tab.List>
                            </div>
                            <Tab.Panels className={"w-full max-w-[1100px] mx-auto px-4 py-8"}>
                                <Tab.Panel>
                                    <div className="border dark:border-gray-400 rounded-normal p-10 pb-4 mb-6">
                                        <div className="flex flex-wrap -mx-3">
                                            {quicklinks.map((item, i) => (
                                            <div className="w-full md:max-w-[33.3333%] lg:max-w-[25%] px-3 mb-6" key={i}>
                                                <div className="h-full border dark:border-gray-400 shadow-normal rounded-normal p-6 flex items-start">
                                                    <div className="mr-4 flex h-[45px] w-[45px] items-center justify-center rounded bg-[#B2E3FF] p-3">
                                                        <Image src={item.icon} alt={'Icon'} width={30} height={30} />
                                                    </div>
                                                    <aside>
                                                        <span className="font-semibold text-darkGray dark:text-gray-400 mb-4 block">{item.name}</span>
                                                        <h4 className="font-bold text-3xl">{item.count || <Skeleton height={25} />}</h4>
                                                    </aside>
                                                </div>
                                            </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap -mx-3">
                                        <div className="w-full md:max-w-[50%] px-3 mb-6">
                                            <div className="h-full border dark:border-gray-400 rounded-normal shadow-normal">
                                                <div className="border-b dark:border-gray-400 p-4 flex items-center">
                                                    <h2 className="font-bold grow">Applicant Pipeline</h2>
                                                    <div className="w-[180px]">
                                                        <FormField fieldType="select" placeholder="All Applicants" />
                                                    </div>
                                                </div>
                                                <div className="p-8">
                                                    Funnel Graph
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full md:max-w-[50%] px-3 mb-6">
                                            <div className="h-full border dark:border-gray-400 rounded-normal shadow-normal">
                                                <div className="border-b dark:border-gray-400 p-4 flex items-center">
                                                    <h2 className="font-bold grow">Hiring Analytics</h2>
                                                    <div className="w-[180px]">
                                                        <FormField fieldType="select" placeholder="All Time" />
                                                    </div>
                                                </div>
                                                <div className="p-8">
                                                    <HighchartsReact highcharts={Highcharts} options={options} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full md:max-w-[50%] px-3 mb-6">
                                            <div className="h-full border dark:border-gray-400 rounded-normal shadow-normal">
                                                <div className="border-b dark:border-gray-400 p-4 flex items-center">
                                                    <h2 className="font-bold grow">Average Source of Candidate</h2>
                                                </div>
                                                <div className="p-8">
                                                    <HighchartsReact highcharts={Highcharts} options={sourceOptions} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full md:max-w-[50%] px-3 mb-6">
                                            <div className="h-full border dark:border-gray-400 rounded-normal shadow-normal">
                                                <div className="border-b dark:border-gray-400 p-4 flex items-center">
                                                    <h2 className="font-bold grow">Average Interviews Schedule</h2>
                                                    <div className="w-[180px]">
                                                        <FormField fieldType="select" placeholder="All Time" />
                                                    </div>
                                                </div>
                                                <div className="p-8">
                                                    <HighchartsReact highcharts={Highcharts} options={interviewOptions} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <div className="border dark:border-gray-400 rounded-normal mb-6">
                                        <div className="border-b dark:border-gray-400 p-4 flex items-center">
                                            <h2 className="font-bold grow">Vendors Performance</h2>
                                        </div>
                                        <div className="p-8">
                                            <div className="overflow-auto max-h-[405px]">
                                                <table cellPadding={"0"} cellSpacing={"0"} className="w-full">
                                                    <thead>
                                                        <tr>
                                                            <th className="border-b py-2 px-3 text-left">
                                                                Name
                                                            </th>
                                                            <th className="border-b py-2 px-3 text-left">
                                                                Total Submissions
                                                            </th>
                                                            <th className="border-b py-2 px-3 text-left">
                                                                Conversions
                                                            </th>
                                                            <th className="border-b py-2 px-3 text-left">
                                                                Hiring (%)
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="text-sm font-semibold">
                                                        {
                                                            sklLoad
                                                            ?
                                                            Array(10).fill(
                                                                <tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
                                                                    <td className="py-2 px-3 text-left">
                                                                        <Image src={bambooHrIcon} alt="BambooHR" width={150} className="max-h-[25px] w-auto" />
                                                                    </td>
                                                                    <td className="py-2 px-3 text-left">
                                                                        100
                                                                    </td>
                                                                    <td className="py-2 px-3 text-left">
                                                                    40
                                                                    </td>
                                                                    <td className="py-2 px-3 text-left">
                                                                        61.4%
                                                                    </td>
                                                                </tr>
                                                            )
                                                            :
                                                            Array(6).fill(
                                                                <tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
                                                                    <td className="py-2 px-3 text-left">
                                                                        <Skeleton width={100} height={25} />
                                                                    </td>
                                                                    <td className="py-2 px-3 text-left">
                                                                        <Skeleton width={100} height={25} />
                                                                    </td>
                                                                    <td className="py-2 px-3 text-left">
                                                                        <Skeleton width={100} height={25} />
                                                                    </td>
                                                                    <td className="py-2 px-3 text-left">
                                                                        <Skeleton width={100} height={25} />
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border dark:border-gray-400 rounded-normal mb-6">
                                        <div className="border-b dark:border-gray-400 p-4 flex items-center">
                                            <h2 className="font-bold grow">Applicant Sourced</h2>
                                            <div className="w-[180px]">
                                                <FormField fieldType="select" placeholder="All Applicants" />
                                            </div>
                                        </div>
                                        <div className="p-8">
                                            Body Graph Here
                                        </div>
                                    </div>
                                    <hr className="mb-6" />
                                    <div className="border dark:border-gray-400 rounded-normal mb-6">
                                        <div className="border-b dark:border-gray-400 p-4 flex items-center">
                                            <h2 className="font-bold grow">Job Boards</h2>
                                        </div>
                                        <div className="p-8">
                                            <div className="overflow-auto max-h-[405px]">
                                                <table cellPadding={"0"} cellSpacing={"0"} className="w-full">
                                                    <thead>
                                                        <tr>
                                                            <th className="border-b py-2 px-3 text-left">
                                                                Name
                                                            </th>
                                                            <th className="border-b py-2 px-3 text-left">
                                                                Total Submissions
                                                            </th>
                                                            <th className="border-b py-2 px-3 text-left">
                                                                Conversions
                                                            </th>
                                                            <th className="border-b py-2 px-3 text-left">
                                                                Hiring (%)
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="text-sm font-semibold">
                                                        {
                                                            sklLoad
                                                            ?
                                                            Array(10).fill(
                                                                <tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
                                                                    <td className="py-2 px-3 text-left">
                                                                        <Image src={linkedInIcon} alt="LinkedIn" width={150} className="max-h-[25px] w-auto" />
                                                                    </td>
                                                                    <td className="py-2 px-3 text-left">
                                                                        100
                                                                    </td>
                                                                    <td className="py-2 px-3 text-left">
                                                                    40
                                                                    </td>
                                                                    <td className="py-2 px-3 text-left">
                                                                        61.4%
                                                                    </td>
                                                                </tr>
                                                            )
                                                            :
                                                            Array(6).fill(
                                                                <tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
                                                                    <td className="py-2 px-3 text-left">
                                                                        <Skeleton width={100} height={25} />
                                                                    </td>
                                                                    <td className="py-2 px-3 text-left">
                                                                        <Skeleton width={100} height={25} />
                                                                    </td>
                                                                    <td className="py-2 px-3 text-left">
                                                                        <Skeleton width={100} height={25} />
                                                                    </td>
                                                                    <td className="py-2 px-3 text-left">
                                                                        <Skeleton width={100} height={25} />
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border dark:border-gray-400 rounded-normal mb-6">
                                        <div className="border-b dark:border-gray-400 p-4 flex items-center">
                                            <h2 className="font-bold grow">Applicant Sourced</h2>
                                            <div className="w-[180px]">
                                                <FormField fieldType="select" placeholder="All Applicants" />
                                            </div>
                                        </div>
                                        <div className="p-8">
                                            Body Graph Here
                                        </div>
                                    </div>
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
					</div>
                </div>
            </main>
        </>
    )
}