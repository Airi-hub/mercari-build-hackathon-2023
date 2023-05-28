import { Login } from "../Login";
import { Signup } from "../Signup";
import { ItemList } from "../ItemList";
import { useCookies } from "react-cookie";
import { MerComponent } from "../MerComponent";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetcher } from "../../helper";
import { useParams, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

interface Item {
  id: number;
  name: string;
  price: number;
  category_name: string;
}
export const SearchResults = () => {
  var currentURL = window.location.href;
  const [cookies] = useCookies(["userID", "token"]);
  const [items, setItems] = useState<Item[]>([]);
  var name = currentURL.substring(currentURL.indexOf("=") + 1);

  const fetchItems = () => {
    fetcher<Item[]>(`/search?name=${name}`, {
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
  var [keyword, setKeyword] = useState("");
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
        </span>
        <ItemList items={items} />
      </div>
    </MerComponent>
  );


  return <>{cookies.token ? itemListPage : signUpAndSignInPage}</>;
};
