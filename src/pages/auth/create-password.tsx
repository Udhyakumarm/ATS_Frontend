import Button from "@/components/Button";
import FormField from "@/components/FormField";
import Logo from "@/components/Logo";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useLangStore } from "@/utils/code";

export default function CreatePassword() {
	const { t } = useTranslation('common')
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	return (
		<>
			<Head>
				<title>{srcLang === 'ja' ? 'パスワードを設定' : 'Create Password'}</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<main className="py-8">
				<div className="mx-auto w-full max-w-[550px] px-4">
					<div className="mb-4 text-center">
						<Logo width={180} />
					</div>
					<div className="min-h-[400px] rounded-large bg-white p-6 shadow-normal dark:bg-gray-800 md:px-12 md:py-8">
						<h1 className="mb-6 text-3xl font-bold">
						{srcLang === 'ja' ? 'パスワードを設定' : <>Create <span className="text-primary">Password</span></>}
						</h1>
						<FormField fieldType="input" inputType="password" label={t('NewPassword')} />
						<FormField fieldType="input" inputType="password" label={t('ConfirmPassword')} />
						<div className="mb-4">
							<Button btnType="submit" label={t('Btn.Submit')} full={true} loader={false} disabled={false} />
						</div>
						<p className="text-center text-darkGray">
							{srcLang === 'ja' ? 'アカウント作成がまだの方は' : 'Already have an Account?'}{" "}
							<Link href={"/auth/signin"} className="font-bold text-primary hover:underline">
								{srcLang === 'ja' ? 'こちら' : 'Sign In'}
							</Link>
						</p>
					</div>
				</div>
			</main>
		</>
	);
}

export async function getServerSideProps({ context, locale }:any) {
	const translations = await serverSideTranslations(locale, ['common']);
	return {
		props: {
		...translations
		},
	};
}

CreatePassword.noAuth = true;
