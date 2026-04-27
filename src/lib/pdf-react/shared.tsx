/**
 * Shared PDF components used by every ClickNComply RAMs template.
 * Watermark, Logo block, Header bar, Footer.
 *
 * Ported from sitelynx-v2/src/components/{pdf-watermark.tsx,rams/pdf.tsx}
 * with ClickNComply brand. Free-tier watermark says "POWERED BY CLICKNCOMPLY"
 * (was "TRIAL" in SL); used to push our brand mark across every PDF
 * a free user puts in front of an auditor or tier-1 contractor.
 */

import { Text, View, Image } from "@react-pdf/renderer";
import {
  s,
  navy,
  dark,
  muted,
  border,
  lightBg,
  pageBg,
  brandLime,
  greenBg,
  greenText,
  greenBorder,
  amberBg,
  amberText,
  amberBorder,
  redBg,
  redText,
  redBorder,
  criticalBg,
  criticalText,
  criticalBorder,
} from "./styles";

/** Risk score → semantic colour palette + label, SL pattern. */
export type RiskBadgeMeta = {
  bg: string;
  color: string;
  border: string;
  label: string;
};
export function riskBadge(score: number): RiskBadgeMeta {
  if (score >= 16) return { bg: criticalBg, color: criticalText, border: criticalBorder, label: "Critical" };
  if (score >= 10) return { bg: redBg, color: redText, border: redBorder, label: "High" };
  if (score >= 5) return { bg: amberBg, color: amberText, border: amberBorder, label: "Medium" };
  return { bg: greenBg, color: greenText, border: greenBorder, label: "Low" };
}

/** Inline risk badge — coloured pill with label + score. */
export function RiskBadge({ score }: { score: number }) {
  const b = riskBadge(score);
  return (
    <Text
      style={{
        backgroundColor: b.bg,
        color: b.color,
        border: `0.5px solid ${b.border}`,
        borderRadius: 3,
        padding: "2 5",
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        textAlign: "center",
      }}
    >
      {b.label} {score}
    </Text>
  );
}

/** Big stat callout — the SL "239 pts" / "94 dB(A)" coloured block. */
export function StatCallout({
  value,
  unit,
  label,
  status,
  hint,
  level,
}: {
  value: number | string;
  unit?: string;
  label: string;
  status: string;
  hint?: string;
  level: "low" | "med" | "high";
}) {
  const palette =
    level === "high"
      ? { bg: redBg, color: redText, border: redBorder }
      : level === "med"
      ? { bg: amberBg, color: amberText, border: amberBorder }
      : { bg: greenBg, color: greenText, border: greenBorder };
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: palette.bg,
        border: `0.5px solid ${palette.border}`,
        borderRadius: 5,
        padding: "8 14",
        marginTop: 6,
        marginBottom: 8,
      }}
    >
      <View>
        <Text style={{ fontSize: 22, fontFamily: "Helvetica-Bold", color: palette.color }}>
          {value}
          {unit ? ` ${unit}` : ""}
        </Text>
        <Text style={{ fontSize: 9, color: palette.color }}>{label}</Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: palette.color }}>{status}</Text>
        {hint && <Text style={{ fontSize: 8.5, color: muted, marginTop: 2 }}>{hint}</Text>}
      </View>
    </View>
  );
}

/** 999 emergency block + RIDDOR strip — fixed copy, hard-coded colours. */
export function EmergencyCard() {
  return (
    <View style={{ width: 110, gap: 8 }}>
      <View
        style={{
          backgroundColor: redBg,
          border: `0.5px solid ${redBorder}`,
          borderRadius: 5,
          padding: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 22, fontFamily: "Helvetica-Bold", color: redText }}>999</Text>
        <Text
          style={{
            fontSize: 7.5,
            color: redText,
            fontFamily: "Helvetica-Bold",
            textAlign: "center",
          }}
        >
          Emergency services
        </Text>
      </View>
      <View
        style={{
          backgroundColor: amberBg,
          border: `0.5px solid ${amberBorder}`,
          borderRadius: 5,
          padding: "8 10",
        }}
      >
        <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: amberText, marginBottom: 3 }}>
          RIDDOR Reporting
        </Text>
        <Text style={{ fontSize: 7.5, color: amberText, lineHeight: 1.4 }}>
          Report all incidents, near misses, and reportable injuries to the principal contractor and HSE
          (0345 300 9923)
        </Text>
      </View>
    </View>
  );
}

