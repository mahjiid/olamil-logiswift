import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { ColorValue } from "react-native";
import { colors } from "../../src/theme";
type IconName=keyof typeof Ionicons.glyphMap;
function tabIcon(name:IconName,active:IconName) {
 return ({color,focused}:{color:ColorValue;focused:boolean;size:number})=><Ionicons name={focused?active:name} size={22} color={typeof color === "string" ? color : colors.ink}/>;
}
export default function TabLayout() {
 return <Tabs screenOptions={{
   headerShown:false, tabBarActiveTintColor:colors.orange,tabBarInactiveTintColor:"#859087",
   tabBarStyle:{backgroundColor:"#FFFFFF",borderTopColor:colors.border,height:67,paddingTop:8,paddingBottom:8},
   tabBarLabelStyle:{fontSize:10,fontWeight:"700"},
  }}>
   <Tabs.Screen name="index" options={{title:"Home",tabBarIcon:tabIcon("home-outline","home")}}/>
   <Tabs.Screen name="activity" options={{title:"Activity",tabBarIcon:tabIcon("time-outline","time")}}/>
   <Tabs.Screen name="payments" options={{title:"Payments",tabBarIcon:tabIcon("card-outline","card")}}/>
   <Tabs.Screen name="account" options={{title:"Account",tabBarIcon:tabIcon("person-outline","person")}}/>
 </Tabs>;
}
