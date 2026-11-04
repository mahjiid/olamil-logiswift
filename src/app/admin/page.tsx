import {redirect} from "next/navigation";

/**
 * Legacy shipment management used an unscoped client-side UPDATE against
 * the shipments table. Retire that privileged UI before promoting v2.
 * The v2 Control Tower requires a verified operator membership and exposes
 * only read-only, organization-scoped data.
 */
export default function LegacyAdminRedirect(){
 redirect("/v2/ops");
}
