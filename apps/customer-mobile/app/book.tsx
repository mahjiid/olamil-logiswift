import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Action, Eyebrow, Panel, TextField } from "../src/components/ui";
import { useDraft } from "../src/state/draft";
import { colors } from "../src/theme";
import { type ParcelType, validateStage } from "../src/lib/booking";

const parcelTypes:{value:ParcelType;label:string;icon:keyof typeof Ionicons.glyphMap}[]=[
 {value:"parcel",label:"Parcel",icon:"cube-outline"},
 {value:"documents",label:"Documents",icon:"document-text-outline"},
 {value:"fragile",label:"Fragile",icon:"wine-outline"},
 {value:"other",label:"Other",icon:"ellipsis-horizontal"},
];
export default function Book() {
 const router=useRouter();
 const {draft,setField,clear}=useDraft();
 const [step,setStep]=useState<1|2>(1);
 const [error,setError]=useState<string|null>(null);
 const change=<K extends keyof typeof draft>(field:K,value:(typeof draft)[K])=>{setField(field,value);setError(null);};
 const goNext=()=>{const message=validateStage(step,draft);if(message){setError(message);return;}if(step===1)setStep(2);else router.push("/review");};
 const goBack=()=>{setError(null);if(step===2)setStep(1);else router.back();};
 const reset=()=>Alert.alert("Clear this draft?","All unsent details will be cleared from memory.",[
  {text:"Keep editing",style:"cancel"},{text:"Clear draft",style:"destructive",onPress:()=>{clear();setError(null);setStep(1);}}
 ]);
 return <SafeAreaView style={styles.safe} edges={["top","bottom"]}>
   <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==="ios"?"padding":undefined}>
     <View style={styles.topbar}>
       <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={goBack} style={styles.iconButton}><Ionicons name="arrow-back" size={23} color={colors.ink}/></Pressable>
       <Text style={styles.navTitle}>New delivery</Text>
       <Pressable accessibilityRole="button" accessibilityLabel="Clear draft" onPress={reset} style={styles.iconButton}><Ionicons name="trash-outline" size={20} color={colors.muted}/></Pressable>
     </View>
     <View style={styles.progress}><View style={[styles.progressBar,{backgroundColor:colors.orange}]}/><View style={[styles.progressBar,{backgroundColor:step===2?colors.orange:colors.border}]}/><View style={styles.progressBar}/></View>
     <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
       <Eyebrow>STEP 0{step} / 03</Eyebrow>
       <Text style={styles.display}>{step===1?"Where are we going?":"What's going with us?"}</Text>
       <Text style={styles.intro}>{step===1?"Enter both locations to plan your route. Include useful landmarks.":"Tell us about the package and who will receive it."}</Text>
       {step===1?<>
         <Panel style={{gap:22}}>
           <View style={styles.routeItem}><View style={styles.dot}/><View style={{flex:1}}><TextField label="PICKUP ADDRESS" value={draft.pickup} onChangeText={v=>change("pickup",v)} placeholder="Building, street, area and city" autoComplete="street-address" maxLength={250}/></View></View>
           <View style={styles.routeItem}><View style={styles.square}/><View style={{flex:1}}><TextField label="DROP-OFF ADDRESS" value={draft.dropoff} onChangeText={v=>change("dropoff",v)} placeholder="Recipient's full destination" maxLength={250}/></View></View>
         </Panel>
         <Text style={styles.groupLabel}>VEHICLE PREFERENCE</Text>
         <View style={styles.vehicleRow}>
           <Choice icon="bicycle-outline" title="Motorcycle" selected={draft.vehicle==="motorcycle"} onPress={()=>change("vehicle","motorcycle")}/>
           <Choice icon="car-outline" title="Car" selected={draft.vehicle==="car"} onPress={()=>change("vehicle","car")}/>
         </View>
         <View style={styles.notice}><Ionicons name="information-circle-outline" size={19} color={colors.inkSoft}/><Text style={styles.noticeText}>Vehicle eligibility and service area will be checked by the live system. This isn't a confirmed booking.</Text></View>
       </>:<>
         <Text style={styles.groupLabel}>PACKAGE CATEGORY</Text>
         <View style={styles.categoryGrid}>{parcelTypes.map(item=>
           <Pressable accessibilityRole="radio" accessibilityState={{checked:draft.parcelType===item.value}} key={item.value} onPress={()=>change("parcelType",item.value)}
             style={[styles.category,draft.parcelType===item.value&&styles.categorySelected]}>
             <Ionicons name={item.icon} size={23} color={draft.parcelType===item.value?colors.orange:colors.inkSoft}/>
             <Text style={styles.categoryTitle}>{item.label}</Text>
           </Pressable>
         )}</View>
         <View style={styles.fieldSection}><TextField label="APPROXIMATE WEIGHT (KG)" value={draft.weightKg} onChangeText={v=>change("weightKg",v)} keyboardType="decimal-pad" placeholder="e.g. 2.5" maxLength={10}/></View>
         <View style={styles.divider}/>
         <Text style={styles.groupLabel}>RECIPIENT DETAILS</Text>
         <View style={styles.fieldSection}><TextField label="RECIPIENT NAME" value={draft.recipientName} onChangeText={v=>change("recipientName",v)} autoComplete="name" placeholder="Full name" maxLength={120}/></View>
         <View style={styles.fieldSection}><TextField label="RECIPIENT PHONE" value={draft.recipientPhone} onChangeText={v=>change("recipientPhone",v)} keyboardType="phone-pad" autoComplete="tel" placeholder="0801 234 5678" maxLength={24}/></View>
         <View style={styles.fieldSection}><TextField label="HANDLING NOTES · OPTIONAL" value={draft.notes} onChangeText={v=>change("notes",v)} placeholder="Access details or package instructions" multiline maxLength={600}/></View>
         <View style={styles.notice}><Ionicons name="shield-checkmark-outline" size={19} color={colors.inkSoft}/><Text style={styles.noticeText}>Restricted items cannot be carried. Recipient details stay in this app's memory until an authorized booking service is connected.</Text></View>
       </>}
       {error?<View style={styles.error} accessibilityRole="alert"><Ionicons name="alert-circle-outline" size={19} color={colors.error}/><Text style={{color:colors.error,flex:1,fontSize:13}}>{error}</Text></View>:null}
     </ScrollView>
     <View style={styles.bottom}><Action title={step===1?"Continue to package":"Review delivery"} onPress={goNext}/><Text style={styles.bottomNote}>No quote, payment or rider assignment in preview.</Text></View>
   </KeyboardAvoidingView>
 </SafeAreaView>;
}
function Choice({title,icon,selected,onPress}:{title:string;icon:keyof typeof Ionicons.glyphMap;selected:boolean;onPress:()=>void}) {
 return <Pressable accessibilityRole="radio" accessibilityState={{checked:selected}} onPress={onPress} style={[styles.choice,selected&&styles.choiceSelected]}>
   <Ionicons name={icon} size={26} color={selected?colors.orange:colors.inkSoft}/>
   <Text style={styles.choiceText}>{title}</Text>
   <Ionicons name={selected?"radio-button-on":"radio-button-off"} size={18} color={selected?colors.orange:"#A3AEA6"} style={{marginLeft:"auto"}}/>
 </Pressable>;
}
const styles=StyleSheet.create({
 safe:{flex:1,backgroundColor:colors.canvas},
 topbar:{height:65,flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingHorizontal:20,backgroundColor:"#FFF",borderBottomWidth:1,borderBottomColor:colors.border},
 iconButton:{width:42,height:42,alignItems:"center",justifyContent:"center"},navTitle:{fontSize:16,fontWeight:"800",color:colors.ink},
 progress:{flexDirection:"row",gap:6,paddingHorizontal:22,marginTop:22},progressBar:{backgroundColor:colors.border,height:4,flex:1,borderRadius:2},
 body:{paddingHorizontal:22,paddingTop:27,paddingBottom:40,gap:16},
 display:{fontSize:37,letterSpacing:-1.8,lineHeight:42,fontWeight:"900",color:colors.ink,marginTop:4},
 intro:{fontSize:14,lineHeight:22,color:colors.muted,marginBottom:15},
 routeItem:{flexDirection:"row",gap:12,alignItems:"flex-start"},
 dot:{width:11,height:11,borderRadius:6,borderWidth:3,borderColor:colors.orange,marginTop:30},
 square:{width:11,height:11,borderRadius:3,backgroundColor:colors.ink,marginTop:30},
 groupLabel:{fontSize:11,fontWeight:"800",color:colors.muted,letterSpacing:1.3,marginTop:12},
 vehicleRow:{flexDirection:"row",gap:11},choice:{flex:1,minHeight:100,padding:15,borderRadius:13,backgroundColor:"#FFF",borderWidth:1,borderColor:colors.border,justifyContent:"space-between"},
 choiceSelected:{backgroundColor:colors.orangeSoft,borderColor:colors.orange},
 choiceText:{fontSize:13,color:colors.ink,fontWeight:"800",marginTop:8},
 categoryGrid:{flexDirection:"row",flexWrap:"wrap",gap:10},category:{width:"48%",backgroundColor:"#FFF",borderWidth:1,borderColor:colors.border,borderRadius:12,padding:17,minHeight:92,justifyContent:"space-between"},categorySelected:{backgroundColor:colors.orangeSoft,borderColor:colors.orange},
 categoryTitle:{fontWeight:"700",color:colors.ink,fontSize:13,marginTop:10},
 fieldSection:{marginTop:6},divider:{height:1,backgroundColor:colors.border,marginVertical:10},
 notice:{borderRadius:10,backgroundColor:"#EAF0E9",padding:14,flexDirection:"row",gap:9,alignItems:"flex-start",marginTop:5},
 noticeText:{color:colors.inkSoft,fontSize:12,lineHeight:18,flex:1},
 error:{backgroundColor:colors.errorSoft,borderColor:"#E8B8B1",borderWidth:1,flexDirection:"row",alignItems:"flex-start",gap:8,padding:13,borderRadius:10,marginTop:7},
 bottom:{backgroundColor:"#FFF",borderTopWidth:1,borderTopColor:colors.border,padding:18,gap:10},
 bottomNote:{textAlign:"center",fontSize:11,color:colors.muted}
});
