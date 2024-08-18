import { Link , useNavigate } from "react-router-dom"

function LinkButton({children,to}) {
    const navigate = useNavigate();

    const className1='text-sm text-blue-500 hover:text-blue-900 hover:underline';

    if(to==="-1"){

        // console.log("error occured there");
        return(
            <button className={className1} onClick={() => navigate(-1)}>{children}</button>
        )
    }
    return (
        <Link to={to} className={className1}>
            {children}
        </Link>
    )
}

export default LinkButton
