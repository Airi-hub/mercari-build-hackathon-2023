import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Item } from "../Item";

interface ItemShort {
  id: number;
  name: string;
  price: number;
  category_name: string;
}

interface Prop {
  items: ItemShort[];
}

export const UserItemList: React.FC<Prop> = (props) => {
  const navigate = useNavigate();
  return (
    <div className="wrapper">
      {props.items &&
        props.items.map((item) => {
          return (
            <div>
              <Item item={item} />
              <button onClick={() => navigate(`/edit/${item.id}`)} id="MerButton">
                Edit
              </button>
            </div>
          );

        })}
    </div>
  );
};