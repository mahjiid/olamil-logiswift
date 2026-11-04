import type {ReactNode} from "react";
import {Pressable,StyleSheet,Text,View,type ViewStyle} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {palette,layout} from "../theme";
type Icon=keyof typeof Ionicons.glyphMap;
export function DriverMark({dark=false}:{dark?:boolean}){
 return <View style={styles.brand} accessibilityLabel="ZAIOLA Driver">
  <View style={[styles.mark,dark&&{backgroundColor:palette.surface}]}><Text style={[styles.z,dark&&{color:palette.ink}]}>Z</Text><View style={styles.dot}/></View>
  <View><Text style={[styles.word,dark&&{color:"#FFFFFF"}]}>ZAIOLA<Text style={{color:palette.accent}}>.</Text></Text><Text style={[styles.descriptor,dark&&{color:"#B9C8BC"}]}>DRIVER</Text></View>
 </View>;
}
export function Surface({children,style}:{children:ReactNode;style?:ViewStyle}){
 return <View style={[styles.panel,style]}>{children}</View>;
}
export function Kicker({children,light=false}:{children:ReactNode;light?:boolean}){
 return <Text style={[styles.kicker,light&&{color:"#F0A590"}]}>{children}</Text>;
}
export function PageHeading({title,description}:{title:string;description?:string}){
 return <View style={{gap:8}}><Text style={styles.title}>{title}</Text>{description?<Text style={styles.description}>{description}</Text>:null}</View>;
}
export function Pill({title,icon,tone="neutral"}:{title:string;icon?:Icon;tone?:"neutral"|"warn"|"success"}){
 const surface=tone==="warn"?palette.cautionSoft:tone==="success"?palette.successSoft:"#E9EFE8";
 const color=tone==="warn"?palette.caution:tone==="success"?palette.success:palette.inkLight;
 return <View style={[styles.pill,{backgroundColor:surface}]}>
  {icon?<Ionicons name={icon} size={14} color={color}/>:null}<Text style={{color,fontSize:10,fontWeight:"800",letterSpacing:.5}}>{title}</Text>
 </View>;
}
export function DriverButton({label,onPress,icon="arrow-forward",variant="accent",disabled=false}:{
 label:string;onPress:()=>void;icon?:Icon;variant?:"accent"|"dark"|"outline";disabled?:boolean
}){
 const isOutline=variant==="outline";
 return <Pressable accessibilityRole="button" accessibilityState={{disabled}} onPress={onPress} disabled={disabled}
  style={({pressed})=>[styles.button,variant==="dark"&&{backgroundColor:palette.ink},isOutline&&styles.outline,pressed&&{opacity:.82},disabled&&{opacity:.5}]}>
  <Text style={[styles.buttonText,isOutline&&{color:palette.ink}]}>{label}</Text>
  <Ionicons name={icon} color={isOutline?palette.ink:"#FFFFFF"} size={20}/>
 </Pressable>;
}
export function InlineNotice({text,icon="information-circle-outline",kind="neutral"}:{text:string;icon?:Icon;kind?:"neutral"|"warning"}){
 return <View style={[styles.notice,kind==="warning"&&{backgroundColor:palette.cautionSoft,borderColor:"#EED5B2"}]}>
  <Ionicons name={icon} size={20} color={kind==="warning"?palette.caution:palette.inkLight}/>
  <Text style={styles.noticeText}>{text}</Text>
 </View>;
}
const styles=StyleSheet.create({
 brand:{flexDirection:"row",alignItems:"center",gap:9},
 mark:{width:40,height:40,borderRadius:12,backgroundColor:palette.ink,alignItems:"center",justifyContent:"center"},
 z:{color:"#FFFFFF",fontSize:26,fontWeight:"900",letterSpacing:-1},
 dot:{position:"absolute",top:4,right:-3,width:6,height:6,backgroundColor:palette.accent,borderRadius:3},
 word:{fontSize:20,color:palette.ink,fontWeight:"900",letterSpacing:1.1,lineHeight:23},
 descriptor:{fontSize:9,fontWeight:"800",color:palette.secondary,letterSpacing:3.5,lineHeight:13},
 panel:{padding:20,backgroundColor:palette.surface,borderWidth:1,borderColor:palette.line,borderRadius:layout.panel},
 kicker:{color:palette.accent,fontSize:10,fontWeight:"800",letterSpacing:1.9},
 title:{fontSize:34,lineHeight:40,letterSpacing:-1.5,fontWeight:"900",color:palette.ink},
 description:{color:palette.secondary,fontSize:14,lineHeight:22},
 pill:{alignSelf:"flex-start",borderRadius:layout.pill,paddingHorizontal:12,paddingVertical:8,flexDirection:"row",alignItems:"center",gap:6},
 button:{minHeight:56,borderRadius:layout.control,backgroundColor:palette.accent,paddingHorizontal:20,
  flexDirection:"row",alignItems:"center",justifyContent:"space-between",gap:12},
 buttonText:{fontSize:15,fontWeight:"800",color:"#FFFFFF",flexShrink:1},
 outline:{backgroundColor:palette.surface,borderWidth:1,borderColor:palette.line},
 notice:{borderWidth:1,borderColor:palette.line,backgroundColor:"#EAF0E9",borderRadius:11,
  flexDirection:"row",alignItems:"flex-start",padding:15,gap:11},
 noticeText:{flex:1,color:palette.inkLight,fontSize:12,lineHeight:20}
});
