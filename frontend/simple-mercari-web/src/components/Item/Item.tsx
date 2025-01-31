import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { fetcherBlob } from "../../helper";
import './PriceImage.css'; // CSSファイルのインポート


interface PriceImageProps {
  price: string;
}

export const Item: React.FC<{ item: ItemShort, edit?:boolean }> = ({ item, edit }) => {

  const navigate = useNavigate();
  const [itemImage, setItemImage] = useState<string>("");
  const [cookies] = useCookies(["token"]);

  const PriceImage: React.FC<PriceImageProps> = ({price }) => {
    return (
      <div className="price-image-container">
        <div className="price-tag">{price}</div>
      </div>
    );
  };

  async function getItemImage(itemId: number): Promise<Blob> {
    return await fetcherBlob(`/items/${itemId}/image`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    });
  }

  useEffect(() => {
    async function fetchData() {
      const image = await getItemImage(item.id);
      setItemImage(URL.createObjectURL(image));
    }

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  return (
    <div>
      <h3 style={{ fontSize: '25px' }}>{item.name}</h3>
      <img
        className="w-full sm:w-64 aspect-square object-cover"
        src={itemImage}
        alt={item.name}
        onClick={() => navigate(`/${edit ? 'edit' : 'item'}/${item.id}`)}
      />
      <div>
        <PriceImage price={`¥${item.price.toFixed(0)}`}/>
      </div>
    </div>
  );
};