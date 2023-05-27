import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { fetcher } from "../../helper";

export const Signup = () => {
  const [name, setName] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [userID, setUserID] = useState<number>();
  const [_, setCookie] = useCookies(["userID"]);

  const navigate = useNavigate();

  return (
    <div>
      <div className="Signup">
        <label id="MerInputLabel">User Name</label>
        <input
          type="text"
          name="name"
          id="MerTextInput"
          placeholder="name"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
          }}
          required
        />
        <label id="MerInputLabel">Password</label>
        <input
          type="password"
          name="password"
          id="MerTextInput"
          placeholder="password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value);
          }}
        />
        <button id="MerButton">
          Signup
        </button>
        {userID ? (
          <p>Use "{userID}" as UserID for login</p>
        ) : null}
      </div>
    </div>
  );
};
