import {useRouter} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {ScrollView,StyleSheet,Text,View,Pressable} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {DriverMark,DriverButton,InlineNotice,Kicker,Pill,Surface} from "../../src/components/ui";
import {palette} from "../../src/theme";
import {useTraining} from "../../src/state/training";

export default function DriverHome(){
 const router=useRouter();
 const {training}=useTraining();
 return <SafeAreaView edges={["top"]} style={styles.safe}>
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
   <View style={styles.header}><DriverMark/><Pill title="PREVIEW" icon="flask-outline"/></View>
   <View style={styles.welcome}><Kicker>YOUR SHIFT / TODAY</Kicker>
    <Text style={styles.title}>Ready when{"\n"}<Text style={{color:palette.accent}}>you are.</Text></Text>
    <Text style={styles.subtitle}>Your workday, kept simple. You'll see verified jobs here when your account is approved and dispatch goes live.</Text>
   </View>
   <Surface style={styles.availability}>
    <View style={styles.availRow}>
      <View style={styles.availIcon}><Ionicons name="power-outline" size={23} color={palette.ink}/></View>
      <Pill title="OFFLINE" icon="ellipse" tone="warn"/>
    </View>
    <Text style={styles.availHeading}>Not accepting real jobs</Text>
    <Text style={styles.availDetail}>Going online will unlock only after identity checks, eligible vehicle verification, authorized location access and a secure dispatch connection.</Text>
    <Pressable disabled accessibilityRole="switch" accessibilityState={{checked:false,disabled:true}}
      style={styles.lockedSwitch}><Ionicons name="lock-closed-outline" size={17} color={palette.secondary}/><Text style={styles.lockText}>Availability locked until verified</Text></Pressable>
   </Surface>
   <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>Today's workspace</Text><Text style={styles.caption}>NO LIVE DATA</Text></View>
   <View style={styles.stats}>
    <Surface style={styles.stat}><View style={styles.statIcon}><Ionicons name="briefcase-outline" size={22} color={palette.accent}/></View><Text style={styles.statTitle}>Assignments</Text><Text style={styles.statDesc}>Connect dispatch to view real work.</Text></Surface>
    <Surface style={styles.stat}><View style={styles.statIcon}><Ionicons name="cash-outline" size={22} color={palette.accent}/></View><Text style={styles.statTitle}>Earnings</Text><Text style={styles.statDesc}>No fabricated wallet totals.</Text></Surface>
   </View>
   <View style={styles.trainingCard}>
    <Kicker light>DRIVER TRAINING</Kicker>
    <Text style={styles.trainingTitle}>Learn the flow{"\n"}before the road.</Text>
    <Text style={styles.trainingDetail}>A guided example of offer acceptance, pickup verification and delivery handover. No customer is contacted.</Text>
    <DriverButton label={training.stage==="offer"?"Try the delivery walkthrough":"Continue training"} onPress={()=>router.push("/training")} icon="arrow-forward"/>
    <Text style={styles.trainingLabel}>SIMULATION ONLY · NOT A REAL JOB</Text>
   </View>
   <InlineNotice text="This preview requests no background GPS access and can't accept a real delivery. Never operate the app while riding." icon="shield-checkmark-outline"/>
  </ScrollView>
 </SafeAreaView>;
}
const styles=StyleSheet.create({
 safe:{flex:1,backgroundColor:palette.canvas},body:{paddingHorizontal:22,paddingBottom:48},
 header:{paddingVertical:19,flexDirection:"row",alignItems:"center",justifyContent:"space-between",gap:12},
 welcome:{paddingTop:32,paddingBottom:28,gap:12},
 title:{fontSize:49,lineHeight:54,fontWeight:"900",letterSpacing:-2.6,color:palette.ink},
 subtitle:{fontSize:15,color:palette.secondary,lineHeight:24,maxWidth:355},
 availability:{padding:21,gap:13},
 availRow:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
 availIcon:{width:44,height:44,borderRadius:13,backgroundColor:"#F1F3EE",justifyContent:"center",alignItems:"center"},
 availHeading:{fontSize:22,fontWeight:"800",color:palette.ink,letterSpacing:-.7,marginTop:8},
 availDetail:{fontSize:13,lineHeight:21,color:palette.secondary},
 lockedSwitch:{backgroundColor:"#F3F5F0",borderRadius:10,padding:15,flexDirection:"row",alignItems:"center",gap:9},
 lockText:{fontSize:12,color:palette.secondary,fontWeight:"700"},
 sectionHeading:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginTop:34,marginBottom:15},
 sectionTitle:{fontSize:22,fontWeight:"800",color:palette.ink,letterSpacing:-.65},
 caption:{fontSize:10,fontWeight:"800",letterSpacing:1,color:palette.muted},
 stats:{flexDirection:"row",gap:10},
 stat:{flex:1,minHeight:177,padding:16},statIcon:{width:43,height:43,backgroundColor:palette.accentSoft,borderRadius:12,alignItems:"center",justifyContent:"center",marginBottom:18},
 statTitle:{fontSize:16,fontWeight:"800",color:palette.ink,marginBottom:7},statDesc:{fontSize:12,color:palette.secondary,lineHeight:18},
 trainingCard:{backgroundColor:palette.ink,borderRadius:18,padding:23,marginTop:30,gap:15},
 trainingTitle:{fontSize:30,lineHeight:35,fontWeight:"800",letterSpacing:-1.1,color:"#FFFFFF"},
 trainingDetail:{fontSize:13,lineHeight:21,color:"#C5D0C7",marginBottom:5},
 trainingLabel:{fontSize:9,letterSpacing:1.2,color:"#B2C1B5",fontWeight:"800",textAlign:"center",marginTop:2}
});
