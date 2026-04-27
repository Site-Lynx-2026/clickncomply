/**
 * HAVS Assessment PDF — React-PDF version.
 * Cover + tool table + StatCallout for daily exposure + sign-off.
 *
 * Uses HSE's points system: points = (m/s²)² × hours × 2.
 * EAV = 100 pts (action level). ELV = 400 pts (limit, stop work).
 */

import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  CoverHeader,
  PDFFooter,
  PDFWatermark,
  ProjectInfoGrid,
  SectionHead,
  StatCallout,
  type PDFContext,
} from "./shared";
import { s, muted, navy, lightBg } from "./styles";

export interface HavsTool {
  id?: string;
  name: string;
  /** Vibration magnitude in m/s². */
  magnitude: number;
  /** Trigger time in hours. */
  hours: number;
}

export interface HavsForm {
  title?: string;
  workerName?: string;
  tools?: HavsTool[];
}

export interface HavsPDFProps {
  form: HavsForm;
  ctx: PDFContext;
}

const HAVS_EAV = 100;
const HAVS_ELV = 400;

const havsPoints = (magnitude: number, hours: number) =>
  Math.round(Math.pow(magnitude, 2) * hours * 2);

export function HavsPDF({ form, ctx }: HavsPDFProps) {
  const title = form.title || "HAVs Assessment";
  const tools = form.tools ?? [];
  const totalPoints = tools.reduce(
    (sum, t) => sum + havsPoints(t.magnitude, t.hours),
    0
  );
  const level: "low" | "med" | "high" =
    totalPoints >= HAVS_ELV ? "high" : totalPoints >= HAVS_EAV ? "med" : "low";
  const status =
    totalPoints >= HAVS_ELV
      ? "Limit value exceeded — STOP WORK"
      : totalPoints >= HAVS_EAV
      ? "Action level exceeded — controls required"
      : "Below action level";

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <PDFWatermark watermark={ctx.watermark} />
        <CoverHeader
          ctx={ctx}
          documentType="HAVs Assessment"
          title={title}
          subtitle={form.workerName ? `Worker: ${form.workerName}` : ctx.meta?.projectName ?? undefined}
        />
        <ProjectInfoGrid ctx={ctx} />

        <SectionHead
          num={1}
          title="Hand Arm Vibration — Control of Vibration at Work Regs 2005"
        />

        {tools.length === 0 ? (
          <Text style={{ fontSize: 9, color: muted, fontStyle: "italic", marginBottom: 14 }}>
            No tools recorded.
          </Text>
        ) : (
          <>
            {/* Tool table */}
            <View style={{ flexDirection: "row", backgroundColor: lightBg, padding: "5 8" }}>
              <Text
                style={{
                  width: "40%",
                  fontSize: 8.5,
                  fontFamily: "Helvetica-Bold",
                  color: muted,
                }}
              >
                Tool
              </Text>
              <Text
                style={{
                  width: "20%",
                  fontSize: 8.5,
                  fontFamily: "Helvetica-Bold",
                  color: muted,
                }}
              >
                Vibration (m/s²)
              </Text>
              <Text
                style={{
                  width: "20%",
                  fontSize: 8.5,
                  fontFamily: "Helvetica-Bold",
                  color: muted,
                }}
              >
                Trigger time (hrs)
              </Text>
              <Text
                style={{
                  width: "20%",
                  fontSize: 8.5,
                  fontFamily: "Helvetica-Bold",
                  color: muted,
                }}
              >
                Points
              </Text>
            </View>
            {tools.map((t, i) => {
              const pts = havsPoints(t.magnitude, t.hours);
              return (
                <View
                  key={t.id ?? i}
                  style={{
                    flexDirection: "row",
                    padding: "5 8",
                    borderBottom: "0.5px solid #eee",
                  }}
                  wrap={false}
                >
                  <Text style={{ width: "40%", fontSize: 9.5 }}>{t.name}</Text>
                  <Text style={{ width: "20%", fontSize: 9.5 }}>{t.magnitude} m/s²</Text>
                  <Text style={{ width: "20%", fontSize: 9.5 }}>{t.hours} hrs</Text>
                  <Text
                    style={{
                      width: "20%",
                      fontSize: 9.5,
                      fontFamily: "Helvetica-Bold",
                      color: pts >= HAVS_ELV ? "#a32d2d" : pts >= HAVS_EAV ? "#854f0b" : navy,
                    }}
                  >
                    {pts} pts
                  </Text>
                </View>
              );
            })}

            <StatCallout
              value={totalPoints}
              unit="pts"
              label="Daily exposure total"
              status={status}
              hint={`EAV: ${HAVS_EAV} pts (2.5 m/s²) · ELV: ${HAVS_ELV} pts (5 m/s²)`}
              level={level}
            />
          </>
        )}

        <View style={s.notice}>
          <Text>
            Vibration exposure is calculated using HSE&apos;s points system. Action level (EAV) at
            100 points triggers controls and health surveillance. Exposure limit (ELV) at 400 points
            must not be exceeded — stop work if calculated exposure reaches this threshold. All
            operatives using vibrating tools regularly must be enrolled on a health surveillance
            programme.
          </Text>
        </View>

        <PDFFooter ctx={ctx} />
      </Page>
    </Document>
  );
}
