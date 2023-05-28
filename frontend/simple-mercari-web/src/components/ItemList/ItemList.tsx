import React from "react";
import { Item } from "../Item/Item";

interface Prop {
  items: ItemShort[];
  edit?: boolean;
}

export const ItemList: React.FC<Prop> = (props) => {
  return (
    <div className="w-full sm:flex sm:flex-wrap sm:gap-5 sm:justify-center sm:items-center">
      {props.items &&
        props.items.map((item, i) => {
          return <div key={i} className="basis-64 grow-0 shrink-0"><Item item={item} edit={props.edit} /></div>;
        })}
    </div>
  );
};
