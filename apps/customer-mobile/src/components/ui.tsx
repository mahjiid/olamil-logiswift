import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, type KeyboardTypeOptions, type TextInputProps } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, radii } from "../theme";

export function Wordmark({inverse=false}:{inverse?:boolean}) {
  return <View style={styles.brand} accessibilityLabel="ZAIOLA Delivery">
    <View style={[styles.brandMark,inverse && {backgroundColor:"#F1F1EB"}]}><Text style={[styles.brandZ,inverse&&{color:colors.ink}]}>Z</Text><View style={styles.brandDot}/></View>
    <View><Text style={[styles.brandName,inverse&&{color:"#FFFFFF"}]}>ZAIOLA<Text style={{color:colors.orange}}>.</Text></Text><Text style={[styles.brandCaption,inverse&&{color:"#AAB9AE"}]}>DELIVERY</Text></View>
  </View>;
}

export function Action({title,onPress,kind="primary",icon="arrow-forward",disabled=false}:{
  title:string;onPress:()=>void;kind?:"primary"|"dark"|"secondary";icon?:keyof typeof Ionicons.glyphMap;disabled?:boolean
}) {
 return <Pressable disabled={disabled} accessibilityRole="button" accessibilityState={{disabled}}
  onPress={onPress} style={({pressed})=>[styles.action,kind==="dark"&&styles.actionDark,kind==="secondary"&&styles.actionSecondary,pressed&&{opacity:.87},disabled&&{opacity:.5}]}>
   <Text style={[styles.actionText,kind==="secondary"&&{color:colors.ink}]}>{title}</Text>
   <Ionicons name={icon} color={kind==="secondary"?colors.ink:"#fff"} size={19}/>
 </Pressable>;
}

export function Panel({children,style}:{children:ReactNode;style?:object}) {
 return <View style={[styles.panel,style]}>{children}</View>;
}

export function TextField({label,value,onChangeText,placeholder,keyboardType,autoCapitalize="sentences",multiline=false,...props}:{
 label:string;value:string;onChangeText:(v:string)=>void;placeholder:string;keyboardType?:KeyboardTypeOptions;autoCapitalize?:TextInputProps["autoCapitalize"];multiline?:boolean;
} & Omit<TextInputProps,"value"|"onChangeText"|"placeholder"|"keyboardType"|"autoCapitalize"|"multiline">) {
 return <View style={{gap:8}}><Text style={styles.fieldLabel}>{label}</Text><TextInput
  value={value} onChangeText={onChangeText} placeholder={placeholder} keyboardType={keyboardType}
  autoCapitalize={autoCapitalize} multiline={multiline} placeholderTextColor="#859188" selectionColor={colors.orange}
  style={[styles.field,multiline&&{height:96,textAlignVertical:"top"}]} {...props}/></View>;
}
export function Eyebrow({children}:{children:ReactNode}) {return <Text style={styles.eyebrow}>{children}</Text>;}
export function ScreenTitle({title,sub}:{title:string;sub?:string}) {return <View style={{gap:8}}><Text style={styles.heading}>{title}</Text>{sub?<Text style={styles.sub}>{sub}</Text>:null}</View>;}
export function InfoState({icon,title,body}:{icon:keyof typeof Ionicons.glyphMap;title:string;body:string}) {
 return <Panel style={{padding:25,alignItems:"flex-start",gap:12}}><View style={styles.infoIcon}><Ionicons name={icon} size={23} color={colors.orange}/></View><Text style={{fontSize:19,fontWeight:"750",color:colors.ink}}>{title}</Text><Text style={styles.sub}>{body}</Text></Panel>;
}
const styles=StyleSheet.create({
 brand:{flexDirection:"row",alignItems:"center",gap:9},
 brandMark:{width:36,height:36,borderRadius:11,backgroundColor:colors.ink,alignItems:"center",justifyContent:"center"},
 brandZ:{fontWeight:"900",fontSize:24,color:"#FFFFFF",letterSpacing:-1},
 brandDot:{position:"absolute",right:-2,top:3,width:6,height:6,borderRadius:3,backgroundColor:colors.orange},
 brandName:{fontSize:20,fontWeight:"900",letterSpacing:1,color:colors.ink,lineHeight:22},
 brandCaption:{fontSize:9,fontWeight:"800",letterSpacing:2.9,color:colors.muted,marginTop:2},
 action:{minHeight:56,borderRadius:radii.control,backgroundColor:colors.orange,paddingHorizontal:19,flexDirection:"row",alignItems:"center",justifyContent:"space-between",gap:14},
 actionDark:{backgroundColor:colors.ink},
 actionSecondary:{backgroundColor:"#FFFFFF",borderWidth:1,borderColor:colors.border},
 actionText:{fontSize:15,fontWeight:"750",color:"#FFFFFF"},
 panel:{backgroundColor:colors.paper,borderColor:colors.border,borderWidth:1,borderRadius:radii.panel,padding:18},
 fieldLabel:{color:colors.inkSoft,fontWeight:"750",fontSize:12},
 field:{backgroundColor:"#FBFCF9",borderColor:"#CAD5CD",borderWidth:1,borderRadius:radii.control,minHeight:52,paddingHorizontal:14,fontSize:15,color:colors.ink},
 eyebrow:{fontSize:10,fontWeight:"800",letterSpacing:2,color:colors.orange},
 heading:{fontSize:30,fontWeight:"800",color:colors.ink,letterSpacing:-1.2,lineHeight:36},
 sub:{fontSize:14,lineHeight:22,color:colors.muted},
 infoIcon:{width:46,height:46,borderRadius:13,backgroundColor:colors.orangeSoft,alignItems:"center",justifyContent:"center"}
});
