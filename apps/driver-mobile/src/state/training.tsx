import {createContext,useContext,useMemo,useState,type ReactNode} from "react";
import {advanceTraining,INITIAL_TRAINING,type Event,type TrainingState,type Transition} from "../lib/workflow";
type TrainingContext={training:TrainingState;attempt:(event:Event,code?:string)=>Transition;reset:()=>void};
const Context=createContext<TrainingContext|null>(null);
export function TrainingProvider({children}:{children:ReactNode}){
 const [training,setTraining]=useState<TrainingState>({...INITIAL_TRAINING});
 const value=useMemo<TrainingContext>(()=>({
   training,
   attempt:(event,code)=>{const result=advanceTraining(training,event,code);if(result.ok)setTraining(result.state);return result;},
   reset:()=>setTraining({...INITIAL_TRAINING}),
 }),[training]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useTraining(){const value=useContext(Context);if(!value)throw Error("TrainingProvider missing");return value;}
