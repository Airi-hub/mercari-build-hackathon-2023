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
  const navigate = useNavigate();

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

  const CategoryListPage = (
    <div id="MerButtonContainer">
      <button onClick={() => navigate(`/category/0`)} id="MerButton">all</button>
      <button onClick={() => navigate(`/category/1`)} id="MerButton">food</button>
      <button onClick={() => navigate(`/category/2`)} id="MerButton">fashion</button>
      <button onClick={() => navigate(`/category/3`)} id="MerButton">furniture</button>
      <button onClick={() => navigate(`/category/4`)} id="MerButton">book</button>
    </div>
  );

  const itemListPage = (
    <div className="component">
      <ItemList items={items} />
    </div>
  );

  return <>{CategoryListPage}{itemListPage}</>;

};
