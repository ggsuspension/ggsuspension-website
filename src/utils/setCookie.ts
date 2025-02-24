import Cookies from "js-cookie";
export function setCookie(cookieName:string,value:any){
    Cookies.set(cookieName,value);
}