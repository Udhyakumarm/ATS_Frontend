import Button from "@/components/button"
import FormField from "@/components/formfield"
import Logo from "@/components/logo"
import Head from "next/head"
import Link from "next/link"

export default function Forgot() {
    return (
        <>
            <Head>
                <title>Forgot</title>
                <meta name="description" content="Generated by create next app" />
            </Head>
            <main className='py-8'>
                <div className='w-full max-w-[550px] mx-auto px-4'>
                    <div className='text-center mb-4'>
                        <Logo width={180} />
                    </div>
                    <div className='bg-white dark:bg-gray-800 rounded-large shadow-normal min-h-[400px] p-6 md:py-8 md:px-12'>
                        <h1 className='font-bold text-3xl mb-6'>Forgot <span className='text-primary'>Password</span></h1>
                        <FormField fieldType="input" inputType="email" label="Email" icon={<i className="fa-regular fa-envelope"></i>} required />
                        <div className='mb-4'>
                            <Button btnType="submit" label="Submit" full={true} loader={false} disabled={false} />
                        </div>
                        <p className='text-center text-darkGray'>
                            Already have an Account? <Link href={'/auth/signin'} className="text-primary hover:underline font-bold">Sign In</Link>
                        </p>
                    </div>
                </div>
            </main>
        </>
    )
}