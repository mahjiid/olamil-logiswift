import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Eyebrow, Panel, ScreenTitle, Wordmark } from "../../src/components/ui";
import { colors } from "../../src/theme";
export default function Account() {
 return <SafeAreaView edges={["top"]} style={{flex:1,backgroundColor:colors.canvas}}>
  <ScrollView contentContainerStyle={styles.scroll}>
   <Wordmark/><View style={styles.top}><Eyebrow>PERSONAL SPACE</Eyebrow><ScreenTitle title="Your account" sub="A better delivery experience starts with trust."/></View>
   <Panel style={{padding:25}}><View style={styles.profile}><Ionicons name="person-outline" size={23} color={colors.ink}/></View>
    <Text style={styles.panelTitle}>You're exploring a preview</Text>
    <Text style={styles.body}>Sign-in and saved addresses will be enabled when the secure identity service is connected. No personal account has been created.</Text>
   </Panel>
   <View style={{marginTop:16}}><Panel><Text style={styles.panelTitle}>About ZAIOLA Delivery</Text>
    <Text style={styles.body}>Designed around straightforward booking, transparent milestones, and dependable handover.</Text>
    <View style={styles.version}><Text style={styles.versionText}>CUSTOMER APP / PREVIEW</Text><Text style={styles.versionText}>VERSION 0.1</Text></View></Panel></View>
  </ScrollView>
 </SafeAreaView>;
}
const styles=StyleSheet.create({
 scroll:{padding:22,paddingBottom:45},top:{gap:14,marginTop:47,marginBottom:28},profile:{width:55,height:55,borderRadius:17,backgroundColor:colors.orangeSoft,justifyContent:"center",alignItems:"center",marginBottom:20},
 panelTitle:{fontWeight:"800",fontSize:18,color:colors.ink,letterSpacing:-.6},body:{fontSize:14,lineHeight:23,color:colors.muted,marginTop:10},
 version:{flexDirection:"row",justifyContent:"space-between",borderTopWidth:1,borderTopColor:colors.border,paddingTop:17,marginTop:25},versionText:{fontSize:10,color:colors.muted,letterSpacing:1,fontWeight:"700"}
});
