import {Stack} from "expo-router";
import {StatusBar} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {TrainingProvider} from "../src/state/training";
import {palette} from "../src/theme";

export default function RootLayout(){
 return <SafeAreaProvider><TrainingProvider>
  <StatusBar barStyle="dark-content"/>
  <Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:palette.canvas}}}>
   <Stack.Screen name="(tabs)"/>
   <Stack.Screen name="training" options={{animation:"slide_from_right"}}/>
  </Stack>
 </TrainingProvider></SafeAreaProvider>;
}
