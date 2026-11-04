import {Tabs} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {palette} from "../../src/theme";
import type {ColorValue} from "react-native";
type Icon=keyof typeof Ionicons.glyphMap;
function tabIcon(outline:Icon,fill:Icon){
 return ({color,focused}:{color:ColorValue;focused:boolean;size:number})=>
  <Ionicons name={focused?fill:outline} size={22} color={typeof color==="string"?color:palette.ink}/>;
}
export default function TabsLayout(){
 return <Tabs screenOptions={{
   headerShown:false,
   tabBarStyle:{backgroundColor:"#FFFFFF",borderTopColor:palette.line,height:69,paddingTop:8,paddingBottom:8},
   tabBarActiveTintColor:palette.accent,tabBarInactiveTintColor:palette.muted,
   tabBarLabelStyle:{fontSize:10,fontWeight:"700"}
  }}>
  <Tabs.Screen name="index" options={{title:"Home",tabBarIcon:tabIcon("home-outline","home")}}/>
  <Tabs.Screen name="jobs" options={{title:"Jobs",tabBarIcon:tabIcon("cube-outline","cube")}}/>
  <Tabs.Screen name="earnings" options={{title:"Earnings",tabBarIcon:tabIcon("wallet-outline","wallet")}}/>
  <Tabs.Screen name="account" options={{title:"Account",tabBarIcon:tabIcon("person-outline","person")}}/>
 </Tabs>;
}
