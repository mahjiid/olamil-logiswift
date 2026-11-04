import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Action, Eyebrow, Panel } from "../src/components/ui";
import { useDraft } from "../src/state/draft";
import { colors } from "../src/theme";
import { summarize, validateStage } from "../src/lib/booking";

export default function Review() {
 const router=useRouter();
 const {draft,clear}=useDraft();
 const [complete,setComplete]=useState(false);
 const issue=validateStage(1,draft)||validateStage(2,draft);
 const data=issue?null:summarize(draft);
 function exit() {
  Alert.alert("Exit this draft?","Your draft is held only in memory and may be lost if the app closes.",[
   {text:"Keep reviewing",style:"cancel"},{text:"Return home",onPress:()=>router.replace("/")}
  ]);
 }
 return <SafeAreaView edges={["top","bottom"]} style={{flex:1,backgroundColor:colors.canvas}}>
   <View style={styles.topbar}>
     <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={()=>complete?router.replace("/"):router.back()} style={styles.back}><Ionicons name="arrow-back" size={23} color={colors.ink}/></Pressable>
     <Text style={styles.topTitle}>Review</Text>
     <Pressable accessibilityRole="button" accessibilityLabel="Return home" onPress={exit} style={styles.back}><Ionicons name="close" size={23} color={colors.ink}/></Pressable>
   </View>
   <ScrollView contentContainerStyle={styles.content}>
    {complete ? <>
      <View style={styles.icon}><Ionicons name="checkmark" size={29} color={colors.success}/></View>
      <Eyebrow>PREVIEW COMPLETE</Eyebrow>
      <Text style={styles.title}>Your draft is ready.</Text>
      <Text style={styles.lead}>You've reviewed the details. This is <Text style={{fontWeight:"800"}}>not</Text> a delivery booking or a stored order. No rider has been assigned and no payment was collected.</Text>
      <Panel><Text style={styles.boxTitle}>What happens when booking goes live?</Text>
       <Text style={styles.muted}>Serviceability and vehicle suitability will be verified, an authoritative quote will be shown, and secure payment will be confirmed before dispatch.</Text></Panel>
      <Action title="Back to home" onPress={()=>router.replace("/")}/>
      <Action title="Start another draft" kind="secondary" icon="refresh-outline" onPress={()=>{clear();router.replace("/book");}}/>
    </>: issue ? <>
      <Eyebrow>INCOMPLETE DRAFT</Eyebrow><Text style={styles.title}>One more thing.</Text><Text style={styles.lead}>{issue}</Text>
      <Action title="Complete details" onPress={()=>router.back()}/>
    </>:data ? <>
      <Eyebrow>STEP 03 / 03</Eyebrow><Text style={styles.title}>One final look.</Text>
      <Text style={styles.lead}>Check your delivery information before leaving the draft screen.</Text>
      <View style={styles.group}><Text style={styles.groupLabel}>01 — THE ROUTE</Text>
       <Panel style={{gap:18}}><Row label="Pickup" value={data.route[0]}/><View style={styles.rule}/><Row label="Drop-off" value={data.route[1]}/><View style={styles.rule}/><Row label="Vehicle preference" value={data.vehicle==="car"?"Car":"Motorcycle"}/></Panel>
      </View>
      <View style={styles.group}><Text style={styles.groupLabel}>02 — THE PACKAGE</Text>
       <Panel style={{gap:18}}><Row label="Category" value={data.parcel}/><View style={styles.rule}/><Row label="Estimated weight" value={String(data.weightKg)+" kg"}/></Panel>
      </View>
      <View style={styles.group}><Text style={styles.groupLabel}>03 — THE RECIPIENT</Text>
       <Panel style={{gap:18}}><Row label="Name" value={data.recipient}/><View style={styles.rule}/><Row label="Phone" value={data.phone??"Invalid"}/>{draft.notes.trim()?<><View style={styles.rule}/><Row label="Notes" value={draft.notes.trim()}/></>:null}</Panel>
      </View>
      <View style={styles.notice}><Ionicons name="alert-circle-outline" size={23} color="#8A6228"/><Text style={styles.noticeText}><Text style={{fontWeight:"800"}}>No live quote available.</Text>{"\n"}This prototype cannot place orders, accept payments, assign drivers or calculate verified delivery rates.</Text></View>
      <Action title="Finish preview" onPress={()=>setComplete(true)}/>
      <Action kind="secondary" title="Edit details" icon="create-outline" onPress={()=>router.back()}/>
    </>:null}
   </ScrollView>
 </SafeAreaView>;
}
function Row({label,value}:{label:string;value:string}) {
 return <View style={styles.row}><Text style={styles.rowLabel}>{label}</Text><Text style={styles.rowValue}>{value}</Text></View>;
}
const styles=StyleSheet.create({
 topbar:{height:64,flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingHorizontal:16,backgroundColor:"#FFF",borderBottomColor:colors.border,borderBottomWidth:1},
 back:{width:40,height:40,alignItems:"center",justifyContent:"center"},topTitle:{fontWeight:"800",fontSize:16,color:colors.ink},
 content:{padding:22,paddingTop:33,paddingBottom:70,gap:19},
 icon:{backgroundColor:colors.successSoft,width:64,height:64,borderRadius:18,justifyContent:"center",alignItems:"center"},
 title:{fontSize:39,fontWeight:"900",letterSpacing:-2,color:colors.ink,lineHeight:45,marginTop:4},
 lead:{fontSize:15,lineHeight:25,color:colors.muted,marginBottom:10},
 group:{gap:12,marginTop:6},groupLabel:{color:colors.muted,fontSize:10,fontWeight:"800",letterSpacing:1.3},
 row:{flexDirection:"row",justifyContent:"space-between",gap:16},
 rowLabel:{fontSize:12,color:colors.muted,width:102},rowValue:{fontSize:13,fontWeight:"700",color:colors.ink,flex:1,textAlign:"right",lineHeight:20},
 rule:{height:1,backgroundColor:colors.border},
 notice:{flexDirection:"row",gap:11,padding:16,backgroundColor:"#FFF4E3",borderWidth:1,borderColor:"#EED3AB",borderRadius:12,marginVertical:8},
 noticeText:{fontSize:13,color:"#604B31",lineHeight:20,flex:1},
 boxTitle:{fontSize:16,fontWeight:"800",color:colors.ink},muted:{fontSize:13,color:colors.muted,lineHeight:22,marginTop:9}
});
