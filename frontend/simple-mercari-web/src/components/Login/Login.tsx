import React, { useState } from "react";
import { useAppContext } from "../../contexts/AppContext";

interface Values {
  name: string | undefined
  user_id: number | undefined,
  password: string | undefined
}

export const Login = () => {
  const app = useAppContext()
  const [signup, setSignup] = useState<boolean>(false)
  const [values, setValues] = useState<Values>({ name: undefined, user_id: undefined, password: undefined });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setValues(values => ({ ...values, [e.target.name]: e.target.type === "number" ? Number(e.target.value) : e.target.value }))
  const handleSubmit = async () => {
    if (!signup) app.login(values)
    else {
      const id = await app.signup(values)
      setValues(values => ({ ...values, user_id: id }))
    }
  }
  return <div className="p-4 flex justify-center">
    <div className="component">
      <div className="pb-4 text-xl font-bold text-theme-500">{signup ? 'Signup' : 'Login'}</div>
      <label className="label">{signup ? 'User Name' : 'User ID'}</label>
      <input
        className="input"
        type={signup ? 'text' : 'number'}
        name={signup ? 'name' : 'user_id'}
        id="MerTextInput"
        placeholder={signup ? 'User Name' : 'User ID'}
        onChange={handleChange}
        required
      />
      <label className="label">Password</label>
      <input
        className="input"
        type="password"
        name="password"
        id="MerTextInput"
        placeholder="password"
        onChange={handleChange}
      />
      <button className="my-2 button" onClick={handleSubmit}>
        {signup ? 'Signup' : 'Login'}
      </button>
      {signup && values.user_id ? (
        <p>Use "{values.user_id}" as UserID for login</p>
      ) : null}
      <div className="text-theme-500 cursor-pointer" onClick={() => setSignup(signup => !signup)}>{signup ? 'Already have account? Login here' : "Don't have account? Signup here"}</div>
    </div>
  </div>
};
