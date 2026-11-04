"use client";

import {useCallback,useEffect,useMemo,useState,type FormEvent,type ReactNode} from "react";
import {
 Activity,ArrowRight,ArrowUpRight,BarChart3,CheckCircle2,ChevronRight,
 CircleHelp,Clock3,CreditCard,FileClock,Headphones,Layers3,LayoutDashboard,
 LockKeyhole,LogOut,MapPin,Package,RefreshCcw,Search,Settings2,ShieldCheck,
 Truck,UsersRound,WifiOff
} from "lucide-react";
import {opsBrowserAuth} from "@/lib/ops-browser-auth";
import {dispatchGroups,overviewFromVisible,searchShipments,statusLabel,ORDER_STATUSES,
 type OpsArea,type OpsShipment,type OpsDriver,type OperationsSnapshot,type OpsStatus
} from "@/lib/ops-model";

const navigation=[
 {key:"overview",label:"Overview",icon:LayoutDashboard},
 {key:"orders",label:"Orders",icon:Package},
 {key:"dispatch",label:"Dispatch",icon:Layers3},
 {key:"drivers",label:"Drivers",icon:Truck},
 {key:"finance",label:"Finance",icon:CreditCard},
 {key:"support",label:"Support",icon:Headphones},
 {key:"analytics",label:"Analytics",icon:BarChart3},
 {key:"settings",label:"Settings",icon:Settings2}
] as const;

const statusTone=(s:OpsStatus)=>{
 if(s==="delivered")return "success";
 if(s==="failed"||s==="cancelled")return "danger";
 if(s==="awaiting_dispatch"||s==="assigning")return "warning";
 return "active";
};
const formatDate=(value:string)=>{
 const timestamp=Date.parse(value);
 return Number.isFinite(timestamp)?new Intl.DateTimeFormat("en-NG",{dateStyle:"medium"}).format(new Date(timestamp)):"Unknown date";
};

