import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { fetcherBlob } from "../../helper";
import './PriceImage.css'; // CSSファイルのインポート


interface Item {
  id: number;
  name: string;
  price: number;
  category_name: string;
}

interface PriceImageProps {
  price: string;
}

export const Item: React.FC<{ item: Item }> = ({ item }) => {
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
  }, [item]);

  return (
    <div>
      <h3>{item.name}</h3>
      <img
        src={itemImage}
        alt={item.name}
        height={300}
        width={300}
        onClick={() => navigate(`/item/${item.id}`)}
      />
      <div>
        <PriceImage price={`¥${item.price.toFixed(0)}`}/>
      </div>
    </div>
  );
};
