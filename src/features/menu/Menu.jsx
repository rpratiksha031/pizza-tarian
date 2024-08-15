import { getMenu } from "../../services/apiRestaurant";
import MenuItem from "./MenuItem";
import { useLoaderData } from "react-router-dom";

function Menu() {
  const menu = useLoaderData();
  console.log(menu);
  return (
    <ul>
      {" "}
      {menu.map((pizza) => (
        <MenuItem pizza={pizza} key={pizza.id} />
      ))}
    </ul>
  );
}

export async function loader() {
  const menu = await getMenu();
  console.log("loader", loader);
  return menu;
}

export default Menu;
