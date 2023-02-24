export default function Button(props: any) {
    return (
        <>
            <button 
            type={props.btnType ? props.btnType : 'button'} 
            className={`my-2 bg-gradient-to-b from-[#9290FC] to-[#6A67EA] hover:from-[#6A67EA] hover:to-[#6A67EA] text-white py-2 px-4 rounded font-bold disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed` + ' ' + (props.full ? 'w-full' : 'w-auto')}
            disabled={props.disabled}
            >
                {props.label}
                {
                    props.loader
                    ?
                    <i className="fa-solid fa-spinner fa-spin-pulse ml-2"></i>
                    :
                    ''
                }
            </button>
        </>
    )
}