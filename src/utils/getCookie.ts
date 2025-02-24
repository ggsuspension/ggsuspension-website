import Cookies from "js-cookie";
export function getCookie(cookieName:string){
    return Cookies.get(cookieName);
}