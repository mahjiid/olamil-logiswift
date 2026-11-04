import {SafeAreaView} from "react-native-safe-area-context";
import {ScrollView,StyleSheet,Text,View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {DriverMark,InlineNotice,Kicker,PageHeading,Pill,Surface} from "../../src/components/ui";
import {palette} from "../../src/theme";
const requirements=[
 {title:"Identity verification",detail:"Approved ID, authenticated profile and contact details.",icon:"id-card-outline" as const},
 {title:"Vehicle eligibility",detail:"Relevant vehicle documents and operating requirements.",icon:"bicycle-outline" as const},
 {title:"Payment account",detail:"Reviewed settlement details; no credentials stored in preview.",icon:"card-outline" as const},
 {title:"Location consent",detail:"Permission requested only when required for live work.",icon:"location-outline" as const},
];
export default function Account(){
 return <SafeAreaView edges={["top"]} style={{flex:1,backgroundColor:palette.canvas}}>
  <ScrollView contentContainerStyle={styles.body}>
   <DriverMark/><View style={styles.head}><Kicker>DRIVER ACCOUNT</Kicker>
    <PageHeading title="Built on trust." description="Your approval and safety come before any assignment."/></View>
   <Surface style={styles.profile}>
    <View style={styles.profileIcon}><Ionicons name="person-outline" size={28} color={palette.ink}/></View>
    <Pill title="NOT VERIFIED" icon="shield-outline" tone="warn"/>
    <Text style={styles.title}>No driver account linked.</Text>
    <Text style={styles.copy}>Your onboarding will start once the secure identity service is connected. This preview doesn't upload identification documents or store banking information.</Text>
   </Surface>
   <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Before you go online</Text><Text style={styles.small}>4 REQUIREMENTS</Text></View>
   <View style={{gap:10}}>{requirements.map(item=>
     <Surface key={item.title} style={styles.requirement}>
       <View style={styles.requirementIcon}><Ionicons name={item.icon} size={24} color={palette.accent}/></View>
       <View style={{flex:1}}><Text style={styles.reqTitle}>{item.title}</Text><Text style={styles.reqDetail}>{item.detail}</Text></View>
       <Ionicons name="lock-closed-outline" color={palette.muted} size={18}/>
     </Surface>
   )}</View>
   <View style={{marginTop:23}}><InlineNotice text="Documents, consent, identity reviews and payout setup must be implemented in an authenticated onboarding service before this app can receive real offers."/></View>
  </ScrollView>
 </SafeAreaView>;
}
const styles=StyleSheet.create({
 body:{padding:22,paddingBottom:45},head:{marginTop:40,marginBottom:27,gap:13},profile:{gap:15,padding:25},
 profileIcon:{height:60,width:60,justifyContent:"center",alignItems:"center",backgroundColor:"#F0F3EE",borderRadius:18},
 title:{fontSize:22,color:palette.ink,fontWeight:"800",letterSpacing:-.7},
 copy:{fontSize:13,lineHeight:22,color:palette.secondary},sectionHeader:{marginTop:30,marginBottom:14,flexDirection:"row",alignItems:"center",justifyContent:"space-between",gap:10},
 sectionTitle:{fontSize:20,fontWeight:"800",color:palette.ink,letterSpacing:-.5},
 small:{fontSize:10,color:palette.muted,fontWeight:"800",letterSpacing:.65},
 requirement:{padding:16,flexDirection:"row",alignItems:"center",gap:12},
 requirementIcon:{width:43,height:43,borderRadius:12,backgroundColor:palette.accentSoft,alignItems:"center",justifyContent:"center"},
 reqTitle:{fontSize:14,color:palette.ink,fontWeight:"800"},reqDetail:{fontSize:12,color:palette.secondary,lineHeight:18,marginTop:4}
});
