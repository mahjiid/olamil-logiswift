import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Wordmark, Action, Eyebrow, Panel } from "../../src/components/ui";
import { colors } from "../../src/theme";

export default function Home() {
 const router=useRouter();
 return <SafeAreaView style={styles.safe} edges={["top"]}>
  <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
   <View style={styles.top}><Wordmark/><View style={styles.topPill}><View style={styles.pillDot}/><Text style={styles.pillText}>EARLY ACCESS PREVIEW</Text></View></View>
   <View style={styles.hero}>
    <Eyebrow>THE CITY MOVES WITH YOU</Eyebrow>
    <Text style={styles.display}>From your door{"\n"}to <Text style={{color:colors.orange}}>theirs.</Text></Text>
    <Text style={styles.lead}>Send the important things without the guesswork. Start with a clear delivery plan.</Text>
    <Action title="Plan a delivery" onPress={()=>router.push("/book")}/>
    <View style={styles.heroFoot}><Text style={styles.heroFootText}>01 / CUSTOMER EXPERIENCE</Text><Text style={styles.heroFootText}>ZAIOLA  —  DELIVERY</Text></View>
   </View>
   <View style={styles.sectionTitle}><Text style={styles.sectionHeading}>Made for moving.</Text><Text style={styles.muted}>Start with what you need.</Text></View>
   <View style={styles.cards}>
    <Pressable accessibilityRole="button" accessibilityLabel="Send a package" onPress={()=>router.push("/book")} style={({pressed})=>[styles.card,pressed&&styles.pressed]}>
      <View style={styles.tileIcon}><Ionicons name="cube-outline" size={24} color={colors.orange}/></View>
      <Text style={styles.cardTitle}>Send a package</Text>
      <Text style={styles.cardBody}>Plan pickup, destination and package details.</Text>
      <Ionicons name="arrow-up-outline" size={18} color={colors.ink} style={{position:"absolute",top:20,right:20,transform:[{rotate:"45deg"}]}}/>
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel="Check delivery activity" onPress={()=>router.push("/activity")} style={({pressed})=>[styles.card,pressed&&styles.pressed]}>
      <View style={styles.tileIcon}><Ionicons name="navigate-outline" size={24} color={colors.orange}/></View>
      <Text style={styles.cardTitle}>Your activity</Text>
      <Text style={styles.cardBody}>Find tracking and order history when connected.</Text>
      <Ionicons name="arrow-up-outline" size={18} color={colors.ink} style={{position:"absolute",top:20,right:20,transform:[{rotate:"45deg"}]}}/>
    </Pressable>
   </View>
   <View style={styles.approach}><Text style={styles.approachTag}>THE ZAIOLA APPROACH</Text><Text style={styles.approachTitle}>Every delivery,{"\n"}under control.</Text>
    <View style={styles.rail}>
     <Step number="01" title="Tell us where" detail="Set pickup and drop-off addresses."/>
     <Step number="02" title="Review your plan" detail="Check item and recipient details."/>
     <Step number="03" title="Track the handover" detail="When live dispatch is enabled, follow verified milestones."/>
    </View>
   </View>
   <Panel style={{marginTop:24,backgroundColor:"#F1F5EF"}}>
     <View style={{flexDirection:"row",gap:11,alignItems:"flex-start"}}><Ionicons name="information-circle-outline" size={22} color={colors.inkSoft}/>
     <View style={{flex:1}}><Text style={{fontWeight:"800",color:colors.ink}}>Preview environment</Text>
     <Text style={{fontSize:12,color:colors.muted,lineHeight:19,marginTop:5}}>You can create a delivery draft. Payments, order creation and rider assignment are not enabled.</Text></View></View>
   </Panel>
  </ScrollView>
 </SafeAreaView>;
}
function Step({number,title,detail}:{number:string;title:string;detail:string}){
 return <View style={styles.step}><View style={styles.stepNum}><Text style={styles.stepNumText}>{number}</Text></View><View style={{flex:1}}><Text style={styles.stepTitle}>{title}</Text><Text style={styles.stepBody}>{detail}</Text></View></View>;
}
const styles=StyleSheet.create({
 safe:{flex:1,backgroundColor:colors.canvas},scroll:{paddingBottom:38},top:{paddingHorizontal:22,paddingVertical:18,backgroundColor:"#FFF",flexDirection:"row",justifyContent:"space-between",alignItems:"center",gap:10},
 topPill:{borderWidth:1,borderColor:"#D6E2D7",borderRadius:99,paddingHorizontal:9,paddingVertical:7,flexDirection:"row",alignItems:"center",gap:6,flexShrink:1},
 pillDot:{width:5,height:5,borderRadius:3,backgroundColor:colors.orange},pillText:{fontSize:8,color:colors.inkSoft,fontWeight:"800",letterSpacing:.7},
 hero:{backgroundColor:"#EBEFE9",paddingHorizontal:24,paddingTop:57,paddingBottom:26,minHeight:420,justifyContent:"center"},
 display:{fontSize:50,fontWeight:"900",lineHeight:54,letterSpacing:-2.6,color:colors.ink,marginTop:18,marginBottom:18},
 lead:{fontSize:16,color:"#51645A",lineHeight:25,maxWidth:360,marginBottom:27},heroFoot:{flexDirection:"row",justifyContent:"space-between",marginTop:41},
 heroFootText:{fontSize:9,letterSpacing:.7,color:"#77857C",fontWeight:"700"},
 sectionTitle:{paddingHorizontal:22,paddingTop:38,paddingBottom:18},sectionHeading:{fontSize:26,letterSpacing:-1.1,fontWeight:"800",color:colors.ink},muted:{fontSize:13,color:colors.muted,marginTop:4},
 cards:{flexDirection:"row",gap:11,paddingHorizontal:22},
 card:{backgroundColor:"#FFFFFF",borderColor:colors.border,borderWidth:1,borderRadius:15,padding:17,flex:1,minHeight:200,alignItems:"flex-start"},pressed:{opacity:.8},
 tileIcon:{backgroundColor:colors.orangeSoft,width:42,height:42,borderRadius:12,justifyContent:"center",alignItems:"center",marginBottom:25},
 cardTitle:{fontSize:16,fontWeight:"800",letterSpacing:-.4,color:colors.ink,marginBottom:8},cardBody:{fontSize:12,lineHeight:18,color:colors.muted},
 approach:{backgroundColor:colors.ink,marginHorizontal:22,marginTop:37,paddingHorizontal:24,paddingTop:29,paddingBottom:26,borderRadius:17},
 approachTag:{color:"#E2A48F",fontWeight:"800",fontSize:10,letterSpacing:1.8},
 approachTitle:{fontSize:29,color:"#FFFFFF",fontWeight:"800",letterSpacing:-1,marginTop:14,lineHeight:35},
 rail:{marginTop:29,gap:22},step:{flexDirection:"row",gap:15,alignItems:"flex-start"},
 stepNum:{borderWidth:1,borderColor:"#627368",width:34,height:34,borderRadius:9,alignItems:"center",justifyContent:"center"},
 stepNumText:{fontSize:11,fontWeight:"800",color:"#E0AC96"},stepTitle:{color:"#FFFFFF",fontSize:14,fontWeight:"800"},
 stepBody:{color:"#A9B9AE",fontSize:12,lineHeight:19,marginTop:4}
});
