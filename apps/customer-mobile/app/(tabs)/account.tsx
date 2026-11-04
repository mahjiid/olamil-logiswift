import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Action, Eyebrow, Panel, ScreenTitle, TextField, Wordmark } from "../../src/components/ui";
import { useCustomerAuth } from "../../src/state/auth";
import { colors } from "../../src/theme";

export default function Account() {
 const {user,loading,configured,signIn,signUp,signOut}=useCustomerAuth();
 const [mode,setMode]=useState<"signin"|"signup">("signin");
 const [email,setEmail]=useState(""),[password,setPassword]=useState("");
 const [busy,setBusy]=useState(false),[message,setMessage]=useState("");
 async function submit(){
  if(busy)return;
  if(!/^\S+@\S+\.\S+$/.test(email.trim())||password.length<8){
   setMessage("Enter a valid email and password of at least 8 characters.");return;
  }
  setBusy(true);setMessage("");
  try{
   const response=mode==="signin"?await signIn(email,password):await signUp(email,password);
   if(response.error)setMessage(response.error);
   else if(response.pendingConfirmation)setMessage("Check your inbox to confirm this email, then sign in.");
   else setMessage(mode==="signin"?"Signed in for this app session.":"Account created.");
   setPassword("");
  }finally{setBusy(false);}
 }
 async function logout(){
  setBusy(true);try{const result=await signOut();setMessage(result.error??"Signed out.");}finally{setBusy(false);}
 }
 return <SafeAreaView edges={["top"]} style={{flex:1,backgroundColor:colors.canvas}}>
  <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==="ios"?"padding":undefined}>
   <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
    <Wordmark/><View style={styles.top}><Eyebrow>PERSONAL SPACE</Eyebrow><ScreenTitle title="Your account" sub="One identity, clearer delivery experiences."/></View>
    {!configured?<Panel style={{padding:24}}>
      <Ionicons name="shield-checkmark-outline" size={29} color={colors.orange}/>
      <Text style={styles.title}>Secure sign-in is not connected yet.</Text>
      <Text style={styles.body}>This build does not have an approved Supabase project configured. No credentials will be submitted. Contact the development team to activate the secure environment.</Text>
     </Panel>
    :loading?<Panel><Text style={styles.body}>Checking account session…</Text></Panel>
    :user?<Panel style={{gap:14}}>
      <View style={styles.profile}><Ionicons name="person-outline" size={25} color={colors.ink}/></View>
      <Text style={styles.title}>You're signed in.</Text>
      <Text style={styles.body}>Signed in as {user.email??"a verified customer"}. Your session is kept in memory for this preview and will not survive an app restart.</Text>
      <Action title={busy?"Signing out…":"Sign out"} kind="secondary" icon="log-out-outline" disabled={busy} onPress={logout}/>
     </Panel>
    :<Panel style={{gap:17}}>
      <Text style={styles.title}>{mode==="signin"?"Welcome back.":"Create your account."}</Text>
      <Text style={styles.body}>{mode==="signin"?"Enter your verified account details.":"We'll send a verification email if your identity service requires it."}</Text>
      <TextField label="EMAIL ADDRESS" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoComplete="email" autoCapitalize="none" maxLength={254}/>
      <TextField label="PASSWORD" value={password} onChangeText={setPassword} placeholder="At least 8 characters" secureTextEntry autoCapitalize="none" autoComplete={mode==="signin"?"current-password":"new-password"} maxLength={128}/>
      <Action title={busy?"Working…":mode==="signin"?"Sign in":"Create account"} onPress={submit} disabled={busy}/>
      <Pressable onPress={()=>{setMode(mode==="signin"?"signup":"signin");setPassword("");setMessage("");}} accessibilityRole="button" style={{paddingVertical:12,alignSelf:"center"}}>
       <Text style={styles.switch}>{mode==="signin"?"New here? Create an account":"Already have an account? Sign in"}</Text>
      </Pressable>
     </Panel>}
    {message?<View style={styles.message} accessibilityRole="alert"><Text style={styles.messageText}>{message}</Text></View>:null}
    <View style={{marginTop:17}}><Panel><Text style={styles.title}>Your privacy matters.</Text>
      <Text style={styles.body}>No delivery details are uploaded without an explicit save action. This preview does not initiate payments or driver assignments.</Text>
      <Text style={styles.note}>ZAIOLA DELIVERY · PREVIEW BUILD</Text>
     </Panel></View>
   </ScrollView>
  </KeyboardAvoidingView>
 </SafeAreaView>;
}
const styles=StyleSheet.create({
 scroll:{padding:22,paddingBottom:45},top:{gap:14,marginTop:38,marginBottom:25},
 profile:{height:55,width:55,borderRadius:17,backgroundColor:colors.orangeSoft,justifyContent:"center",alignItems:"center"},
 title:{fontSize:20,fontWeight:"800",color:colors.ink,letterSpacing:-.5,marginTop:5},
 body:{fontSize:13,color:colors.muted,lineHeight:21,marginTop:5},
 switch:{color:colors.orange,fontWeight:"700",fontSize:13},
 message:{marginTop:14,padding:13,borderWidth:1,borderColor:"#DBE5DA",backgroundColor:"#E9F3EA",borderRadius:11},
 messageText:{fontSize:13,lineHeight:20,color:colors.inkSoft},
 note:{fontSize:10,fontWeight:"700",letterSpacing:1,color:colors.muted,marginTop:22}
});
