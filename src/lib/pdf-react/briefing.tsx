/**
 * Briefing PDF — Site Induction / Daily Briefing / Pre-task Briefing.
 * Cover + introduction + numbered key points + questions + attendee
 * sign-off table.
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
import { s, muted, navy, border, pageBg } from "./styles";

export interface BriefingPdfPoint {
  id?: string;
  text: string;
}

export interface BriefingPdfForm {
  title?: string;
  audience?: string;
  duration?: string;
  introduction?: string;
  keyPoints?: BriefingPdfPoint[];
  questions?: string;
  presenter?: string;
  presenterRole?: string;
}

export interface BriefingPDFProps {
  form: BriefingPdfForm;
  ctx: PDFContext;
  documentType?: string;
}

export function BriefingPDF({
  form,
  ctx,
  documentType = "Briefing",
}: BriefingPDFProps) {
  const title = form.title || documentType;
  const points = form.keyPoints ?? [];

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <PDFWatermark watermark={ctx.watermark} />
        <CoverHeader
          ctx={ctx}
          documentType={documentType}
          title={title}
          subtitle={[
            form.audience ? `Audience: ${form.audience}` : null,
            form.duration ? `Duration: ${form.duration}` : null,
          ]
            .filter(Boolean)
            .join(" · ") || undefined}
        />
        <ProjectInfoGrid ctx={ctx} />

        {form.introduction && (
          <>
            <SectionHead num={1} title="Introduction" />
            <Text style={s.descBox}>{form.introduction}</Text>
          </>
        )}

        <SectionHead num={2} title="Key points" />
        {points.length === 0 ? (
          <Text style={{ fontSize: 9, color: muted, fontStyle: "italic", marginBottom: 14 }}>
            No key points recorded.
          </Text>
        ) : (
          points.map((p, idx) => (
            <View
              key={p.id ?? idx}
              style={{
                flexDirection: "row",
                gap: 9,
                padding: "7 0",
                borderBottom: "0.5px solid #eee",
                alignItems: "flex-start",
              }}
              wrap={false}
            >
              <Text
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: navy,
                  color: "#e8eef5",
                  fontSize: 8,
                  fontFamily: "Helvetica-Bold",
                  textAlign: "center",
                  paddingTop: 3.5,
                }}
              >
                {idx + 1}
              </Text>
              <Text style={{ flex: 1, fontSize: 10, lineHeight: 1.5 }}>{p.text}</Text>
            </View>
          ))
        )}

        {form.questions && (
          <>
            <SectionHead num={3} title="Questions raised" />
            <Text style={s.descBox}>{form.questions}</Text>
          </>
        )}

        <SectionHead num={4} title="Delivered by" />
        <View
          style={{
            border: `0.5px solid ${border}`,
            borderRadius: 5,
            padding: "10 12",
            marginBottom: 14,
          }}
        >
          <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: navy }}>
            {form.presenter || "—"}
          </Text>
          {form.presenterRole && (
            <Text style={{ fontSize: 9, color: muted, marginTop: 2 }}>
              {form.presenterRole}
            </Text>
          )}
        </View>

        <SectionHead num={5} title="Attendee sign-off" />
        <Text
          style={{
            fontSize: 9.5,
            color: muted,
            lineHeight: 1.5,
            marginBottom: 8,
          }}
        >
          I confirm I attended this briefing and understood the content. Any questions I raised were
          answered to my satisfaction.
        </Text>

        <View
          style={{
            border: `0.5px solid ${border}`,
            borderRadius: 5,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: navy,
              padding: "5 9",
            }}
          >
            <Text style={{ flex: 3, color: "#e8eef5", fontSize: 9, fontFamily: "Helvetica-Bold" }}>
              Name
            </Text>
            <Text style={{ flex: 2, color: "#e8eef5", fontSize: 9, fontFamily: "Helvetica-Bold" }}>
              Role
            </Text>
            <Text style={{ flex: 3, color: "#e8eef5", fontSize: 9, fontFamily: "Helvetica-Bold" }}>
              Signature
            </Text>
            <Text style={{ flex: 2, color: "#e8eef5", fontSize: 9, fontFamily: "Helvetica-Bold" }}>
              Date
            </Text>
          </View>
          {Array.from({ length: 8 }).map((_, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                padding: "10 9",
                borderTop: i > 0 ? "0.5px solid #eee" : "none",
                backgroundColor: i % 2 === 0 ? "#fff" : pageBg,
                minHeight: 24,
              }}
            >
              <Text style={{ flex: 3 }}>&nbsp;</Text>
              <Text style={{ flex: 2 }}>&nbsp;</Text>
              <Text style={{ flex: 3 }}>&nbsp;</Text>
              <Text style={{ flex: 2 }}>&nbsp;</Text>
            </View>
          ))}
        </View>

        <PDFFooter ctx={ctx} />
      </Page>
    </Document>
  );
}
