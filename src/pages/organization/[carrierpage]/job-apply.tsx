import Button from "@/components/button";
import FormField from "@/components/formfield";
import HeaderBar from "@/components/HeaderBar";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import { useCarrierStore } from "@/utils/code";
import { getProviders, useSession } from "next-auth/react";
import router from "next/router";
import { useState, Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useEffect, useState } from "react";

export default function ApplyJob() {
    const { data: session } = useSession();
    const cancelButtonRef = useRef(null)
    const [isOpen, setIsOpen] = useState(false)

    
    
    const cname = useCarrierStore((state) => state.cname)
    const cid = useCarrierStore((state) => state.cid)
    const jid = useCarrierStore((state) => state.jid)
    const jdata = useCarrierStore((state) => state.jdata)
    const setjdata = useCarrierStore((state) => state.setjdata)

    const [resume,setresume] = useState()
    const [fname,setfname] = useState("")
    const [lname,setlname] = useState("")
    const [email,setemail] = useState("")
    const [phone,setphone] = useState("")
    const [summary,setsummary] = useState("")

    const [token,settoken] = useState("")
    const [done,setdone] = useState(0)

    const axiosInstanceAuth2 = axiosInstanceAuth(token)

    useEffect(()=>{
        if(session){settoken(session['accessToken'])}
    },[session,settoken])
    
    useEffect(()=>{
        if(jdata && Object.keys(jdata).length === 0 || jid && jid == "" || !session){
            if(cname=="" && cid=="")
                router.replace(`/organization/${cname}`)
            else
                router.back()
        }
    },[cid,jid,jdata,session,cname])

    function verifyForm() {
        return fname.length > 0 && lname.length > 0 && email.length > 0 && phone.length > 0 && summary.length > 0 && resume
    }

    async function saveresume(){
        const formData = new FormData()
        formData.append("file", resume)
        await axiosInstanceAuth2
            .post(`/candidate/candidateresume/${jdata["refid"]}/`, formData)
            .then(async res => {
                console.log("Resume Saved")

            })
            .catch(err => {
                console.log(err)
            })
    }

    async function saveprofile(){
        const formData = new FormData()
        formData.append("first_name", fname)
        formData.append("last_name", lname)
        formData.append("mobile", phone)
        formData.append("summary", summary)
        await axiosInstanceAuth2
            .post(`/candidate/candidateprofile/${jdata["refid"]}/`, formData)
            .then(async res => {
                createapplicant()
                console.log("profile saved")
                
            })
            .catch(err => {
                console.log(err)
            })
    }

    async function createapplicant(){
        const formData = new FormData()
        await axiosInstanceAuth2
            .post(`/job/applicant/apply/${jdata["refid"]}/`,)
            .then(async res => {
                console.log("Applied")
            })
            .catch(err => {
                console.log(err)
            })
    }

    function apply(){
        saveresume()
        saveprofile()
    }

    return (
        <>
            <main className="py-8">
                <div className="w-full max-w-[1000px] mx-auto px-4">
                    <div className="bg-white dark:bg-gray-800 rounded-normal shadow-normal">
                        <div className="rounded-t-normal overflow-hidden">
                            <HeaderBar handleBack={() => router.back()} />
                        </div>
                        <div className="p-8">
                            <div className="py-1">
                                <div className="my-2 border rounded-normal overflow-hidden flex">
                                    <div className="w-[70px] bg-red-600 text-white font-bold text-center p-3">
                                        <p className="uppercase">pdf</p>
                                    </div>
                                    <div className="w-[calc(100%-70px)] py-3 px-6 flex items-center justify-between">
                                        <p className="text-darkGray font-semibold">Product Manager</p>
                                        <aside>
                                            <button type="button" className="text-primary hover:underline">
                                                Choose
                                            </button>
                                            <button type="button" className="text-darkGray hover:text-red-500 ml-10">
                                                <i className="fa-solid fa-xmark"></i>
                                            </button>
                                        </aside>
                                    </div>
                                </div>
                                <div className="my-2 border rounded-normal overflow-hidden flex">
                                    <div className="w-[70px] bg-red-600 text-white font-bold text-center p-3">
                                        <p className="uppercase">pdf</p>
                                    </div>
                                    <div className="w-[calc(100%-70px)] py-3 px-6 flex items-center justify-between">
                                        <p className="text-darkGray font-semibold">Product Manager</p>
                                        <aside>
                                            <button type="button" className="text-primary hover:underline">
                                                Choose
                                            </button>
                                            <button type="button" className="text-darkGray hover:text-red-500 ml-10">
                                                <i className="fa-solid fa-xmark"></i>
                                            </button>
                                        </aside>
                                    </div>
                                </div>
                            </div>
                            <hr className="my-4" />
                            <label htmlFor="uploadCV" className="border rounded-normal p-6 text-center cursor-pointer block mb-6">
                                <h3 className="font-semibold text-xl mb-4">Autofill With Resume</h3>
                                <h5 className="text-darkGray mb-2">Drag and Drop Resume Here</h5>
                                <p className="text-sm mb-2">Or <span className="text-primary font-semibold">Click Here To Upload</span></p>
                                <p className="text-darkGray text-sm">
                                    Maximum File Size: 5 MB
                                </p>
                                <input type="file" className="hidden" id="uploadCV"  onChange={e => setresume(e.target.files[0])} />
                            </label>
                            <div className="flex flex-wrap mx-[-10px]">
                                <div className="w-full md:max-w-[50%] px-[10px] mb-[20px]">
                                    <FormField fieldType="input" inputType="text" label="First Name" placeholder="First Name" value={fname} handleChange={e => setfname(e.target.value)} />
                                </div>
                                <div className="w-full md:max-w-[50%] px-[10px] mb-[20px]">
                                    <FormField fieldType="input" inputType="text" label="Last Name" placeholder="Last Name" value={lname} handleChange={e => setlname(e.target.value)} />
                                </div>
                            </div>
                            <div className="flex flex-wrap mx-[-10px]">
                                <div className="w-full md:max-w-[50%] px-[10px] mb-[20px]">
                                    <FormField fieldType="input" inputType="email" label="Email" placeholder="Email" required value={email} handleChange={e => setemail(e.target.value)} />
                                </div>
                                <div className="w-full md:max-w-[50%] px-[10px] mb-[20px]">
                                    <FormField fieldType="input" inputType="number" label="Phone Number" placeholder="Phone Number" value={phone} handleChange={e => setphone(e.target.value)} />
                                </div>
                            </div>
                            <FormField fieldType="addItem" inputType="text" label="Social Links" placeholder="Add Social Profiles" icon={<i className="fa-regular fa-plus"></i>} />
                            <FormField fieldType="textarea" label="Summary" placeholder="Summary" value={summary} handleChange={e => setsummary(e.target.value)} />
                            <FormField fieldType="addItem" inputType="text" label="Skills" placeholder="Add Skills" icon={<i className="fa-regular fa-plus"></i>} />
                            <FormField fieldType="addItem" inputType="text" label="Education" placeholder="Add Education" icon={<i className="fa-regular fa-plus"></i>} />
                            <FormField fieldType="addItem" inputType="text" label="Certification" placeholder="Add Certification" icon={<i className="fa-regular fa-plus"></i>} />
                            <hr className="mt-8 mb-4" />
                            <div className="mb-4 relative">
                                <FormField fieldType="addItem" inputType="text" label="Experience" placeholder="Add Experience" icon={<i className="fa-regular fa-plus"></i>} />
                                <label htmlFor="newGraduate" className="font-bold text-sm absolute right-0 top-0">
                                    <input type="checkbox" id="newGraduate" name="newGraduate" className="mr-2 mb-[3px]" />
                                    New Graduate
                                </label>
                            </div>
                            <div className="flex flex-wrap mx-[-10px]">
                                <div className="w-full md:max-w-[50%] px-[10px] mb-[20px]">
                                    <FormField fieldType="input" inputType="text" label="Current Salary" placeholder="Current Salary" />
                                </div>
                                <div className="w-full md:max-w-[50%] px-[10px] mb-[20px]">
                                    <FormField fieldType="input" inputType="text" label="Expected Salary" placeholder="Expected Salary" />
                                </div>
                            </div>
                            <FormField fieldType="input" inputType="text" label="Notice Period" placeholder="Notice Period" />
                            <p className="text-darkGray mb-4"><small>Note: You can edit your details manually</small></p>
                            <Button label="Apply" loader={false} disabled={!verifyForm()} btnType="button" handleClick={apply} />
                        </div>
                    </div>  
                </div>
            </main>
            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog
                as="div"
                className="relative z-40"
                initialFocus={cancelButtonRef}
                onClose={setIsOpen}
                >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <Dialog.Panel className="relative transform overflow-hidden rounded-[30px] bg-[#FBF9FF] dark:bg-gray-800 text-black dark:text-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-2xl">
                            <div className="flex items-center justify-between text-white bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3">
                                <h4 className="leading-none font-semibold">
                                    Title Here
                                </h4>
                                <button
                                    type="button"
                                    className="leading-none hover:text-gray-700"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            <div className="p-8">
                                    Body
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                    </div>
                </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}
export async function getServerSideProps(context: any) {
	const providers = await getProviders();
	return {
		props: {
			providers
		}
	};
}