import Cookies from "js-cookie";
export function setCookie(cookieName:string,value:any){
    Cookies.set(cookieName,value,{ expires: 12/24 });
    return {status:true};
}