export function OperationsDashboard(){
 const [active,setActive]=useState<OpsArea>("overview");
 const [snapshot,setSnapshot]=useState<OperationsSnapshot|null>(null);
 const [phase,setPhase]=useState<"checking"|"unconfigured"|"signed-out"|"loading"|"ready"|"forbidden"|"error">("checking");
 const [message,setMessage]=useState("");
 const [email,setEmail]=useState(""),[password,setPassword]=useState("");
 const [busy,setBusy]=useState(false),[search,setSearch]=useState(""),[filter,setFilter]=useState("all");
 const fetchOverview=useCallback(async(token:string)=>{
  setPhase("loading");setMessage("");
  try{
   const response=await fetch("/api/v2/ops/overview",{
    headers:{"Authorization":`Bearer ${token}`},cache:"no-store"
   });
   if(!response.ok){
    setSnapshot(null);
    setPhase(response.status===401?"signed-out":response.status===403||response.status===409?"forbidden":"error");
    const readable:Record<number,string>={
     401:"Your session expired. Sign in again.",
     403:"This account has not been approved as an operations team member.",
     409:"This account has access to multiple workspaces. Workspace selection is not enabled yet.",
     503:"The operations backend is not available. Connect the approved staging environment."
    };
    setMessage(readable[response.status]||"Unable to retrieve operations data. Try again.");
    return;
   }
   const body:unknown=await response.json();
   if(!body||typeof body!=="object"||!("readOnly" in body)||!(body as {readOnly:unknown}).readOnly){
    setPhase("error");setMessage("Unexpected operations API response.");return;
   }
   const parsed=body as OperationsSnapshot;
   if(!Array.isArray(parsed.shipments)||!Array.isArray(parsed.drivers)){
    setPhase("error");setMessage("Invalid operations data.");return;
   }
   setSnapshot(parsed);setPhase("ready");
  }catch{setSnapshot(null);setPhase("error");setMessage("The operations API could not be reached.");}
 },[]);
 useEffect(()=>{
  let open=true;
  if(!opsBrowserAuth){setPhase("unconfigured");return;}
  opsBrowserAuth.auth.getSession().then(async({data})=>{
   if(!open)return;
   if(data.session?.access_token)await fetchOverview(data.session.access_token);
   else setPhase("signed-out");
  }).catch(()=>{if(open)setPhase("signed-out");});
  return()=>{open=false;};
 },[fetchOverview]);
 async function signin(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(!opsBrowserAuth||busy)return;
  if(!email.trim()||!password){setMessage("Enter your operator email and password.");return;}
  setBusy(true);setMessage("");
  try{
   const response=await opsBrowserAuth.auth.signInWithPassword({email:email.trim(),password});
   setPassword("");
   if(response.error||!response.data.session){setMessage("Unable to sign in. Check your details and account verification.");return;}
   await fetchOverview(response.data.session.access_token);
  }catch{setMessage("Sign-in service is unavailable.");}finally{setBusy(false);}
 }
 async function signout(){
  if(opsBrowserAuth)await opsBrowserAuth.auth.signOut().catch(()=>null);
  setSnapshot(null);setEmail("");setPassword("");setMessage("");setPhase("signed-out");
 }
 async function reload(){
  if(!opsBrowserAuth){setPhase("unconfigured");return;}
  const {data,error}=await opsBrowserAuth.auth.getSession();
  if(error||!data.session){setPhase("signed-out");setMessage("Sign in to refresh operations.");return;}
  await fetchOverview(data.session.access_token);
 }
 const data=snapshot;
 const counts=useMemo(()=>overviewFromVisible(data?.shipments??[],data?.drivers??[]),[data]);
 const shipments=useMemo(()=>searchShipments(data?.shipments??[],search,filter),[data,search,filter]);
 const groups=useMemo(()=>dispatchGroups(data?.shipments??[]),[data]);
 const allowed=phase==="ready"&&!!data;
 const tabTitle=navigation.find(x=>x.key===active)?.label||"Overview";
 return <div className="zo-app">
  <aside className="zo-aside">
   <a className="zo-brand" href="/v2/ops" aria-label="ZAIOLA Control Tower">
     <span className="zo-symbol">Z<i/></span><span className="zo-wordmark"><strong>ZAIOLA<span>.</span></strong><small>CONTROL TOWER</small></span>
   </a>
   <div className="zo-aside-section"><span className="zo-aside-caption">WORKSPACE</span><div className="zo-workspace">
     <div className="zo-workspace-avatar">ZD</div>
     <div><strong>Delivery operations</strong><small>{allowed?"Protected workspace":"Restricted access"}</small></div>
     <ChevronRight size={15} aria-hidden="true"/>
   </div></div>
   <div className="zo-nav-title">GENERAL</div>
   <nav className="zo-nav" aria-label="Operations views">
    {navigation.map(({key,label,icon:Icon},index)=>
     <button key={key} className={`zo-nav-item ${active===key?"is-active":""} ${index===4?"zo-nav-break":""}`}
      type="button" onClick={()=>setActive(key)} aria-current={active===key?"page":undefined}>
      <Icon size={18} strokeWidth={1.8}/><span>{label}</span>
      {key==="dispatch"?<span className="zo-nav-pin" aria-hidden="true"/>:null}
     </button>
    )}
   </nav>
   <div className="zo-aside-bottom">
    <div className="zo-aside-safety"><ShieldCheck size={18}/><span>Controlled operations<br/><small>Read-only integration</small></span></div>
    <div className="zo-aside-copy">ZAIOLA DELIVERY / V2</div>
   </div>
  </aside>
  <div className="zo-main">
   <header className="zo-topbar">
     <div className="zo-breadcrumb"><span>Workspace</span><ChevronRight size={14}/><strong>{tabTitle}</strong></div>
     <div className="zo-topbar-actions">
      <span className="zo-topbar-badge"><span className={allowed?"zo-live-dot":"zo-off-dot"}/>{allowed?"Protected data":"Connection restricted"}</span>
      {allowed?<button className="zo-top-icon" type="button" onClick={()=>{void reload();}} aria-label="Refresh operations"><RefreshCcw size={18}/></button>:null}
      {allowed?<button className="zo-signout" onClick={()=>{void signout();}} type="button"><LogOut size={16}/> Sign out</button>:null}
     </div>
   </header>
   <main className="zo-content" id="main">
    <div className="zo-heading">
     <div><span className="zo-kicker">ZAIOLA / OPERATIONS</span>
      <h1>{active==="overview"?"Your operations,":active==="orders"?"Every order,":active==="dispatch"?"Keep the city":active==="drivers"?"Your delivery":active==="finance"?"Financial":active==="analytics"?"Operational":active==="support"?"Support":"Workspace"} <em>{active==="overview"?"in focus.":active==="orders"?"accounted for.":active==="dispatch"?"moving.":active==="drivers"?"network.":active==="finance"?"clarity.":active==="analytics"?"intelligence.":active==="support"?"requests.":"settings."}</em></h1>
      <p>{active==="overview"?"Monitor verified delivery and driver records in one controlled workspace.":active==="orders"?"Search, filter and review orders without changing their status.":active==="dispatch"?"Track dispatch stages before connecting real assignments.":active==="drivers"?"See verified driver availability when identity integration is enabled.":active==="finance"?"Financial records require a separate audited settlement ledger.":active==="analytics"?"Measured from verified operational records—not manufactured analytics.":active==="support"?"A secure support queue will appear after case management is connected.":"Access, permissions and operational connections."}</p>
     </div>
     <div className="zo-heading-aside"><span className="zo-heading-aside-top"><Clock3 size={15}/> OPERATIONAL CONTROL</span>
      <strong>{allowed?"Verified access":"Setup required"}</strong><small>{allowed?`Role: ${data?.role}`:"No privileged data exposed"}</small>
     </div>
    </div>
    {!allowed? <section className="zo-access-grid" aria-label="Operations access requirements">
      <div className="zo-access-main">
       <div className="zo-access-icon"><LockKeyhole size={27}/></div>
       <span className="zo-kicker">SECURE BY DESIGN</span>
       <h2>{phase==="unconfigured"?"Connect the operations environment.":phase==="forbidden"?"Access needs approval.":phase==="error"?"The control tower is offline.":phase==="checking"||phase==="loading"?"Verifying access.":"Sign in to the control tower."}</h2>
       <p>{phase==="unconfigured"?"The dashboard is ready for an approved Supabase project. Until then, operator accounts and real operational data stay disconnected.":phase==="forbidden"?"Your sign-in was recognized, but you don't have an active operator membership for a single workspace.":phase==="error"?"The protected API could not return verified records. No example orders are shown as live.":phase==="checking"||phase==="loading"?"Checking your identity and organization membership before loading any records.":"Only approved ZAIOLA operations staff can access real delivery and driver records."}</p>
       {opsBrowserAuth&&(phase==="signed-out"||phase==="forbidden"||phase==="error")? <form className="zo-login" onSubmit={signin}>
         <label>Operator email<input type="email" required autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@company.com"/></label>
         <label>Password<input type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Account password"/></label>
         {message?<p className="zo-form-error" role="alert">{message}</p>:null}
         <button className="zo-primary-button" disabled={busy} type="submit">{busy?"Checking access…":"Sign in securely"} <ArrowRight size={18}/></button>
        </form>:null}
       {(phase==="error"||phase==="forbidden")?<button className="zo-link-button" type="button" onClick={()=>{void reload();}}><RefreshCcw size={16}/> Check access again</button>:null}
       {!opsBrowserAuth?<div className="zo-setup-alert"><WifiOff size={18}/> No live connection or credentials are stored in this prototype.</div>:null}
      </div>
      <div className="zo-access-right">
       <span className="zo-kicker">READY FOR INTEGRATION</span>
       <h3>A better view of what matters.</h3>
       <div className="zo-readiness">
        {[
         ["01","Operator authorization","Account and organization membership required"],
         ["02","Protected order visibility","Cross-organization access blocked by RLS"],
         ["03","Controlled dispatch","Assignment mutations disabled until verified"],
         ["04","Driver & financial integrity","No simulated GPS, payouts or orders"]
        ].map(([num,title,sub])=><div key={num} className="zo-readiness-item">
          <span>{num}</span><div><strong>{title}</strong><small>{sub}</small></div><LockKeyhole size={15}/>
         </div>)}
       </div>
       <div className="zo-access-footer"><ShieldCheck size={19}/> No production delivery action can be taken here.</div>
      </div>
     </section>
    : <>
      {active==="overview"?<Overview data={data} counts={counts} onSwitch={setActive}/>:null}
      {active==="orders"?<Orders shipments={shipments} search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} total={data.shipments.length}/>:null}
      {active==="dispatch"?<Dispatch groups={groups}/>:null}
      {active==="drivers"?<Drivers drivers={data.drivers}/>:null}
      {active==="finance"?<Unconnected icon={<CreditCard size={31}/>} label="FINANCIAL RECORDS" title="No finance ledger connected." details="Revenue, settlements, invoices and refunds must come from a reconciled server-side ledger. We will never display fabricated payments or wallet balances."/>:null}
      {active==="support"?<Unconnected icon={<Headphones size={31}/>} label="CASE MANAGEMENT" title="Support case system pending." details="Customer conversations and disputes require an audited, role-scoped ticket service. No inbox data is synchronized in this sprint."/>:null}
      {active==="analytics"?<Analytics shipments={data.shipments} drivers={data.drivers} counts={counts}/>:null}
      {active==="settings"?<Settings data={data}/>:null}
     </>}
    <footer className="zo-footer"><span>ZAIOLA DELIVERY <i/> OPERATIONS FOUNDATION</span><span>{allowed?"Protected, read-only snapshot":"Environment not connected"}</span></footer>
   </main>
  </div>
 </div>;
}

