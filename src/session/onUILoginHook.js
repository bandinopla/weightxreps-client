import React, { createContext, useContext } from "react";

const uiLoginContext = createContext();

/**
 * @typedef {Object} UILoginProps
 * @property {React.ReactNode} children 
 * @property {(sessionToken:string)=>void} hook 
 */

/** 
 * @param {UILoginProps} param0  
 */
export const UILoginContext = ({ children, hook })=><uiLoginContext.Provider value={hook}>{children}</uiLoginContext.Provider>;


/**
 * 
 * @returns {UILoginProps["hook"]}
 */
export const useUILoginHook = ()=>{
    let hook = useContext(uiLoginContext);
    return hook;
}