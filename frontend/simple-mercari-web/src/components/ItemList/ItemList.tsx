import React from "react";
import { Item } from "../Item";
interface Item {
  id: number;
  name: string;
  price: number;
  category_name: string;
}

interface Prop {
  items: Item[];
}

export const ItemList: React.FC<Prop> = (props) => {
  return (
    <div className="w-full sm:flex sm:flex-wrap sm:gap-1" >
      {props.items &&
        props.items.map((item) => {
          return <div className="basis-64 grow-0 shrink-0"><Item item={item} /></div>;
        })}
    </div>
  );
};
