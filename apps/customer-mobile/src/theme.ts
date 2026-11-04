/** Cross-platform semantic design tokens aligned with web ZAIOLA Delivery. */
export const colors = {
  ink:"#17201E", inkSoft:"#31403C", orange:"#C34325", orangeSoft:"#FFF0EA",
  canvas:"#F7F7F2", paper:"#FFFFFF", border:"#E2E5DF", muted:"#65756D",
  success:"#17634C", successSoft:"#E9F5EE", error:"#B42318", errorSoft:"#FFF0ED",
  map:"#E7ECE7",
} as const;
export const radii = { control:10, panel:16, sheet:24, pill:99 } as const;
export const spacing = { xs:4, sm:8, md:12, base:16, lg:20, xl:24, xxl:32, huge:48 } as const;
export const type = { display:43, heading:27, title:20, body:15, small:12, label:11 } as const;
