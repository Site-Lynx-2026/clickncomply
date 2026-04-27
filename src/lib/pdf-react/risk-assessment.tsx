/**
 * Risk Assessment PDF — React-PDF version.
 * Cover (portrait) + landscape hazard table + sign-off.
 *
 * Mirrors sitelynx-v2's RA pages with the SL visual language: numbered
 * section badges, colour-coded risk pills (Low/Medium/High/Critical),
 * ALARP column, navy table header, alternating row tint.
 */

import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  CoverHeader,
  PDFFooter,
  PDFWatermark,
  ProjectInfoGrid,
  SectionHead,
  SignOffCard,
  RiskBadge,
  type PDFContext,
} from "./shared";
import {
  s,
  muted,
  navy,
  pageBg,
  greenText,
  amberText,
  greenBg,
  amberBg,
  redBg,
  criticalBg,
  greenBorder,
  amberBorder,
  redBorder,
  criticalBorder,
  redText,
  criticalText,
} from "./styles";

export interface RiskAssessmentHazard {
  id?: string;
  hazard: string;
  whoAtRisk: string;
  consequences: string;
  initialL: number;
  initialS: number;
  controls: string;
  residualL: number;
  residualS: number;
}

export interface RiskAssessmentForm {
  title?: string;
  scope?: string;
  preparedBy?: string;
  preparedByRole?: string;
  hazards?: RiskAssessmentHazard[];
}

export interface RiskAssessmentPDFProps {
  form: RiskAssessmentForm;
  ctx: PDFContext;
}

const riskScore = (l: number, s: number) => l * s;

