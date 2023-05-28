import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { MerComponent } from "../MerComponent";
import { fetcher, fetcherBlob, getGetParams, getPostParams, handleGetError, handlePostError } from "../../helper";

const ItemStatus = {
  ItemStatusInitial: 0,
  ItemStatusOnSale: 1,
  ItemStatusSoldOut: 2,
} as const;

type ItemStatus = (typeof ItemStatus)[keyof typeof ItemStatus];

interface Item {
  id: number;
  name: string;
  category_id: number;
  category_name: string;
  user_id: number;
  price: number;
  status: ItemStatus;
  description: string;
}

export const ItemDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [item, setItem] = useState<Item>();
  const [itemImage, setItemImage] = useState<Blob>();
  const [cookies] = useCookies(["token", "userID"]);

  const fetchItem = async () => {
    const res = await fetcher<Item>(`/items/${params.id}`, getGetParams()).catch(handleGetError)
    if (res) {
        console.log("GET success:", res);
        setItem(res);
    }

    const resBlob = await fetcherBlob(`/items/${params.id}/image`, getGetParams()).catch(handleGetError)
    if (resBlob) {
        console.log("GET success:", res);
        setItemImage(resBlob);
    }
  };

  const onSubmit = async (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const res = await fetcher<Item[]>(`/purchase/${params.id}`, getPostParams({
        user_id: Number(cookies.userID),
      }, cookies.token)).catch(handlePostError)
      window.location.reload()
  };

  useEffect(() => {
    fetchItem();
  }, []);

  return (
    <div className="component">
      <MerComponent condition={() => item !== undefined}>
        {item && itemImage && (
          <div>
            <img
              height={480}
              width={480}
              src={URL.createObjectURL(itemImage)}
              alt="item"
              onClick={() => navigate(`/item/${item.id}`)}
            />
            <div className="grid grid-cols-2">
              <span>Item Name:</span><span>{item.name}</span>
              <span>Price:</span><span>{item.price}</span>
              <span>UserID:</span><span>{item.user_id}</span>
              <span>Category:</span><span>{item.category_name}</span>
              <span>Description:</span><span>{item.description}</span>
            </div>
            {item.status == ItemStatus.ItemStatusSoldOut ? (
              <button disabled={true} onClick={onSubmit} className="button">
                SoldOut
              </button>
            ) : (
              <button onClick={onSubmit} className="button">
                Purchase
              </button>
            )}
          </div>
        )}
      </MerComponent>
    </div>
  );
};