/** Two-column sign-off card — Prepared by + Approved by. */
export function SignOffCard({
  preparedBy,
  preparedByRole,
  date,
  signatureUrl,
}: {
  preparedBy?: string | null;
  preparedByRole?: string | null;
  date?: string | null;
  signatureUrl?: string | null;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 20, marginBottom: 14 }}>
      {/* Prepared */}
      <View style={{ flex: 1, border: `0.5px solid ${border}`, borderRadius: 5, padding: 11 }}>
        <Text
          style={{
            fontSize: 8.5,
            fontFamily: "Helvetica-Bold",
            color: muted,
            textTransform: "uppercase",
            marginBottom: 4,
            letterSpacing: 0.5,
          }}
        >
          Prepared by
        </Text>
        <Text style={{ fontSize: 11, color: navy, fontFamily: "Helvetica-Bold", marginBottom: 4 }}>
          {preparedBy || "—"}
        </Text>
        {preparedByRole && (
          <Text style={{ fontSize: 9, color: muted, marginBottom: 12 }}>{preparedByRole}</Text>
        )}
        <View style={s.sigArea}>
          {signatureUrl && (
            <Image src={signatureUrl} style={{ height: 45, objectFit: "contain" }} />
          )}
        </View>
        <Text style={{ fontSize: 9, color: muted }}>
          {preparedBy || "—"} {date ? `· ${date}` : ""}
        </Text>
      </View>
      {/* Approved */}
      <View style={{ flex: 1, border: `0.5px solid ${border}`, borderRadius: 5, padding: 11 }}>
        <Text
          style={{
            fontSize: 8.5,
            fontFamily: "Helvetica-Bold",
            color: muted,
            textTransform: "uppercase",
            marginBottom: 4,
            letterSpacing: 0.5,
          }}
        >
          Approved by
        </Text>
        <Text style={{ fontSize: 11, color: muted, fontStyle: "italic", marginBottom: 4 }}>
          — Awaiting approval —
        </Text>
        <Text style={{ fontSize: 9, color: muted, marginBottom: 12 }}>&nbsp;</Text>
        <View style={s.sigArea} />
        <Text style={{ fontSize: 9, color: muted, fontStyle: "italic" }}>Signature / Date</Text>
      </View>
    </View>
  );
}

