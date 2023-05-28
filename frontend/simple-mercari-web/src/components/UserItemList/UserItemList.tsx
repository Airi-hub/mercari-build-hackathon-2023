import React from "react";
import { Item } from "../Item";
import { useParams, useNavigate } from "react-router-dom";

interface Item {
  id: number;
  name: string;
  price: number;
  category_name: string;
}

interface Prop {
  items: Item[];
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