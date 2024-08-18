import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";
import Username from "../features/user/Username";

function Header() {
  return (
    <header className="bg-yellow-500 uppercase px-4 py-4 border-b border-stone-200 sm:px-6 flex justify-between items-center">
      <Link to="/" className="tracking-widest">Fast react pizza company.</Link>
      <SearchOrder />
    <Username/>
    </header>
  );
}

export default Header;
