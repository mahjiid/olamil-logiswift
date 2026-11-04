import type {Metadata} from "next";
import {OperationsDashboard} from "@/components/v2/operations-dashboard";

export const metadata:Metadata={
 title:"ZAIOLA Control Tower | Operations",
 description:"Protected ZAIOLA Delivery operations workspace. No publicly visible shipment data.",
 robots:{index:false,follow:false},
};
export default function OperationsPage(){return <OperationsDashboard/>;}
