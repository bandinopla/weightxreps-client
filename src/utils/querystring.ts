const currentUrl            = window.location.href; 
const url                   = new URL(currentUrl); 
export const queryParams    = new URLSearchParams(url.search); 
 