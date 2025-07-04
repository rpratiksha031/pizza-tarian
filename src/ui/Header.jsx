import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";
import Username from "../features/user/Username";

function Header() {
  return (
    <header className="bg-yellow-500 font-bold text-3xl uppercase px-4 py-4 border-b border-stone-200 sm:px-6 flex justify-between items-center">
      <Link to="/" className="tracking-widest">Pizza-tarian</Link>
      <SearchOrder />
    <Username/>
    </header>
  );
}

export default Header;
