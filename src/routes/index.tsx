import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  FileText,
  FileSpreadsheet,
  FileJson,
  Boxes,
  Sparkles,
  ClipboardCheck,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Save,
  FileCheck,
  UploadCloud,
  GripVertical,
  Check,
  PenLine,
  Database,
  TableProperties,
  UserCheck,
  Globe,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo, LogoMark, LogoDivider } from "@/components/Logo";
import {
  fetchApifyReference,
  saveReportToBox,
} from "@/lib/api/integrations.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CliniClean AI — Clinical reporting, accelerated by AI" },
      {
        name: "description",
        content:
          "From handwritten clinical notes to structured trial data, review-ready regulatory tables, and QC reports — with Box as the review workspace.",
      },
      { property: "og:title", content: "CliniClean AI" },
      {
        property: "og:description",
        content:
          "Clinical reporting, accelerated by AI.",
      },
    ],
  }),
  component: Index,
});

const progressSteps = [
  "Reading clinical files from Box...",
  "Interpreting study requirements...",
  "Calculating adverse event summaries...",
  "Generating regulatory-style table...",
  "Running QC validation...",
  "Preparing report for human review...",
];

const qcItems = [
  "Treatment groups separated correctly",
  "Counts and percentages validated",
  "Severity breakdown included",
  "Drug-related events included",
  "Study requirements matched",
  "External reference considered",
  "Ready for human review",
];

const tableRows = [
  ["Subjects with any AE", "9 (90.0%)", "5 (50.0%)"],
  ["Total adverse events", "9", "5"],
  ["Mild AE", "5", "3"],
  ["Moderate AE", "3", "2"],
  ["Severe AE", "1", "0"],
  ["Related to study drug", "5 (50.0%)", "1 (10.0%)"],
];

const handwrittenNotes = [
  { id: "001", arm: "Drug A", ae: "Headache", sev: "Mild", rel: "Yes" },
  { id: "002", arm: "Drug A", ae: "Nausea", sev: "Moderate", rel: "Yes" },
  { id: "003", arm: "Placebo", ae: "Fatigue", sev: "Mild", rel: "No" },
];

type FileConfig = {
  id: "note" | "csv" | "sap" | "shell" | "qc" | "ref";
  name: string;
  label: string;
  Icon: typeof FileText;
  spanClass: string;
  preview: React.ReactNode;
};