export function RiskAssessmentPDF({ form, ctx }: RiskAssessmentPDFProps) {
  const title = form.title || "Untitled Risk Assessment";
  const hazards = form.hazards ?? [];

  return (
    <Document>
      {/* ═══ COVER (portrait) ═══ */}
      <Page size="A4" style={s.page}>
        <PDFWatermark watermark={ctx.watermark} />
        <CoverHeader
          ctx={ctx}
          documentType="Risk Assessment"
          title={title}
          subtitle={ctx.meta?.projectName ?? undefined}
        />
        <ProjectInfoGrid ctx={ctx} />

        <SectionHead num={1} title="Scope of works" />
        <Text style={s.descBox}>{form.scope || "No scope recorded."}</Text>

        <SectionHead num={2} title="Risk rating key" />
        <RiskKey />

        <PDFFooter ctx={ctx} />
      </Page>

      {/* ═══ HAZARD TABLE (landscape) ═══ */}
      <Page size="A4" orientation="landscape" style={s.pageLand}>
        <PDFWatermark watermark={ctx.watermark} />

        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 10,
              fontFamily: "Helvetica-Bold",
              color: muted,
              textTransform: "uppercase",
              letterSpacing: 0.6,
              marginBottom: 2,
            }}
          >
            {ctx.companyName} · {ctx.reference}
          </Text>
          <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", color: navy }}>
            {title}
          </Text>
        </View>

        <SectionHead num={3} title="Hazard identification & control" />

        {/* Table header */}
        <View style={{ flexDirection: "row", backgroundColor: navy, padding: "5 6" }}>
          {[
            { label: "#", w: "3%" },
            { label: "Hazard", w: "14%" },
            { label: "Consequences", w: "16%" },
            { label: "Who at Risk", w: "10%" },
            { label: "Initial Risk", w: "10%" },
            { label: "Control Measures", w: "30%" },
            { label: "Residual Risk", w: "10%" },
            { label: "ALARP", w: "7%" },
          ].map((c) => (
            <Text
              key={c.label}
              style={{
                width: c.w,
                color: "#e8eef5",
                fontSize: 8,
                fontFamily: "Helvetica-Bold",
              }}
            >
              {c.label}
            </Text>
          ))}
        </View>

        {hazards.length === 0 ? (
          <Text
            style={{
              fontSize: 9,
              color: muted,
              fontStyle: "italic",
              padding: "16 8",
              textAlign: "center",
            }}
          >
            No hazards recorded. Add hazards via the trade picker or library.
          </Text>
        ) : (
          hazards.map((h, idx) => {
            const initial = riskScore(h.initialL, h.initialS);
            const residual = riskScore(h.residualL, h.residualS);
            const alarp = residual <= 4 || residual < initial * 0.6;
            return (
              <View
                key={h.id ?? idx}
                style={{
                  flexDirection: "row",
                  backgroundColor: idx % 2 === 0 ? "#fff" : pageBg,
                  borderBottom: "0.5px solid #eee",
                  padding: "5 6",
                  alignItems: "flex-start",
                }}
                wrap={false}
              >
                <Text style={{ width: "3%", color: muted, fontSize: 8 }}>{idx + 1}</Text>
                <View style={{ width: "14%", paddingRight: 4 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5 }}>{h.hazard}</Text>
                </View>
                <Text style={{ width: "16%", fontSize: 8, color: "#444", paddingRight: 4 }}>
                  {h.consequences || "—"}
                </Text>
                <Text style={{ width: "10%", fontSize: 8, paddingRight: 4 }}>{h.whoAtRisk}</Text>
                <View style={{ width: "10%", paddingRight: 4 }}>
                  <RiskBadge score={initial} />
                  <Text style={{ fontSize: 7, color: muted, marginTop: 2 }}>
                    L{h.initialL} × S{h.initialS}
                  </Text>
                </View>
                <Text style={{ width: "30%", fontSize: 8, lineHeight: 1.4, paddingRight: 4 }}>
                  {h.controls}
                </Text>
                <View style={{ width: "10%", paddingRight: 4 }}>
                  <RiskBadge score={residual} />
                  <Text style={{ fontSize: 7, color: muted, marginTop: 2 }}>
                    L{h.residualL} × S{h.residualS}
                  </Text>
                </View>
                <Text
                  style={{
                    width: "7%",
                    fontSize: 9,
                    color: alarp ? greenText : amberText,
                    fontFamily: "Helvetica-Bold",
                  }}
                >
                  {alarp ? "Yes" : "Review"}
                </Text>
              </View>
            );
          })
        )}

        <PDFFooter ctx={ctx} />
      </Page>

      {/* ═══ SIGN-OFF (portrait) ═══ */}
      <Page size="A4" style={s.page}>
        <PDFWatermark watermark={ctx.watermark} />

        <SectionHead num={4} title="Document sign-off & authorisation" />
        <SignOffCard
          preparedBy={form.preparedBy}
          preparedByRole={form.preparedByRole}
          date={ctx.meta?.dateOfWorks}
        />

        <View style={s.notice}>
          <Text>
            This Risk Assessment has been prepared to identify hazards associated with the described
            works and to implement control measures to reduce risk to as low as reasonably practicable
            (ALARP). All operatives must read and understand this document before commencing work.
            Any deviation from the listed controls must be approved by the site supervisor.
          </Text>
        </View>

        <PDFFooter ctx={ctx} />
      </Page>
    </Document>
  );
}

/** Risk-rating colour key strip — same palette as the hazard badges. */
function RiskKey() {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        marginBottom: 14,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 9, color: muted }}>
        Risk = Likelihood × Severity (1–5 each).
      </Text>
      <KeyPill label="Low 1–4" bg={greenBg} fg={greenText} bd={greenBorder} />
      <KeyPill label="Medium 5–9" bg={amberBg} fg={amberText} bd={amberBorder} />
      <KeyPill label="High 10–15" bg={redBg} fg={redText} bd={redBorder} />
      <KeyPill label="Critical 16–25" bg={criticalBg} fg={criticalText} bd={criticalBorder} />
    </View>
  );
}

function KeyPill({
  label,
  bg,
  fg,
  bd,
}: {
  label: string;
  bg: string;
  fg: string;
  bd: string;
}) {
  return (
    <Text
      style={{
        backgroundColor: bg,
        color: fg,
        border: `0.5px solid ${bd}`,
        borderRadius: 3,
        padding: "2 6",
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
      }}
    >
      {label}
    </Text>
  );
}
