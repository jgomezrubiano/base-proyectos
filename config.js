/* Shared config for base-proyectos hub + public /request.html
   Loaded as a classic <script>; exposes constants on window. */

window.SUPABASE_URL = "https://aenejwygqugmzncbstll.supabase.co";
window.SUPABASE_KEY = "sb_publishable_kPV4uNB9GI4F0RNGflaJoQ_Xk2pVcfh";

/* Stakeholder-facing project list — curated, not the hub's internal PROJECTS.
   Keep "Other / New idea" last. */
window.REQUEST_PROJECTS = [
  "Booked vs Budget",
  "Trucking KPI's",
  "ODS v2 — Outlier Detection",
  "Standarizer — Client Data Standardization",
  "PS Benchmarking",
  "Hatching Egg & Chick Cost",
  "Order Cancellation Tracking",
  "Other / New idea"
];

/* Priority metadata shared across views.
   `token` is the hub CSS variable name — consumers style via var(<token>).
   Display labels live in each view (Spanish in the hub tab, English on /request.html). */
window.PRIORITY_META = {
  quick:  { order: 0, token: "--grey" },
  medium: { order: 1, token: "--gold" },
  urgent: { order: 2, token: "--red"  }
};
