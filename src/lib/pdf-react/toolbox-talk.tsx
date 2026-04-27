/**
 * Toolbox Talk PDF — React-PDF version.
 * One-page briefing on a single topic + 8-row attendee sign-off table.
 *
 * The briefing body comes from the `generated` field (markdown-ish text
 * from the AI). We render it as a block — light bg, dark left bar.
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

export interface ToolboxTalkForm {
  topic?: string;
  audience?: string;
  duration?: string;
  /** Generated markdown-ish body. Renders as paragraphs split by double-newline. */
  generated?: string;
}

export interface ToolboxTalkPDFProps {
  form: ToolboxTalkForm;
  ctx: PDFContext;
}

export function ToolboxTalkPDF({ form, ctx }: ToolboxTalkPDFProps) {
  const topic = form.topic || "Untitled Toolbox Talk";
  const body = form.generated?.trim() ?? "";
  const paragraphs = body
    ? body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : [];

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <PDFWatermark watermark={ctx.watermark} />
        <CoverHeader
          ctx={ctx}
          documentType="Toolbox Talk"
          title={topic}
          subtitle={[
            form.audience ? `Audience: ${form.audience}` : null,
            form.duration ? `Duration: ${form.duration}` : null,
          ]
            .filter(Boolean)
            .join(" · ") || undefined}
        />

        <ProjectInfoGrid ctx={ctx} />

        {/* Briefing body */}
        <SectionHead num={1} title="Briefing" />
        {paragraphs.length === 0 ? (
          <Text style={{ fontSize: 9, color: muted, fontStyle: "italic", marginBottom: 14 }}>
            No briefing content recorded.
          </Text>
        ) : (
          <View
            style={{
              backgroundColor: pageBg,
              borderLeft: `3px solid ${navy}`,
              padding: "11 13",
              marginBottom: 16,
            }}
          >
            {paragraphs.map((p, i) => (
              <Text
                key={i}
                style={{
                  fontSize: 10,
                  color: navy,
                  lineHeight: 1.6,
                  marginBottom: i < paragraphs.length - 1 ? 8 : 0,
                }}
              >
                {p}
              </Text>
            ))}
          </View>
        )}

        {/* Attendee sign-off */}
        <SectionHead num={2} title="Attendee sign-off" />
        <Text
          style={{
            fontSize: 9.5,
            color: muted,
            lineHeight: 1.5,
            marginBottom: 10,
          }}
        >
          I confirm I have attended this toolbox talk and understood the content. I had the
          opportunity to ask questions. I will follow the practices discussed during my work on site.
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
