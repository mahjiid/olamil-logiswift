import {useRouter} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {ScrollView,StyleSheet,Text,View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {DriverMark,DriverButton,InlineNotice,Kicker,PageHeading,Surface,Pill} from "../../src/components/ui";
import {palette} from "../../src/theme";
export default function Jobs(){
 const router=useRouter();
 return <SafeAreaView edges={["top"]} style={{flex:1,backgroundColor:palette.canvas}}>
   <ScrollView contentContainerStyle={styles.body}>
    <DriverMark/><View style={styles.head}><Kicker>WORK QUEUE</Kicker><PageHeading title="Your jobs." description="One clear next step for every assigned delivery."/></View>
    <Surface style={{padding:24,gap:13}}>
      <View style={styles.emptyIcon}><Ionicons name="cube-outline" size={31} color={palette.accent}/></View>
      <Pill title="NO LIVE ASSIGNMENTS" icon="lock-closed-outline"/>
      <Text style={styles.title}>Nothing assigned yet.</Text>
      <Text style={styles.text}>When a verified dispatch service is connected, accepted jobs will appear here. We won't invent customer addresses, ETAs or payments.</Text>
    </Surface>
    <View style={{marginTop:16}}><DriverButton label="Try a sample delivery" icon="navigate-outline" onPress={()=>router.push("/training")}/></View>
    <View style={{marginTop:23}}><InlineNotice text="Training is separate from real deliveries. It never updates shipment status or contacts a customer."/></View>
   </ScrollView>
 </SafeAreaView>;
}
const styles=StyleSheet.create({
 body:{padding:22,paddingBottom:42},head:{marginTop:44,marginBottom:26,gap:15},
 emptyIcon:{width:62,height:62,borderRadius:18,alignItems:"center",justifyContent:"center",backgroundColor:palette.accentSoft,marginBottom:7},
 title:{fontSize:22,fontWeight:"800",color:palette.ink,letterSpacing:-.7},text:{fontSize:13,color:palette.secondary,lineHeight:22}
});
