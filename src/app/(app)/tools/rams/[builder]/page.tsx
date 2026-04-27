import { notFound } from "next/navigation";
import { getBuilder } from "@/lib/rams/builders";
import { BuilderShell } from "../_components/builder-shell";
import { ComingSoon } from "../_components/coming-soon";
import { FullRamsBuilder } from "../_builders/full";
import { MethodStatementBuilder } from "../_builders/method-statement";
import { RiskAssessmentBuilder } from "../_builders/risk-assessment";
import { CoshhBuilder } from "../_builders/coshh";
import { HavsBuilder } from "../_builders/havs";
import { ToolboxTalkBuilder } from "../_builders/toolbox-talk";
import { RaLibrary } from "../_builders/ra-library";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ builder: string }>;
}) {
  const { builder } = await params;
  const b = getBuilder(builder);
  if (!b) return {};
  return {
    title: `${b.name} — RAMs Builder — ClickNComply`,
    description: b.tagline,
  };
}

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ builder: string }>;
}) {
  const { builder: slug } = await params;
  const builder = getBuilder(slug);
  if (!builder) notFound();

  const body = renderBody(slug);

  return <BuilderShell builder={builder}>{body}</BuilderShell>;
}

function renderBody(slug: string) {
  switch (slug) {
    case "full":
      return <FullRamsBuilder />;
    case "method-statement":
      return <MethodStatementBuilder />;
    case "risk-assessment":
      return <RiskAssessmentBuilder />;
    case "coshh":
      return <CoshhBuilder />;
    case "havs":
      return <HavsBuilder />;
    case "toolbox-talk":
      return <ToolboxTalkBuilder />;
    case "ra-library":
      return <RaLibrary />;
    default:
      return <ComingSoon slug={slug} />;
  }
}
