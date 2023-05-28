import { ItemList } from "../ItemList";
import { useEffect, useState } from "react";
import { fetcher, getGetParams, handleGetError } from "../../helper";
import "react-toastify/dist/ReactToastify.css";
import { Link, useLocation, useParams } from "react-router-dom";

export const Home = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get('name');
  const { id } = useParams();
  const [items, setItems] = useState<ItemShort[]>([]);
  const fetchItems = async () => {
    const data = await fetcher<ItemShort[]>(`/items`, getGetParams()).catch(handleGetError)
    if (data) {
      console.log("GET success:", data);
      setItems(data);
    }
  };

  const fetchCategoryItems = async () => {
    const data = await fetcher<Item[]>(`/category/${id}`, getGetParams()).catch(handleGetError)
    if (data) {
      console.log("GET success:", data);
      setItems(data);
    } else if (data === null) {
      console.log("GET returned no data")
      setItems([])
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
    else if (id) fetchCategoryItems();
    else fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, id]);

  const categories = ["all", "food", "fashion", "furniture", "book"];
  const itemListPage = <div className="flex flex-col items-center">
    <div className="tab-group">
      <ul className="flex flex-wrap -mb-px">
        {categories.map((category, i) => <li key={category} className="mr-2">
          <Link to={`/category/${i}`} className={`tab${Number(id) === i ? ' tab-active' : ''}`}>
            {category}
          </Link>
        </li>)}
      </ul>
    </div>
    <div className="component">
      <ItemList items={items} />
    </div>
  </div>;

return <>{itemListPage}</>;

};
