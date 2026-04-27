/**
 * Inspection PDF — PUWER / LOLER / Plant pre-start checklist.
 * Cover + checklist (pass / fail / N/A per row) + outcome + sign-off.
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
  pageBg,
  greenBg,
  greenText,
  greenBorder,
  redBg,
  redText,
  redBorder,
} from "./styles";

export type InspectionPdfStatus = "pass" | "fail" | "na";

export interface InspectionPdfItem {
  id?: string;
  text: string;
  status: InspectionPdfStatus;
  note?: string;
}

export interface InspectionPdfForm {
  title?: string;
  itemRef?: string;
  inspectionDate?: string;
  inspector?: string;
  inspectorRole?: string;
  items?: InspectionPdfItem[];
  overallResult?: "pass" | "fail" | "";
  comments?: string;
  nextDue?: string;
}

export interface InspectionPDFProps {
  form: InspectionPdfForm;
  ctx: PDFContext;
  documentType?: string;
}

const statusPill = (status: InspectionPdfStatus) => {
  if (status === "pass")
    return { bg: greenBg, color: greenText, border: greenBorder, label: "PASS" };
  if (status === "fail")
    return { bg: redBg, color: redText, border: redBorder, label: "FAIL" };
  return { bg: pageBg, color: muted, border, label: "N/A" };
};

export function InspectionPDF({
  form,
  ctx,
  documentType = "Inspection",
}: InspectionPDFProps) {
  const title = form.title || documentType;
  const items = form.items ?? [];
  const failed = items.filter((i) => i.status === "fail");

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <PDFWatermark watermark={ctx.watermark} />
        <CoverHeader
          ctx={ctx}
          documentType={documentType}
          title={title}
          subtitle={form.itemRef ? `Item: ${form.itemRef}` : undefined}
        />
        <ProjectInfoGrid ctx={ctx} />

        <SectionHead num={1} title="Item details" />
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 14 }}>
          <Field label="Item ref" value={form.itemRef} />
          <Field label="Inspection date" value={form.inspectionDate} />
          <Field label="Next due" value={form.nextDue} />
        </View>

        <SectionHead num={2} title="Checklist" />
        {items.length === 0 ? (
          <Text style={{ fontSize: 9, color: muted, fontStyle: "italic", marginBottom: 14 }}>
            No checks recorded.
          </Text>
        ) : (
          <View
            style={{
              border: `0.5px solid ${border}`,
              borderRadius: 5,
              overflow: "hidden",
              marginBottom: 14,
            }}
          >
            {items.map((it, i) => {
              const pill = statusPill(it.status);
              return (
                <View
                  key={it.id ?? i}
                  style={{
                    flexDirection: "row",
                    padding: "7 10",
                    borderTop: i > 0 ? "0.5px solid #eee" : "none",
                    backgroundColor: i % 2 === 0 ? "#fff" : pageBg,
                    alignItems: "flex-start",
                  }}
                  wrap={false}
                >
                  <Text
                    style={{
                      width: 18,
                      fontSize: 8,
                      color: muted,
                      paddingTop: 2,
                    }}
                  >
                    {i + 1}.
                  </Text>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={{ fontSize: 9.5, lineHeight: 1.4 }}>{it.text}</Text>
                    {it.note && (
                      <Text style={{ fontSize: 8.5, color: muted, marginTop: 2, fontStyle: "italic" }}>
                        Note: {it.note}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={{
                      backgroundColor: pill.bg,
                      color: pill.color,
                      border: `0.5px solid ${pill.border}`,
                      borderRadius: 3,
                      padding: "2 7",
                      fontSize: 8,
                      fontFamily: "Helvetica-Bold",
                      textAlign: "center",
                      width: 50,
                    }}
                  >
                    {pill.label}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        <SectionHead num={3} title="Outcome" />
        <View
          style={{
            backgroundColor: form.overallResult === "fail" ? redBg : greenBg,
            border: `0.5px solid ${form.overallResult === "fail" ? redBorder : greenBorder}`,
            borderRadius: 5,
            padding: "10 14",
            marginBottom: 14,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Helvetica-Bold",
                color: form.overallResult === "fail" ? redText : greenText,
                textTransform: "uppercase",
              }}
            >
              {form.overallResult || "—"}
            </Text>
            <Text
              style={{
                fontSize: 9,
                color: form.overallResult === "fail" ? redText : greenText,
                marginTop: 2,
              }}
            >
              {failed.length > 0
                ? `${failed.length} item${failed.length === 1 ? "" : "s"} failed`
                : "All checks passed"}
            </Text>
          </View>
          {form.nextDue && (
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ fontSize: 8, color: muted, textTransform: "uppercase" }}>
                Next due
              </Text>
              <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: navy }}>
                {form.nextDue}
              </Text>
            </View>
          )}
        </View>

        {form.comments && (
          <>
            <Text
              style={{
                fontSize: 8.5,
                fontFamily: "Helvetica-Bold",
                color: muted,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Comments
            </Text>
            <Text style={s.descBox}>{form.comments}</Text>
          </>
        )}

        <SectionHead num={4} title="Inspector" />
        <SignOffCard
          preparedBy={form.inspector}
          preparedByRole={form.inspectorRole}
          date={form.inspectionDate}
        />

        <PDFFooter ctx={ctx} />
      </Page>
    </Document>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <View
      style={{
        flex: 1,
        border: `0.5px solid ${border}`,
        borderRadius: 5,
        padding: "8 10",
      }}
    >
      <Text
        style={{
          fontSize: 8,
          color: muted,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          fontFamily: "Helvetica-Bold",
          marginBottom: 3,
        }}
      >
        {label}
      </Text>
      <Text style={{ fontSize: 10, color: navy, fontFamily: "Helvetica-Bold" }}>
        {value || "—"}
      </Text>
    </View>
  );
}
