import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Action, Eyebrow, InfoState, ScreenTitle, Wordmark } from "../../src/components/ui";
import { colors } from "../../src/theme";
export default function Activity() {
 const router=useRouter();
 return <SafeAreaView edges={["top"]} style={{flex:1,backgroundColor:colors.canvas}}>
  <ScrollView contentContainerStyle={styles.scroll}>
   <Wordmark/><View style={styles.top}><Eyebrow>YOUR SHIPMENTS</Eyebrow><ScreenTitle title="Activity" sub="Your deliveries, when they are ready."/></View>
   <InfoState icon="file-tray-outline" title="No deliveries to show" body="This preview is not connected to a shipment account. We won't invent tracking activity or order history."/>
   <View style={{marginTop:16}}><Action title="Plan a delivery" onPress={()=>router.push("/book")}/></View>
  </ScrollView>
 </SafeAreaView>;
}
const styles=StyleSheet.create({scroll:{padding:22,paddingBottom:45},top:{gap:14,marginTop:47,marginBottom:28}});
