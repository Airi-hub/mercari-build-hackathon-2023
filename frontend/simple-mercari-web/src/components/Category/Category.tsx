import { Login } from "../Login";
import { Signup } from "../Signup";
import { ItemList } from "../ItemList";
import { useCookies } from "react-cookie";
import { MerComponent } from "../MerComponent";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetcher } from "../../helper";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

interface Item {
  id: number;
  name: string;
  price: number;
  category_name: string;
}
export const Category = () => {
  const [cookies] = useCookies(["userID", "token"]);
  const [items, setItems] = useState<Item[]>([]);
  var currentURL = window.location.href;
  var parts = currentURL.split("/");
  var category_id = parts[parts.length - 1];

  const fetchItems = () => {
    fetcher<Item[]>(`/category/${category_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((data) => {
        console.log("GET success:", data);
        setItems(data);
      })
      .catch((err) => {
        console.log(`GET error:`, err);
        toast.error(err.message);
      });
  };

  useEffect(() => {
    fetchItems();
  }, [currentURL]);

  const signUpAndSignInPage = (
    <>
      <div>
        <Signup />
      </div>
      or
      <div>
        <Login />
      </div>
    </>
  );

  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const itemListPage = (
    <MerComponent>
      <div>
        <span>
          <p>Logined User ID: {cookies.userID}</p>
          <label id="MerInputLabel">Search </label>
          <input
          type="MerTextInput"
          name="keyword"
          required
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          />
          <button onClick={() => navigate(`/search?name=${keyword}`)} id="MerButton">
          Search
        </button>
        <div id="MerButtonContainer">
        <button onClick={() => navigate(`/category/0`)} id="MerButton">all</button>
          <button onClick={() => navigate(`/category/1`)} id="MerButton">fashion</button>
          <button onClick={() => navigate(`/category/2`)} id="MerButton">food</button>
          <button onClick={() => navigate(`/category/3`)} id="MerButton">book</button>
        </div>
        </span>
        <ItemList items={items} />
      </div>
    </MerComponent>
  );


  return <>{cookies.token ? itemListPage : signUpAndSignInPage}</>;
};
