import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { MerComponent } from "../MerComponent";
import { toast } from "react-toastify";
import { fetcher } from "../../helper";

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

export const EditItem = () => {
  var currentURL = window.location.href;
  var parts = currentURL.split("/");
  var item_id = parts[parts.length - 1];

  const initialState = {
    name: "",
    category_id: 1,
    price: 0,
    description: "",
    image: "",
  };
  const [values, setValues] = useState<formDataType>(initialState);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cookies] = useCookies(["userID", "token"]);

  //Add the new state here
  const [newCategoryName, setNewCategoryName]=useState("");

  const onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
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

    // fetcher(`/items/${item_id}`, {
    //   method: "PUT",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${cookies.token}`,
    //   },
    //   body: JSON.stringify({
    //     item_id: item_id,
    //   }),
    // })
    //   .then((_) => {
    //     toast.success("Item added successfully!");
    //   })
    //   .catch((error: Error) => {
    //     toast.error(error.message);
    //     console.error("PUT error:", error);
    //   });}

    fetcher<{ id: number }>(`/items/${item_id}`, {
      method: "PUT",
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

  const sell = (itemID: number) =>
    fetcher(`/sell`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
      body: JSON.stringify({
        item_id: itemID,
      }),
    })
      .then((_) => {
        toast.success("Item added successfully!");
      })
      .catch((error: Error) => {
        toast.error(error.message);
        console.error("POST error:", error);
      });


    

  const fetchCategories = () => {
    fetcher<Category[]>(`/items/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((items) => setCategories(items))
      .catch((err) => {
        console.log(`GET error:`, err);
        toast.error(err.message);
      });
  };


  const addNewCategory = () => {
    fetcher(`/items/new_category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
      body: JSON.stringify({
        name: newCategoryName,
      }),
    })
      .then((newCategory) => {
        setCategories([...categories, newCategory]); // Add the new category to the list
        setNewCategoryName(""); // Clear the new category name field
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <MerComponent>
      <div className="Listing">
        <form onSubmit={onSubmit} className="ListingForm">
          <div>
            <input
              type="text"
              name="name"
              id="MerTextInput"
              placeholder="name"
              onChange={onValueChange}
              required
            />
            <div>  
              <input // New category input field
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter new category"
              />
              <button type="button" onClick={addNewCategory}>Add Category</button>
            </div>
            <select
              name="category_id"
              id="MerTextInput"
              value={values.category_id}
              onChange={onSelectChange}
            >
              {categories &&
                categories.map((category) => {
                  return <option value={category.id}>{category.name}</option>;
                })}
            </select>
            <input
              type="number"
              name="price"
              id="MerTextInput"
              placeholder="price"
              onChange={onValueChange}
              required
            />
            <input
              type="text"
              name="description"
              id="MerTextInput"
              placeholder="description"
              onChange={onValueChange}
              required
            />
            <input
              type="file"
              name="image"
              id="MerTextInput"
              onChange={onFileChange}
              required
            />
            <button type="submit" id="MerButton">
              List this item
            </button>
          </div>
        </form>
      </div>
    </MerComponent>
  );
};
