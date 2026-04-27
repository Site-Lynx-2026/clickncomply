/**
 * Method Statement PDF — React-PDF version.
 * SiteLynx-grade visual: cover page + method statement + sign-off.
 *
 * Replaces the pdf-lib version with proper rich layout.
 */

import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  CoverHeader,
  PDFFooter,
  PDFWatermark,
  ProjectInfoGrid,
  SectionHead,
  type PDFContext,
} from "./shared";
import { s, muted, navy, lightBg, border, pageBg } from "./shared";

export interface MethodStatementForm {
  title?: string;
  scope?: string;
  trade?: string;
  steps?: { description: string; responsible?: string }[];
  preparedBy?: string;
  preparedByRole?: string;
}

export interface MethodStatementPDFProps {
  form: MethodStatementForm;
  ctx: PDFContext;
}

export function MethodStatementPDF({ form, ctx }: MethodStatementPDFProps) {
  const title = form.title || "Untitled Method Statement";
  const subtitleParts: string[] = [];
  if (form.trade) subtitleParts.push(form.trade);
  if (ctx.meta?.projectName) subtitleParts.push(ctx.meta.projectName);
  const subtitle = subtitleParts.join(" · ") || undefined;

  const steps = form.steps ?? [];

  return (
    <Document>
      {/* ═══════════════════════════════════════════════════════════
          PAGE 1 — Cover + project info + description + sequence
      ═══════════════════════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <PDFWatermark watermark={ctx.watermark} />

        <CoverHeader
          ctx={ctx}
          documentType="Method Statement"
          title={title}
          subtitle={subtitle}
        />

        <ProjectInfoGrid ctx={ctx} />

        {/* Description */}
        <SectionHead num={1} title="Description of works" />
        <Text style={s.descBox}>
          {form.scope || "No scope of works recorded."}
        </Text>

        {/* Sequence of work */}
        <SectionHead num={2} title="Sequence of work — safe system of work" />
        {steps.length === 0 ? (
          <Text
            style={{ color: muted, fontSize: 9, fontStyle: "italic", marginBottom: 14 }}
          >
            No method steps defined.
          </Text>
        ) : (
          steps.map((step, idx) => (
            <View key={idx} minPresenceAhead={30}>
              <View style={s.stepRow} wrap={false}>
                <Text style={s.stepNum}>{idx + 1}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.stepText}>{step.description}</Text>
                  {step.responsible && (
                    <Text style={s.stepResp}>{step.responsible}</Text>
                  )}
                </View>
              </View>
            </View>
          ))
        )}

        <PDFFooter ctx={ctx} />
      </Page>

      {/* ═══════════════════════════════════════════════════════════
          PAGE 2 — Sign-off + briefing
      ═══════════════════════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <PDFWatermark watermark={ctx.watermark} />

        <SectionHead num={3} title="Document sign-off & authorisation" />

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
          {/* Prepared by */}
          <View
            style={{
              flex: 1,
              border: `0.5px solid ${border}`,
              borderRadius: 5,
              padding: 14,
            }}
          >
            <Text
              style={{
                fontSize: 8.5,
                fontFamily: "Helvetica-Bold",
                color: muted,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Prepared by
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: navy,
                fontFamily: "Helvetica-Bold",
                marginBottom: 4,
              }}
            >
              {form.preparedBy || "—"}
            </Text>
            <Text style={{ fontSize: 9, color: muted, marginBottom: 16 }}>
              {form.preparedByRole || "—"}
            </Text>
            <View style={s.sigArea} />
            <Text style={{ fontSize: 8, color: muted }}>Signature / Date</Text>
          </View>

          {/* Approved by */}
          <View
            style={{
              flex: 1,
              border: `0.5px solid ${border}`,
              borderRadius: 5,
              padding: 14,
            }}
          >
            <Text
              style={{
                fontSize: 8.5,
                fontFamily: "Helvetica-Bold",
                color: muted,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Approved by
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: muted,
                fontStyle: "italic",
                marginBottom: 4,
              }}
            >
              — Awaiting approval —
            </Text>
            <Text style={{ fontSize: 9, color: muted, marginBottom: 16 }}>
              &nbsp;
            </Text>
            <View style={s.sigArea} />
            <Text style={{ fontSize: 8, color: muted }}>Signature / Date</Text>
          </View>
        </View>

        {/* Document revision history */}
        <Text
          style={{
            fontSize: 8.5,
            fontFamily: "Helvetica-Bold",
            color: muted,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Document revision history
        </Text>
        <View
          style={{
            border: `0.5px solid ${border}`,
            borderRadius: 5,
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: navy,
              padding: "5 10",
            }}
          >
            <Text
              style={{
                flex: 1,
                color: "#e8eef5",
                fontSize: 9,
                fontFamily: "Helvetica-Bold",
              }}
            >
              Rev
            </Text>
            <Text
              style={{
                flex: 2,
                color: "#e8eef5",
                fontSize: 9,
                fontFamily: "Helvetica-Bold",
              }}
            >
              Date
            </Text>
            <Text
              style={{
                flex: 4,
                color: "#e8eef5",
                fontSize: 9,
                fontFamily: "Helvetica-Bold",
              }}
            >
              Description
            </Text>
            <Text
              style={{
                flex: 3,
                color: "#e8eef5",
                fontSize: 9,
                fontFamily: "Helvetica-Bold",
              }}
            >
              Prepared by
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#fff",
              padding: "6 10",
            }}
          >
            <Text style={{ flex: 1, fontSize: 9, color: navy, fontFamily: "Helvetica-Bold" }}>
              1
            </Text>
            <Text style={{ flex: 2, fontSize: 9, color: muted }}>
              {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Text>
            <Text style={{ flex: 4, fontSize: 9, color: muted }}>
              Initial issue
            </Text>
            <Text style={{ flex: 3, fontSize: 9, color: muted }}>
              {form.preparedBy || "—"}
            </Text>
          </View>
        </View>

        {/* Notice box */}
        <View style={s.notice}>
          <Text>
            This Method Statement has been prepared to identify the safe system
            of work for the described activity. All operatives must read and
            understand this document before commencing work. Any deviation from
            the described method must be approved by the site supervisor. This
            document must be reviewed and reissued if site conditions change
            or new hazards are identified.
          </Text>
        </View>

        {/* Operative briefing */}
        <SectionHead num={4} title="Operative briefing & sign-off" />
        <Text
          style={{
            fontSize: 9.5,
            color: muted,
            lineHeight: 1.6,
            marginBottom: 14,
          }}
        >
          I confirm that I have read and understood the contents of this Method
          Statement. Anything I did not understand has been explained to my
          satisfaction by the site supervisor. I agree to follow the method
          statement, work within the identified control measures, and wear the
          specified PPE at all times.
        </Text>

        <View
          style={{
            border: `0.5px solid ${border}`,
            borderRadius: 5,
            overflow: "hidden",
          }}
        >
          {/* Header row */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: navy,
              padding: "6 10",
            }}
          >
            <Text
              style={{
                flex: 3,
                color: "#e8eef5",
                fontSize: 9,
                fontFamily: "Helvetica-Bold",
              }}
            >
              Name
            </Text>
            <Text
              style={{
                flex: 2,
                color: "#e8eef5",
                fontSize: 9,
                fontFamily: "Helvetica-Bold",
              }}
            >
              Role
            </Text>
            <Text
              style={{
                flex: 3,
                color: "#e8eef5",
                fontSize: 9,
                fontFamily: "Helvetica-Bold",
              }}
            >
              Signature
            </Text>
            <Text
              style={{
                flex: 3,
                color: "#e8eef5",
                fontSize: 9,
                fontFamily: "Helvetica-Bold",
              }}
            >
              Date &amp; time signed
            </Text>
          </View>
          {/* 5 blank rows for site sign-off */}
          {Array.from({ length: 5 }).map((_, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                padding: "9 10",
                borderTop: i > 0 ? `0.5px solid #eee` : "none",
                backgroundColor: i % 2 === 0 ? "#fff" : pageBg,
                minHeight: 22,
              }}
            >
              <Text style={{ flex: 3 }}>&nbsp;</Text>
              <Text style={{ flex: 2 }}>&nbsp;</Text>
              <Text style={{ flex: 3 }}>&nbsp;</Text>
              <Text style={{ flex: 3 }}>&nbsp;</Text>
            </View>
          ))}
        </View>

        {/* Document status footer */}
        <View
          style={{
            marginTop: 20,
            padding: "10 12",
            backgroundColor: lightBg,
            borderRadius: 5,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 8.5,
                fontFamily: "Helvetica-Bold",
                color: navy,
                marginBottom: 2,
              }}
            >
              Document status: CONTROLLED
            </Text>
            <Text style={{ fontSize: 8, color: muted }}>
              {ctx.reference} · Rev 1 · Generated{" "}
              {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text
              style={{
                fontSize: 9,
                fontFamily: "Helvetica-Bold",
                color: navy,
              }}
            >
              {ctx.companyName}
            </Text>
            <Text style={{ fontSize: 8, color: muted }}>
              Prepared in accordance with CDM 2015
            </Text>
          </View>
        </View>

        <PDFFooter ctx={ctx} />
      </Page>
    </Document>
  );
}
