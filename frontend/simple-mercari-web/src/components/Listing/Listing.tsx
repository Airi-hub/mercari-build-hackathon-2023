import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

import { fetcher, fetcherBlob, getGetParams, getPostParams, handleGetError, handlePostError } from "../../helper";
import { useParams } from "react-router-dom";


interface Category {
  id: number;
  name: string;
}
type formDataType = {
  name: string;
  category_id: number;
  price: number;
  description: string;
  image: string | File;
};
export const Listing: React.FC<{ edit?: boolean }> = ({ edit }) => {
  const initialState = {
    name: "",
    category_id: 1,
    price: 0,
    description: "",
    image: "",
  };
  const params = useParams()
  const [values, setValues] = useState<formDataType>(initialState);
  const [categories, setCategories] = useState<Category[]>([]);
  const [itemImage, setItemImage] = useState<Blob>();
  const [cookies] = useCookies(["token", "userID"]);
  //Add the new state here

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues(values => ({

      ...values,
      [event.target.name]: event.target.value,
    }));
  };
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.files![0],
    });
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    edit ? update() : insert()
  }
  const insert = async () => {
    const data = new FormData();
    data.append("name", values.name);
    data.append("category_id", values.category_id.toString());
    data.append("price", values.price.toString());
    data.append("description", values.description);
    data.append("image", values.image);
    const res = await fetcher<{ id: number }>(`/items`, {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    }).catch(handlePostError)
    if (res) sell(res.id);
  };

  const update = async () => {
    const data = new FormData();
    data.append("name", values.name);
    data.append("category_id", values.category_id.toString());
    data.append("price", values.price.toString());
    data.append("description", values.description);
    const res = await fetcher<{ id: number }>(`/items/${params.id}`, {
      method: "PUT",
      body: data,
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    }).catch(handlePostError)
    if (res) toast.success('Item updated successfully')
  };

  const sell = async (itemID: number) => {
    const response = await fetcher(`/sell`, getPostParams({
      item_id: itemID,
    }, cookies.token)).catch(handlePostError)
    if (response) toast.success("Item added successfully!");
  }
  const fetchCategories = async () => {
    const items = await fetcher<Category[]>(`/items/categories`, getGetParams()).catch(handleGetError)
    if (items) setCategories(items)
  };
  const fetchItem = async () => {
    const res = await fetcher<Item>(`/items/${params.id}`, getGetParams()).catch(handleGetError)
    if (res) {
      console.log("GET success:", res);
      setValues(values => ({ ...values, ...res }));
    }

    const resBlob = await fetcherBlob(`/items/${params.id}/image`, getGetParams()).catch(handleGetError)
    if (resBlob) {
      console.log("GET success:", res);
      setItemImage(resBlob);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (edit) fetchItem();
  }, []);
  console.log(values)
  return <form onSubmit={onSubmit} className="component">
    {edit && itemImage && <img
      height={480}
      width={480}
      src={URL.createObjectURL(itemImage)}
      alt="item"
    />}

    <input
      className="input"
      type="text"
      name="name"
      placeholder="name"
      value={values.name}
      onChange={handleChange}
      required
    />
    <select
      className="input"
      name="category_id"
      value={values.category_id}
      onChange={handleChange}
    >
      {categories &&
        categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
    </select>
    <input
      className="input"
      type="number"
      name="price"
      placeholder="price"
      value={values.price}
      onChange={handleChange}
      required
    />
    <input
      className="input"
      type="text"
      name="description"
      placeholder="description"
      value={values.description}
      onChange={handleChange}
      required
    />
    {!edit && <input
      className="input"
      type="file"
      name="image"
      onChange={onFileChange}
      required
    />}
    <button type="submit" className="button button-wide">
      {`${edit ? 'Update' : 'List'} this item`}
    </button>
  </form>

};
