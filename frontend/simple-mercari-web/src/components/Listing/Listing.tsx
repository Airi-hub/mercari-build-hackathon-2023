import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { MerComponent } from "../MerComponent";
import { toast } from "react-toastify";

import { fetcher, getGetParams, getPostParams, handleGetError, handlePostError } from "../../helper";


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
export const Listing: React.FC = () => {
  const initialState = {
    name: "",
    category_id: 1,
    price: 0,
    description: "",
    image: "",
  };
  const [values, setValues] = useState<formDataType>(initialState);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cookies] = useCookies(["token", "userID"]);
  //Add the new state here

  const [newCategoryName, setNewCategoryName] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
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
    const data = new FormData();
    data.append("name", values.name);
    data.append("category_id", values.category_id.toString());
    data.append("price", values.price.toString());
    data.append("description", values.description);
    data.append("image", values.image);
    fetcher<{ id: number }>(`/items`, {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    })
      .then((res) => {
        sell(res.id);
      })
      .catch((error: Error) => {
        toast.error(error.message);
        console.error("POST error:", error);
      });
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


  const addNewCategory = async () => {
    const newCategory = await fetcher(`/items/new_category`, getPostParams({
      name: newCategoryName,
    }, cookies.token)).catch(handlePostError)
    if (newCategory) {
      setCategories(categories => [...categories, newCategory]); // Add the new category to the list
      setNewCategoryName(""); // Clear the new category name field
    }

  };
  useEffect(() => {
    fetchCategories();
  }, []);


  return <form onSubmit={onSubmit} className="component">
        <input
          className="input"
          type="text"
          name="name"
          placeholder="name"
          onChange={handleChange}
          required
        />
        <div className="p-2 border border-white rounded-md">
          <input // New category input field
          className="input"
          type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter new category"
          />
          <button type="button" onClick={addNewCategory}>Add Category</button>
        </div>
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
          onChange={handleChange}
          required
        />
        <input
          className="input"
          type="text"
          name="description"
          placeholder="description"
          onChange={handleChange}
          required
        />
        <input
          className="input"
          type="file"
          name="image"
          onChange={onFileChange}
          required
        />
        <button type="submit" className="button button-wide">
          List this item
        </button>
    </form>

};
