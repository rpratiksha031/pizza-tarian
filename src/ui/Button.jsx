import { Link } from "react-router-dom"

function Button({children,disabled,to,type}) {

    const className1="bg-yellow-400 uppercase font-semibold text-stone-800 py-3 px-4 inline-block tracking-wide rounded-full hover:bg-yellow-300 transition-all-clors duration-300 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed sm:px-6 sm:py-4";
   


    const base=
    " text-sm bg-yellow-400 uppercase font-semibold text-stone-800  inline-block tracking-wide rounded-full hover:bg-yellow-300 transition-all-clors duration-300 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed";


    const styles={
        primary:base+' md:px-6 md:py-4 py-3 px-4',
        small:base+' sm:px-5 sm:py-2.5 py-2 px-4 text-xs',
        secondary: " text-sm bg-transperent text-stone-400 border-2 uppercase font-semibold  inline-block tracking-wide rounded-full hover:bg-stone-300 transition-all-colors duration-300 focus:outline-none focus:ring focus:ring-stone-200 focus:ring-offset-2 disabled:cursor-not-allowed md:px-6 md:py-3.5 py-2.5 px-4 hover:text-stone-800"
        
   }

    if (to){
        return<Link to={to}className={styles[type]}>{children}</Link>
    }
    return (
        <button
        disabled={disabled}
            className={styles[type]}>
                {children}
        </button>
    )
}

export default Button