/** Reusable navy-header column table. Pass columns + rows. */
export interface TableColumn {
  label: string;
  width: string;
  align?: "left" | "center" | "right";
}
export function ColumnTable({
  columns,
  rows,
}: {
  columns: TableColumn[];
  rows: React.ReactNode[][];
}) {
  return (
    <View
      style={{
        border: `0.5px solid ${border}`,
        borderRadius: 5,
        overflow: "hidden",
        marginBottom: 14,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", backgroundColor: navy, padding: "5 10" }}>
        {columns.map((c, i) => (
          <Text
            key={i}
            style={{
              width: c.width,
              color: "#e8eef5",
              fontSize: 9,
              fontFamily: "Helvetica-Bold",
              textAlign: c.align ?? "left",
            }}
          >
            {c.label}
          </Text>
        ))}
      </View>
      {/* Rows */}
      {rows.length === 0 ? (
        <View style={{ padding: "12 10", backgroundColor: "#fff" }}>
          <Text style={{ fontSize: 9, color: muted, fontStyle: "italic" }}>No entries.</Text>
        </View>
      ) : (
        rows.map((cells, ri) => (
          <View
            key={ri}
            style={{
              flexDirection: "row",
              padding: "6 10",
              borderTop: ri > 0 ? "0.5px solid #eee" : "none",
              backgroundColor: ri % 2 === 0 ? "#fff" : pageBg,
            }}
            wrap={false}
          >
            {cells.map((cell, ci) => (
              <View
                key={ci}
                style={{
                  width: columns[ci]?.width ?? "auto",
                }}
              >
                {typeof cell === "string" || typeof cell === "number" ? (
                  <Text
                    style={{
                      fontSize: 9,
                      color: dark,
                      textAlign: columns[ci]?.align ?? "left",
                    }}
                  >
                    {cell}
                  </Text>
                ) : (
                  cell
                )}
              </View>
            ))}
          </View>
        ))
      )}
    </View>
  );
}

/** Pill-grid of contents/section labels. The SL "Document Contents" block. */
export function ContentsPills({ items }: { items: string[] }) {
  return (
    <View
      style={{
        border: `0.5px solid ${border}`,
        borderRadius: 5,
        padding: "10 12",
        backgroundColor: pageBg,
        marginBottom: 14,
      }}
    >
      <Text
        style={{
          fontSize: 8.5,
          fontFamily: "Helvetica-Bold",
          color: muted,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 8,
        }}
      >
        Document contents
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
        {items.map((item, i) => (
          <View
            key={i}
            style={{
              backgroundColor: "#fff",
              border: `0.5px solid ${border}`,
              borderRadius: 3,
              padding: "3 8",
            }}
          >
            <Text style={{ fontSize: 8.5, color: navy }}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/** Description box — light bg, dark left bar, body text inside. */
export function DescriptionBox({ children }: { children: React.ReactNode }) {
  return <Text style={s.descBox}>{children}</Text>;
}

/** Document context shared across templates. */
export interface PDFContext {
  /** Customer's company name (from organisations table). */
  companyName: string;
  /** Optional initials shown in the logo fallback box. */
  companyInitials: string;
  /** Optional uploaded logo URL. */
  logoUrl?: string | null;
  /** Free-tier flag — adds the brand watermark when true. */
  watermark?: boolean;
  /** Stable doc reference (e.g. RAMS-A1B2C3D4). */
  reference: string;
  /** Project + client meta from the linked project record (if any). */
  meta?: {
    clientName?: string | null;
    projectName?: string | null;
    projectCode?: string | null;
    siteAddress?: string | null;
    sitePostcode?: string | null;
    dateOfWorks?: string | null;
    endDate?: string | null;
  };
}

/**
 * Diagonal brand watermark for free-tier outputs. Place inside each
 * <Page> as the first child. `fixed` keeps it on every overflow page.
 */
export function PDFWatermark({ watermark }: { watermark?: boolean }) {
  if (!watermark) return null;
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
      }}
      fixed
    >
      <Text
        style={{
          fontSize: 56,
          color: navy,
          opacity: 0.07,
          fontFamily: "Helvetica-Bold",
          letterSpacing: 6,
          transform: "rotate(-30deg)",
        }}
      >
        POWERED BY CLICKNCOMPLY
      </Text>
    </View>
  );
}

/**
 * Cover-page header band — light tint, defined bottom rule, logo + title
 * + document-type badge.
 */
export function CoverHeader({
  ctx,
  documentType,
  title,
  subtitle,
}: {
  ctx: PDFContext;
  documentType: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <View
      style={{
        backgroundColor: lightBg,
        margin: "-16mm -16mm 0 -16mm",
        padding: "18mm 16mm 14mm",
        marginBottom: 20,
        borderBottom: `1px solid ${navy}`,
      }}
    >
      {/* Logo / brand */}
      <View style={{ marginBottom: 14 }}>
        {ctx.logoUrl ? (
          <Image
            src={ctx.logoUrl}
            style={{ height: 48, width: "auto", maxWidth: 220 }}
          />
        ) : (
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                backgroundColor: navy,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 15,
                  fontFamily: "Helvetica-Bold",
                }}
              >
                {ctx.companyInitials}
              </Text>
            </View>
            <Text
              style={{
                color: dark,
                fontSize: 16,
                fontFamily: "Helvetica-Bold",
              }}
            >
              {ctx.companyName}
            </Text>
          </View>
        )}
      </View>

      {/* Document-type badge */}
      <View
        style={{
          backgroundColor: navy,
          borderRadius: 4,
          padding: "5 12",
          alignSelf: "flex-start",
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            color: "#e8eef5",
            fontSize: 9,
            fontFamily: "Helvetica-Bold",
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          {documentType}
        </Text>
      </View>

      {/* Title */}
      <Text
        style={{
          color: dark,
          fontSize: 26,
          fontFamily: "Helvetica-Bold",
          lineHeight: 1.2,
          marginBottom: 6,
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text style={{ color: muted, fontSize: 11 }}>{subtitle}</Text>
      )}
    </View>
  );
}

/**
 * Compact interior-page header — used on overflow pages to keep the
 * doc anchored.
 */
export function InteriorHeader({
  ctx,
  sections,
}: {
  ctx: PDFContext;
  sections?: string;
}) {
  return (
    <View
      style={{
        paddingBottom: 10,
        borderBottom: `1px solid ${navy}`,
        marginBottom: 16,
      }}
    >
      <View style={{ marginBottom: 8 }}>
        {ctx.logoUrl ? (
          <Image
            src={ctx.logoUrl}
            style={{ height: 32, width: "auto", maxWidth: 160 }}
          />
        ) : (
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            <View
              style={{
                width: 30,
                height: 30,
                backgroundColor: navy,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#e8eef5",
                  fontSize: 11,
                  fontFamily: "Helvetica-Bold",
                }}
              >
                {ctx.companyInitials}
              </Text>
            </View>
            <Text style={s.brandName}>{ctx.companyName}</Text>
          </View>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <View>
          <Text style={s.brandName}>{ctx.companyName}</Text>
          <Text style={s.brandSub}>
            {sections ? `${ctx.reference} · ${sections}` : "ClickNComply"}
          </Text>
        </View>
        <View style={s.meta}>
          <Text>
            <Text style={s.metaBold}>Ref:</Text> {ctx.reference}
          </Text>
          {ctx.meta?.dateOfWorks && (
            <Text>
              <Text style={s.metaBold}>Date:</Text> {ctx.meta.dateOfWorks}
            </Text>
          )}
          {ctx.meta?.clientName && (
            <Text>
              <Text style={s.metaBold}>Client:</Text> {ctx.meta.clientName}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

/**
 * Page footer — fixed to bottom of every page, shows company + ref +
 * project + page X of Y. Lime brand pip on the right.
 */
export function PDFFooter({ ctx }: { ctx: PDFContext }) {
  return (
    <View style={s.footer} fixed>
      <View style={{ flexDirection: "column", gap: 3, flex: 1 }}>
        <Text style={{ fontFamily: "Helvetica-Bold", color: "#777" }}>
          {ctx.companyName} · {ctx.reference}
        </Text>
        {ctx.meta?.projectName && (
          <Text style={{ color: "#aaa" }}>
            {ctx.meta.projectName}
            {ctx.meta.projectCode ? ` · ${ctx.meta.projectCode}` : ""}
          </Text>
        )}
      </View>
      <View
        style={{ flexDirection: "column", alignItems: "flex-end", gap: 3 }}
      >
        <Text
          style={s.pgBadge}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: brandLime,
            }}
          />
          <Text style={{ fontSize: 7, color: "#bbb" }}>
            Powered by ClickNComply
          </Text>
        </View>
      </View>
    </View>
  );
}

/**
 * Project + reference info grid — 2 columns of 5 rows each.
 * Shown on the cover page below the title band.
 */
export function ProjectInfoGrid({ ctx }: { ctx: PDFContext }) {
  const m = ctx.meta ?? {};
  return (
    <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
      {/* Left column — project details */}
      <InfoCol
        rows={[
          ["Client", m.clientName],
          ["Project", m.projectName],
          ["Site address", m.siteAddress],
          ["Postcode", m.sitePostcode],
          ["Duration", m.endDate && m.dateOfWorks ? `${m.dateOfWorks} – ${m.endDate}` : null],
        ]}
      />
      {/* Right column — document control */}
      <InfoCol
        rows={[
          ["Reference", ctx.reference, true],
          ["Project code", m.projectCode],
          ["Date of works", m.dateOfWorks],
          ["Date prepared", new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })],
          ["Status", "Controlled"],
        ]}
      />
    </View>
  );
}

function InfoCol({
  rows,
}: {
  rows: [string, string | null | undefined, boolean?][];
}) {
  return (
    <View
      style={{
        flex: 1,
        border: `0.5px solid ${border}`,
        borderRadius: 5,
        overflow: "hidden",
      }}
    >
      {rows.map(([label, value, accent], i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            borderBottom:
              i < rows.length - 1 ? `0.5px solid ${border}` : "none",
          }}
        >
          <Text
            style={{
              width: "38%",
              backgroundColor: lightBg,
              padding: "6 9",
              fontSize: 8.5,
              fontFamily: "Helvetica-Bold",
              color: muted,
              textTransform: "uppercase",
            }}
          >
            {label}
          </Text>
          <Text
            style={{
              flex: 1,
              padding: "6 9",
              fontSize: 9.5,
              color: accent ? navy : dark,
              fontFamily: accent ? "Helvetica-Bold" : "Helvetica",
            }}
          >
            {value || "—"}
          </Text>
        </View>
      ))}
    </View>
  );
}

/**
 * Section heading helper — numbered dark badge + heading text.
 * Use directly inside Page content.
 */
export function SectionHead({
  num,
  title,
}: {
  num: number;
  title: string;
}) {
  return (
    <View style={s.secHead}>
      <Text style={s.secNum}>{num}</Text>
      <Text style={s.secTitle}>{title}</Text>
    </View>
  );
}

/**
 * Compliance footer note + status badges (CDM 2015 / Controlled).
 * Shown at the bottom of the cover page.
 */
export function ComplianceFooterRow() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: `0.5px solid ${border}`,
        paddingTop: 10,
      }}
    >
      <Text style={{ fontSize: 8.5, color: muted }}>
        Prepared in accordance with CDM 2015 Regulations and the Health &
        Safety at Work Act 1974
      </Text>
      <View style={{ flexDirection: "row", gap: 6 }}>
        <View
          style={{ backgroundColor: navy, borderRadius: 3, padding: "3 8" }}
        >
          <Text
            style={{
              color: "#e8eef5",
              fontSize: 8,
              fontFamily: "Helvetica-Bold",
            }}
          >
            CDM 2015
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#2d6a3a",
            borderRadius: 3,
            padding: "3 8",
          }}
        >
          <Text
            style={{
              color: "#d6f0de",
              fontSize: 8,
              fontFamily: "Helvetica-Bold",
            }}
          >
            CONTROLLED
          </Text>
        </View>
      </View>
    </View>
  );
}

export { s, pageBg, navy, muted, border, lightBg, dark };
