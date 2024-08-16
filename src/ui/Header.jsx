import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";

function Header() {
  return (
    <header className="bg-yellow-500">
      <Link to="/">Fast react pizza company.</Link>
      <SearchOrder />
      <p>Pratiksha</p>
    </header>
  );
}

export default Header;
