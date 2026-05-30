# CliniClean AI — Cascadia AI Hackathon 2026

CliniClean AI is a clinical reporting prototype built for Cascadia AI Hackathon 2026.

It demonstrates how AI can turn clinical notes and trial files into review-ready regulatory tables and QC reports, using **Box** as the clinical content workspace and **Apify** to collect external clinical reporting references.

---

## Product Story

Clinical reporting is still highly manual.

Clinical teams often work with fragmented materials such as handwritten notes, scanned forms, patient-level trial data, SAP requirements, table shells, QC criteria, and external references.

CliniClean AI shows how these materials can be transformed into structured, traceable, review-ready outputs.

The workflow is designed for a human-in-the-loop review process, where AI assists with structuring, table generation, and QC validation, while clinical experts remain responsible for final review.

---

## Core Workflow

1. **Capture clinical notes**  
   Clinical observations may begin as handwritten notes, scanned forms, or semi-structured records.

2. **Structure trial data**  
   CliniClean AI converts clinical notes and patient-level data into structured trial data.

3. **Centralize files in Box**  
   Study files, SAP requirements, table shells, QC criteria, Apify references, generated reports, and human review packages are organized in Box.

4. **Collect external reference with Apify**  
   Apify collects external clinical reporting reference material and provides it as QC context.

5. **Generate clinical table**  
   The AI generates a regulatory-style adverse events summary table.

6. **Run QC validation**  
   The system checks treatment groups, counts, percentages, severity breakdown, drug-related events, SAP alignment, and external reference context.

7. **Save back to Box**  
   The generated clinical table and QC report are uploaded back to Box for human review.

---

## Box Integration

Box is used as the clinical content workspace.

In this demo, Box stores:

- Clinical notes
- Patient-level adverse event data
- SAP requirements
- Table shell
- QC checklist
- Apify external reference file
- Generated clinical table
- QC report
- Human review package

The demo includes a live Box upload workflow. When the user clicks **Save Report to Box**, the app uploads the generated files to a Box folder using the Box Upload API.

Generated files:

```text
Adverse_Events_Summary_Table.md
QC_Report_Adverse_Events.md
