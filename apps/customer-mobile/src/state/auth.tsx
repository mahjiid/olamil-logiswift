import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { type User } from "@supabase/supabase-js";
import { authClient,isAuthConfigured } from "../lib/auth-client";

type Result={error:string|null;pendingConfirmation?:boolean};
type AuthState={
 user:User|null;loading:boolean;configured:boolean;
 signIn:(email:string,password:string)=>Promise<Result>;
 signUp:(email:string,password:string)=>Promise<Result>;
 signOut:()=>Promise<Result>;
 getAccessToken:()=>Promise<string|null>;
};
const Context=createContext<AuthState|null>(null);
export function CustomerAuthProvider({children}:{children:ReactNode}){
 const [user,setUser]=useState<User|null>(null),[loading,setLoading]=useState(true);
 useEffect(()=>{
   if(!authClient){setLoading(false);return;}
   const client=authClient;let active=true;
   client.auth.getUser().then(({data})=>{if(active)setUser(data.user??null);}).catch(()=>{if(active)setUser(null);}).finally(()=>{if(active)setLoading(false);});
   const {data:{subscription}}=client.auth.onAuthStateChange((_event,session)=>{
     if(active){setUser(session?.user??null);setLoading(false);}
   });
   return()=>{active=false;subscription.unsubscribe();};
 },[]);
 const api=useMemo<AuthState>(()=>({
   user,loading,configured:isAuthConfigured,
   signIn:async(email,password)=>{
     if(!authClient)return{error:"Account service is not configured."};
     const {error}=await authClient.auth.signInWithPassword({email:email.trim(),password});
     return{error:error?"Sign-in failed. Check your details or verify your email.":null};
   },
   signUp:async(email,password)=>{
     if(!authClient)return{error:"Account service is not configured."};
     const {data,error}=await authClient.auth.signUp({email:email.trim(),password});
     return{error:error?"Registration could not be completed. Please check your details.":null,
       pendingConfirmation:!error&&!data.session};
   },
   signOut:async()=>{
     if(!authClient)return{error:null};
     const {error}=await authClient.auth.signOut();
     return{error:error?"Sign-out failed. Please try again.":null};
   },
   getAccessToken:async()=>{
     if(!authClient)return null;
     const {data,error}=await authClient.auth.getSession();
     return error?null:(data.session?.access_token??null);
   }
 }),[user,loading]);
 return <Context.Provider value={api}>{children}</Context.Provider>;
}
export function useCustomerAuth(){
 const value=useContext(Context);if(!value)throw Error("CustomerAuthProvider missing");
 return value;
}
