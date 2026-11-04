import {useState} from "react";
import {useRouter} from "expo-router";
import {KeyboardAvoidingView,Platform,Pressable,ScrollView,StyleSheet,Text,TextInput,View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import {DriverButton,InlineNotice,Kicker,Pill,Surface} from "../src/components/ui";
import {DEMO_JOB,stageLabel,TRAINING_DROPOFF_PIN,TRAINING_PICKUP_PIN,type Event} from "../src/lib/workflow";
import {useTraining} from "../src/state/training";
import {palette} from "../src/theme";

const STEPS=["offer","heading_to_pickup","at_pickup","in_transit","at_dropoff","delivered"] as const;
export default function DeliveryTraining(){
 const router=useRouter();
 const {training,attempt,reset}=useTraining();
 const [code,setCode]=useState(""),[error,setError]=useState("");
 const {stage}=training;
 const done=stage==="delivered"||stage==="declined";
 const count=stage==="declined"?0:Math.max(0,STEPS.indexOf(stage as typeof STEPS[number]));
 const displayCode=stage==="at_pickup"?TRAINING_PICKUP_PIN:TRAINING_DROPOFF_PIN;
 function advance(event:Event){
  const result=attempt(event,code);
  if(!result.ok){setError(result.error);return;}
  setCode("");setError("");
 }
 function startAgain(){reset();setCode("");setError("");}
 return <SafeAreaView edges={["top","bottom"]} style={styles.safe}>
  <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==="ios"?"padding":undefined}>
  <View style={styles.header}>
   <Pressable accessibilityRole="button" accessibilityLabel="Exit driver training" onPress={()=>router.replace("/")} style={styles.iconButton}>
    <Ionicons name="arrow-back" size={22} color={palette.ink}/>
   </Pressable>
   <Text style={styles.headerTitle}>Delivery training</Text>
   <Pill title="SIMULATION" icon="flask-outline" tone="warn"/>
  </View>
  <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
   <Kicker>GUIDED WALKTHROUGH · NOT LIVE</Kicker>
   <Text style={styles.title}>{done?"You made it.":"One action.\nAt a time."}</Text>
   <Text style={styles.subtitle}>Practice the correct handover stages using an invented assignment. No location tracking, customer calls, or real dispatch takes place.</Text>
   <View style={styles.progress} accessibilityLabel={`Training progress, step ${count+1} of 6`}>
    {STEPS.map((s,i)=><View key={s} style={[styles.segment,i<=count&&{backgroundColor:palette.accent}]}/>)}
   </View>
   <Surface style={styles.card}>
    <View style={styles.cardHeader}><Text style={styles.cardEyebrow}>TRAINING ASSIGNMENT</Text>
      <Pill title="EXAMPLE ONLY" icon="information-circle-outline"/></View>
    <View style={styles.statusLine}>
     <View style={styles.statusIcon}><Ionicons name={done?"checkmark-circle-outline":"cube-outline"} size={26} color={palette.accent}/></View>
     <View style={{flex:1}}><Text style={styles.currentLabel}>CURRENT STAGE</Text><Text style={styles.currentStage}>{stageLabel(stage)}</Text></View>
    </View>
    <View style={styles.path}>
      <View style={styles.pathRail} aria-hidden={true}>
       <View style={styles.fromDot}/><View style={styles.pathLine}/><View style={styles.toDot}/>
      </View>
      <View style={styles.pathLabels}><View><Text style={styles.routeLabel}>PICKUP</Text><Text style={styles.routeName}>{DEMO_JOB.pickup}</Text></View>
      <View><Text style={styles.routeLabel}>DROP-OFF</Text><Text style={styles.routeName}>{DEMO_JOB.dropoff}</Text></View></View>
    </View>
    <View style={styles.bottomData}>
     <View><Text style={styles.dataLabel}>PACKAGE</Text><Text style={styles.dataValue}>{DEMO_JOB.package}</Text></View>
     <View style={{alignItems:"flex-end"}}><Text style={styles.dataLabel}>EARNINGS</Text><Text style={styles.dataValue}>Not available</Text></View>
    </View>
   </Surface>
   {!done ? (
     <Surface style={styles.actionCard}>
       <Kicker>NEXT ACTION</Kicker>
       {stage==="offer"?<>
        <Text style={styles.actionTitle}>A new assignment arrives</Text>
        <Text style={styles.copy}>In the live app, offer details and earnings must be verified before a rider accepts. This one is an example only.</Text>
        <DriverButton label="Accept training offer" onPress={()=>advance("accept")}/>
        <DriverButton label="Decline this example" variant="outline" icon="close-outline" onPress={()=>advance("decline")}/>
       </>:stage==="heading_to_pickup"?<>
        <Text style={styles.actionTitle}>Head to the sender</Text>
        <Text style={styles.copy}>A real route would open authorized navigation. The training route below is illustrative and does not follow your location.</Text>
        <InlineNotice text="TRAINING ROUTE: Wuse 2 → Gwarinpa, Abuja. This is not live navigation."/>
        <DriverButton label="I've reached the pickup" onPress={()=>advance("arrive_pickup")} icon="location-outline"/>
       </>:stage==="at_pickup"?<>
        <Text style={styles.actionTitle}>Verify the package collection</Text>
        <Text style={styles.copy}>Before changing a real delivery to picked up, the server must verify the correct handover method.</Text>
        <View style={styles.pinPanel}><Text style={styles.demoLabel}>EXAMPLE PICKUP PIN</Text><Text style={styles.demoPin}>{TRAINING_PICKUP_PIN}</Text><Text style={styles.demoHelp}>For training only. Never use a fixed PIN in production.</Text></View>
        <Text style={styles.inputLabel}>ENTER THE TRAINING PIN</Text>
        <TextInput value={code} onChangeText={t=>{setCode(t.replace(/\D/g,"").slice(0,4));setError("");}} maxLength={4} keyboardType="number-pad"
          autoComplete="off" placeholder="4-digit code" placeholderTextColor={palette.muted}
          accessibilityLabel="Training pickup PIN" style={styles.pinInput}/>
        <DriverButton label="Confirm training pickup" onPress={()=>advance("collect")} icon="checkmark-outline" disabled={code.length!==4}/>
       </>:stage==="in_transit"?<>
        <Text style={styles.actionTitle}>Move toward drop-off</Text>
        <Text style={styles.copy}>Once a package is collected, the customer should see verified transit milestones. This walkthrough creates none.</Text>
        <DriverButton label="I've reached the destination" onPress={()=>advance("arrive_dropoff")} icon="location-outline"/>
       </>:stage==="at_dropoff"?<>
        <Text style={styles.actionTitle}>Complete a verified handover</Text>
        <Text style={styles.copy}>Real proof of delivery must be checked by a trusted server. Practice the recipient PIN stage here.</Text>
        <View style={styles.pinPanel}><Text style={styles.demoLabel}>EXAMPLE RECIPIENT PIN</Text><Text style={styles.demoPin}>{TRAINING_DROPOFF_PIN}</Text><Text style={styles.demoHelp}>Example only. No real recipient has been contacted.</Text></View>
        <Text style={styles.inputLabel}>ENTER THE TRAINING PIN</Text>
        <TextInput value={code} onChangeText={t=>{setCode(t.replace(/\D/g,"").slice(0,6));setError("");}} maxLength={6} keyboardType="number-pad"
          autoComplete="off" placeholder="6-digit code" placeholderTextColor={palette.muted}
          accessibilityLabel="Training recipient PIN" style={styles.pinInput}/>
        <DriverButton label="Confirm training handover" onPress={()=>advance("complete")} icon="checkmark-circle-outline" disabled={code.length!==6}/>
       </>:null}
       {error?<View accessibilityRole="alert" style={styles.error}><Ionicons name="alert-circle-outline" size={18} color={palette.danger}/><Text style={styles.errorText}>{error}</Text></View>:null}
     </Surface>
   ):(
     <Surface style={styles.actionCard}>
      <View style={styles.completeIcon}><Ionicons name={stage==="declined"?"close-outline":"checkmark"} size={28} color={palette.success}/></View>
      <Text style={styles.actionTitle}>{stage==="delivered"?"Walkthrough completed":"Example declined"}</Text>
      <Text style={styles.copy}>You've explored a simulated delivery lifecycle. No actual shipment was created or updated and no earnings were recorded.</Text>
      <DriverButton label="Practice again" onPress={startAgain} icon="refresh-outline"/>
      <DriverButton label="Back to driver home" onPress={()=>router.replace("/")} icon="home-outline" variant="outline"/>
     </Surface>
   )}
   <InlineNotice kind="warning" icon="shield-checkmark-outline" text="Safety first: never interact with the screen while riding. Real driver availability, GPS access, assignments, PINs and proof-of-delivery verification require an approved, authenticated server connection."/>
  </ScrollView>
  </KeyboardAvoidingView>
 </SafeAreaView>;
}
const styles=StyleSheet.create({
 safe:{flex:1,backgroundColor:palette.canvas},
 header:{height:67,backgroundColor:"#FFFFFF",borderBottomColor:palette.line,borderBottomWidth:1,paddingHorizontal:15,
  flexDirection:"row",alignItems:"center",justifyContent:"space-between",gap:8},
 iconButton:{width:40,height:40,alignItems:"center",justifyContent:"center"},
 headerTitle:{fontSize:15,fontWeight:"800",color:palette.ink,flexShrink:1},
 body:{paddingHorizontal:22,paddingTop:27,paddingBottom:48,gap:17},
 title:{fontSize:42,fontWeight:"900",lineHeight:45,letterSpacing:-2,color:palette.ink,marginTop:2},
 subtitle:{fontSize:13,color:palette.secondary,lineHeight:22},
 progress:{flexDirection:"row",gap:5,marginBottom:5,marginTop:7},
 segment:{height:5,backgroundColor:palette.line,borderRadius:9,flex:1},
 card:{gap:17},
 cardHeader:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",gap:8},
 cardEyebrow:{fontSize:10,color:palette.secondary,fontWeight:"800",letterSpacing:1},
 statusLine:{flexDirection:"row",gap:15,alignItems:"center"},
 statusIcon:{width:49,height:49,borderRadius:14,backgroundColor:palette.accentSoft,alignItems:"center",justifyContent:"center"},
 currentLabel:{fontSize:10,fontWeight:"800",color:palette.muted,letterSpacing:1},
 currentStage:{fontSize:19,fontWeight:"800",color:palette.ink,letterSpacing:-.6,marginTop:5},
 path:{flexDirection:"row",gap:17,paddingTop:15,borderTopColor:palette.line,borderTopWidth:1},
 pathRail:{width:17,alignItems:"center",paddingTop:6,paddingBottom:11},
 fromDot:{height:11,width:11,borderRadius:6,borderWidth:3,borderColor:palette.accent},
 pathLine:{width:1,flex:1,backgroundColor:palette.line,minHeight:45},
 toDot:{height:11,width:11,backgroundColor:palette.ink,borderRadius:3},
 pathLabels:{flex:1,gap:23},routeLabel:{fontSize:10,color:palette.muted,fontWeight:"800",letterSpacing:1},
 routeName:{fontSize:14,fontWeight:"700",lineHeight:20,color:palette.ink,marginTop:5},
 bottomData:{borderTopColor:palette.line,borderTopWidth:1,paddingTop:19,flexDirection:"row",justifyContent:"space-between",gap:10},
 dataLabel:{fontSize:10,color:palette.muted,letterSpacing:1,fontWeight:"800"},
 dataValue:{fontSize:13,color:palette.ink,fontWeight:"700",marginTop:6},
 actionCard:{gap:16},actionTitle:{fontSize:23,letterSpacing:-.7,fontWeight:"800",color:palette.ink},
 copy:{fontSize:13,color:palette.secondary,lineHeight:22},
 pinPanel:{padding:20,borderRadius:13,backgroundColor:"#F2F5EF",alignItems:"center",gap:6,borderWidth:1,borderColor:palette.line},
 demoLabel:{fontSize:10,fontWeight:"800",letterSpacing:1.4,color:palette.secondary},
 demoPin:{fontSize:35,fontWeight:"900",letterSpacing:8,color:palette.ink},
 demoHelp:{fontSize:11,color:palette.muted,textAlign:"center",lineHeight:18},
 inputLabel:{fontSize:11,color:palette.inkLight,fontWeight:"800",letterSpacing:.8},
 pinInput:{height:57,borderWidth:1,borderColor:"#BCCAC0",backgroundColor:palette.surface,borderRadius:11,paddingHorizontal:15,
  color:palette.ink,fontSize:22,fontWeight:"800",letterSpacing:5},
 error:{padding:13,backgroundColor:palette.dangerSoft,borderRadius:11,flexDirection:"row",gap:10,alignItems:"center"},
 errorText:{flex:1,fontSize:12,color:palette.danger,lineHeight:18},
 completeIcon:{height:56,width:56,borderRadius:18,backgroundColor:palette.successSoft,alignItems:"center",justifyContent:"center"}
});
