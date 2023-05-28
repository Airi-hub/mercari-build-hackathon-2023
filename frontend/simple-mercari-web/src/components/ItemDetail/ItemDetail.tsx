import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { MerComponent } from "../MerComponent";
import { fetcher, fetcherBlob, getGetParams, getPostParams, handleGetError, handlePostError } from "../../helper";

const ItemStatuses = {
  ItemStatusInitial: 0,
  ItemStatusOnSale: 1,
  ItemStatusSoldOut: 2,
} as const;

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

  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleShowMore = () => {
    setShowFullDescription(true);
  };

  const formatDescription = (description: string): React.ReactNode => {
    const maxLength = 30;
    if (description.length <= maxLength) {
      return description;
    }
    return (
      <>
        {description.slice(0, maxLength)}
        <br />
        {formatDescription(description.slice(maxLength))}
      </>
    );
  };

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
            <div className="product">

            <span><h2 className="product-name">{item.name}</h2></span>
            <div className="product-details">
              <p className="product-price">¥{item.price}</p>
            </div>
            <div className="product-information">商品の情報</div>
            <div className="product-description">
              <p className="product-category">カテゴリー: {item.category_name}</p>
              <p>
                {showFullDescription
                  ? item.description
                  : formatDescription(item.description)}
              </p>
            </div>

            </div>
            {item.status === ItemStatuses.ItemStatusSoldOut ? (
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
