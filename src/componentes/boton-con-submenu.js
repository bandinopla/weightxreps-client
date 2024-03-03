import { Button, Menu } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';


const SubmenuContext = React.createContext(); 

/**
 * HOW TO CLOSE? ---> submenu debe emitir un evento de tipo click con .closeMenu = true
 */
 export const BotonConSubmenu = ({ UseButton, submenu, startIcon, children }) => {

    const [anchorEl, setAnchorEl]   = React.useState(null);
    const menuAnchor                = React.createRef();
    const contentDiv                = React.createRef();
    const [onOpenListeners]         = React.useState([]);
    const [onExitListeners]         = React.useState([]);
    const ButtonClass = UseButton ?? Button;


    const handleClick = (event) => { 
        setAnchorEl( menuAnchor.current); //event.currentTarget); 
    }; 

    const addOnOpenListener = f => { 
        onOpenListeners.push(f);
        return ()=>onOpenListeners.splice( onOpenListeners.indexOf(f),1 );
    }

    const addOnCloseListener = f => { 
        onExitListeners.push(f);
        return ()=>onExitListeners.splice( onExitListeners.indexOf(f),1 );
    }

    const onExit = ()=> {
        onExitListeners.forEach(l=>l());
    };

    const onEntered = ()=> {
        onOpenListeners.forEach(l=>l());
    }

    
    const handleClose = () => {
        setAnchorEl(null);
        onExit();
    };
 

    const listenClose = e=> {
        if( e.closeMenu ) {
            handleClose();
        }
    }

    return <>
            <ButtonClass onClick={handleClick} style={{position:"relative"}} startIcon={startIcon}>
                {children} 
                <div style={{position:"fixed" }} ref={menuAnchor}></div>
            </ButtonClass>
            

            <Menu  
                ref={contentDiv}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                getContentAnchorEl={null}
                onClose={handleClose}
                onClick={listenClose} 
                TransitionProps={{
                    onEntered,
                    onExit
                }}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                  }}
            >  
                <SubmenuContext.Provider value={ {addOnOpenListener, addOnCloseListener, close:handleClose } }> 
                    {submenu} 
                </SubmenuContext.Provider>
            </Menu>

            </>;

}


/** 
 * Usar este hook dentro de algun elemento que sea child del "submenu" `<BotonConSubmenu submenu={<SomeChild/>}/>`
 * 
 *  ```  
 *       var closeTrigger = useSubmenuListener({ 
 *          onOpened(){
 *               console.log("SUBMENU OPENED!!");
 *          },
 *
 *          onClosed() {
 *              console.log("SUBMENU CLOSED!!");
 *          }
 *       });
 * 
 *        closeTrigger() //<--- cierra el menu
 *   ```
 * 
 * @param { { onOpened:()=>void, onClosed:()=>void } } params 
 */
export const useSubmenuListener = (params, dependency=null) => {
    const submenu = useContext(SubmenuContext);
 
    //
    // "on mounted" registrarnos a los eventos...
    //
    useEffect( ()=> {

        var remove = [];

        if( params?.onOpened )
        {
            remove.push( submenu.addOnOpenListener( params.onOpened ) );
        } 

        if( params?.onClosed ) {
            remove.push( submenu.addOnCloseListener( params.onClosed ) );
        }

        return ()=> {

            while( remove.length ) {
                remove.shift()();
            } 
        }

    },[dependency]);  

    return submenu.close;

}