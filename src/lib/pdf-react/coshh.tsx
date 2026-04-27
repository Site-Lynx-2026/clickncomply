/**
 * COSHH Assessment PDF — React-PDF version.
 * Cover + substance cards + sign-off.
 */

import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  CoverHeader,
  PDFFooter,
  PDFWatermark,
  ProjectInfoGrid,
  SectionHead,
  SignOffCard,
  type PDFContext,
} from "./shared";
import {
  s,
  muted,
  navy,
  border,
  redText,
  amberText,
  greenText,
} from "./styles";

export type CoshhRiskLevel = "low" | "medium" | "high";

export interface CoshhSubstance {
  id?: string;
  name: string;
  sdsRef?: string;
  exposureRoute?: string;
  welRef?: string;
  riskLevel: CoshhRiskLevel;
  controls?: string;
  ppe?: string;
  emergencyProcedure?: string;
}

export interface CoshhForm {
  title?: string;
  scope?: string;
  preparedBy?: string;
  substances?: CoshhSubstance[];
}

export interface CoshhPDFProps {
  form: CoshhForm;
  ctx: PDFContext;
}

const riskColor = (lvl: CoshhRiskLevel) =>
  lvl === "high" ? redText : lvl === "medium" ? amberText : greenText;

export function CoshhPDF({ form, ctx }: CoshhPDFProps) {
  const title = form.title || "Untitled COSHH Assessment";
  const substances = form.substances ?? [];

  return (
    <Document>
      {/* ═══ COVER ═══ */}
      <Page size="A4" style={s.page}>
        <PDFWatermark watermark={ctx.watermark} />
        <CoverHeader
          ctx={ctx}
          documentType="COSHH Assessment"
          title={title}
          subtitle={ctx.meta?.projectName ?? undefined}
        />
        <ProjectInfoGrid ctx={ctx} />

        <SectionHead num={1} title="Scope of works" />
        <Text style={s.descBox}>{form.scope || "No scope recorded."}</Text>

        <PDFFooter ctx={ctx} />
      </Page>

      {/* ═══ SUBSTANCES ═══ */}
      <Page size="A4" style={s.page}>
        <PDFWatermark watermark={ctx.watermark} />

        <SectionHead num={2} title="Hazardous substances" />

        {substances.length === 0 ? (
          <Text style={{ fontSize: 9, color: muted, fontStyle: "italic", marginBottom: 14 }}>
            No substances recorded. Add substances from the COSHH library.
          </Text>
        ) : (
          substances.map((sub, i) => (
            <View
              key={sub.id ?? i}
              style={{
                border: `0.5px solid ${border}`,
                borderRadius: 5,
                padding: "10 12",
                marginBottom: 10,
              }}
              minPresenceAhead={60}
              wrap={false}
            >
              <Text
                style={{
                  fontSize: 10.5,
                  fontFamily: "Helvetica-Bold",
                  color: navy,
                  marginBottom: 8,
                  paddingBottom: 5,
                  borderBottom: "0.5px solid #eee",
                }}
              >
                Substance {i + 1}
                {sub.name ? ` — ${sub.name}` : ""}
              </Text>

              <View style={{ flexDirection: "row", gap: 10, marginBottom: 8 }}>
                <SubstanceField label="SDS Reference" value={sub.sdsRef} />
                <SubstanceField label="Exposure Route" value={sub.exposureRoute} />
                <SubstanceField label="WEL" value={sub.welRef} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: muted }}>
                    RISK LEVEL
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: "Helvetica-Bold",
                      color: riskColor(sub.riskLevel),
                      textTransform: "uppercase",
                    }}
                  >
                    {sub.riskLevel}
                  </Text>
                </View>
              </View>

              {sub.controls && (
                <View style={{ marginBottom: 6 }}>
                  <Text
                    style={{
                      fontSize: 8,
                      fontFamily: "Helvetica-Bold",
                      color: muted,
                      marginBottom: 3,
                    }}
                  >
                    CONTROL MEASURES
                  </Text>
                  <Text style={{ fontSize: 9.5, lineHeight: 1.5 }}>{sub.controls}</Text>
                </View>
              )}

              {sub.ppe && (
                <View style={{ marginBottom: 6 }}>
                  <Text
                    style={{
                      fontSize: 8,
                      fontFamily: "Helvetica-Bold",
                      color: muted,
                      marginBottom: 3,
                    }}
                  >
                    PPE REQUIRED
                  </Text>
                  <Text style={{ fontSize: 9.5, lineHeight: 1.5 }}>{sub.ppe}</Text>
                </View>
              )}

              {sub.emergencyProcedure && (
                <View>
                  <Text
                    style={{
                      fontSize: 8,
                      fontFamily: "Helvetica-Bold",
                      color: muted,
                      marginBottom: 3,
                    }}
                  >
                    EMERGENCY PROCEDURE
                  </Text>
                  <Text style={{ fontSize: 9.5, lineHeight: 1.5 }}>{sub.emergencyProcedure}</Text>
                </View>
              )}
            </View>
          ))
        )}

        <PDFFooter ctx={ctx} />
      </Page>

      {/* ═══ SIGN-OFF ═══ */}
      <Page size="A4" style={s.page}>
        <PDFWatermark watermark={ctx.watermark} />

        <SectionHead num={3} title="Document sign-off & authorisation" />
        <SignOffCard
          preparedBy={form.preparedBy}
          date={ctx.meta?.dateOfWorks}
        />

        <View style={s.notice}>
          <Text>
            This COSHH assessment identifies hazardous substances on site and the controls required
            to manage exposure under the Control of Substances Hazardous to Health Regulations 2002.
            All operatives must read and understand this document before handling listed substances.
            Safety Data Sheets must be available on site for every substance listed above.
          </Text>
        </View>

        <PDFFooter ctx={ctx} />
      </Page>
    </Document>
  );
}

function SubstanceField({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: muted }}>
        {label.toUpperCase()}
      </Text>
      <Text style={{ fontSize: 10 }}>{value || "—"}</Text>
    </View>
  );
}