function Metric({label,value,note,icon}:{label:string;value:string|number;note:string;icon:ReactNode}){
 return <article className="zo-metric"><div className="zo-metric-head"><span>{label}</span><span className="zo-metric-icon">{icon}</span></div>
  <strong>{value}</strong><small>{note}</small></article>;
}
function Overview({data,counts,onSwitch}:{data:OperationsSnapshot;counts:ReturnType<typeof overviewFromVisible>;onSwitch:(v:OpsArea)=>void}){
 const current=data.shipments.slice(0,5);
 return <>
  <div className="zo-metrics">
   <Metric label="Loaded orders" value={counts.visibleShipments} note="Latest 100 records maximum" icon={<Package size={21}/>}/>
   <Metric label="Awaiting dispatch" value={counts.awaitingDispatch} note="Within loaded orders" icon={<Clock3 size={21}/>}/>
   <Metric label="In progress" value={counts.inProgress} note="Within loaded orders" icon={<Activity size={21}/>}/>
   <Metric label="Available drivers" value={counts.availableDrivers} note="Approved & available in loaded list" icon={<Truck size={21}/>}/>
  </div>
  <div className="zo-dashboard-row">
   <section className="zo-panel zo-recent">
    <div className="zo-panel-top"><div><span className="zo-section-number">01 / SHIPMENTS</span><h2>Recent activity</h2></div>
     <button type="button" className="zo-text-action" onClick={()=>onSwitch("orders")}>View orders <ArrowUpRight size={17}/></button></div>
    {current.length?<div className="zo-recent-rows">{current.map(order=><div className="zo-recent-row" key={order.id}>
       <div className="zo-route-symbol"><Package size={18}/></div>
       <div className="zo-recent-info"><strong>{order.reference}</strong><small>{order.pickup_area} <ArrowRight size={11} aria-hidden="true"/> {order.dropoff_area}</small></div>
       <Status value={order.status}/></div>)}</div>
     :<Empty icon={<FileClock size={26}/>} title="No verified shipments yet" detail="Order activity will appear when the protected operations database is populated."/>}
   </section>
   <section className="zo-panel zo-team-panel"><div className="zo-panel-top"><div><span className="zo-section-number">02 / NETWORK</span><h2>Driver readiness</h2></div></div>
    <div className="zo-team-number"><strong>{counts.approvedDrivers}<small> / {counts.driverProfiles}</small></strong><p>Approved profiles in loaded records</p></div>
    <div className="zo-team-strips"><div><span>Available</span><strong>{counts.availableDrivers}</strong></div>
     <div><span>Other statuses</span><strong>{counts.driverProfiles-counts.availableDrivers}</strong></div></div>
    <p className="zo-fine">Driver states are read-only summaries. No GPS or location sharing is enabled.</p>
    <button type="button" className="zo-text-action" onClick={()=>onSwitch("drivers")}>Explore network <ArrowRight size={17}/></button>
   </section>
  </div>
  <div className="zo-bottom-notice"><ShieldCheck size={20}/><div><strong>Every number is sourced—not simulated.</strong>
   <p>These summaries cover only the records loaded by this protected API, capped at 100 per collection. They are not global totals or live map locations.</p></div>
   <span>READ ONLY</span></div>
 </>;
}
function Status({value}:{value:OpsStatus}){return <span className={`zo-status zo-status--${statusTone(value)}`}><i/>{statusLabel(value)}</span>;}
function Empty({icon,title,detail}:{icon:ReactNode;title:string;detail:string}){
 return <div className="zo-empty"><span className="zo-empty-icon">{icon}</span><strong>{title}</strong><p>{detail}</p></div>;
}
function Orders({shipments,search,setSearch,filter,setFilter,total}:{shipments:OpsShipment[];search:string;setSearch:(v:string)=>void;filter:string;setFilter:(v:string)=>void;total:number}){
 return <section className="zo-panel"><div className="zo-panel-top"><div><span className="zo-section-number">SHIPMENT REGISTER / READ ONLY</span><h2>Delivery orders</h2></div>
  <span className="zo-panel-count">{shipments.length} shown of {total} loaded</span></div>
  <div className="zo-filterbar">
   <label className="zo-search"><Search size={18}/><input type="search" value={search} onChange={e=>setSearch(e.target.value)}
    placeholder="Search reference or route" aria-label="Search shipments"/></label>
   <label className="zo-select-label">Status <select value={filter} onChange={e=>setFilter(e.target.value)}>
     <option value="all">All statuses</option>{ORDER_STATUSES.map(s=><option key={s} value={s}>{statusLabel(s)}</option>)}
   </select></label>
  </div>
  {shipments.length?<div className="zo-table-scroller"><table className="zo-table">
   <thead><tr><th scope="col">Reference</th><th scope="col">Pickup</th><th scope="col">Drop-off</th><th scope="col">Vehicle</th><th scope="col">Status</th><th scope="col">Created</th></tr></thead>
   <tbody>{shipments.map(o=><tr key={o.id}><td><strong>{o.reference}</strong></td><td>{o.pickup_area}</td><td>{o.dropoff_area}</td><td className="zo-cap">{o.vehicle_type}</td><td><Status value={o.status}/></td><td>{formatDate(o.created_at)}</td></tr>)}</tbody>
  </table></div>:<Empty icon={<Search size={26}/>} title={total?"No orders match your filters":"No verified orders yet"}
     detail={total?"Adjust the search or status filter to find records.":"Connect a staging shipment source to populate this register."}/>}
  <div className="zo-table-foot"><LockKeyhole size={16}/> Order updates and assignments are disabled until the dispatch service is security-reviewed.</div>
 </section>;
}
function Dispatch({groups}:{groups:ReturnType<typeof dispatchGroups>}){
 const columns=[
  {key:"waiting",name:"Waiting",description:"Requires a dispatch decision",list:groups.waiting},
  {key:"active",name:"In motion",description:"Assigned through drop-off",list:groups.active},
  {key:"closed",name:"Closed",description:"Completed, cancelled or failed",list:groups.closed}
 ];
 return <>
  <div className="zo-inline-note"><MapPin size={20}/><div><strong>Dispatch board · live location not connected</strong>
   <p>These columns reflect shipment statuses from the authorized database. Drag-to-assign, driver GPS, and status changes are intentionally disabled.</p></div></div>
  <div className="zo-kanban">{columns.map((column,index)=><section key={column.key} className="zo-lane">
    <header><span className="zo-lane-index">0{index+1}</span><div><h2>{column.name}</h2><p>{column.description}</p></div><span className="zo-lane-count">{column.list.length}</span></header>
    <div className="zo-lane-body">{column.list.length?column.list.map(o=><article key={o.id} className="zo-dispatch-card">
      <div className="zo-dispatch-card-top"><strong>{o.reference}</strong><Status value={o.status}/></div>
      <div className="zo-dispatch-line"><MapPin size={15}/>{o.pickup_area}</div>
      <div className="zo-dispatch-line"><ArrowRight size={15}/>{o.dropoff_area}</div>
      <footer><span>{o.vehicle_type}</span><span>{formatDate(o.updated_at)}</span></footer>
     </article>):<div className="zo-lane-empty"><Package size={25}/><strong>No records in this stage</strong><small>Verified assignments will appear here.</small></div>}</div>
   </section>)}</div>
 </>;
}
function Drivers({drivers}:{drivers:OpsDriver[]}){
 return <section className="zo-panel"><div className="zo-panel-top"><div><span className="zo-section-number">DRIVER WORKFORCE / READ ONLY</span><h2>Network directory</h2></div>
   <span className="zo-panel-count">{drivers.length} loaded</span></div>
  {drivers.length?<div className="zo-table-scroller"><table className="zo-table">
   <thead><tr><th scope="col">Partner</th><th scope="col">Vehicle</th><th scope="col">Verification</th><th scope="col">Availability</th><th scope="col">Last updated</th></tr></thead>
   <tbody>{drivers.map(d=><tr key={d.id}><td><strong>{d.display_name}</strong></td>
     <td className="zo-cap">{d.vehicle_type}</td><td><span className={`zo-status zo-status--${d.verification_state==="approved"?"success":d.verification_state==="suspended"?"danger":"warning"}`}>{d.verification_state}</span></td>
     <td className="zo-cap">{d.availability_state}</td><td>{formatDate(d.updated_at)}</td></tr>)}</tbody>
  </table></div>:<Empty icon={<UsersRound size={28}/>} title="No verified driver profiles" detail="Approved driver summaries will appear once the secure driver onboarding and operational tables are connected."/>}
  <div className="zo-table-foot"><ShieldCheck size={16}/> Private documents, banking details and location coordinates are never shown on this screen.</div>
 </section>;
}
function Analytics({shipments,drivers,counts}:{shipments:OpsShipment[];drivers:OpsDriver[];counts:ReturnType<typeof overviewFromVisible>}){
 const statusCounts=ORDER_STATUSES.map(s=>({status:s,count:shipments.filter(x=>x.status===s).length})).filter(x=>x.count>0);
 return <>
  <div className="zo-metrics">
   <Metric label="Visible shipments" value={shipments.length} note="Most recent 100 maximum" icon={<Package size={20}/>}/>
   <Metric label="Delivered in sample" value={counts.delivered} note="Not a delivery rate" icon={<CheckCircle2 size={20}/>}/>
   <Metric label="Approved drivers" value={counts.approvedDrivers} note="From loaded profiles" icon={<ShieldCheck size={20}/>}/>
   <Metric label="Visible driver records" value={drivers.length} note="Most recent 100 maximum" icon={<UsersRound size={20}/>}/>
  </div>
  <section className="zo-panel zo-analytics-panel"><div className="zo-panel-top"><div><span className="zo-section-number">SAMPLE DISTRIBUTION</span><h2>Delivery lifecycle</h2></div>
    <span className="zo-panel-count">Read-only sample</span></div>
   {!statusCounts.length?<Empty icon={<BarChart3 size={28}/>} title="No event distribution available" detail="Verified shipment records are needed before analytics can be calculated."/>
    :<div className="zo-bars">{statusCounts.map(x=><div className="zo-bar" key={x.status}>
      <span>{statusLabel(x.status)}</span><div className="zo-bar-track"><div style={{width:`${Math.round(x.count/shipments.length*100)}%`}}/></div><strong>{x.count}</strong>
     </div>)}</div>}
   <p className="zo-analytics-foot">This chart uses only records returned to the authorized operator. It is not a platform-wide KPI, revenue report, or real-time performance guarantee.</p>
  </section>
 </>;
}
function Unconnected({icon,label,title,details}:{icon:ReactNode;label:string;title:string;details:string}){
 return <section className="zo-unconnected"><span className="zo-unconnected-icon">{icon}</span><span className="zo-kicker">{label}</span>
  <h2>{title}</h2><p>{details}</p><span className="zo-not-ready"><LockKeyhole size={16}/> Integration not enabled</span></section>;
}
function Settings({data}:{data:OperationsSnapshot}){
 return <div className="zo-settings-grid">
  <section className="zo-panel"><div className="zo-panel-top"><div><span className="zo-section-number">IDENTITY & SCOPE</span><h2>Access details</h2></div></div>
   <dl className="zo-definition">
    <div><dt>Organization</dt><dd className="zo-mono">{data.organizationId}</dd></div>
    <div><dt>Operator role</dt><dd className="zo-cap">{data.role}</dd></div>
    <div><dt>API access</dt><dd><span className="zo-status zo-status--success">Authorized</span></dd></div>
    <div><dt>Mutation permissions</dt><dd>Disabled in this release</dd></div>
    <div><dt>Latest snapshot</dt><dd>{formatDate(data.fetchedAt)}</dd></div>
   </dl>
  </section>
  <section className="zo-panel"><div className="zo-panel-top"><div><span className="zo-section-number">DATA CONNECTIONS</span><h2>System boundaries</h2></div></div>
   <div className="zo-connector"><ShieldCheck size={18}/><div><strong>Operator-scoped read API</strong><small>Connected with access checks</small></div><span>READ</span></div>
   <div className="zo-connector"><Truck size={18}/><div><strong>Dispatch mutations</strong><small>Awaiting authenticated assignment service</small></div><span>OFF</span></div>
   <div className="zo-connector"><MapPin size={18}/><div><strong>Driver location</strong><small>Not collected by this workspace</small></div><span>OFF</span></div>
   <div className="zo-connector"><CreditCard size={18}/><div><strong>Financial settlement ledger</strong><small>Separate reconciliation required</small></div><span>OFF</span></div>
  </section>
 </div>;
}
