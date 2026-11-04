import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { Draft, EMPTY_DRAFT } from "../lib/booking";

/**
 * Drafts are intentionally ephemeral and never written to unencrypted device storage.
 * A future authenticated server draft endpoint may be added after privacy review.
 */
type DraftState={draft:Draft;setField:<K extends keyof Draft>(field:K,value:Draft[K])=>void;clear:()=>void;};
const Context=createContext<DraftState|null>(null);
export function DraftProvider({children}:{children:ReactNode}) {
 const [draft,setDraft]=useState<Draft>({...EMPTY_DRAFT});
 const value=useMemo<DraftState>(()=>({
  draft,setField:(field,value)=>setDraft(prev=>({...prev,[field]:value})),
  clear:()=>setDraft({...EMPTY_DRAFT}),
 }),[draft]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useDraft():DraftState {
 const context=useContext(Context);
 if(!context)throw new Error("useDraft requires DraftProvider");
 return context;
}
