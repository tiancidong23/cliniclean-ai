# CliniClean AI

CliniClean AI is a hackathon prototype that turns clinical notes and trial files into review-ready regulatory tables and QC reports.

## Product Story

Clinical reporting is still highly manual. Clinical teams often work with handwritten notes, scanned forms, patient-level data, SAP requirements, table shells, QC criteria, and external references.

CliniClean AI demonstrates how AI can help transform these fragmented clinical inputs into structured, traceable, review-ready outputs.

## Workflow

1. Clinical notes and trial files are organized in Box.
2. Apify collects an external clinical reporting reference.
3. CliniClean AI structures the data and generates a clinical table.
4. The system runs QC validation.
5. The generated table and QC report are saved back to Box for human review.

## Box Integration

Box is used as the clinical content workspace.

It stores:

- Clinical notes
- Patient-level trial data
- SAP requirements
- Table shells
- QC criteria
- Apify external references
- Generated clinical tables
- QC reports
- Human review package

The demo includes a live Box upload workflow using `BOX_ACCESS_TOKEN` and `BOX_FOLDER_ID`.

## Apify Integration

Apify is used to collect external clinical reporting references as QC context.

The demo includes an Apify reference collection workflow using `APIFY_TOKEN`.

## Demo Output

The demo generates:

- `Adverse_Events_Summary_Table.md`
- `QC_Report_Adverse_Events.md`

These files are saved back to Box for human review.

## Tech Stack

- Lovable
- TanStack Start
- Cloudflare Workers
- Box API
- Apify API
- React
- TypeScript

## Environment Variables

This project uses server-side environment variables.

```env
APIFY_TOKEN=your_apify_token_here
BOX_ACCESS_TOKEN=your_box_developer_token_here
BOX_FOLDER_ID=your_box_folder_id_here
