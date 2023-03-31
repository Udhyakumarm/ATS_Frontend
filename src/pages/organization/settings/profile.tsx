import OrgSideBar from "@/components/organization/SideBar";
import OrgTopBar from "@/components/organization/TopBar";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Dialog, Tab, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useRef, useState } from "react";
import userIcon from "/public/images/icons/user.png";
import UploadProfile from "@/components/UploadProfile";
import FormField from "@/components/FormField";
import Button from "@/components/Button";
import Link from "next/link";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import careerBanner from "/public/images/gall-4.png";
import galleryUpload from "/public/images/gallery_upload.png";
import gall_1 from "/public/images/gall-1.png";
import gall_2 from "/public/images/gall-2.png";
import gall_3 from "/public/images/gall-3.png";
import gall_4 from "/public/images/gall-4.png";
import userImg from "/public/images/user-image.png";
import { Switch } from '@headlessui/react'
import { useSession } from "next-auth/react";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import toastcomp from "@/components/toast";

export default function Profile() {
    const router = useRouter();

    const cancelButtonRef = useRef(null);
	const [addSocial, setAddSocial] = useState(false);
    const [changePass, setChangePass] = useState(false);
    const [addFounder, setAddFounder] = useState(false);
    const [addWidget, setAddWidget] = useState(false);
    const [addGalImages, setAddGalImages] = useState(false);
    const [addGroups, setAddGroups] = useState(false);

    const [enabled, setEnabled] = useState(false)

    const [gallUpload, setGallUpload] =  useState(false);

    const tabHeading_1 = [
        {
            title: 'Individual Profile'
        },
        {
            title: 'Organization Profile'
        },
        {
            title: 'Groups/Division'
        },
        // {
        //     title: 'User Access'
        // }
    ]
    const tabHeading_2 = [
        {
            title: 'Summary',
            icon: <i className="fa-solid fa-bars"></i>
        },
        {
            title: 'Gallery',
            icon: <i className="fa-solid fa-mountain-sun"></i>
        },
        {
            title: 'Widget',
            icon: <i className="fa-solid fa-gauge"></i>
        },
        // {
        //     title: 'Custom Domain',
        //     icon: <i className="fa-solid fa-desktop"></i>
        // }
    ]
    const gallery = [
        {
            image: gall_1
        },
        {
            image: gall_2
        },
        {
            image: gall_3
        },
        {
            image: gall_4
        }
    ]

    const { data: session } = useSession();
	const [token, settoken] = useState("");
    //Individual Profile
	const [iprofile, setiprofile] = useState([]);
	const [iuniqueid, setiuniqueid] = useState("");

    const [profileimg, setProfileImg] = useState()
    const [purl, setpurl] = useState("")
    const [oname, setoname] = useState("")
    const [fname, setfname] = useState("")
    const [contact, setcontact] = useState("")
    const [email, setemail] = useState("")
    const [title, settitle] = useState("")
    const [dept, setdept] = useState("")
    //blur
    const [bluroname, setbluroname] = useState("")
    const [blurfname, setblurfname] = useState("")
    const [blurcontact, setblurcontact] = useState("")
    const [bluremail, setbluremail] = useState("")
    const [blurtitle, setblurtitle] = useState("")
    const [blurdept, setblurdept] = useState("")

    //Individual Link
	const [ilink, setilink] = useState([]);
	const [iaddlink, setiaddlink] = useState("");

    function verifyLinkPopup() {
        return iaddlink.length > 0
    }

    //Org Profile
    const [oprofile, setoprofile] = useState([]);

    const [oabout, setoabout] = useState("")
    const [oafounder, setoafounder] = useState("")
    const [ourl, setourl] = useState("")
    const [ocontact, setocontact] = useState("")
    const [ocsize, setocsize] = useState("")
    const [owplace, setowplace] = useState("")
    const [ohlocation, setohlocation] = useState("")
    const [oboffice, setoboffice] = useState("")
    const [obenefits, setobenefits] = useState("")
    const [ofund, setofund] = useState("")

    const [ologo, setologo] = useState()
    const [oulogo, setoulogo] = useState()
    const [obanner, setobanner] = useState()
    const [oubanner, setoubanner] = useState()
    //blur
    const [bluroabout, setbluroabout] = useState("")
    const [bluroafounder, setbluroafounder] = useState("")
    const [blurourl, setblurourl] = useState("")
    const [blurocontact, setblurocontact] = useState("")
    const [blurocsize, setblurocsize] = useState("")
    const [blurowplace, setblurowplace] = useState("")
    const [blurohlocation, setblurohlocation] = useState("")
    const [bluroboffice, setbluroboffice] = useState("")
    const [blurobenefits, setblurobenefits] = useState("")
    const [blurofund, setblurofund] = useState("")

    //Org Founder
    const [ofounder, setofounder] = useState([]);

    const [ofounderimg, setofounderimg] = useState();
    const [ofoundername, setofoundername] = useState("");
    const [ofounderdes, setofounderdes] = useState("");

    function verifyFounderPopup() {
        return ofounderimg && ofoundername.length > 0 && ofounderdes.length > 0
    }

    //Org Gallery
    const [ogallery, setoGallery] = useState([])
    const [ofile, setoFile] = useState([] as any)

    function onImageChange(e: any) {
        setoFile([...ofile, ...e.target.files])
    }

    
    function deleteUImage(num: any) {
        var myElement = document.getElementById(`gallerypopup${num}`).remove()
        if (ofile.length == 1) {
            setoFile([])
        } else {
            ofile.splice(num, 1)
        }
    }
    
    function verifyGalPopup() {
        return ofile.length > 0
    }





	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

    async function loadIndividualProfile() {
        await axiosInstanceAuth2
			.get(`/organization/listindividualprofile/`)
			.then(async (res) => {
				console.log("@","iprofile",res.data);
				setiprofile(res.data);
			})
			.catch((err) => {
				console.log("@","iprofile",err);
			});
    }

    async function saveIndividualProfile(formData: any) {
        await axiosInstanceAuth2
          .put(`/organization/individualprofile/update/`, formData)
          .then(async res => {
            toastcomp("Individual Profile Updated", "success")
            loadIndividualProfile()
          })
          .catch(err => {
            console.log(err)
            if (err.message != "Request failed with status code 401") {
                toastcomp("Individual Profile Not Updated", "error")
            }
          })
    }

    async function loadIndividualLink() {
        await axiosInstanceAuth2
			.get(`/organization/listindividuallink/${iuniqueid}/`)
			.then(async (res) => {
				console.log("@","Link",res.data);
				setilink(res.data);
			})
			.catch((err) => {
				console.log("@","Link",err);
			});
    }

    async function addIndividualLink() {
        var formData = new FormData()
        formData.append("title", iaddlink)
        await axiosInstanceAuth2
          .post(`/organization/individuallink/${iuniqueid}/`, formData)
          .then(async res => {
            toastcomp("Social Link Added", "success")
            loadIndividualLink()
            setiaddlink("")
            setAddSocial(false)
          })
          .catch(err => {
            toastcomp("Link Not Added", "error")
            console.log(err)
            loadIndividualLink()
            setiaddlink("")
            setAddSocial(false)
          })
    }

    async function delIndividualLink(val: any) {
        await axiosInstanceAuth2
          .delete(`/organization/individuallink/${iuniqueid}/${val}/delete/`)
          .then(async res => {
            toastcomp("Social Link Deleted", "success")
            loadIndividualLink()
            setiaddlink("")
            setAddSocial(false)
          })
          .catch(err => {
            toastcomp("Link Not Deleted", "error")
            console.log(err)
            loadIndividualLink()
            setiaddlink("")
            setAddSocial(false)
          })
    }

    async function loadOrganizationProfile() {
        await axiosInstanceAuth2
			.get(`/organization/listorganizationprofile/`)
			.then(async (res) => {
				console.log("@","oprofile",res.data);
				setoprofile(res.data);
			})
			.catch((err) => {
				console.log("@","oprofile",err);
			});
    }

    async function saveOrganizationProfile(formData: any) {
        await axiosInstanceAuth2
          .put(`/organization/organizationprofile/update/`, formData)
          .then(async res => {
            toastcomp("Organization Profile Updated", "success")
            loadIndividualProfile()
          })
          .catch(err => {
            console.log(err)
            if (err.message != "Request failed with status code 401") {
                toastcomp("Organization Profile Not Updated", "error")
            }
          })
    }

    async function loadOrganizationFounder() {
        await axiosInstanceAuth2
			.get(`/organization/listorganizationfounder/`)
			.then(async (res) => {
				console.log("@","founder",res.data);
				setofounder(res.data);
			})
			.catch((err) => {
				console.log("@","founder",err);
			});
    }

    async function addOrganizationFounder() {
        var formData = new FormData()
        formData.append("name", ofoundername)
        formData.append("designation", ofounderdes)
        formData.append("image", ofounderimg)
        await axiosInstanceAuth2
          .post(`/organization/organizationfounder/`, formData)
          .then(async res => {
            toastcomp("Organization founder Added", "success")
            loadOrganizationFounder()
            setofounderdes("")
            setofounderimg()
            setofoundername("")
            setAddFounder(false)
          })
          .catch(err => {
            toastcomp("founder Not Added", "error")
            console.log(err)
            loadOrganizationFounder()
            setofounderdes("")
            setofounderimg()
            setofoundername("")
            setAddFounder(false)
          })
    }
    
    async function delOrganizationFounder(val: any) {
        await axiosInstanceAuth2
          .delete(`/organization/organizationfounder/${val}/delete/`)
          .then(async res => {
            toastcomp("Organization founder Deleted", "success")
            loadOrganizationFounder()
            setofounderdes("")
            setofounderimg()
            setofoundername("")
            setAddFounder(false)
          })
          .catch(err => {
            toastcomp("Founder Not Deleted", "error")
            console.log(err)
            loadOrganizationFounder()
            setofounderdes("")
            setofounderimg()
            setofoundername("")
            setAddFounder(false)
          })
    }

    async function loadOrganizationGallery() {
        await axiosInstanceAuth2
			.get(`/organization/listorganizationgallery/`)
			.then(async (res) => {
				console.log("@","gallery",res.data);
				setoGallery(res.data);
			})
			.catch((err) => {
				console.log("@","gallery",err);
			});
    }

    async function addOrganizationGallery(formdata) {
        await axiosInstanceAuth2
          .post("/organization/organizationgallery/",formdata)
          .then(async res => {
            toastcomp("Gallery Added", "success")
            loadOrganizationGallery()
            setoFile([])
            setAddGalImages(false)
          })
          .catch(err => {
            toastcomp("Gallery Not Added", "error")
            console.log(err)
            loadOrganizationGallery()
            setoFile([])
            setAddGalImages(false)
        })
    }

    
    function saveGallery() {
        if (ofile.length > 0) {
          for (let i = 0; i < ofile.length; i++) {
            const formData = new FormData()
            formData.append("image", ofile[i])
            addOrganizationGallery(formData)
          }
        }
    }
    
    async function delOrganizationGallery(val: any) {
        await axiosInstanceAuth2
          .delete(`/organization/organizationgallery/${val}/delete/`)
          .then(async res => {
            toastcomp("Organization Gallery Deleted", "success")
            loadOrganizationGallery()
          })
          .catch(err => {
            toastcomp("Gallery Not Deleted", "error")
            console.log(err)
            loadOrganizationGallery()
          })
    }

    useEffect(()=>{
        if(token && token.length > 0){
            loadIndividualProfile()
            loadOrganizationProfile()
            loadOrganizationFounder()
            loadOrganizationGallery()
        }
    },[token])

    useEffect(()=>{
        if(iprofile && iprofile.length > 0){
            for(let i=0;i<iprofile.length;i++){
                if(iprofile[i]["profile"]){
                    setpurl(iprofile[i]["profile"])
                }
                else{setpurl("")}

                if(iprofile[i]["organization_Name"]){
                    setoname(iprofile[i]["organization_Name"])
                    setbluroname(iprofile[i]["organization_Name"])
                }
                else{setoname("")}

                if(iprofile[i]["full_Name"]){
                    setfname(iprofile[i]["full_Name"])
                    setblurfname(iprofile[i]["full_Name"])
                }
                else{setfname("")}

                if(iprofile[i]["contact_Number"]){
                    setcontact(iprofile[i]["contact_Number"])
                    setblurcontact(iprofile[i]["contact_Number"])
                }
                else{setcontact("")}

                if(iprofile[i]["email"]){
                    setemail(iprofile[i]["email"])
                    setbluremail(iprofile[i]["email"])
                }
                else{setemail("")}

                if(iprofile[i]["title"]){
                    settitle(iprofile[i]["title"])
                    setblurtitle(iprofile[i]["title"])
                }
                else{settitle("")}

                if(iprofile[i]["department"]){
                    setdept(iprofile[i]["department"])
                    setblurdept(iprofile[i]["department"])
                }
                else{setdept("")}

                setiuniqueid(iprofile[i]["unique_id"])
            }
        }
    },[iprofile])

    
    useEffect(()=>{
        if(oprofile && oprofile.length > 0){
            for(let i=0;i<oprofile.length;i++){
                if(oprofile[i]["about_org"]){
                    setoabout(oprofile[i]["about_org"])
                    setbluroabout(oprofile[i]["about_org"])
                }
                else{setoabout("")}

                if(oprofile[i]["about_founder"]){
                    setoafounder(oprofile[i]["about_founder"])
                    setbluroafounder(oprofile[i]["about_founder"])
                }
                else{setoafounder("")}

                if(oprofile[i]["org_Url"]){
                    setourl(oprofile[i]["org_Url"])
                    setblurourl(oprofile[i]["org_Url"])
                }
                else{setourl("")}

                if(oprofile[i]["contact_Number"]){
                    setocontact(oprofile[i]["contact_Number"])
                    setblurocontact(oprofile[i]["contact_Number"])
                }
                else{setocontact("")}

                if(oprofile[i]["company_Size"]){
                    setocsize(oprofile[i]["company_Size"])
                    setblurocsize(oprofile[i]["company_Size"])
                }
                else{setocsize("")}

                if(oprofile[i]["workplace_Type"]){
                    setowplace(oprofile[i]["workplace_Type"])
                    setblurowplace(oprofile[i]["workplace_Type"])
                }
                else{setowplace("")}

                if(oprofile[i]["headquarter_Location"]){
                    setohlocation(oprofile[i]["headquarter_Location"])
                    setblurohlocation(oprofile[i]["headquarter_Location"])
                }
                else{setohlocation("")}

                if(oprofile[i]["branch_Office"]){
                    setoboffice(oprofile[i]["branch_Office"])
                    setbluroboffice(oprofile[i]["branch_Office"])
                }
                else{setoboffice("")}

                if(oprofile[i]["organization_Benefits"]){
                    setobenefits(oprofile[i]["organization_Benefits"])
                    setblurobenefits(oprofile[i]["organization_Benefits"])
                }
                else{setobenefits("")}

                if(oprofile[i]["funding_Details"]){
                    setofund(oprofile[i]["funding_Details"])
                    setblurofund(oprofile[i]["funding_Details"])
                }
                else{setofund("")}

                if(oprofile[i]["logo"]){
                    setologo(oprofile[i]["logo"])
                }
                else{setologo("")}

                if(oprofile[i]["banner"]){
                    setobanner(oprofile[i]["banner"])
                }
                else{setobanner("")}

                

                // setiuniqueid(iprofile[i]["unique_id"])
            }
        }
    },[oprofile])

    useEffect(()=>{
        if(iuniqueid && iuniqueid.length > 0){
            loadIndividualLink()
        }
    },[iuniqueid])



    useEffect(()=>{
        if(iprofile && iprofile.length > 0){
            var formData = new FormData()
            if (iprofile[0]["organization_Name"] != bluroname) {
                formData.append("organization_Name", bluroname)
            }
            if (iprofile[0]["full_Name"] != blurfname) {
                formData.append("full_Name", blurfname)
            }
            if (iprofile[0]["contact_Number"] != blurcontact) {
                formData.append("contact_Number", blurcontact)
            }
            if (iprofile[0]["email"] != bluremail) {
                formData.append("email", bluremail)
            }
            if (iprofile[0]["title"] != blurtitle) {
                formData.append("title", blurtitle)
            }
            if (iprofile[0]["department"] != blurdept) {
                formData.append("department", blurdept)
            }
            if (profileimg) {
                formData.append("profile", profileimg)
            }

            if (Array.from(formData.keys()).length > 0) {
                saveIndividualProfile(formData)
            }
        }
    },[bluroname,blurfname,blurcontact,bluremail,blurtitle,blurdept,profileimg])

    useEffect(()=>{
        if(oprofile && oprofile.length > 0){
            var formData = new FormData()
            if (oprofile[0]["about_org"] != bluroabout) {
                formData.append("about_org", bluroabout)
            }
            if (oprofile[0]["about_founder"] != bluroafounder) {
                formData.append("about_founder", bluroafounder)
            }
            if (oprofile[0]["org_Url"] != blurourl) {
                formData.append("org_Url", blurourl)
            }
            if (oprofile[0]["contact_Number"] != blurocontact) {
                formData.append("contact_Number", blurocontact)
            }
            if (oprofile[0]["company_Size"] != ocsize) {
                formData.append("company_Size", ocsize)
            }
            if (oprofile[0]["workplace_Type"] != owplace) {
                formData.append("workplace_Type", owplace)
            }
            if (oprofile[0]["headquarter_Location"] != blurohlocation) {
                formData.append("headquarter_Location", blurohlocation)
            }
            if (oprofile[0]["branch_Office"] != bluroboffice) {
                formData.append("branch_Office", bluroboffice)
            }
            if (oprofile[0]["organization_Benefits"] != blurobenefits) {
                formData.append("organization_Benefits", blurobenefits)
            }
            if (oprofile[0]["funding_Details"] != blurofund) {
                formData.append("funding_Details", blurofund)
            }
            if (oulogo) {
                formData.append("logo", oulogo)
                setoulogo()
            }
            if (oubanner) {
                formData.append("banner", oubanner)
                setoubanner()
            }

            if (Array.from(formData.keys()).length > 0) {
                saveOrganizationProfile(formData)
            }
        }
    },[bluroabout,bluroafounder,blurourl,blurocontact,ocsize,owplace,blurohlocation,bluroboffice,blurobenefits,blurofund,oulogo,oubanner])




    
  function geticon(param1: string) {
    if (param1.toLowerCase().includes("facebook")) {
      return "fa-brands fa-facebook"
    } else if (param1.toLowerCase().includes("twitter")) {
      return "fa-brands fa-twitter"
    } else if (param1.toLowerCase().includes("instagram")) {
      return "fa-brands fa-instagram"
    } else if (param1.toLowerCase().includes("linkedin")) {
      return "fa-brands fa-linkedin"
    } else if (param1.toLowerCase().includes("github")) {
      return "fa-brands fa-github"
    } else if (param1.toLowerCase().includes("discord")) {
      return "fa-brands fa-discord"
    } else if (param1.toLowerCase().includes("youtube")) {
      return "fa-brands fa-youtube"
    } else if (param1.toLowerCase().includes("behance")) {
      return "fa-brands fa-behance"
    } else if (param1.toLowerCase().includes("behance")) {
      return "fa-brands fa-behance"
    } else {
      return "fa-solid fa-link"
    }
  }

  function gettitle(param1: string) {
    if (param1.toLowerCase().includes("facebook")) {
      return "facebook"
    } else if (param1.toLowerCase().includes("twitter")) {
      return "twitter"
    } else if (param1.toLowerCase().includes("instagram")) {
      return "instagram"
    } else if (param1.toLowerCase().includes("linkedin")) {
      return "linkedin"
    } else if (param1.toLowerCase().includes("github")) {
      return "github"
    } else if (param1.toLowerCase().includes("discord")) {
      return "discord"
    } else if (param1.toLowerCase().includes("youtube")) {
      return "youtube"
    } else if (param1.toLowerCase().includes("behance")) {
      return "behance"
    } else {
      return "link"
    }
  }

    return(
        <>
            <Head>
				<title>Profile</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<main>
				<OrgSideBar />
				<OrgTopBar />
				<div id="overlay" className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"></div>
				<div className="layoutWrap p-4 lg:p-8">
					<div className="rounded-normal bg-white shadow-normal dark:bg-gray-800">
						<div className="py-4">
                            <div className="w-full max-w-[1100px] mx-auto mb-4 flex flex-wrap items-center justify-start py-2 px-4">
                                <button
                                    onClick={() => router.back()}
                                    className="mr-10 justify-self-start text-darkGray dark:text-gray-400"
                                >
                                    <i className="fa-solid fa-arrow-left text-2xl"></i>
                                </button>
                                <h2 className="text-xl font-bold flex items-center">
                                    <div className="mr-4 flex h-[45px] w-[45px] items-center justify-center rounded bg-[#B2E3FF] p-3">
                                        <Image src={userIcon} alt='Active Job' height={20} />
                                    </div>
                                    <span>Profile</span>
                                </h2>
                            </div>
                            <Tab.Group>
                                <div className={"border-b px-4"}>
                                    <Tab.List className={"w-full max-w-[950px] mx-auto"}>
                                        {tabHeading_1.map((item, i)=> 
                                        <Tab key={i} as={Fragment}>
                                            {({ selected }) => (
                                                <button
                                                    className={
                                                        "border-b-4 py-2 mr-16 font-semibold focus:outline-none" +
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
                                <Tab.Panels className={"w-full max-w-[980px] mx-auto px-4 py-8"}>
                                    <Tab.Panel>
                                        <div className="mb-4">
                                            <UploadProfile note="Supported Formats 2 mb  : Png , Jpeg" handleChange={(e)=>setProfileImg(e.target.files[0])} purl={purl} />
                                        </div>
                                        <div className="-mx-3 flex flex-wrap">
                                            <div className="mb-4 w-full px-3 md:max-w-[50%]">
                                                <FormField fieldType="input" inputType="text" label="Organization Name" value={oname} handleChange={(e) => setoname(e.target.value)} handleOnBlur={(e) => setbluroname(e.target.value)} id={""}/>
                                            </div>
                                            <div className="mb-4 w-full px-3 md:max-w-[50%]">
                                                <FormField fieldType="input" inputType="text" label="Full Name" value={fname} handleChange={(e) => setfname(e.target.value)} handleOnBlur={(e) => setblurfname(e.target.value)} id={""} />
                                            </div>
                                            <div className="mb-4 w-full px-3 md:max-w-[50%]">
                                                <FormField fieldType="input" inputType="number" label="Contact Number" value={contact} handleChange={(e) => setcontact(e.target.value)} handleOnBlur={(e) => setblurcontact(e.target.value)} id={""} />
                                            </div>
                                            <div className="mb-4 w-full px-3 md:max-w-[50%]">
                                                <FormField fieldType="input" inputType="email" label="Email Address" value={email} handleChange={(e) => setemail(e.target.value)} handleOnBlur={(e) => setbluremail(e.target.value)} required id={""} />
                                            </div>
                                            <div className="mb-4 w-full px-3 md:max-w-[50%]">
                                                <FormField fieldType="input" inputType="text" label="Title" value={title} handleChange={(e) => settitle(e.target.value)} handleOnBlur={(e) => setblurtitle(e.target.value)} id={""} />
                                            </div>
                                            <div className="mb-4 w-full px-3 md:max-w-[50%]">
                                                <FormField fieldType="input" inputType="text" label="Department" value={dept} handleChange={(e) => setdept(e.target.value)} handleOnBlur={(e) => setblurdept(e.target.value)} id={""} />
                                            </div>
                                        </div>
                                        <hr className="my-4" />
                                        <div>
                                            <div className="flex flex-wrap items-center justify-between">
                                                <h6 className="mb-1 font-bold">
                                                    Add Social Logins
                                                </h6>
                                                <Button btnType="button" btnStyle="iconRightBtn" label="Add" iconRight={(<i className="fa-solid fa-circle-plus"></i>)} handleClick={() => setAddSocial(true)} />
                                            </div>
                                            <div className="flex flex-wrap">
                                                {ilink && ilink.map((data,i)=>(
                                                    <div className="mr-6 mb-4 w-[100px] rounded-normal shadow-highlight relative p-3 text-center bg-lightBlue dark:bg-gray-700">
                                                        <Link href={data["title"]} className="" key={i}>
                                                            <span className="block w-8 h-8 mx-auto mb-1 shadow-normal rounded p-1 bg-white dark:bg-gray-500">
                                                                <i className={`${geticon(data["title"])}`}></i>
                                                            </span>
                                                            <p className="font-bold text-[12px] capitalize">
                                                                {`${gettitle(data["title"])}`}
                                                            </p>
                                                        </Link>
                                                        <button type="button" className="absolute top-[-10px] right-[-10px] text-center rounded-full text-[20px] font-bold text-red-500 dark:text-white" onClick={(e)=>delIndividualLink(data["id"])} >
                                                            <i className="fa-solid fa-circle-xmark"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <hr className="my-4" />
                                        <div>
                                            <h6 className="mb-1 font-bold">
                                                Password Settings
                                            </h6>
                                            <Button btnType="button" label="Change Password" handleClick={() => setChangePass(true)} />
                                        </div>
                                    </Tab.Panel>
                                    <Tab.Panel>
                                        <Tab.Group>
                                            <Tab.List className={'border-b mb-6'}>
                                                {tabHeading_2.map((item, i)=> 
                                                    <Tab key={i} as={Fragment}>
                                                        {({ selected }) => (
                                                            <button
                                                                className={
                                                                    "border-b-4 py-2 px-4 mr-6 font-semibold focus:outline-none inline-flex items-center" +
                                                                    " " +
                                                                    (selected ? "border-primary text-primary" : "border-transparent text-darkGray dark:text-gray-400")
                                                                }
                                                            >
                                                                <div className="mr-2">
                                                                    {item.icon}
                                                                </div>
                                                                {item.title}
                                                            </button>
                                                        )}
                                                    </Tab>
                                                )}
                                            </Tab.List>
                                            <Tab.Panels>
                                                <Tab.Panel>
                                                    <FormField fieldType="reactquill" label="About the organization" value={oabout} handleChange={setoabout} handleOnBlur={setbluroabout} />
                                                    <div className="mb-4">
                                                        <h6 className="mb-3 font-bold">Founders Information</h6>
                                                        <div className="flex flex-wrap -mx-4">
                                                            {ofounder && ofounder.map((data,i)=>(
                                                                <div className="w-[50%] md:max-w-[33.3333%] lg:max-w-[25%] px-4 mb-4 last:mb-0" key={i}>
                                                                    <div className="relative text-center p-4 shadow-normal rounded-normal w-full min-h-[180px] dark:bg-gray-700">
                                                                        <Image src={data["image"]} alt='User' width={300} height={300} className="rounded-full object-cover w-[100px] h-[100px] shadow-highlight mx-auto mb-3" />
                                                                        <h5 className="font-semibold">{data["name"]}</h5>
                                                                        <p className="text-darkGray dark:text-gray-400 text-sm italic">{data["designation"]}</p>
                                                                        <button type="button" className="absolute right-2 top-2 text-red-500 hover:text-red-700" onClick={(e)=>delOrganizationFounder(data["id"])}>
                                                                            <i className="fa-solid fa-trash"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <div className="w-[50%] md:max-w-[33.3333%] lg:max-w-[25%] px-4 mb-4 last:mb-0">
                                                                <button type="button" className="border-2 border-dashed rounded-normal w-full min-h-[180px] flex items-center justify-center hover:bg-lightBlue dark:hover:bg-gray-700" onClick={() => setAddFounder(true)}>
                                                                    <i className="fa-solid fa-plus text-[80px] text-lightGray"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <FormField fieldType="input" inputType="text" label="About Founder" value={oafounder} handleChange={(e) => setoafounder(e.target.value)} handleOnBlur={(e) => setbluroafounder(e.target.value)} />
                                                    <div className="-mx-3 flex flex-wrap">
                                                        <div className="mb-4 w-full px-3 md:max-w-[50%]">
                                                            <FormField fieldType="input" inputType="text" label="Organization URL" value={ourl} handleChange={(e) => setourl(e.target.value)} handleOnBlur={(e) => setblurourl(e.target.value)} />
                                                        </div>
                                                        <div className="mb-4 w-full px-3 md:max-w-[50%]">
                                                            <FormField fieldType="input" inputType="text" label="Organization Contact Number" value={ocontact} handleChange={(e) => setocontact(e.target.value)} handleOnBlur={(e) => setblurocontact(e.target.value)} />
                                                        </div>
                                                        <div className="mb-4 w-full px-3 md:max-w-[50%]">
                                                            <FormField fieldType="select" label="Company Size" value={[{ name:  ocsize }]} 
                                                            handleChange={setocsize} singleSelect options={
                                                                [
                                                                    { name: "1-10" },
                                                                    { name: "10-50" },
                                                                    { name: "50-100" },
                                                                    { name: "100-500" },
                                                                    { name: "500+" }
                                                                ]
                                                            } />
                                                        </div>
                                                        <div className="mb-4 w-full px-3 md:max-w-[50%]">
                                                            <FormField fieldType="select" label="Workplace Type" value={[{ name: owplace }]} 
                                                            handleChange={setowplace} singleSelect options={
                                                                [
                                                                    { name: "On-site" },
                                                                    { name: "Remote" },
                                                                    { name: "Hybrid" },
                                                                ]
                                                            }/>
                                                        </div>
                                                        <div className="mb-4 w-full px-3 md:max-w-[50%]">
                                                            <FormField fieldType="input" inputType="text" label="Headquarter Location" value={ohlocation} handleChange={(e) => setohlocation(e.target.value)} handleOnBlur={(e) => setblurohlocation(e.target.value)} />
                                                        </div>
                                                        <div className="mb-4 w-full px-3 md:max-w-[50%]">
                                                            <FormField fieldType="input" inputType="text" label="Branch Office (Optional)" value={oboffice} handleChange={(e) => setoboffice(e.target.value)} handleOnBlur={(e) => setbluroboffice(e.target.value)} />
                                                        </div>
                                                        <div className="mb-4 w-full px-3 md:max-w-[50%]">
                                                            <FormField fieldType="input" inputType="text" label="Organization Benefits" value={obenefits} handleChange={(e) => setobenefits(e.target.value)} handleOnBlur={(e) => setblurobenefits(e.target.value)} />
                                                        </div>
                                                        <div className="mb-4 w-full px-3 md:max-w-[50%]">
                                                            <FormField fieldType="input" inputType="text" label="Funding Details" value={ofund} handleChange={(e) => setofund(e.target.value)} handleOnBlur={(e) => setblurofund(e.target.value)} />
                                                        </div>
                                                    </div>
                                                </Tab.Panel>
                                                <Tab.Panel>
                                                    <div className="mb-6">
                                                        <h6 className="mb-3 font-bold">Company Logo</h6>
                                                        <UploadProfile note="Supported Formats 2 mb  : Png , Jpeg" handleChange={(e)=>setoulogo(e.target.files[0])} purl={ologo} />
                                                    </div>
                                                    <div className="mb-6">
                                                        <h6 className="mb-3 font-bold">Banner Image</h6>
                                                        {obanner && obanner.legth <= 0 ? <label htmlFor="uploadBanner" className="cursor-pointer border-2 border-dashed rounded-normal w-full min-h-[180px] flex items-center justify-center hover:bg-lightBlue dark:hover:bg-gray-700">
                                                            <i className="fa-solid fa-plus text-[80px] text-lightGray"></i>
                                                            <input type="file" hidden id="uploadBanner" onChange={(e)=>setoubanner(e.target.files[0])} />
                                                        </label>
                                                        :
                                                        <div className="block w-full relative rounded-normal border overflow-hidden"> 
                                                            <Image src={obanner} alt='User' width={1200} height={1200} className="object-cover w-full h-[200px]" />
                                                            <div className="absolute top-[-1px] right-0 shadow-highlight rounded-bl overflow-hidden">
                                                                {/* <button type="button" className="bg-white hover:bg-red-200 text-red-500 w-6 h-6 leading-6 text-center text-[12px] border-b">
                                                                    <i className={'fa-solid fa-trash'}></i>
                                                                </button> */}
                                                                <label htmlFor="editBanner" className="cursor-pointer block bg-white hover:bg-slate-200 text-slate-500 w-6 h-6 leading-6 text-center text-[12px]">
                                                                    <i className={'fa-solid fa-edit'}></i>
                                                                    <input type="file" id="editBanner" onChange={(e)=>setoubanner(e.target.files[0])} hidden />
                                                                </label>
                                                            </div>
                                                        </div>
                                                        }
                                                    </div>
                                                    <div className="mb-6">
                                                        <h6 className="mb-3 font-bold">Workplace Culture</h6>
                                                        <div className="bg-white dark:bg-gray-700 shadow-highlight rounded-normal overflow-hidden">
                                                            <div className="bg-lightBlue dark:bg-gray-600 p-3 flex items-center justify-between">
                                                                <h4 className="font-semibold">Upload Images</h4>
                                                                <Button btnStyle="sm" btnType="submit" label="Add Images" handleClick={() => setAddGalImages(true)} />
                                                            </div>
                                                            <div className="p-6">
                                                                {
                                                                    ogallery && ogallery.length > 0
                                                                    ?
                                                                    <>
                                                                        <ResponsiveMasonry
                                                                        columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
                                                                        >
                                                                            <Masonry className="masonary_grid">
                                                                                {ogallery.map((data, i) => (
                                                                                    <div key={i} className="relative">
                                                                                        <Image src={data["image"]} height={100} width={100} alt="Gallery" className="w-full p-1" />
                                                                                        <button type="button" className="absolute right-2 top-2 text-red-500 hover:text-red-700 w-7 h-7 bg-white rounded-full text-sm" onClick={e => delOrganizationGallery(data["id"])}>
                                                                                            <i className="fa-solid fa-trash"></i>
                                                                                        </button>
                                                                                    </div>
                                                                                ))}
                                                                            </Masonry>
                                                                        </ResponsiveMasonry>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <div className="flex items-center justify-center min-h-[200px] cursor-pointer"  onClick={()=>setAddGalImages(true)} >
                                                                            <Image src={galleryUpload} alt="Upload"/>
                                                                        </div>
                                                                    </>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap -mx-3">
                                                        <div className="w-full lg:max-w-[50%] px-3 mb-6">
                                                            <h6 className="mb-3 font-bold">Choose from the Color Palates</h6>
                                                            <div className="flex flex-wrap items-center">
                                                                <input type="color" id="favcolor" name="favcolor" className="w-8 h-8 bg-white" />
                                                            </div>
                                                        </div>
                                                        <div className="w-full lg:max-w-[50%] px-3">
                                                            <h6 className="mb-3 font-bold">Connect with our team to customize</h6>
                                                            <Button btnStyle="iconLeftBtn" label="Send Mail" iconLeft={(<i className="fa-solid fa-envelope"></i>)} />
                                                        </div>
                                                    </div>
                                                </Tab.Panel>
                                                <Tab.Panel>
                                                    <h6 className="font-bold mb-2">Add Widget</h6>
                                                    <div className="flex border rounded-normal">
                                                        <div className="w-[80%] p-4 flex items-center">
                                                            <p>All your Jobs will be posted on customized Career Page</p>
                                                        </div>
                                                        <div className="w-[20%] p-4 bg-lightBlue dark:bg-gray-600 rounded-normal text-center">
                                                            <Button btnType="button" label="Add Here" handleClick={() => setAddWidget(true)} />
                                                        </div>
                                                    </div>
                                                </Tab.Panel>
                                            </Tab.Panels>
                                        </Tab.Group>
                                    </Tab.Panel>
                                    <Tab.Panel>
                                        <div className="flex flex-wrap items-center justify-between mb-6">
                                            <h5 className="mb-2 font-bold">Add Groups to your Parent Organization</h5>
                                            <Button btnStyle="iconRightBtn" label="Add Group" iconRight={(<i className="fa-solid fa-circle-plus"></i>)} btnType="button" handleClick={() => setAddGroups(true)} />
                                        </div>
                                        <div className="py-2">
                                            <p className="text-darkGray dark:text-gray-400 text-center">No groups found</p>
                                            <div className="flex flex-wrap mx-[-15px]">
                                                {Array(5).fill(
                                                <div className="mb-[30px] px-[15px] w-full md:max-w-[50%] lg:max-w-[33.3333%]">
                                                    <div className="h-full bg-lightBlue dark:bg-gray-700 shadow-highlight rounded-normal p-4">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <Image src={userImg} alt="Logo" width={100} className="rounded-full object-cover w-[50px] h-[50px]" />
                                                            <button type="button" className="text-red-500 hover:text-red-700">
                                                                <i className="fa-solid fa-trash"></i>
                                                            </button>
                                                        </div>
                                                        <p className="text-darkGray dark:text-gray-400 text-sm flex items-center justify-between mb-2">
                                                            <span>Bell Cosmetic</span>
                                                            <span>ID - 45989</span>
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <Switch
                                                            checked={enabled}
                                                            onChange={setEnabled}
                                                            className={`${
                                                                enabled ? 'bg-primary' : 'bg-gray-400'
                                                            } relative inline-flex h-6 w-11 items-center rounded-full`}
                                                            >
                                                                <span className="sr-only">Enable notifications</span>
                                                                <span
                                                                    className={`${
                                                                    enabled ? 'translate-x-6' : 'translate-x-1'
                                                                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                                                />
                                                            </Switch>
                                                            <Button btnStyle="outlined" label="Edit" />
                                                        </div>
                                                    </div>
                                                </div>
                                                )}
                                            </div>
                                        </div>
                                    </Tab.Panel>
                                </Tab.Panels>
                            </Tab.Group>
						</div>
					</div>
				</div>
			</main>
            <Transition.Root show={addSocial} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setAddSocial}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-lg">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">
											Add Social Login
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setAddSocial(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
                                        {/* <FormField
                                            fieldType="select"
                                            inputType="text"
                                            label="Choose social media"
                                            singleSelect
                                            options={[
                                                { name: "Facebook" },
                                                { name: "Twitter" }
                                            ]}
                                        /> */}
                                        <FormField
                                            fieldType="input"
                                            inputType="text"
                                            label="Add URL"
                                            value={iaddlink}
                                            handleChange={(e)=>setiaddlink(e.target.value)}
                                        />
										<div className="text-center">
											<Button label="Add" disabled={!verifyLinkPopup()} btnType={"button"} handleClick={addIndividualLink} />
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
            <Transition.Root show={changePass} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setChangePass}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-lg">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">
											Change Password
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setChangePass(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
                                        <FormField
                                            fieldType="input"
                                            inputType="password"
                                            label="Old Password"
                                            required
                                        />
                                        <FormField
                                            fieldType="input"
                                            inputType="password"
                                            label="New Password"
                                            required
                                        />
                                        <FormField
                                            fieldType="input"
                                            inputType="password"
                                            label="Confirm Password"
                                            required
                                        />
                                        <div className="text-center">
                                            <Button label="Submit" />
                                        </div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
            <Transition.Root show={addFounder} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setAddFounder}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-lg">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">
											Add new founder
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setAddFounder(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
                                        <div className="mb-4 text-center">
                                            <UploadProfile handleChange={(e)=>setofounderimg(e.target.files[0])} />
                                        </div>
                                        <FormField
                                            fieldType="input"
                                            inputType="text"
                                            label="Founder Name"
                                            value={ofoundername}
                                            handleChange={(e)=>setofoundername(e.target.value)}
                                        />
                                        <FormField
                                            fieldType="input"
                                            inputType="text"
                                            label="Founder Designation"
                                            value={ofounderdes}
                                            handleChange={(e)=>setofounderdes(e.target.value)}
                                        />
                                        <div className="text-center">
                                            <Button label="Add" disabled={!verifyFounderPopup()} btnType={"button"} handleClick={addOrganizationFounder} />
                                        </div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
            <Transition.Root show={addWidget} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setAddWidget}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-2xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">
											Create Page Widget
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setAddWidget(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
                                    <div className="bg-primary p-8">
                                        <p className="text-sm text-white">The careers widget is a simple list of your jobs embedded on a dedicated page on your website, such as your careers page. All you’ll need is access to the Content Management System (CMS) of your website, then follow the easy and simple steps mentioned below:</p>
                                    </div>
									<div className="p-8">
                                        <ul className="pl-4 list-disc text-sm">
                                            <li className="mb-4">
                                            Access the HTML on the webpage where you want the jobs to display.
                                            </li>
                                            <li className="mb-4">
                                            Copy the script tag mentioned below and paste it into the head section of your website.
                                                <div className="border rounded mt-2 flex">
                                                    <div className="w-[calc(100%-50px)] p-2 border-r flex items-center">
                                                        <p className="text-[12px]">
                                                            &lt;script src="https://app.somhakoats.com/asset-objects/careers-page-integration.js"&gt;&lt;/script&gt;
                                                        </p>
                                                    </div>
                                                    <button type="button" className="w-[50px] p-3">
                                                        <i className="fa-solid fa-copy"></i>
                                                    </button>
                                                </div>
                                            </li>
                                            <li className="mb-4">
                                            Copy the Somhako ATS jobs tag below and paste it within your HTML where you want the job list to display.
                                                <div className="border rounded mt-2 flex">
                                                    <div className="w-[calc(100%-50px)] p-2 border-r flex items-center">
                                                        <p className="text-[12px]">
                                                            &lt;somhakoats-jobs data-company-name="xyz" data-company-uuid="F0DADE07A7" data-careers-page="true"&gt; &lt;/somhakoats-jobs&gt;
                                                        </p>
                                                    </div>
                                                    <button type="button" className="w-[50px] p-3">
                                                        <i className="fa-solid fa-copy"></i>
                                                    </button>
                                                </div>
                                            </li>
                                            <li className="mb-4">
                                            Preview the page and publish.
                                            </li>
                                            <li className="mb-4">
                                            Done. Now all of your created jobs will reflect on the page where you added the widget.
                                            </li>
                                        </ul>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
            <Transition.Root show={addGalImages} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setAddGalImages}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-2xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">
											Add Gallery Images
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setAddGalImages(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
                                        <label htmlFor="addGallery" className="cursor-pointer border-2 border-dashed rounded-normal w-full min-h-[180px] flex items-center justify-center hover:bg-lightBlue dark:hover:bg-gray-700 mb-4">
                                            <i className="fa-solid fa-plus text-[80px] text-lightGray"></i>
                                            <input type="file" hidden id="addGallery" accept="image/*"
                                            onChange={onImageChange}
                                            multiple />
                                        </label>
                                        {ofile.length > 0 && 
                                        <ResponsiveMasonry
                                        columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
                                        >
                                            <Masonry>
                                                {ofile.map((imageSrc, i) => (
                                                    <div id={`gallerypopup${i}`}
                                                    key={i} className="relative">
                                                        <Image src={URL.createObjectURL(imageSrc)} height={100} width={100} alt="Gallery" className="w-full p-1" />
                                                        <button type="button" className="absolute right-2 top-2 text-red-500 hover:text-red-700 w-7 h-7 bg-white rounded-full text-sm" onClick={() => deleteUImage(i)}>
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </Masonry>
                                        </ResponsiveMasonry>
                                        }
                                        <div className="text-center">
                                            <Button 
                                            label="Add" disabled={!verifyGalPopup()} btnType={"button"} handleClick={saveGallery} />
                                        </div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
            <Transition.Root show={addGroups} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setAddGroups}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-2xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">
											Add Group
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setAddGroups(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
                                        <div className="text-center">
                                            <UploadProfile />
                                        </div>
                                        <FormField fieldType="input" inputType="text" label="Name of group" />
                                        <FormField fieldType="input" inputType="text" label="Group (Parent Organization)" />
                                        <div className="text-center">
                                            <Button label="Add" />
                                        </div>
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