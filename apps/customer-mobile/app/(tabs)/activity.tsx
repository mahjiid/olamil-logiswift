import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Action, Eyebrow, InfoState, Panel, ScreenTitle, Wordmark } from "../../src/components/ui";
import { useCustomerAuth } from "../../src/state/auth";
import { bookingApiConfigured, listCustomerDrafts, type SavedDraft } from "../../src/lib/draft-api";
import { colors } from "../../src/theme";

export default function Activity() {
 const router=useRouter();
 const {user,loading,getAccessToken}=useCustomerAuth();
 const [drafts,setDrafts]=useState<SavedDraft[]>([]),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const load=useCallback(async()=>{
   if(!user||!bookingApiConfigured())return;
   setBusy(true);setError("");
   try{
     const token=await getAccessToken();
     if(!token){setError("Sign in again to view saved drafts.");setDrafts([]);return;}
     const result=await listCustomerDrafts(token);
     if(result.ok)setDrafts(result.drafts);
     else {setError(result.message);setDrafts([]);}
   }finally{setBusy(false);}
 },[getAccessToken,user]);
 useEffect(()=>{if(user){void load();}else{setDrafts([]);setError("");}},[user,load]);
 return <SafeAreaView edges={["top"]} style={{flex:1,backgroundColor:colors.canvas}}>
   <ScrollView contentContainerStyle={styles.scroll}>
    <Wordmark/><View style={styles.top}><Eyebrow>YOUR DELIVERIES</Eyebrow>
     <ScreenTitle title="Activity" sub="Your saved drafts, distinct from confirmed shipments."/></View>
    {loading?<InfoState icon="hourglass-outline" title="Checking account" body="Loading your session securely."/>
    :!user?<><InfoState icon="lock-closed-outline" title="Sign in to view drafts" body="Saved drafts are private to your account. No live deliveries are available in this preview."/>
      <View style={styles.action}><Action title="Sign in" onPress={()=>router.push("/account")}/></View></>
    :!bookingApiConfigured()?<InfoState icon="cloud-offline-outline" title="Draft history isn't connected yet" body="The booking API hasn't been configured for this build. Your account is not being shown fake shipment data."/>
    :busy?<InfoState icon="hourglass-outline" title="Loading your drafts" body="Retrieving your private draft history."/>
    :error?<><InfoState icon="alert-circle-outline" title="Couldn't load drafts" body={error}/><View style={styles.action}><Action title="Try again" onPress={()=>{void load();}}/></View></>
    :drafts.length===0?<><InfoState icon="file-tray-outline" title="No saved drafts yet" body="Plan a delivery, sign in, and explicitly save it to your account."/>
      <View style={styles.action}><Action title="Plan a delivery" onPress={()=>router.push("/book")}/></View></>
    :<View style={{gap:13}}>
      <Text style={styles.section}>SAVED DRAFTS · NOT CONFIRMED BOOKINGS</Text>
      {drafts.map(d=><Panel key={d.id}><View style={styles.row}>
        <View style={styles.icon}><Ionicons name="cube-outline" size={22} color={colors.orange}/></View>
        <View style={{flex:1}}><Text style={styles.label}>DELIVERY DRAFT</Text>
          <Text style={styles.route} numberOfLines={2}>{d.pickup}</Text>
          <View style={styles.arrow}><Ionicons name="arrow-down" size={15} color={colors.muted}/></View>
          <Text style={styles.route} numberOfLines={2}>{d.dropoff}</Text>
          <Text style={styles.date}>{Number.isNaN(Date.parse(d.created_at))?"Saved draft":new Date(d.created_at).toLocaleDateString("en-NG")} · No payment collected</Text>
        </View>
      </View></Panel>)}
      <Pressable accessibilityRole="button" onPress={()=>{void load();}} style={styles.refresh}><Ionicons name="refresh-outline" color={colors.inkSoft} size={18}/><Text style={styles.refreshText}>Refresh drafts</Text></Pressable>
     </View>}
   </ScrollView>
  </SafeAreaView>;
}
const styles=StyleSheet.create({
 scroll:{padding:22,paddingBottom:50},top:{gap:14,marginTop:38,marginBottom:27},
 action:{marginTop:16},section:{color:colors.muted,fontSize:10,fontWeight:"800",letterSpacing:1.25,marginBottom:7},
 row:{flexDirection:"row",gap:15,alignItems:"flex-start"},
 icon:{height:40,width:40,borderRadius:12,backgroundColor:colors.orangeSoft,justifyContent:"center",alignItems:"center"},
 label:{fontSize:10,color:colors.orange,fontWeight:"800",letterSpacing:1.1},
 route:{color:colors.ink,fontSize:14,fontWeight:"700",lineHeight:21,marginTop:8},
 arrow:{marginTop:6},date:{fontSize:11,color:colors.muted,marginTop:14},
 refresh:{flexDirection:"row",alignItems:"center",gap:9,alignSelf:"center",padding:14,marginTop:4},refreshText:{color:colors.inkSoft,fontWeight:"700"}
});
