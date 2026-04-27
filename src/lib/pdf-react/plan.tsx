/**
 * Plan PDF — PPE Schedule, First Aid Assessment, Welfare Plan, EAP.
 * Cover + scope + numbered free-form sections + sign-off.
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
import { s, muted } from "./styles";

export interface PlanPdfSection {
  id?: string;
  label: string;
  body: string;
}

export interface PlanPdfForm {
  title?: string;
  scope?: string;
  preparedBy?: string;
  preparedByRole?: string;
  sections?: PlanPdfSection[];
}

export interface PlanPDFProps {
  form: PlanPdfForm;
  ctx: PDFContext;
  documentType?: string;
}

export function PlanPDF({ form, ctx, documentType = "Plan" }: PlanPDFProps) {
  const title = form.title || documentType;
  const sections = form.sections ?? [];

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <PDFWatermark watermark={ctx.watermark} />
        <CoverHeader
          ctx={ctx}
          documentType={documentType}
          title={title}
          subtitle={ctx.meta?.projectName ?? undefined}
        />
        <ProjectInfoGrid ctx={ctx} />

        {form.scope && (
          <>
            <SectionHead num={1} title="Scope" />
            <Text style={s.descBox}>{form.scope}</Text>
          </>
        )}

        {sections.length === 0 ? (
          <Text style={{ fontSize: 9, color: muted, fontStyle: "italic", marginBottom: 14 }}>
            No sections recorded.
          </Text>
        ) : (
          sections.map((sec, i) => (
            <View key={sec.id ?? i} minPresenceAhead={60}>
              <SectionHead num={i + 2} title={sec.label} />
              <Text style={s.descBox}>{sec.body || "—"}</Text>
            </View>
          ))
        )}

        <SectionHead num={sections.length + 2} title="Prepared by" />
        <SignOffCard
          preparedBy={form.preparedBy}
          preparedByRole={form.preparedByRole}
          date={ctx.meta?.dateOfWorks}
        />

        <PDFFooter ctx={ctx} />
      </Page>
    </Document>
  );
}
