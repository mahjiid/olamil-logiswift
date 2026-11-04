import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DraftProvider } from "../src/state/draft";
import { CustomerAuthProvider } from "../src/state/auth";
import { colors } from "../src/theme";
export default function RootLayout() {
 return <SafeAreaProvider><CustomerAuthProvider><DraftProvider>
   <StatusBar barStyle="dark-content"/>
   <Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:colors.canvas}}}>
     <Stack.Screen name="(tabs)"/>
     <Stack.Screen name="book" options={{animation:"slide_from_right"}}/>
     <Stack.Screen name="review" options={{animation:"slide_from_right"}}/>
   </Stack>
 </DraftProvider></CustomerAuthProvider></SafeAreaProvider>;
}
