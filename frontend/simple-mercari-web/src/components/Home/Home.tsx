import { Login } from "../Login";
import { Signup } from "../Signup";
import { ItemList } from "../ItemList";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { fetcher, getGetParams, handleGetError } from "../../helper";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

export const Home = () => {
  const [cookies] = useCookies(["userID", "token"]);
  const { name } = useParams()
  const [items, setItems] = useState<ItemShort[]>([]);
  console.log(name)

  const fetchItems = async () => {
    const data = await fetcher<ItemShort[]>(`/items`, getGetParams()).catch(handleGetError)
    if (data) {
        console.log("GET success:", data);
        setItems(data);
    }
  };

  const searchItems = async () => {
    const data = await fetcher<ItemShort[]>(`/search?name=${name}`, getGetParams()).catch(handleGetError)
    if (data) {
        console.log("GET success:", data);
        setItems(data);
    }
  };

  useEffect(() => {
    if (name) searchItems();
    else fetchItems();
  }, [name]);

  const itemListPage = (
    <div className="component">
      <ItemList items={items} />
    </div>
  );

  return <>{itemListPage}</>;

};
