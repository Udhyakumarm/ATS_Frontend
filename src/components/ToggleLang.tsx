import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useLangStore } from '@/utils/code'

const languages = [
  { name: 'en', locale: 'en' },
  { name: 'ja', locale: 'ja' },
]

export default function ToggleLang() {
  const [selectedLanguages, setLanguages] = useState(languages[0])
  const router = useRouter();

  const lang = useLangStore((state: { lang: any }) => state.lang);

  const setlang = useLangStore((state: { setlang: any }) => state.setlang);
  
  useEffect(()=> {
    setlang(router.locale)
  }, [router])

  return (
    <div className="relative inline-block">
      <Listbox value={selectedLanguages} onChange={setLanguages}>
        <div className="relative">
          <Listbox.Button className="flex items-center w-[50px] text-darkGray dark:text-gray-400 text-sm">
            <span className="block truncate uppercase leading-1 mr-2">{lang}</span>
            <i className='fa-solid fa-angle-down'></i>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute w-[150px] top-[100%] right-0 mt-1 max-h-60 overflow-auto rounded-md bg-primary py-1 shadow-normal ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {languages.map((item, itemIdx) => (
                <Listbox.Option
                className={({ active }) =>
                    `relative text-left cursor-pointer select-none py-2 pl-10 pr-4 block hover:bg-indigo-500 hover:text-white ${
                    active ? 'bg-indigo-500 text-white' : 'text-white'
                    }`
                }
                value={item}
                key={itemIdx}
                as={Link}
                href={router.asPath} 
                locale={item.locale}
                >
                  <span
                      className={`block truncate uppercase ${
                      lang === item.name ? 'font-medium' : 'font-normal'
                      }`}
                  >
                      {item.name}
                  </span>
                  {lang === item.name ? (
                      <span className={`absolute inset-y-0 left-0 flex items-center pl-3 text-white`}>
                        <i className='fa-solid fa-check'></i>
                      </span>
                  ) : null}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}