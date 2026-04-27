/**
 * Permit-to-Work PDF — React-PDF version.
 * Cover + permit details + controls + issue/holder sign-off block.
 *
 * Same component used for every permit class (general PTW, hot works,
 * dig, confined space entry, working at height). The `documentType`
 * prop varies the cover badge text.
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
import { s, muted, navy, border, lightBg } from "./styles";

export interface PermitPdfForm {
  title?: string;
  workDescription?: string;
  location?: string;
  validFrom?: string;
  validTo?: string;
  issuedBy?: string;
  issuedByRole?: string;
  holder?: string;
  holderCompany?: string;
  conditions?: string;
  precautions?: string;
  isolations?: string;
}

export interface PermitPDFProps {
  form: PermitPdfForm;
  ctx: PDFContext;
  /** Cover badge text — e.g. "Hot Works Permit", "Permit to Dig". */
  documentType?: string;
}

export function PermitPDF({ form, ctx, documentType = "Permit to Work" }: PermitPDFProps) {
  const title = form.title || documentType;

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

        <SectionHead num={1} title="Description of work" />
        <Text style={s.descBox}>{form.workDescription || "—"}</Text>

        <SectionHead num={2} title="Location & validity" />
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 14 }}>
          <FieldCol label="Location" value={form.location} flex={2} />
          <FieldCol label="Valid from" value={form.validFrom} flex={1} />
          <FieldCol label="Valid to" value={form.validTo} flex={1} />
        </View>

        <SectionHead num={3} title="Precautions required" />
        <Text style={s.descBox}>{form.precautions || "—"}</Text>

        {form.isolations && (
          <>
            <SectionHead num={4} title="Isolations & lock-outs" />
            <Text style={s.descBox}>{form.isolations}</Text>
          </>
        )}

        {form.conditions && (
          <>
            <SectionHead num={5} title="Additional conditions" />
            <Text style={s.descBox}>{form.conditions}</Text>
          </>
        )}

        <SectionHead num={6} title="Issue & acceptance" />
        <View style={{ flexDirection: "row", gap: 14, marginBottom: 14 }}>
          <PermitParty
            label="Issued by"
            name={form.issuedBy}
            sub={form.issuedByRole}
          />
          <PermitParty
            label="Permit holder"
            name={form.holder}
            sub={form.holderCompany}
          />
        </View>

        <SignOffCard
          preparedBy={form.issuedBy}
          preparedByRole={form.issuedByRole}
          date={ctx.meta?.dateOfWorks}
        />

        <View style={s.notice}>
          <Text>
            This permit must be signed by the issuer and the holder before work begins. Work must
            stop and the permit be returned for cancellation if site conditions change. The permit
            is not transferable. Anyone working under this permit must understand and follow every
            precaution listed above.
          </Text>
        </View>

        <PDFFooter ctx={ctx} />
      </Page>
    </Document>
  );
}

function FieldCol({
  label,
  value,
  flex,
}: {
  label: string;
  value?: string;
  flex: number;
}) {
  return (
    <View style={{ flex, border: `0.5px solid ${border}`, borderRadius: 5, padding: "8 10" }}>
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

function PermitParty({
  label,
  name,
  sub,
}: {
  label: string;
  name?: string;
  sub?: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: lightBg,
        borderRadius: 5,
        padding: "10 12",
      }}
    >
      <Text
        style={{
          fontSize: 8.5,
          color: muted,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          fontFamily: "Helvetica-Bold",
          marginBottom: 4,
        }}
      >
        {label}
      </Text>
      <Text style={{ fontSize: 11, color: navy, fontFamily: "Helvetica-Bold" }}>
        {name || "—"}
      </Text>
      {sub && <Text style={{ fontSize: 9, color: muted, marginTop: 2 }}>{sub}</Text>}
    </View>
  );
}
