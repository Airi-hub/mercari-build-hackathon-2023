import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Home } from "./components/Home";
import { ItemDetail } from "./components/ItemDetail";
import { UserProfile } from "./components/UserProfile";
import { Listing } from "./components/Listing";
import { SearchResults } from "./components/SearchResults";
import { EditItem } from "./components/EditItem";
import { Category } from "./components/Category";
import "./App.css";
import { Header } from "./components/Header/Header";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppContextProvider, { RequireLoggedInUser } from "./contexts/AppContext";
import { Footer } from "./components/Footer/Footer";

export const App: React.VFC = () => {

  
  return <>
    <ToastContainer position="bottom-center" />
    <div className="h-full grid grid-rows-frame">
      <AppContextProvider>
        <BrowserRouter>
          <Header />
          <div className="overflow-scroll">
            <RequireLoggedInUser>
              <div className="p-4 flex justify-center">
                <Routes>
                  <Route index element={<Home />} />
                  <Route path="/item/:id" element={<ItemDetail />} />
                  <Route path="/user/:id" element={<UserProfile />} />
                  <Route path="/sell" element={<Listing />} />
                  <Route path="/search/:name" element={<Home />} />
                  <Route path="/edit/:id" element={<Listing edit />} />
                  <Route path="/category/:id" element={<Category />} />
                </Routes>
              </div>
            </RequireLoggedInUser>
          </div>
          <Footer />
        </BrowserRouter>
      </AppContextProvider>
    </div>
  </>

};
