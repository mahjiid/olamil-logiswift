import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Eyebrow, InfoState, ScreenTitle, Wordmark } from "../../src/components/ui";
import { colors } from "../../src/theme";
export default function Payments() {
 return <SafeAreaView edges={["top"]} style={{flex:1,backgroundColor:colors.canvas}}>
  <ScrollView contentContainerStyle={styles.scroll}>
   <Wordmark/><View style={styles.top}><Eyebrow>PAYMENTS & RECEIPTS</Eyebrow><ScreenTitle title="Payments" sub="Clear charges. No surprises."/></View>
   <InfoState icon="card-outline" title="Payments aren't connected" body="No payment methods or transactions are stored here. Secure checkout, verified receipts and refunds will become available after backend integration."/>
  </ScrollView>
 </SafeAreaView>;
}
const styles=StyleSheet.create({scroll:{padding:22,paddingBottom:45},top:{gap:14,marginTop:47,marginBottom:28}});
