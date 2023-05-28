import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";

import { fetcher, getGetParams, getPostParams, handleGetError, handlePostError } from "../../helper";
import { ItemList } from "../ItemList";

export const UserProfile: React.FC = () => {
  const [items, setItems] = useState<ItemShort[]>([]);
  const [balance, setBalance] = useState<number>();
  const [addedbalance, setAddedBalance] = useState<number>();
  const [cookies] = useCookies(["token"]);
  const params = useParams();

  const fetchItems = async () => {
    const items = await fetcher<ItemShort[]>(`/users/${params.id}/items`, getGetParams(cookies.token)).catch(handleGetError)
    if (items) setItems(items)
  };

  const fetchUserBalance = async () => {
    const res = await fetcher<{ balance: number }>(`/balance`, getGetParams(cookies.token)).catch(handleGetError)
    if (res) setBalance(res.balance);
  };

  useEffect(() => {
    fetchItems();
    fetchUserBalance();
  }, []);

  const onBalanceSubmit = async () => {
    const res = await fetcher(`/balance`, getPostParams({
        balance: addedbalance,
      }, cookies.token)).catch(handlePostError)
    window.location.reload()
  };

  return (
      <div className="component">
        <div>
          <div className="border border-white rounded-md p-2 bg-theme-700 flex flex-col gap-2">
            
            <h2>
              <span>Balance: {balance}</span>
            </h2>
            <input
              className="input"
              type="number"
              name="balance"
              placeholder="0"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setAddedBalance(Number(e.target.value));
              }}
              required
            />
            <button onClick={onBalanceSubmit} className="button button-wide">
              Add balance
            </button>
          </div>

          <div>
            <h2>Item List</h2>
            {<ItemList items={items} edit />}
          </div>
        </div>
      </div>
  );
};
