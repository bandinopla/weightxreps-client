import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';


console.log(`▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█░███░█░▄▄██▄██░▄▄▄█░████▄░▄█░█░█░▄▄▀█░▄▄█▀▄▄▀█░▄▄████░▄▄▀█░▄▄█▄░▄
█▄▀░▀▄█░▄▄██░▄█░█▄▀█░▄▄░██░██▀▄▀█░▀▀▄█░▄▄█░▀▀░█▄▄▀█▀▀█░██░█░▄▄██░█
██▄█▄██▄▄▄█▄▄▄█▄▄▄▄█▄██▄██▄██▄█▄█▄█▄▄█▄▄▄█░████▄▄▄█▄▄█▄██▄█▄▄▄██▄█
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
`);
console.log("Developed by Pablo Bandinopla <pablo@weightxreps.net>");
console.log("-----------------------------------------------------");

// replace console.* for disable log on production
if (process.env.NODE_ENV === 'production') {
    console.log = () => {} ; //block console logs.
}



ReactDOM.render(
  //<React.StrictMode>
    <App /> 
  //</React.StrictMode>,
  ,document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

serviceWorkerRegistration.register();