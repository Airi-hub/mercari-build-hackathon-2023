import React, { useContext, useReducer } from "react"
import { useCookies } from "react-cookie";
import { fetcher, getPostParams, handlePostError } from "../helper";
import { toast } from "react-toastify";
import { Login } from "../components/Login";

export interface AppContextInterface {
    /** States of application. */
    state: KeyValues,
    /** Dispatcher to change state */
    dispatch: React.Dispatch<KeyValues>;
    signup: (values: KeyValues) => Promise<number | undefined>
    login: (values: KeyValues) => void
    logout: () => void
}
interface Tokens {
    id: number;
    name: string;
    token: string
}

const AppContext = React.createContext<AppContextInterface>({ state: {}, dispatch: () => { }, signup: async () => undefined, login: () => { }, logout: () => { } });

export const useAppContext = () => {
    const appContext = useContext(AppContext);
    if (appContext == null) throw new Error("useAppContext() called outside of a AppContext?");
    return appContext
}

export const RequireLoggedInUser = ({ children }: { children: JSX.Element|JSX.Element[] }): JSX.Element => {
    const [cookies] = useCookies(["token"]);
    return cookies.token ? <>{children}</> : <Login />
};


const AppContextProvider = ({ children }: { children: JSX.Element|JSX.Element[] }) => {
    const [state, dispatch] = useReducer(
        (state: KeyValues, action: KeyValues) => ({
            ...state,
            ...action,
        }), {
        userID: ""
    });
    const [_, setCookie, removeCookie] = useCookies(["name", "userID", "token"]);
    const setCookies = (cookies:{name?:string, userID?:number, token?:string}) => (Object.keys(cookies) as ("name"|"userID"|"token")[]).forEach(key => setCookie(key, cookies[key], { path: '/' }))
    const removeCookies = (cookies:("name"|"userID"|"token")[]) => cookies.forEach(cookie => removeCookie(cookie, { path: '/' }))

    const signup = async (values: KeyValues) => {
        const user = await fetcher<{ id: number; name: string }>(`/register`, getPostParams({
            name: values.name,
            password: values.password,
        })).catch(handlePostError);
        if (!user) return
        toast.success("New account is created!");
        console.log("POST success:", user.id);
        setCookie("userID", user.id);
        return user.id;
    };


    const login = async (values: KeyValues) => {
        const user = await fetcher<Tokens>(`/login`, getPostParams(values)).catch(handlePostError);
        if (!user) return
        toast.success("Signed in!");
        console.log("POST success:", user.id);
        setCookies({
            name: user.name,
            userID: user.id,
            token: user.token
        });
        dispatch({ userID: user.id });
    };

    const logout = () => {
        removeCookies(["name", "userID", "token"]);
        dispatch({ userID: "" });
    };

    return <AppContext.Provider value={{ state, dispatch, signup, login, logout }}>{children}</AppContext.Provider>;
};
export default AppContextProvider