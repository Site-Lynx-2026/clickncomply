import { StyleSheet } from "@react-pdf/renderer";

/**
 * Shared PDF styling — ported from sitelynx-v2/src/components/rams/pdf.tsx
 * with ClickNComply brand adjustments.
 *
 * Palette stays close to SL's professional look (near-black + light bg +
 * coloured callouts) rather than the saturated lime that read as
 * "indie SaaS" in our previous pdf-lib output.
 */

// Core colours
export const navy = "#1e1e1e"; // SL called this "navy" — actually near-black
export const dark = "#1a1a1a";
export const muted = "#666666";
export const border = "#dddddd";
export const lightBg = "#f5f5f5";
export const pageBg = "#f8f9fb";

// Status / risk callout palettes
export const greenBg = "#eaf3de";
export const greenText = "#3b6d11";
export const greenBorder = "#97c459";
export const amberBg = "#faeeda";
export const amberText = "#854f0b";
export const amberBorder = "#ef9f27";
export const redBg = "#fcebeb";
export const redText = "#a32d2d";
export const redBorder = "#f09595";
export const blueBg = "#e6f1fb";
export const blueText = "#0c447c";
export const criticalBg = "#fce8e8";
export const criticalText = "#7a1010";
export const criticalBorder = "#e06060";

// ClickNComply lime — used SPARINGLY (footer accent dot, brand mark)
export const brandLime = "#d4ff00";

export const s = StyleSheet.create({
  page: {
    padding: "16mm",
    paddingBottom: "26mm",
    fontSize: 9,
    fontFamily: "Helvetica",
    color: dark,
    backgroundColor: "#fff",
  },
  pageLand: {
    padding: "12mm 14mm",
    paddingBottom: "22mm",
    fontSize: 9,
    fontFamily: "Helvetica",
    color: dark,
    backgroundColor: "#fff",
  },

  brandName: { fontSize: 13, fontFamily: "Helvetica-Bold", color: dark },
  brandSub: { fontSize: 9, color: muted, marginTop: 1 },
  meta: { textAlign: "right", fontSize: 9, color: muted, lineHeight: 1.8 },
  metaBold: { color: dark, fontFamily: "Helvetica-Bold" },

  title: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: navy,
    marginBottom: 4,
    lineHeight: 1.2,
  },
  subtitle: { fontSize: 11, color: muted },

  // Section heading — numbered dark badge + title
  secHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 10,
    marginTop: 2,
  },
  secNum: {
    backgroundColor: navy,
    color: "#e8eef5",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    padding: "2 7",
    borderRadius: 3,
    textAlign: "center",
  },
  secTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: navy,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  // 2-column info grid
  infoGrid: {
    border: `0.5px solid ${border}`,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 14,
  },
  infoRow: { flexDirection: "row" },
  infoLabel: {
    width: "30%",
    backgroundColor: lightBg,
    padding: "6 10",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: muted,
    textTransform: "uppercase",
    borderBottom: `0.5px solid ${border}`,
  },
  infoVal: {
    width: "70%",
    padding: "6 10",
    fontSize: 10,
    color: dark,
    borderBottom: `0.5px solid ${border}`,
  },

  // Description box (left dark bar, light bg)
  descBox: {
    backgroundColor: pageBg,
    borderLeft: `3px solid ${navy}`,
    padding: "11 13",
    fontSize: 10,
    color: dark,
    lineHeight: 1.7,
    marginBottom: 14,
  },

  // Method-statement step row
  stepRow: {
    flexDirection: "row",
    gap: 9,
    padding: "7 0",
    borderBottom: `0.5px solid #eee`,
    alignItems: "flex-start",
  },
  stepNum: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: navy,
    color: "#e8eef5",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    paddingTop: 3.5,
  },
  stepText: { fontSize: 10, color: dark, lineHeight: 1.5, marginBottom: 2 },
  stepResp: { fontSize: 9, color: navy, fontFamily: "Helvetica-Bold" },

  // Pills + tags
  pill: {
    backgroundColor: lightBg,
    border: `0.5px solid ${border}`,
    borderRadius: 12,
    padding: "3 9",
    fontSize: 9,
    color: dark,
  },
  badge: {
    borderRadius: 3,
    padding: "2 5",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },

  // Footer — fixed at bottom of every page
  footer: {
    position: "absolute",
    bottom: 14,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8.5,
    color: "#999",
    borderTop: `0.5px solid #e5e5e5`,
    paddingTop: 8,
  },
  pgBadge: {
    backgroundColor: navy,
    color: "#e8eef5",
    padding: "2 7",
    borderRadius: 3,
    fontSize: 8.5,
  },

  // Sign-off
  sigArea: { height: 50, borderBottom: `0.5px solid #bbb`, marginBottom: 7 },

  // Notice (info / disclaimer block)
  notice: {
    backgroundColor: blueBg,
    borderLeft: `3px solid #185fa5`,
    padding: "10 12",
    fontSize: 9.5,
    color: blueText,
    lineHeight: 1.6,
    marginBottom: 14,
  },
});