const CLINICAL_FILES: FileConfig[] = [
  {
    id: "note",
    name: "handwritten_note_sample.txt",
    label: "Transcribed handwritten note",
    Icon: FileText,
    spanClass: "lg:col-span-2",
    preview: (
      <pre className="overflow-hidden rounded-md border border-dashed border-border bg-muted/20 p-2 text-[10.5px] leading-relaxed text-foreground font-mono whitespace-pre-wrap">
{`Subj 004, Drug A
day 6 — mild rash
on forearms, resolved
without treatment.`}
      </pre>
    ),
  },
  {
    id: "csv",
    name: "patient_ae_data.csv",
    label: "Patient-level AE data",
    Icon: FileSpreadsheet,
    spanClass: "lg:col-span-4",
    preview: (
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-[11px]">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              {["Subject", "Arm", "AE", "Severity"].map((h) => (
                <th key={h} className="px-2 py-1.5 text-left font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono">
            {[
              ["001", "Drug A", "Headache", "Mild"],
              ["002", "Drug A", "Nausea", "Moderate"],
              ["003", "Placebo", "Fatigue", "Mild"],
              ["004", "Drug A", "Rash", "Severe"],
              ["005", "Placebo", "—", "—"],
            ].map((r, i) => (
              <tr
                key={i}
                className="border-t border-border odd:bg-background even:bg-muted/10"
              >
                {r.map((c, j) => (
                  <td
                    key={j}
                    className={`px-2 py-1.5 ${c === "—" ? "text-destructive/70" : "text-foreground"}`}
                  >
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    id: "sap",
    name: "sap_excerpt.txt",
    label: "Study requirements",
    Icon: FileText,
    spanClass: "lg:col-span-2",
    preview: (
      <ul className="space-y-1.5 text-xs leading-relaxed">
        {[
          "Group adverse events by treatment arm",
          "Include severity breakdown",
          "Calculate subject counts and percentages",
          "Flag drug-related events",
        ].map((t) => (
          <li key={t} className="flex gap-2">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />
            <span className="italic text-muted-foreground">“{t}”</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "shell",
    name: "table_shell.txt",
    label: "Table shell",
    Icon: FileText,
    spanClass: "lg:col-span-2",
    preview: (
      <div className="overflow-hidden rounded-md border border-dashed border-border">
        <table className="w-full text-[11px] font-mono">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-2 py-1 text-left font-medium">Category</th>
              <th className="px-2 py-1 text-right font-medium">Drug A</th>
              <th className="px-2 py-1 text-right font-medium">Placebo</th>
            </tr>
          </thead>
          <tbody>
            {["Any AE", "Mild", "Moderate", "Severe"].map((c) => (
              <tr key={c} className="border-t border-border">
                <td className="px-2 py-1 text-foreground">{c}</td>
                <td className="px-2 py-1 text-right text-muted-foreground/60">___</td>
                <td className="px-2 py-1 text-right text-muted-foreground/60">___</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    id: "qc",
    name: "qc_checklist.txt",
    label: "QC criteria",
    Icon: ClipboardCheck,
    spanClass: "lg:col-span-2",
    preview: (
      <ul className="space-y-1.5 text-xs">
        {[
          "Treatment arms separated?",
          "Percentages correct?",
          "Severity included?",
          "SAP matched?",
          "Ready for review?",
        ].map((t) => (
          <li key={t} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-[3px] border border-muted-foreground/60" />
            <span className="text-muted-foreground">{t}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "ref",
    name: "external_reference_from_apify.json",
    label: "External reference (Apify)",
    Icon: FileJson,
    spanClass: "lg:col-span-6",
    preview: (
      <pre className="overflow-hidden rounded-md border border-border bg-muted/30 p-2 text-[10.5px] leading-relaxed text-foreground font-mono">
{`{
  source: "external clinical reporting reference",
  topic:  "adverse event summary reporting",
  origin: "Apify actor run",
  status: "collected"
}`}
      </pre>
    ),
  },
];

type FileId = "note" | "csv" | "sap" | "shell" | "qc" | "ref";

function Index() {
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const [activeStep, setActiveStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState<Set<FileId>>(new Set());
  const [dragOver, setDragOver] = useState(false);
  const [draggingId, setDraggingId] = useState<FileId | null>(null);
  const [reviewAction, setReviewAction] = useState<"approved" | "revision" | null>(null);

  // Real server-fn integrations (Apify + Box). Tokens live server-side only.
  const collectApify = useServerFn(fetchApifyReference);
  const saveBox = useServerFn(saveReportToBox);
  const [apifyState, setApifyState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [apifyError, setApifyError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedFiles, setSavedFiles] = useState<string[]>([]);

  // Hero "live demo" animation: cycle through 4 process steps with a syncing progress bar
  const [heroStep, setHeroStep] = useState(0);
  const [heroPct, setHeroPct] = useState(0);
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setHeroStep((s) => (s + 1) % 4);
    }, 1400);
    const pctInterval = setInterval(() => {
      setHeroPct((p) => {
        const next = p + 2;
        return next > 100 ? 0 : next;
      });
    }, 90);
    return () => {
      clearInterval(stepInterval);
      clearInterval(pctInterval);
    };
  }, []);

  const allLoaded = loaded.size === 6;

  const loadFile = (id: FileId) => {
    setLoaded((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleCollectApify = async () => {
    setApifyState("loading");
    setApifyError(null);
    try {
      await collectApify();
      setApifyState("done");
      loadFile("ref");
    } catch (err) {
      setApifyState("error");
      setApifyError(
        err instanceof Error
          ? err.message
          : "Couldn't reach Apify. Please try again.",
      );
    }
  };

  const handleSaveToBox = async () => {
    setSaveState("loading");
    setSaveError(null);
    try {
      const res = await saveBox();
      setSavedFiles(res.uploaded_files.map((f) => f.name));
      setSaveState("done");
      setSaved(true);
    } catch (err) {
      setSaveState("error");
      setSaveError(
        err instanceof Error
          ? err.message
          : "Couldn't save to Box. Please try again.",
      );
    }
  };

  const handleGenerate = () => {
    if (!allLoaded) return;
    setPhase("loading");
    setActiveStep(0);
    progressSteps.forEach((_, i) => {
      setTimeout(() => setActiveStep(i + 1), (i + 1) * 600);
    });
    setTimeout(() => setPhase("done"), progressSteps.length * 600 + 300);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <nav className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <div className="leading-tight">
              <p className="text-[15px] font-semibold tracking-tight text-foreground">
                CliniClean <span className="text-primary">AI</span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                Clinical reporting, accelerated by AI.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.65_0.15_155)]/30 bg-[oklch(0.65_0.15_155)]/10 px-2.5 py-1 text-[11px] font-medium text-[oklch(0.45_0.13_155)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.65_0.15_155)] animate-pulse" />
              Powered by Box · Apify · Demo Mode
            </span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden border-b border-border/60 bg-[var(--gradient-hero)]">
        <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[oklch(0.78_0.12_165)]/15 blur-3xl" />
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="oklch(0.32 0.09 250)" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>

        {/* Brand watermark — giant helix mark */}
        <div className="pointer-events-none absolute -right-16 -top-10 hidden sm:block">
          <LogoMark size={420} variant="ghost" />
        </div>
        <div className="pointer-events-none absolute -left-20 bottom-0 hidden lg:block">
          <LogoMark size={260} variant="ghost" className="opacity-60" />
        </div>



        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-16 text-center sm:px-8 sm:pt-28 sm:pb-24">
          <h1 className="mx-auto max-w-5xl text-3xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-[1.1]">
            Clinical reporting,{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              accelerated by AI.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            From handwritten clinical notes to structured trial data, review-ready
            regulatory tables, and QC reports, with Box as the review workspace.
          </p>

          {/* Value chips */}
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-2">
            {[
              "Reduce manual transcription",
              "Automate table generation",
              "Catch QC issues earlier",
              "Protect reporting timelines",
            ].map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-foreground/80 shadow-sm backdrop-blur"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-[oklch(0.55_0.15_160)]" />
                {t}
              </span>
            ))}
          </div>

          {/* Four-card workflow */}
          <div className="mx-auto mt-16 grid max-w-6xl items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 — Clinical Notes */}
            <WorkflowCard
              n={1}
              label="Capture"
              title="Clinical Notes"
              icon={<PenLine className="h-4 w-4" />}
              accent="muted"
              bullets={[
                "Handwritten nurse notes",
                "Physician observations",
                "Scanned clinical forms",
              ]}
            >
              {/* Mock handwritten card */}
              <div
                className="relative rotate-[-1.2deg] rounded-md border border-[oklch(0.85_0.05_85)]/60 bg-[oklch(0.985_0.02_85)] p-2 shadow-sm"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent 0px, transparent 13px, oklch(0.85 0.04 220 / 0.35) 13px, oklch(0.85 0.04 220 / 0.35) 14px)",
                }}
              >
                <div className="mb-1 flex items-center justify-between text-[8px] uppercase tracking-wider text-muted-foreground">
                  <span>Nurse note</span>
                  <span>Day 14</span>
                </div>
                <ul
                  className="space-y-[3px] text-[10px] leading-[14px] text-foreground/85"
                  style={{ fontFamily: '"Caveat", "Comic Sans MS", cursive' }}
                >
                  {handwrittenNotes.map((n) => (
                    <li key={n.id}>
                      <span className="font-semibold">P{n.id}</span> · {n.arm} ·{" "}
                      {n.ae} ({n.sev}) · rel: {n.rel}
                    </li>
                  ))}
                </ul>
              </div>
            </WorkflowCard>

            {/* Card 2 — Structured Data */}
            <WorkflowCard
              n={2}
              label="Structure"
              title="Structured Data"
              icon={<Database className="h-4 w-4" />}
              accent="cyan"
              bullets={[
                "Patient-level AE data",
                "Study requirements",
                "Table shell",
                "QC criteria",
              ]}
              footer="Computer vision + clinical data structuring"
            >
              <div className="overflow-hidden rounded-md border border-border bg-background font-mono text-[9px]">
                <div className="grid grid-cols-5 bg-primary/8 px-1.5 py-0.5 text-[8.5px] text-primary">
                  <span>Subj</span>
                  <span>Arm</span>
                  <span>AE</span>
                  <span>Sev</span>
                  <span>Rel</span>
                </div>
                {handwrittenNotes.map((n) => (
                  <div
                    key={n.id}
                    className="grid grid-cols-5 border-t border-border/60 px-1.5 py-0.5 text-foreground/85"
                  >
                    <span>{n.id}</span>
                    <span>{n.arm}</span>
                    <span>{n.ae}</span>
                    <span>{n.sev}</span>
                    <span>{n.rel}</span>
                  </div>
                ))}
              </div>
            </WorkflowCard>

            {/* Card 3 — AI Tables */}
            <WorkflowCard
              n={3}
              label="Generate"
              title="AI Tables"
              icon={<TableProperties className="h-4 w-4" />}
              accent="primary"
              bullets={[
                "Apply reporting rules",
                "Generate clinical table",
                "Run QC validation",
              ]}
            >
              <div className="rounded-md border border-primary/25 bg-card/80 p-1.5">
                <div className="mb-1 flex items-center justify-between text-[8.5px] uppercase tracking-wider text-primary">
                  <span>Table 14.3.1 · AE summary</span>
                  <Sparkles className="h-2.5 w-2.5" />
                </div>
                <div className="overflow-hidden rounded-sm border border-border/60 font-mono text-[9px]">
                  <div className="grid grid-cols-3 bg-primary/8 px-1.5 py-0.5 text-primary">
                    <span>Category</span>
                    <span className="text-right">Drug A</span>
                    <span className="text-right">Placebo</span>
                  </div>
                  {[
                    ["Any AE", "9 (90%)", "5 (50%)"],
                    ["Mild", "5", "3"],
                    ["Moderate", "3", "2"],
                    ["Severe", "1", "0"],
                  ].map((r) => (
                    <div
                      key={r[0]}
                      className="grid grid-cols-3 border-t border-border/50 px-1.5 py-0.5 text-foreground/85"
                    >
                      <span>{r[0]}</span>
                      <span className="text-right tabular-nums">{r[1]}</span>
                      <span className="text-right tabular-nums">{r[2]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-primary/10">
                <div
                  className="h-full rounded-full transition-[width] duration-100 ease-linear"
                  style={{ width: `${heroPct}%`, background: "var(--gradient-brand)" }}
                />
              </div>
            </WorkflowCard>

            {/* Card 4 — Human Review */}
            <WorkflowCard
              n={4}
              label="Review"
              title="Human Review"
              icon={<UserCheck className="h-4 w-4" />}
              accent="mint"
              bullets={[
                "QC report passed",
                "Saved to Box",
                "Ready for expert review",
              ]}
            >
              <div className="rounded-md border border-[oklch(0.7_0.16_160)]/30 bg-[oklch(0.7_0.16_160)]/[0.05] p-2">
                <div className="mb-1 flex items-center justify-between text-[8.5px] uppercase tracking-wider text-[oklch(0.4_0.13_160)]">
                  <span className="flex items-center gap-1">
                    <Boxes className="h-2.5 w-2.5" />
                    Box · Review queue
                  </span>
                  <span className="rounded-full bg-[oklch(0.7_0.16_160)]/15 px-1.5 py-0.5 font-semibold">
                    Ready
                  </span>
                </div>
                <ul className="space-y-1 text-[9.5px] text-foreground/85">
                  {[
                    "Adverse_Events_Summary_Table.md",
                    "QC_Report_Adverse_Events.md",
                    "external_reference_from_apify.json",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-2.5 w-2.5 shrink-0 text-[oklch(0.55_0.15_160)]" />
                      <span className="truncate font-mono">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex gap-1">
                  <span className="flex-1 rounded-sm bg-[oklch(0.7_0.16_160)] px-1.5 py-0.5 text-center text-[8.5px] font-semibold text-white">
                    Approve
                  </span>
                  <span className="flex-1 rounded-sm border border-border bg-card px-1.5 py-0.5 text-center text-[8.5px] font-semibold text-foreground/70">
                    Revise
                  </span>
                </div>
              </div>
            </WorkflowCard>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-24 px-6 py-20 sm:space-y-28 sm:px-8">
        {/* MODULE 1 — Capture & Structure (before/after) */}
        <section>
          <Label text="Module 1 · Capture & structure" />
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Capture and structure clinical inputs
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Clinical observations may begin as handwritten notes, scanned forms,
              or semi-structured records. CliniClean AI converts them into
              structured trial data before reporting begins.
            </p>
          </div>

          <Card className="rounded-2xl border-border/70 p-6 shadow-[var(--shadow-card)] sm:p-8">
            <div className="grid items-stretch gap-5 lg:grid-cols-[1fr_auto_1fr]">
              {/* Before */}
              <div className="flex flex-col">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Before · Original clinical note
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    Handwritten
                  </span>
                </div>
                <div
                  className="relative flex-1 rotate-[-0.8deg] rounded-xl border border-[oklch(0.85_0.05_85)]/60 bg-[oklch(0.985_0.02_85)] p-5 shadow-md"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, transparent 0px, transparent 25px, oklch(0.85 0.04 220 / 0.4) 25px, oklch(0.85 0.04 220 / 0.4) 26px)",
                  }}
                >
                  <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span>Nurse note · Site 03</span>
                    <span>Day 14</span>
                  </div>
                  <ul
                    className="space-y-3 text-[15px] leading-[26px] text-foreground/85"
                    style={{ fontFamily: '"Caveat", "Comic Sans MS", cursive' }}
                  >
                    {handwrittenNotes.map((n) => (
                      <li key={n.id}>
                        <span className="font-semibold">Patient {n.id}</span> —
                        Arm: {n.arm}, AE: {n.ae}, Severity: {n.sev}, Related:{" "}
                        {n.rel}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center justify-center gap-3 py-4 lg:py-0">
                <div className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  Digitize + Structure
                </div>
                <div className="flex items-center gap-1 text-primary">
                  <ArrowRight className="h-6 w-6 animate-nudge-right" />
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Computer vision · NLP
                </span>
              </div>

              {/* After */}
              <div className="flex flex-col">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                    After · Structured patient-level data
                  </span>
                  <span className="rounded-full bg-[oklch(0.7_0.16_160)]/15 px-2 py-0.5 text-[10px] font-medium text-[oklch(0.4_0.13_160)]">
                    Structured
                  </span>
                </div>
                <div className="flex-1 overflow-hidden rounded-xl border border-primary/20 bg-card shadow-md">
                  <table className="w-full text-xs">
                    <thead className="bg-primary/5 text-[11px] text-primary">
                      <tr>
                        {["Subject", "Arm", "AE", "Severity", "Related"].map((h) => (
                          <th key={h} className="px-3 py-2 text-left font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      {handwrittenNotes.map((n, i) => (
                        <tr
                          key={n.id}
                          className="border-t border-border odd:bg-background even:bg-muted/10 animate-row-reveal"
                          style={{ animationDelay: `${i * 140}ms` }}
                        >
                          <td className="px-3 py-2">{n.id}</td>
                          <td className="px-3 py-2">{n.arm}</td>
                          <td className="px-3 py-2">{n.ae}</td>
                          <td className="px-3 py-2">{n.sev}</td>
                          <td className="px-3 py-2">{n.rel}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* MODULE 2 — Box workspace */}
        <section>
          <Label text="Module 2 · Centralize in Box" />
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Centralize study files in Box
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Box stores the clinical notes, study files, generated reports,
              and human review package. Apify collects an external clinical
              reporting reference and files it into Box as QC context.
              CliniClean AI generates the table and QC report, then saves
              them back to Box for human review.
            </p>
          </div>

          <Card className="rounded-2xl border-border/70 p-8 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  <Boxes className="h-3.5 w-3.5 text-primary" /> Box Clinical Workspace
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
                    allLoaded
                      ? "border-[oklch(0.7_0.16_160)]/40 bg-[oklch(0.7_0.16_160)]/10 text-[oklch(0.4_0.13_160)]"
                      : "border-border bg-muted/40 text-muted-foreground"
                  }`}
                >
                  {loaded.size} of 6 files loaded
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-12">
              <div className="relative lg:col-span-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Source files
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      <Boxes className="h-3 w-3" /> Loaded from Box
                    </span>
                  </div>
                  {loaded.size === 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary animate-pulse">
                      Drag me
                      <ArrowRight className="h-3 w-3 animate-nudge-right" />
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {CLINICAL_FILES.map((f, i) => {
                    const isLoaded = loaded.has(f.id);
                    const isDragging = draggingId === f.id;
                    const isHintTarget = !isLoaded && loaded.size === 0 && i === 0;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        draggable={!isLoaded}
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", f.id);
                          e.dataTransfer.effectAllowed = "move";
                          setDraggingId(f.id);
                        }}
                        onDragEnd={() => setDraggingId(null)}
                        onClick={() => !isLoaded && loadFile(f.id)}
                        disabled={isLoaded}
                        className={`group relative flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left shadow-sm transition ${
                          isLoaded
                            ? "border-border/50 opacity-40"
                            : "border-border cursor-grab hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md active:cursor-grabbing"
                        } ${isDragging ? "opacity-50" : ""} ${
                          isHintTarget ? "ring-2 ring-primary/40 ring-offset-2 ring-offset-background" : ""
                        }`}
                      >
                        <GripVertical className={`h-4 w-4 shrink-0 ${isHintTarget ? "text-primary" : "text-muted-foreground/60 group-hover:text-primary"}`} />
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <f.Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate text-xs font-medium text-foreground">
                              {f.name}
                            </p>
                            {f.id === "ref" && (
                              <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-[oklch(0.72_0.11_200)]/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[oklch(0.4_0.12_200)]">
                                Apify
                              </span>
                            )}
                          </div>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {f.id === "ref" ? "Collected by Apify · stored in Box" : f.label}
                          </p>
                        </div>
                        {isLoaded && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[oklch(0.55_0.15_160)]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-8">
                <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Box Clinical Workspace
                </p>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    const id = e.dataTransfer.getData("text/plain") as FileId;
                    if (id) loadFile(id);
                    setDragOver(false);
                    setDraggingId(null);
                  }}
                  className={`relative min-h-[440px] rounded-2xl border-2 border-dashed p-4 sm:p-6 transition ${
                    dragOver
                      ? "border-primary bg-primary/5"
                      : allLoaded
                        ? "border-[oklch(0.7_0.16_160)]/40 bg-[oklch(0.7_0.16_160)]/[0.04]"
                        : "border-border bg-[radial-gradient(oklch(0.92_0.02_220)_1px,transparent_1px)] [background-size:18px_18px] bg-muted/10"
                  }`}
                >
                  {loaded.size === 0 ? (
                    <div className="relative flex h-full min-h-[400px] flex-col items-center justify-center text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-[var(--shadow-glow)] animate-pulse">
                        <UploadCloud className="h-8 w-8" />
                      </div>
                      <p className="mt-4 text-base font-semibold text-foreground">
                        Drag clinical files into Box
                      </p>
                      <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                        CSV data, SAP excerpts, table shells, QC notes, and
                        external references
                      </p>
                      <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        Drag from the left, or click any file to load it
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 lg:grid-cols-6 lg:grid-rows-2 lg:gap-4">
                      {CLINICAL_FILES.filter((f) => loaded.has(f.id)).map((f) => (
                        <ScatterCard
                          key={f.id}
                          className={`${f.spanClass} animate-fade-in`}
                          icon={<f.Icon className="h-4 w-4" />}
                          title={f.name}
                          badge={f.id === "ref" ? "Collected by Apify" : "Loaded from Box"}
                          badgeTone={f.id === "ref" ? "apify" : "loaded"}
                        >
                          {f.preview}
                        </ScatterCard>
                      ))}
                    </div>
                  )}
                </div>

                {allLoaded && (
                  <div className="mt-4 space-y-2 animate-fade-in">
                    <div className="flex items-center gap-2 rounded-xl border border-[oklch(0.7_0.16_160)]/30 bg-[oklch(0.7_0.16_160)]/[0.06] px-4 py-3 text-sm">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[oklch(0.55_0.15_160)]" />
                      <span className="text-foreground">
                        All study files loaded. Ready for AI generation.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </section>

        {/* MODULE 3 — Generate */}
        <section>
          <Label text="Module 3 · Generate & validate" />
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Generate and validate with AI
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              One click reads the Box files, interprets study requirements,
              generates the clinical table, and runs QC validation.
            </p>
          </div>

          <Card className="relative overflow-hidden rounded-3xl border-2 border-primary/30 p-10 text-center shadow-[var(--shadow-elevated)] sm:p-14">
            <div
              className="pointer-events-none absolute inset-0 opacity-90"
              style={{ background: "var(--gradient-mesh)" }}
            />
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="grid-2" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M32 0H0V32" fill="none" stroke="oklch(0.78 0.14 210)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-2)" />
            </svg>
            {/* Pulsing glow halos behind the CTA */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-[360px] w-[360px] rounded-full bg-primary/20 blur-3xl animate-pulse" />
            </div>
            <div className="relative">
              <div className="flex flex-col items-center gap-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary backdrop-blur">
                  <Sparkles className="h-3 w-3" /> One-click AI pipeline
                </span>
                <div className="relative">
                  {/* Animated gradient ring */}
                  {allLoaded && phase === "idle" && (
                    <span className="pointer-events-none absolute -inset-2 rounded-2xl bg-gradient-to-r from-primary via-[oklch(0.72_0.18_200)] to-primary opacity-60 blur-md animate-pulse" />
                  )}
                  <Button
                    onClick={handleGenerate}
                    disabled={phase === "loading" || !allLoaded}
                    className="relative h-auto rounded-2xl bg-gradient-to-r from-primary to-[oklch(0.55_0.18_220)] px-10 py-7 text-lg font-semibold shadow-[0_20px_60px_-15px_oklch(0.5_0.18_220/0.7)] transition-transform hover:scale-[1.02] hover:shadow-[0_25px_70px_-15px_oklch(0.5_0.18_220/0.85)] disabled:opacity-60 sm:px-14 sm:py-8 sm:text-xl"
                  >
                    {phase === "loading" ? (
                      <>
                        <Loader2 className="mr-3 h-6 w-6 animate-spin sm:h-7 sm:w-7" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-3 h-6 w-6 sm:h-7 sm:w-7" />
                        Generate Clinical Table
                        <ArrowRight className="ml-3 h-6 w-6 sm:h-7 sm:w-7" />
                      </>
                    )}
                  </Button>
                </div>
                <p className="max-w-md text-sm text-muted-foreground">
                  Reads Box files · interprets study requirements · generates
                  regulatory table · runs QC validation
                </p>
                {!allLoaded && phase === "idle" && (
                  <p className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Load all 6 files in Module 2 to enable
                  </p>
                )}
              </div>

              {phase !== "idle" && (
                <div className="mx-auto mt-8 max-w-md space-y-2 text-left">
                  {progressSteps.map((s, i) => {
                    const done = i < activeStep;
                    const active = i === activeStep && phase === "loading";
                    return (
                      <div
                        key={s}
                        className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition ${
                          done
                            ? "border-primary/20 bg-primary/5 text-foreground"
                            : active
                              ? "border-primary/30 bg-primary/5 text-foreground"
                              : "border-border bg-card text-muted-foreground"
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : active ? (
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-border" />
                        )}
                        <span>{s}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* MODULE 4 — Output + QC */}
        {phase === "done" && (
          <section className="animate-fade-in">
            <Label text="Module 4 · Review-ready output" />
            <div className="mb-8">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Review-ready regulatory output
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                The system produces a structured clinical table and QC report
                that experts can review, approve, or revise.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
              {/* Table */}
              <Card className="relative overflow-hidden rounded-2xl border-primary/30 p-8 shadow-[var(--shadow-glow)] lg:col-span-3">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-[oklch(0.78_0.14_210)] to-[oklch(0.7_0.16_160)]" />
                <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-[oklch(0.78_0.14_210)]/20 blur-2xl" />

                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    Clinical table
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-gradient-to-r from-primary/10 to-[oklch(0.78_0.14_210)]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary animate-badge-shine">
                      <Sparkles className="h-3 w-3" />
                      Just generated
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                      <Boxes className="h-3 w-3" />
                      Saved back to Box
                    </span>
                  </div>
                </div>

                <div className="relative mt-6 overflow-hidden rounded-xl border border-primary/20 shadow-md">
                  <div className="border-b border-border bg-gradient-to-r from-primary/5 to-[oklch(0.78_0.14_210)]/10 px-5 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        Table 14.3.1 — Summary of Adverse Events
                      </p>
                      <span className="inline-flex items-center gap-1 rounded-md bg-[oklch(0.7_0.16_160)]/10 px-2 py-0.5 text-[10px] font-semibold text-[oklch(0.4_0.13_160)]">
                        <CheckCircle2 className="h-3 w-3" /> Validated
                      </span>
                    </div>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/20 text-left">
                        <th className="px-5 py-3 font-medium text-muted-foreground">
                          Category
                        </th>
                        <th className="px-5 py-3 text-right font-medium text-muted-foreground">
                          Drug A (N=10)
                        </th>
                        <th className="px-5 py-3 text-right font-medium text-muted-foreground">
                          Placebo (N=10)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((r, i) => (
                        <tr
                          key={r[0]}
                          className="border-b border-border last:border-0 animate-row-reveal hover:bg-muted/20"
                          style={{ animationDelay: `${i * 140}ms` }}
                        >
                          <td className="px-5 py-3 text-foreground">{r[0]}</td>
                          <td className="px-5 py-3 text-right tabular-nums font-medium text-foreground">
                            {r[1]}
                          </td>
                          <td className="px-5 py-3 text-right tabular-nums font-medium text-foreground">
                            {r[2]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5 text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-primary" /> AI-generated
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5 text-muted-foreground">
                    Traceable to source data
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5 text-muted-foreground">
                    Regulatory-style format
                  </span>
                </div>
              </Card>

              {/* QC */}
              <Card className="relative overflow-hidden rounded-2xl border-[oklch(0.7_0.16_160)]/40 p-8 shadow-[0_0_40px_-12px_oklch(0.7_0.16_160_/_0.4)] lg:col-span-2">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[oklch(0.7_0.16_160)] to-[oklch(0.78_0.14_210)]" />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[oklch(0.7_0.16_160)]/15">
                      <ClipboardCheck className="h-4 w-4 text-[oklch(0.45_0.13_160)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      AI QC Review
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.7_0.16_160)]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[oklch(0.4_0.13_160)] animate-badge-shine">
                    {qcItems.length} / {qcItems.length} passed
                  </span>
                </div>

                <ul className="mt-5 space-y-2">
                  {qcItems.map((item, i) => (
                    <li
                      key={item}
                      className="flex items-start justify-between gap-3 rounded-lg border border-[oklch(0.7_0.16_160)]/20 bg-gradient-to-r from-[oklch(0.7_0.16_160)]/[0.04] to-transparent px-3 py-2 text-sm animate-row-reveal"
                      style={{ animationDelay: `${i * 90}ms` }}
                    >
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.55_0.15_160)]" />
                        <span className="text-foreground">{item}</span>
                      </div>
                      <span className="shrink-0 rounded-full bg-[oklch(0.65_0.15_155)]/10 px-2 py-0.5 text-[10px] font-medium text-[oklch(0.5_0.15_155)]">
                        Passed
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <Button
                    onClick={handleSaveToBox}
                    disabled={saveState === "loading" || saveState === "done"}
                    className="w-full rounded-xl"
                    size="lg"
                  >
                    {saveState === "loading" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    {saveState === "done"
                      ? "Saved back to Box"
                      : saveState === "loading"
                        ? "Uploading to Box..."
                        : "Save Report to Box"}
                  </Button>
                  {saveState === "done" && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg border border-[oklch(0.65_0.15_155)]/30 bg-[oklch(0.65_0.15_155)]/5 px-3 py-2.5 text-xs text-foreground animate-fade-in">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.65_0.15_155)]" />
                      <div>
                        <p>Saved back to Box for human review.</p>
                        {savedFiles.length > 0 && (
                          <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                            {savedFiles.join(" · ")}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {saveState === "error" && saveError && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-xs text-foreground animate-fade-in">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                      <span>{saveError}</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* MODULE 5 — Human review in Box */}
        {phase === "done" && (
          <section className="animate-fade-in">
            <Label text="Module 5 · Human review in Box" />
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Human review in Box
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-[oklch(0.65_0.15_155)]/40 bg-[oklch(0.65_0.15_155)]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[oklch(0.45_0.13_155)]">
                  <CheckCircle2 className="h-3 w-3" />
                  Ready for human review
                </span>
              </div>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                Generated outputs are saved back to Box so clinical experts can
                review, approve, or request revision.
              </p>
            </div>

            <Card className="rounded-2xl border-border/70 p-6 shadow-[var(--shadow-card)] sm:p-8">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Boxes className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Box · Review Queue
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Review package · 3 files
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                    reviewAction === "approved"
                      ? "bg-[oklch(0.7_0.16_160)]/15 text-[oklch(0.4_0.13_160)]"
                      : reviewAction === "revision"
                        ? "bg-[oklch(0.75_0.15_70)]/15 text-[oklch(0.45_0.15_70)]"
                        : "bg-primary/10 text-primary animate-badge-shine"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {reviewAction === "approved"
                    ? "Approved"
                    : reviewAction === "revision"
                      ? "Revision requested"
                      : "Ready for Review"}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { name: "Adverse_Events_Summary_Table.md", Icon: FileCheck },
                  { name: "QC_Report_Adverse_Events.md", Icon: ClipboardCheck },
                  { name: "external_reference_from_apify.json", Icon: FileJson },
                ].map((f) => (
                  <div
                    key={f.name}
                    className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <f.Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-foreground">
                        {f.name}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[oklch(0.65_0.15_155)]/10 px-2 py-0.5 text-[10px] font-medium text-[oklch(0.5_0.15_155)]">
                        <Check className="h-2.5 w-2.5" /> Saved to Box
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setReviewAction("revision")}
                  disabled={reviewAction !== null}
                  className="rounded-xl"
                >
                  Request Revision
                </Button>
                <Button
                  onClick={() => setReviewAction("approved")}
                  disabled={reviewAction !== null}
                  className="rounded-xl bg-[oklch(0.55_0.15_160)] text-white hover:bg-[oklch(0.5_0.15_160)]"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </div>

              {reviewAction && (
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-xs text-foreground animate-fade-in">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.55_0.15_160)]" />
                  <span>
                    {reviewAction === "approved"
                      ? "Review package approved. Status updated in Box."
                      : "Revision requested. Reviewer notes returned to the clinical team."}
                  </span>
                </div>
              )}
            </Card>
          </section>
        )}

        {/* Apify integration */}
        <section>
          <Label text="External reference · Apify" />
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              External reference by Apify
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Apify collects external clinical reporting references and stores
              them in Box as supporting context for QC review.
            </p>
          </div>

          <Card className="rounded-2xl border-border/70 p-6 shadow-[var(--shadow-card)] sm:p-8">
            <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
              <div className="flex-1">
                <ApifyStep
                  icon={<Globe className="h-4 w-4" />}
                  label="Step 1"
                  title="Apify actor run"
                  sub="Collects external clinical reporting references"
                  tone="apify"
                />
              </div>
              <ApifyArrow />
              <div className="flex-1">
                <ApifyStep
                  icon={<FileJson className="h-4 w-4" />}
                  label="Step 2"
                  title="external_reference_from_apify.json"
                  sub="Structured reference payload"
                  tone="default"
                  mono
                />
              </div>
              <ApifyArrow />
              <div className="flex-1">
                <ApifyStep
                  icon={<Boxes className="h-4 w-4" />}
                  label="Step 3"
                  title="Box knowledge folder"
                  sub="Filed alongside study inputs"
                  tone="default"
                />
              </div>
              <ApifyArrow />
              <div className="flex-1">
                <ApifyStep
                  icon={<ClipboardCheck className="h-4 w-4" />}
                  label="Step 4"
                  title="QC review"
                  sub="Considered during validation"
                  tone="mint"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-muted-foreground">
                Triggers an Apify actor run server-side. Token stays on the
                server.
              </div>
              <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                {apifyState === "done" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.72_0.11_200)]/40 bg-[oklch(0.72_0.11_200)]/10 px-3 py-1.5 text-xs font-medium text-[oklch(0.4_0.12_200)]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Collected by Apify
                  </span>
                )}
                <Button
                  onClick={handleCollectApify}
                  disabled={apifyState === "loading" || apifyState === "done"}
                  size="lg"
                  className="rounded-xl"
                >
                  {apifyState === "loading" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Globe className="mr-2 h-4 w-4" />
                  )}
                  {apifyState === "done"
                    ? "Reference collected"
                    : apifyState === "loading"
                      ? "Calling Apify..."
                      : "Collect External Reference with Apify"}
                </Button>
              </div>
            </div>
            {apifyState === "error" && apifyError && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-xs text-foreground">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <span>{apifyError}</span>
              </div>
            )}
          </Card>
        </section>

        {/* Summary */}
        <section>
          <LogoDivider className="mb-8" />
          <Card className="relative overflow-hidden rounded-2xl border-primary/20 bg-gradient-to-br from-primary/5 to-background p-10 text-center shadow-sm">
            <div className="pointer-events-none absolute -right-10 -bottom-10 opacity-30">
              <LogoMark size={200} variant="ghost" />
            </div>
            <div className="pointer-events-none absolute -left-10 -top-10 opacity-30">
              <LogoMark size={160} variant="ghost" />
            </div>
            <div className="relative">
              <div className="mx-auto mb-4 flex justify-center">
                <LogoMark size={40} />
              </div>
              <p className="mx-auto max-w-3xl text-lg font-semibold leading-relaxed text-foreground">
                Clinical reporting is too critical to depend on manual assembly
                alone.
              </p>
              <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                CliniClean AI accelerates the path from clinical notes to
                traceable, review-ready regulatory outputs.
              </p>
            </div>
          </Card>
        </section>
      </main>

      <footer className="relative overflow-hidden border-t border-border/60 py-10">
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "var(--gradient-brand)", opacity: 0.4 }}
        />
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-center">
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <span className="text-sm font-semibold tracking-tight text-foreground">
              CliniClean <span className="text-primary">AI</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Clinical reporting, accelerated by AI · Demo prototype · Mock data only
          </p>
        </div>
      </footer>
    </div>
  );
}

function Label({ text }: { text: string }) {
  return (
    <div className="mb-5 flex items-center gap-2">
      <LogoMark size={14} variant="outline" className="text-primary/70" />
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {text}
      </p>
      <span
        className="ml-1 h-px flex-1 max-w-[120px]"
        style={{
          background:
            "linear-gradient(to right, oklch(0.78 0.14 210 / 0.35), transparent)",
        }}
      />
    </div>
  );
}


function ScatterCard({
  className = "",
  icon,
  title,
  badge,
  badgeTone = "default",
  children,
}: {
  className?: string;
  icon: React.ReactNode;
  title: string;
  badge?: string;
  badgeTone?: "default" | "apify" | "loaded";
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-3.5 shadow-md transition hover:rotate-0 hover:-translate-y-0.5 hover:shadow-lg ${className}`}
    >
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            {icon}
          </div>
          <p className="truncate text-xs font-medium text-foreground">{title}</p>
        </div>
        {badge && (
          <span
            className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              badgeTone === "apify"
                ? "bg-[oklch(0.72_0.11_200)]/15 text-[oklch(0.45_0.12_200)]"
                : badgeTone === "loaded"
                  ? "bg-[oklch(0.7_0.16_160)]/15 text-[oklch(0.4_0.13_160)]"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

type Accent = "muted" | "cyan" | "primary" | "mint";

function WorkflowCard({
  n,
  label,
  title,
  icon,
  accent,
  bullets,
  children,
  footer,
}: {
  n: number;
  label: string;
  title: string;
  icon: React.ReactNode;
  accent: Accent;
  bullets: string[];
  children?: React.ReactNode;
  footer?: string;
}) {
  const accentMap: Record<
    Accent,
    { border: string; chipBg: string; chipText: string; iconBg: string; iconText: string; numText: string }
  > = {
    muted: {
      border: "border-border",
      chipBg: "bg-muted",
      chipText: "text-muted-foreground",
      iconBg: "bg-muted",
      iconText: "text-muted-foreground",
      numText: "text-muted-foreground/15",
    },
    cyan: {
      border: "border-[oklch(0.78_0.14_210)]/35",
      chipBg: "bg-[oklch(0.78_0.14_210)]/10",
      chipText: "text-[oklch(0.45_0.13_210)]",
      iconBg: "bg-[oklch(0.78_0.14_210)]/10",
      iconText: "text-[oklch(0.45_0.13_210)]",
      numText: "text-[oklch(0.78_0.14_210)]/15",
    },
    primary: {
      border: "border-primary/30",
      chipBg: "bg-primary/10",
      chipText: "text-primary",
      iconBg: "bg-primary/10",
      iconText: "text-primary",
      numText: "text-primary/15",
    },
    mint: {
      border: "border-[oklch(0.7_0.16_160)]/40",
      chipBg: "bg-[oklch(0.7_0.16_160)]/10",
      chipText: "text-[oklch(0.4_0.13_160)]",
      iconBg: "bg-[oklch(0.7_0.16_160)]/10",
      iconText: "text-[oklch(0.45_0.13_160)]",
      numText: "text-[oklch(0.7_0.16_160)]/20",
    },
  };
  const a = accentMap[accent];

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border ${a.border} bg-card p-4 text-left shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-md`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute -right-2 -top-4 select-none text-[72px] font-semibold leading-none ${a.numText}`}
      >
        {n}
      </span>
      <div className="relative mb-3 flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${a.iconBg} ${a.iconText}`}>
          {icon}
        </div>
        <div className="flex flex-col">
          <span className={`text-[9.5px] font-semibold uppercase tracking-[0.14em] ${a.chipText}`}>
            Step 0{n} · {label}
          </span>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
      </div>

      {children && <div className="relative mb-3">{children}</div>}

      <ul className="relative space-y-1">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-1.5 text-[11px] text-foreground/80">
            <span className={`mt-1 h-1 w-1 shrink-0 rounded-full ${a.iconText.replace("text-", "bg-")}`} />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {footer && (
        <p className="relative mt-3 text-[10px] italic text-muted-foreground">
          {footer}
        </p>
      )}
    </div>
  );
}

function ApifyStep({
  icon,
  label,
  title,
  sub,
  tone,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  sub: string;
  tone: "default" | "apify" | "mint";
  mono?: boolean;
}) {
  const toneMap = {
    default: "border-border bg-card",
    apify:
      "border-[oklch(0.72_0.11_200)]/35 bg-[oklch(0.72_0.11_200)]/[0.06]",
    mint:
      "border-[oklch(0.7_0.16_160)]/35 bg-[oklch(0.7_0.16_160)]/[0.06]",
  };
  const iconTone = {
    default: "bg-primary/10 text-primary",
    apify: "bg-[oklch(0.72_0.11_200)]/15 text-[oklch(0.45_0.12_200)]",
    mint: "bg-[oklch(0.7_0.16_160)]/15 text-[oklch(0.4_0.13_160)]",
  };
  return (
    <div
      className={`flex flex-col gap-2 rounded-xl border p-4 shadow-sm sm:col-span-1 ${toneMap[tone]}`}
    >
      <div className="flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconTone[tone]}`}>
          {icon}
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
      </div>
      <p
        className={`text-sm font-semibold text-foreground ${mono ? "font-mono text-[12px] break-all" : ""}`}
      >
        {title}
      </p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
    </div>
  );
}

function ApifyArrow() {
  return (
    <div className="flex items-center justify-center text-primary/60">
      <ArrowRight className="h-5 w-5 rotate-90 lg:rotate-0" />
    </div>
  );
}
