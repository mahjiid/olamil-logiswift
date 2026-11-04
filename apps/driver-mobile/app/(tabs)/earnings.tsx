import {SafeAreaView} from "react-native-safe-area-context";
import {ScrollView,StyleSheet,Text,View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {DriverMark,InlineNotice,Kicker,PageHeading,Surface} from "../../src/components/ui";
import {palette} from "../../src/theme";
export default function Earnings(){
 return <SafeAreaView edges={["top"]} style={{flex:1,backgroundColor:palette.canvas}}>
  <ScrollView contentContainerStyle={styles.body}>
   <DriverMark/><View style={styles.head}><Kicker>EARNINGS & SETTLEMENTS</Kicker>
     <PageHeading title="Every naira. Accounted for." description="Clear earnings and payment records, never invented balances."/></View>
   <Surface style={styles.panel}>
    <View style={styles.icon}><Ionicons name="wallet-outline" color={palette.accent} size={30}/></View>
    <Text style={styles.title}>Earnings aren't connected.</Text>
    <Text style={styles.copy}>You'll be able to review completed jobs, adjustments, and settled payouts once your identity and finance services are verified.</Text>
    <View style={styles.separator}/>
    <Text style={styles.label}>AVAILABLE BALANCE</Text>
    <Text style={styles.unavailable}>Not available</Text>
    <Text style={styles.small}>We don't display a false ₦0 balance or simulated settlement history.</Text>
   </Surface>
   <View style={{marginTop:18}}><InlineNotice icon="shield-checkmark-outline" text="All earnings will come from server-issued job and settlement records, not from locally calculated estimates."/></View>
  </ScrollView>
 </SafeAreaView>;
}
const styles=StyleSheet.create({
 body:{padding:22,paddingBottom:44},head:{marginTop:41,gap:13,marginBottom:28},panel:{gap:13,padding:24},
 icon:{width:64,height:64,borderRadius:18,backgroundColor:palette.accentSoft,alignItems:"center",justifyContent:"center"},
 title:{fontSize:22,fontWeight:"800",color:palette.ink,marginTop:7,letterSpacing:-.8},
 copy:{fontSize:13,lineHeight:21,color:palette.secondary},separator:{height:1,backgroundColor:palette.line,marginVertical:13},
 label:{fontSize:10,fontWeight:"800",letterSpacing:1.4,color:palette.secondary},
 unavailable:{fontSize:27,fontWeight:"900",color:palette.ink,letterSpacing:-.9},
 small:{fontSize:12,lineHeight:20,color:palette.muted}
});
