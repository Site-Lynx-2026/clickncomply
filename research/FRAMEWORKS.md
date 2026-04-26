# ClickNComply — Compliance Frameworks Reference Guide

> Internal research deliverable. Compiled 26 April 2026.
> Hardest constraint applied: any clause / requirement that could not be verified against an official primary source (ISO, BSI, HSE, NCSC, ICO, FSA, certification body) is marked `[verify]` — do **not** ship customer-facing copy off `[verify]` items without a second pass.
> Sources for every section are listed inline. The deeper the priority tier, the higher the source density.

---

## How to read this document

Each framework follows a fixed schema:

1. Version + date
2. Issuing body + URL
3. Who needs it (target buyer)
4. Approximate cost of getting certified externally (UK SME baseline)
5. Mandatory documents (named, 1-line, ~page count)
6. Records to maintain (frequency + auditor focus)
7. Mandatory cycles (audits / reviews / recertification)
8. Common audit failure points
9. Pre-built template list for ClickNComply
10. Database schema implications

The schema is identical so the platform can scaffold a framework module from any of these blocks without re-reading the standard.

---

# PRIORITY 1 — V1 LAUNCH

---

## ISO 9001:2015 — Quality Management Systems

**Version + date:** ISO 9001:2015 (current. ISO is balloting a 2026 revision; until ISO publishes the 2026 edition, certification stays against the 2015 text). [verify – revision status]
**Issuing body + URL:** International Organization for Standardization — https://www.iso.org/standard/62085.html
**Who needs it:** Any organisation tendering into supply chains that demand a UKAS-accredited QMS. Heaviest in manufacturing, construction sub-trades, engineering, professional services bidding to public-sector frameworks.
**Cost of consultancy / external certification (UK SME, single site, <25 staff):** £2,000–£5,000 for first audit + certification. £5,200–£11,000 all-in if a consultant builds the system from scratch. Annual surveillance £750–£1,500. (Source: rkmsuk.co.uk, youriso.co.uk, candymc.co.uk, 2026 figures.)

### Mandatory documents required

ISO 9001:2015 deliberately removed the prescriptive "six procedures" list. The four documents an auditor will always ask to see are tied to specific clauses:

| Document | Clause | Description | Suggested pages |
|---|---|---|---|
| Scope of the QMS | 4.3 | Defines what's in/out of the system, sites, products/services, justified exclusions. | 1–2 |
| Quality policy | 5.2 | Top-management statement of intent and commitment. | 1 |
| Quality objectives | 6.2 | Measurable targets aligned with the policy, per function/process. | 2–4 |
| Criteria for evaluation, selection, monitoring of external providers | 8.4.1 | How suppliers are approved and re-rated. | 1–2 |

Documents that are **not mandatory** but auditors expect 90% of the time, because clauses can't realistically be evidenced without them:

| Document | Why it's effectively required | Pages |
|---|---|---|
| Quality Manual | Single binding doc for the four mandatory items above. | 15–30 |
| Process map / interaction-of-processes diagram | Clause 4.4 — "determine processes and their interactions". | 1–2 |
| Risk and opportunities register | Clause 6.1 evidence. | 2–6 |
| Internal audit procedure + programme | Clause 9.2 — programme is mandatory documented information. | 2–4 |
| Control of nonconforming output procedure | Clause 8.7 evidence. | 1–2 |
| Corrective action procedure | Clause 10.2 evidence. | 1–2 |
| Document & record control procedure | Clause 7.5 evidence. | 1–2 |

(Source: Advisera 9001Academy mandatory-document list; 9001simplified.com; iso-9001-checklist.co.uk.)

### Records to maintain

| Record | Clause | Frequency | Auditor checks for |
|---|---|---|---|
| Calibration records of monitoring/measuring equipment | 7.1.5.1 | Each calibration cycle | Traceability to national standards, in-date stickers, out-of-tolerance handling |
| Competence / training / qualification records | 7.2 | On change + annual | Evidence per role, gap-closure plan, induction sign-off |
| Product/service requirements review | 8.2.3.2 | Per quote / order | Order vs quote vs delivered scope match |
| Design & development records (inputs, controls, outputs, changes) | 8.3.2–8.3.6 | Per design change | Stage gates, sign-offs, change log |
| Characteristics of product/service produced | 8.5.1 | Per batch/job | Drawings, specs, ITPs, release notes |
| Customer property records | 8.5.3 | Per item received | Receipt, condition, return |
| Identification & traceability records | 8.5.2 | Per batch | Heat numbers, serials, lot codes |
| Nonconformity & corrective action records | 8.7, 10.2 | Per event | Root cause, action, effectiveness review |
| Internal audit results | 9.2 | Per audit | Programme covers all clauses, findings closed |
| Management review minutes | 9.3 | At planned intervals (typically annual) | Inputs/outputs match clause 9.3.2/9.3.3 |
| Customer satisfaction monitoring | 9.1.2 | Continuous | Method, sample, action on negatives |

### Mandatory cycles

- **Internal audits:** "at planned intervals" (clause 9.2.2). Best-practice = annual full coverage; high-risk processes more often.
- **Management reviews:** "at planned intervals" (clause 9.3.1). Best-practice = annual minimum; quarterly for larger organisations.
- **Document reviews:** Implied by 7.5.3 — most QMSs schedule annual review of all controlled documents.
- **External surveillance audits:** Annual (years 1 and 2 of certificate cycle).
- **Recertification:** Every 3 years. Should be booked ~3 months before certificate expiry.

(Source: ISOQAR, Advisera, BPRHub.)

### Common audit failure points

1. Quality objectives are written but never measured — no evidence of progress monitoring.
2. Risk and opportunities clause (6.1) addressed only at QMS launch, never refreshed.
3. Internal audit programme exists on paper but findings aren't closed within stated timeframe.
4. Management review minutes missing one or more of the nine mandatory inputs (9.3.2).
5. Supplier list exists but no documented approval criteria or re-evaluation evidence.
6. Calibration: equipment in use that's out of calibration date, or no impact assessment when recalled.
7. Competence: training matrix exists but no evidence of effectiveness evaluation.
8. Change control: process changes made without documented review (8.5.6).
9. Nonconformity log treats the symptom — no root cause analysis recorded.
10. Outsourced processes (8.4) included in scope but not controlled.

### Pre-built template list for ClickNComply

1. Quality Manual (modular, pre-mapped to clauses)
2. Quality Policy
3. Quality Objectives Tracker
4. Scope Statement
5. Process Interaction Map
6. Risk & Opportunities Register
7. Internal Audit Procedure
8. Internal Audit Programme & Schedule
9. Internal Audit Report Template
10. Management Review Procedure
11. Management Review Agenda & Minutes
12. Document Control Procedure
13. Master Document List
14. Document Change Request Form
15. Supplier Approval Procedure
16. Approved Supplier List
17. Supplier Re-evaluation Scorecard
18. Customer Feedback / Satisfaction Survey
19. Complaint Log
20. Nonconformity Report (NCR)
21. Corrective Action Request (CAR)
22. Calibration Register
23. Calibration Certificate Template
24. Competence Matrix
25. Training Record Form
26. Induction Checklist
27. Job Description Template (with competence section)
28. Order Review / Contract Review Form
29. Inspection & Test Plan (ITP) Generic
30. Design & Development Plan

### Database schema implications

```
companies
└── qms_systems (1 per company)
    ├── scope_text
    ├── policy_doc_id
    └── version

qms_objectives
└── (id, company_id, objective_text, target, measure, owner, due_date, status_history[])

qms_risks (uniform shape across 9001/14001/45001)
└── (id, framework, source_clause, description, likelihood, impact, controls[], owner, review_date)

qms_audits
└── (id, company_id, type [internal|surveillance|recert], scheduled_date, completed_date, auditor, scope[], findings[])
    └── audit_findings (id, audit_id, clause_ref, classification [major|minor|obs], description, root_cause, action, owner, due_date, closed_date, evidence[])

qms_management_reviews
└── (id, company_id, date, attendees[], inputs_jsonb [9 mandatory inputs], outputs_jsonb [4 mandatory outputs], minutes_doc_id)

qms_suppliers
└── (id, company_id, name, scope, approval_date, approval_criteria_met[], score, next_review)

qms_calibration_assets
└── (id, asset_id, description, last_cal_date, next_cal_date, accuracy, certificate_doc_id, in_tolerance bool)

qms_competence
└── (id, user_id, role_id, required_skills[], evidence_doc_ids[], gap_actions[])

qms_ncrs (shared with 14001/45001 incident table — see schema reuse note at the end)
```

---

## BS EN 1090-2:2018+A1:2024 — Execution of Steel Structures

**Version + date:** BS EN 1090-2:2018+A1:2024, published 31 May 2024 (214 pages). Companion standards: BS EN 1090-1 (CE/UKCA marking + FPC) and EN 1090-3 (aluminium).
**Issuing body + URL:** BSI / CEN — https://knowledge.bsigroup.com/products/execution-of-steel-structures-and-aluminium-structures-technical-requirements-for-steel-structures-2
**Who needs it:** Any UK fabricator selling structural steelwork to the construction sector. Required to legally place CE/UKCA-marked structural steel components on the market under the Construction Products Regulation. Buyer profile: steel fabricators, architectural metalwork shops, secondary-steel subcontractors (e.g. JP Fabrications-style trade).
**Cost of consultancy / external certification:** Initial FPC certification by a Notified Body typically £4,000–£10,000 for a small fabricator. Welding-coordinator (RWC) qualification adds £1,500–£4,000 per nominated person. Annual surveillance £1,500–£3,500. (Indicative ranges from UK fabricator forums and TÜV / DNV / Conformance pricing pages — `[verify per quote]`.)

### Execution Classes (the load-bearing concept)

EN 1090-2 splits all work into four Execution Classes (EXC1–EXC4). EXC class drives every downstream requirement — welding quality level, NDT %, traceability depth, FPC strictness.

| Class | Typical use | Welding quality (ISO 5817) | RWC required? | ISO 3834 part |
|---|---|---|---|---|
| EXC1 | Agricultural buildings, low-consequence | Level D | No (recommended) | 3834-4 ("elementary") |
| EXC2 | Most commercial/residential frames | Level C | Yes | 3834-3 ("standard") |
| EXC3 | Bridges, stadia, complex/fatigue-loaded | Level B | Yes | 3834-2 ("comprehensive") |
| EXC4 | Critical infrastructure, seismic | B+ | Yes (Level A) | 3834-2 |

(Source: BOC EN 1090 white paper; welders-handbook.com; Cotswold Steel; Conformance.)

### Mandatory documents required

| Document | Description | Pages |
|---|---|---|
| Factory Production Control (FPC) Manual | Top-level manual mapping every clause of EN 1090-1 + 1090-2 to a procedure or record. Foundation of CE/UKCA marking. | 30–60 |
| Quality Plan / Execution Specification per project | Job-specific document defining EXC class, materials, tolerances, NDT plan, coatings. | 5–15 per job |
| Welding Quality Plan | Identifies WPSs to be used, welder qualifications, NDT extent. | 3–8 per job |
| Welding Procedure Specifications (WPSs) | Each weld type used by the shop. | 1–2 each |
| Welding Procedure Qualification Records (WPQRs / pWPSs) | Evidence each WPS was qualified by a destructive test. | 2–6 each |
| Welder Qualifications (per ISO 9606-1) | Each welder, each process, each position, currency dates. | 1 each |
| Welding Coordinator (RWC) appointment + competence file | Per ISO 14731 — knowledge level (B/S/C) tied to EXC. | 2–4 |
| NDT Operator Qualifications (per ISO 9712) | Levels 1/2/3 for VT, MT, PT, UT, RT as applicable. | 1 each |
| Inspection & Test Plan (ITP) | Hold/witness/review points across the manufacturing sequence. | 2–4 per job |
| Material Traceability Procedure | How heat numbers / 3.1 mill certs follow the steel through cutting and into the finished component. | 2–4 |
| Declaration of Performance (DoP) | The end-output. Issued per CE/UKCA-marked product. | 1–2 each |
| Method of marking / labelling components | How components are uniquely identified. | 1 |
| Calibration register (welding sets, torque wrenches, gauges) | Shared with ISO 9001 calibration records. | 1 |
| Subcontractor control procedure | How outsourced cutting/welding/coating/galvanising is controlled. | 2 |
| Internal Audit Procedure (FPC) | FPC-specific, may dovetail with ISO 9001. | 2 |
| Nonconformity / corrective action procedure | Welding defects, dimensional errors, material substitutions. | 2 |

(Sources: DNV EN 1090 service page; TÜV SÜD EN 1090 guide; BSI EN 1090 structural-steel guide; Vinçotte FPC guide; Conformance.)

### Records to maintain

| Record | Frequency | Auditor focus |
|---|---|---|
| Mill / 3.1 inspection certificates per heat number | Per delivery | EN 10204 compliance, traceability to stocked steel |
| Goods-in inspection records | Per delivery | Visual + dimensional + cert match |
| Material traceability log (heat → cut piece → finished component) | Continuous | Sample pull: pick any finished piece, trace back to heat |
| Welder daily / weekly logs | Per shift | Welder vs WPS vs job match |
| Welding consumable storage / re-baking records (low-hydrogen) | Per oven cycle | Temperatures, batch, time |
| Pre-heat / interpass temperature records (where required) | Per weld | Min/max windows |
| Weld inspection records (visual, MT/PT, UT, RT) | Per ITP | Acceptance to ISO 5817 level |
| NDT reports + interpreter qualification | Per inspection | Operator level, equipment cal |
| Tightening records for preloaded bolts (HSFG) | Per connection | Torque or turn-of-nut method |
| Coating / galvanising records | Per batch | DFT, visual, certificate from sub |
| Dimensional / geometry inspection records | At final inspection | EN 1090-2 §11 tolerances |
| Repair / nonconformity log per weld | Per event | Defect, cause, repair WPS, re-NDT |
| FPC internal audit reports | Annual minimum | Notified Body looks for self-discovery |
| Calibration records | Per cycle | Welding ammeters, torque tools, levels, tape measures |
| Training records of welders / coordinators | Continuous | Currency dates not lapsed |
| DoP issuance log | Per CE-marked unit | DoP retained 10 years (CPR Article 11) |

### Mandatory cycles

- **FPC internal audit:** annual minimum.
- **Welder qualification revalidation:** every 6 months by the RWC (ISO 9606-1) and full re-qualification at 2 years.
- **WPQR:** one-off, but reviewed if process parameters drift.
- **Notified-Body initial audit:** before first DoP.
- **Notified-Body surveillance:** annual for first 2 years, then can be reduced for stable producers (`[verify per scheme rules`).
- **Document review:** annual, plus on every standard update — A1:2024 forced wholesale ITP/WPS reviews across the UK industry.

### Common audit failure points

1. Material traceability breaks at the cutting stage — heat numbers not transferred onto offcuts.
2. Welder certs lapsed (the 6-month / 2-year clock missed).
3. WPS used in production differs from the qualified WPQR (parameter drift, different consumable batch).
4. RWC named on FPC but no evidence of actual involvement (no signature on WPSs, no audit attendance).
5. NDT scope sampled below the EXC-class minimum.
6. Consumable storage doesn't meet manufacturer's re-baking requirements.
7. Subcontracted galvanising / coating not formally controlled — no approved-supplier evidence.
8. Internal FPC audit ticks boxes but never raises a finding ("no findings" is itself a finding).
9. DoPs issued without clear declared-performance values for all essential characteristics.
10. Tolerance inspections at completion missing — drawings show ±2 mm but no inspection record.

### Pre-built template list for ClickNComply

1. FPC Manual (EXC1 / EXC2 / EXC3 variants)
2. Quality Plan per Job
3. Inspection & Test Plan (ITP) by EXC class
4. WPS Library Template (FCAW, MAG, MMA, SAW)
5. WPQR Form
6. Welder Qualification Register
7. Welder 6-monthly Validation Log
8. Welding Coordinator (RWC) Appointment Letter
9. RWC Competence Matrix (per ISO 14731)
10. NDT Operator Register (per ISO 9712)
11. Material Goods-In Inspection Record
12. Material Traceability Log (heat-to-piece mark)
13. Mill Cert Register
14. Consumable Storage / Re-bake Log
15. Pre-heat / Interpass Temperature Record
16. Weld Visual Inspection Report
17. MT / PT Test Report
18. UT Test Report
19. RT Test Report
20. Dimensional / Geometry Inspection Sheet
21. Bolt Tightening Record (HSFG)
22. Coating / Paint DFT Record
23. Galvanising Subcontract Order + Cert Receipt
24. Nonconformity Report — Welding
25. Repair WPS Cover Sheet
26. Declaration of Performance (DoP) Generator
27. CE / UKCA Marking Label Template
28. FPC Internal Audit Programme
29. FPC Internal Audit Report
30. Welding Consumable Approval List
31. Subcontractor Approval Form
32. Calibration Register (welding kit)
33. Drawing & Revision Control Register

### Database schema implications

```
fab_projects
└── (id, company_id, project_ref, client, exc_class, drawings_revision, start_date)

fab_materials
└── (id, project_id, heat_number, grade, size, cert_doc_id, supplier_id, delivery_date)

fab_pieces (each cut/welded component)
└── (id, project_id, piece_mark, parent_heat_numbers[], drawing_ref, status)

fab_welders
└── (id, company_id, name, qualifications[ {process, position, valid_from, six_month_revalidation, two_year_requalification} ])

fab_wps
└── (id, company_id, ref, process, materials_range, consumable, parameters_jsonb, wpqr_id)

fab_wpqr
└── (id, company_id, ref, qualified_date, test_lab, ndt_results, validity)

fab_welds (each individual weld on the job)
└── (id, piece_id, wps_id, welder_id, date, length_mm, throat_mm, ndt_required[], inspection_results[])

fab_ndt_operators
└── (id, name, methods[ {method, level, valid_until} ])

fab_dops (declarations of performance)
└── (id, project_id, dop_number, issued_date, essential_characteristics_jsonb, retention_until)

fab_consumable_batches
└── (id, type, batch_no, storage_location, opened_at, rebake_log[])

fab_fpc_audits
└── (id, company_id, type [internal|notified_body], date, findings[])
```

---

# PRIORITY 2 — WEEK 2–3

---

## ISO 14001:2015 — Environmental Management Systems

**Version + date:** ISO 14001:2015. (A 2026 revision is in committee — until published, certificates are issued against 2015.) [verify – revision status]
**Issuing body + URL:** ISO — https://www.iso.org/standard/60857.html
**Who needs it:** Any organisation tendering where environmental performance is scored — heavily required in UK public-sector framework, increasingly demanded by Tier-1 contractors. Construction, manufacturing, logistics, FM.
**Cost of consultancy / external certification:** £3,000–£7,000 first-year SME certification with consultancy; £900–£1,800 annual surveillance. Often bundled with 9001 + 45001 (integrated audit ~30–40% cheaper than three separate audits).

### Mandatory documents required

| Document | Clause | Description | Pages |
|---|---|---|---|
| Scope of the EMS | 4.3 | Sites, activities, boundary. | 1–2 |
| Environmental policy | 5.2 | Top-management commitment. | 1 |
| Significant environmental aspects & impacts register | 6.1.2 | Activities → aspects → impacts → significance scoring. | 4–10 |
| Compliance obligations register (legal + other requirements) | 6.1.3 | Statutes, permits, voluntary commitments. | 4–8 |
| Environmental objectives + plans to achieve them | 6.2 | Targets, owners, resources, timescales. | 2–4 |
| Operational controls | 8.1 | Procedures for activities tied to significant aspects. | per activity |
| Emergency preparedness & response procedure | 8.2 | Spill, fire, release scenarios + drills. | 4–8 |

(Source: Advisera 14001Academy; Certikit; DNV documentation-requirements PDF.)

### Records to maintain

| Record | Frequency | Auditor focus |
|---|---|---|
| Compliance evaluation results | Per evaluation cycle (typically 6-monthly or annual) | Clause 9.1.2 — must be **documented**, not implied |
| Monitoring & measurement results (energy, water, waste, emissions) | Continuous, often monthly | Calibrated equipment, trend analysis |
| Internal audit results | Per audit | Programme covers all clauses + significant aspects |
| Management review minutes | Annual minimum | All 14001 inputs covered |
| Training & competence records (incl. environmental awareness) | On change + annual | Evidence per role |
| Communication records (internal + external) | Per event | Especially complaints / regulator correspondence |
| Emergency drill records | Per drill (typically annual) | Lessons-learned + plan revisions |
| Nonconformity & corrective action records | Per event | Root cause + effectiveness review |
| Waste transfer notes (UK Duty of Care) | Per movement | Section 34 EPA 1990 — 3-year retention |
| Hazardous waste consignment notes | Per movement | 3-year retention from producer |

### Mandatory cycles

- Internal audits: planned intervals, typically annual full coverage.
- Management reviews: at planned intervals, typically annual.
- Compliance evaluation: at a frequency justified by risk — best practice = annual minimum, often 6-monthly for higher-risk sites.
- Legal register update: continuous (subscription service or quarterly review).
- Surveillance: annual.
- Recertification: every 3 years.

### Common audit failure points

1. Aspects/impacts register written once and never refreshed when the business adds a new product or process.
2. Legal register is just a list of acts — no demonstration of how each applies, and no evidence of evaluation.
3. Operational criteria not defined for processes / activities / services with significant aspects (ISO 14001 §8.1).
4. Emergency drill done once at certification, not repeated.
5. No documented compliance evaluation results — the auditor literally cannot find clause 9.1.2 evidence.
6. Objectives set at policy level only (e.g. "reduce waste") with no SMART target underneath.
7. Subcontractor / supplier environmental controls (8.1) absent — site uses skip companies with no licence check.
8. Waste transfer notes not retained for 3 years.

### Pre-built template list for ClickNComply

1. Environmental Policy
2. EMS Scope Statement
3. Aspects & Impacts Register (scoring matrix included)
4. Significance Determination Procedure
5. Legal & Other Requirements Register (UK statute starter pack)
6. Compliance Evaluation Procedure
7. Compliance Evaluation Log
8. Environmental Objectives & Targets Tracker
9. Operational Control Procedure (per significant aspect)
10. Spill Response Plan
11. Fire Emergency Response Plan
12. Emergency Drill Record
13. Energy / Water / Waste Monitoring Sheet
14. Carbon Footprint Calculator (Scope 1 + 2 starter)
15. Waste Transfer Note Register
16. Hazardous Waste Consignment Note Register
17. Skip / Waste Carrier Approval Check
18. Internal EMS Audit Programme + Report
19. Management Review Agenda + Minutes (EMS)
20. Environmental Aspects Communication Briefing
21. Subcontractor Environmental Briefing / Induction
22. Toolbox Talk Pack — Environment (10–15 topics)

### Database schema implications

```
ems_aspects_impacts
└── (id, company_id, activity, aspect, impact, conditions [normal|abnormal|emergency], likelihood, severity, significance, controls[], review_date)

ems_legal_register
└── (id, company_id, jurisdiction, instrument, applicability_text, controls_in_place[], last_evaluated, status, evidence_doc_ids[])

ems_objectives — (shape identical to qms_objectives, share table)

ems_monitoring_metrics
└── (id, company_id, metric [kwh|m3|tonne|kg_co2e], scope, period, value, source_doc_id)

ems_waste_movements
└── (id, company_id, date, ewc_code, weight_kg, carrier_id, carrier_licence_doc_id, transfer_note_doc_id, hazardous bool, retention_until)

ems_drills
└── (id, company_id, scenario, date, attendees[], lessons[], plan_updates[])
```

---

## ISO 45001:2018 — Occupational Health & Safety Management

**Version + date:** ISO 45001:2018 (current).
**Issuing body + URL:** ISO — https://www.iso.org/standard/63787.html
**Who needs it:** Same buyer pool as 14001 plus the higher-risk trades — construction, manufacturing, mining, logistics, healthcare. Often a tender requirement in addition to or instead of CHAS / SSIP.
**Cost of consultancy / external certification:** £3,000–£8,000 first-year SME with consultancy. £900–£1,800 annual surveillance. Bundle pricing with 9001 + 14001 standard.

> Terminology: ISO 45001 dropped "documents" vs "records" — both are now called **documented information**. "Maintain documented information" = the document; "retain documented information" = the record.

### Mandatory documents required

| Document | Clause | Description | Pages |
|---|---|---|---|
| Scope of the OH&S MS | 4.3 | Boundary, sites, activities, workers covered. | 1–2 |
| OH&S policy | 5.2 | Includes commitment to consultation, hazard elimination, continual improvement. | 1 |
| Roles, responsibilities, authorities | 5.3 | Per role / function. | 2–4 |
| Hazard identification & risk assessment methodology | 6.1.2 | How hazards are spotted and rated. | 2–4 |
| Risk register / OH&S risks & opportunities | 6.1.2 / 6.1.4 | Assessed hazards + opportunities. | 4–10 |
| Legal & other requirements register | 6.1.3 | UK HSWA, regs, ACoPs, voluntary commitments. | 4–8 |
| OH&S objectives + plans | 6.2 | SMART, owners, resources. | 2–4 |
| Operational controls | 8.1 | Method statements, permits, procedures. | per activity |
| Emergency preparedness & response | 8.2 | Plans + drills. | 4–8 |

### Records to maintain

| Record | Frequency | Auditor focus |
|---|---|---|
| Worker consultation & participation evidence | Continuous | Minutes, safety committee, toolbox-talk attendance |
| Competence / training records | On change + annual | Per role + per task (e.g. PASMA, IPAF, CSCS, asbestos awareness) |
| Hazard reports / near misses | Continuous | Reporting culture, leading indicators |
| Incident / accident investigations (incl. RIDDOR-reportable) | Per event | Root cause, immediate + long-term action |
| Monitoring & measurement (e.g. air quality, noise dosimetry, COSHH, occupational health surveillance) | Per cycle | Calibration, trend analysis |
| Compliance evaluation results | Annual minimum | Documented per 9.1.2 |
| Internal audit results | Per audit | Coverage of all clauses + worker representation |
| Management review minutes | Annual minimum | All 45001 inputs |
| Emergency drill records | Per drill | Annual minimum, lessons-learned |
| PPE issue records | Per issue | Specifically for COSHH / RPE / hearing zones |

### Mandatory cycles

- Internal audits: annual minimum.
- Management reviews: annual minimum.
- Compliance evaluation: documented at planned intervals.
- Worker consultation: continuous (committee / forum).
- Surveillance: annual.
- Recertification: every 3 years.

### Common audit failure points

1. Hazard ID is reactive (only known hazards in register) rather than proactive (process-walk approach).
2. Worker consultation evidence weak — no minutes, no representation from non-management workers.
3. Risk assessments generic, not site / task-specific.
4. Legal register lists statutes but not how they apply.
5. Subcontractor management absent — site has subbies without RAMS reviewed.
6. Incident reporting only captures lost-time injuries — no near-miss data.
7. Corrective actions close the symptom, not the root cause.
8. Health surveillance not done where COSHH/noise/HAVS regs require it.
9. Top-management commitment evidenced only by signing the policy — no further visible engagement.
10. Emergency drills annual on paper, never run.

(Source: ISOQAR top-5 nonconformities; LRQA; Smithers; Quality-Assurance.com.)

### Pre-built template list for ClickNComply

1. OH&S Policy
2. Scope Statement
3. Roles, Responsibilities & Authorities Matrix
4. Hazard Identification Procedure
5. Risk Assessment Methodology + Matrix
6. Risk Assessment Template (task-based)
7. Risk Assessment Template (site-based)
8. COSHH Assessment Template
9. Manual Handling Assessment
10. DSE Assessment
11. Noise Assessment
12. Vibration / HAVS Assessment
13. Lone-Worker Assessment
14. Young / New / Expectant Worker Assessment
15. Method Statement Template (RAMS)
16. Permit-to-Work Pack (Hot Works, Confined Space, Working at Height, Electrical)
17. Legal Register (UK H&S statute starter pack)
18. Worker Consultation Procedure
19. Safety Committee ToR + Minutes Template
20. Toolbox Talk Pack (50+ topics)
21. Site Induction Slide Pack
22. Accident / Incident Report Form
23. Near-Miss Report Form
24. RIDDOR Decision Tree + Submission Log
25. PPE Issue Register
26. Health Surveillance Tracker
27. Emergency Plan Template
28. Fire Risk Assessment
29. First-Aid Needs Assessment
30. Internal H&S Audit Programme + Report
31. Management Review (H&S) Minutes
32. Contractor / Subcontractor Pre-Qual Form
33. Drug & Alcohol Policy

### Database schema implications

```
ohs_hazards
└── (id, company_id, site_id, task, hazard, persons_at_risk[], existing_controls[], likelihood, severity, residual_risk, additional_controls[], owner, review_date)

ohs_incidents
└── (id, company_id, site_id, occurred_at, severity, type, riddor_reportable bool, riddor_submitted_at, persons_involved[], description, immediate_action, root_cause, corrective_actions[], evidence[])

ohs_permits
└── (id, type, issued_to, valid_from, valid_to, controls[], signed_by, withdrawn_at)

ohs_inductions
└── (id, user_id, site_id, completed_at, version, score)

ohs_health_surveillance
└── (id, user_id, type [HAVS|noise|spirometry|skin], last_done, next_due, fit_status)
```

---

## CHAS — Foundation, Elite, Premium Plus

**Note 26 Apr 2026:** CHAS has rebranded its packages. Historic names "Premium" / "Premium Plus" now broadly map to "Advanced" / "Elite". The brief uses the legacy names; build the platform around current product names. **Foundation → Standard → Advanced → Elite** is the live ladder. [verify with current chas.co.uk packages page]

**Issuing body + URL:** Veriforce CHAS — https://www.chas.co.uk/contractors/products-packages/
**Who needs it:** UK contractors and subcontractors bidding into clients who require an SSIP-recognised H&S pre-qualification. Ubiquitous in UK construction Tier 1/2 supply chains.
**Cost:** Foundation ~£75–£125/yr (microbusiness, CSCS-aligned). Standard SSIP ~£139–£385+VAT. Advanced ~£300–£500+VAT. Elite ~£400–£900+VAT depending on turnover band. (`[verify – 2026 price card`)

### Mandatory documents required

(CHAS doesn't publish a single mandatory list — assessors evaluate against an SSIP Core Criteria question set + (Elite) the Common Assessment Standard's 13 risk areas. The list below is the practical evidence pack used by virtually every successful applicant.)

| Document | Tier | Description | Pages |
|---|---|---|---|
| Health & Safety Policy (signed, dated, < 12 months) | All | Statement, organisation, arrangements | 8–20 |
| Risk assessments (sample) | All | Generic + site-specific examples | per task |
| Method statements (sample) | All | Per typical task | per task |
| COSHH assessments (sample) | Standard+ | Hazardous substances | per substance |
| Insurance certificates (PL, EL, PI as applicable) | All | In-date | per cert |
| Accident / incident records | All | Last 3 years | running |
| Training matrix | Standard+ | Per role | running |
| Subcontractor management procedure | Standard+ | How others' RAMS are checked | 2–4 |
| Equality, diversity & inclusion policy | Advanced+ | | 2–3 |
| Environmental policy | Advanced+ (Elite required) | | 2 |
| Quality policy | Elite | | 2 |
| Modern Slavery Act statement (if turnover threshold) | Elite | | 2 |
| Anti-bribery policy | Elite | | 2 |
| GDPR / data-protection policy | Elite | | 3 |
| Financial info (filed accounts) | Elite (Common Assessment Standard) | | – |
| Reference list | Elite | | 1–2 |

(Source: chas.co.uk product pages; bizgrow-holdings.com 2026 guide; THS accreditation breakdown.)

### Records to maintain

- Annual policy review sign-off.
- Insurance renewal evidence.
- Accident book / RIDDOR submissions.
- Training certificate currency (CSCS/CPCS/IPAF/PASMA dates).
- Subcontractor pre-qualification records.
- Toolbox talk attendance.
- Plant/equipment LOLER/PUWER inspection certs.

### Mandatory cycles

- **CHAS renewal:** annual.
- **Policy reviews:** annual minimum (signed within the last 12 months).
- **No surveillance audits** — re-assessment on application each year.
- Common Assessment Standard items at Elite re-checked annually.

### Common audit failure points

1. Policy more than 12 months old or unsigned by current MD/director.
2. Insurance certs lapsed mid-year and not refreshed.
3. Generic RA / MS without site / task specificity.
4. No evidence of subcontractor pre-qual.
5. Training certs lapsed (e.g. expired CSCS).
6. Accident records gappy or missing RIDDOR investigations.
7. Equality / environmental policies missing for the level applied for.
8. Insufficient detail in arrangements section of the H&S policy (no named responsibilities).

### Pre-built template list for ClickNComply

1. CHAS Foundation Application Pack (auto-populated)
2. Health & Safety Policy (CHAS-aligned)
3. H&S Arrangements Section (modular, 25+ topics)
4. Insurance Certificate Tracker
5. RAMS Pack — top 20 trades
6. COSHH Assessment Pack
7. Subcontractor PQQ Form
8. Subcontractor Approval Register
9. Training Matrix (CSCS/IPAF/PASMA-aware)
10. Toolbox Talk Library (50+)
11. Accident Book (digital)
12. RIDDOR Decision Aid
13. Equality & Diversity Policy
14. Environmental Policy
15. Quality Policy
16. Modern Slavery Statement Template
17. Anti-Bribery Policy
18. GDPR / Data Protection Policy
19. CHAS Evidence Bundle Generator (PDF)
20. Renewal Reminder + Action List

### Database schema implications

CHAS doesn't need its own deep schema — it's an evidence-curation layer over the OH&S / EMS / HR data the platform already holds.

```
chas_applications
└── (id, company_id, tier, application_date, expiry, status, evidence_bundle_doc_id)

chas_evidence_map
└── (id, application_id, requirement_code, source_table, source_record_id, status [met|gap], notes)

policy_reviews (shared cross-framework)
└── (id, company_id, policy_type, version, signed_by, signed_at, next_review_due)

insurance_policies
└── (id, company_id, type [PL|EL|PI|Cyber], insurer, policy_no, indemnity_limit, valid_from, valid_to, cert_doc_id)
```

---

## ConstructionLine — Bronze, Silver, Gold (and Platinum)

**Issuing body + URL:** ConstructionLine (Warburtons / Capita-owned) — https://www.constructionline.co.uk
**Who needs it:** UK contractors tendering into the construction supply chain. Silver is the *minimum bar* for most Tier-1 contractor approved-supplier lists; Gold is the most-requested level (cited by Vinci, Wates, BAM, Kier, Balfour Beatty as a minimum). Platinum adds annual financial deep-dive.
**Cost:** Bronze ~£60–£180+VAT. Silver ~£250–£500+VAT (turnover-banded). Gold ~£500–£900+VAT. Platinum ~£900–£1,400+VAT. (Indicative — turnover bands move pricing. `[verify 2026 price card`)

### Tier evidence (cumulative — Gold = Bronze + Silver + Gold extras)

**Bronze**
- Company info (CRN, VAT, registered office)
- Insurance certs (PL, EL, PI as applicable)
- H&S policy (signed, dated)
- Sample RAMS
- Equal opportunities statement

**Silver** (PAS 91-aligned, the legacy de-facto baseline)
- Everything in Bronze + verified financial check
- Detailed H&S Q&A (SSIP-equivalent)
- Insurance limits checked vs typical buyer requirements
- References

**Gold** (the popular tier — adds 4 management areas + SSIP)
- Quality management evidence
- Environmental management evidence
- Equal opportunities & diversity evidence
- Anti-bribery / anti-corruption evidence
- Modern Slavery Act compliance
- SSIP H&S accreditation (Acclaim, the in-house SSIP body)

**Platinum**
- Gold + annual financial review with Companies House sync, watch-listing.

(Source: constructionline.co.uk Gold/Platinum supplier checklist Feb 2026 PDF; Beaconrisk; segurohealthandsafety.co.uk.)

### Mandatory documents (Gold-tier evidence pack)

| Document | Pages |
|---|---|
| H&S Policy (signed, < 12 months) | 8–20 |
| Quality Policy | 1 |
| Environmental Policy | 1–2 |
| Equal Opportunities & Diversity Policy | 2–3 |
| Modern Slavery Statement | 2 |
| Anti-Bribery Policy | 2 |
| Data Protection / GDPR Policy | 3 |
| Sample RAMS / COSHH | per |
| Insurance certs | per |
| Latest filed accounts | – |
| Three customer references | 1 |
| Subcontractor management procedure | 2–4 |
| Training matrix | 1 |
| SSIP / Acclaim certificate | 1 |

### Records to maintain

- Annual document review (every policy signed within last 12 months).
- Companies House updates synced.
- Insurance renewals.
- SSIP renewal.
- Project references kept current.

### Mandatory cycles

- **Annual renewal** (whole platform).
- Policy reviews every 12 months.
- Financial check ongoing for Platinum.

### Common audit failure points

1. Scope-of-work descriptors don't match Companies House or trade.
2. Policies older than 12 months or not director-signed.
3. Insurance limits below buyer-required thresholds.
4. SSIP certificate lapsed.
5. Modern Slavery statement missing for £36m+ turnover.
6. References from related parties (group companies).
7. Inconsistencies between Gold management policies and actual operating procedures (Acclaim spot-check).

### Pre-built template list for ClickNComply

(Massive overlap with CHAS — re-use the same evidence library and add a ConstructionLine-specific evidence-bundle generator.)

1. ConstructionLine Bronze Pack
2. ConstructionLine Silver Pack
3. ConstructionLine Gold Pack
4. SSIP / Acclaim Application Template
5. Reference Request Email
6. Reference Form (client-completable)
7. Modern Slavery Statement (turnover-conditional)
8. Anti-Bribery Policy
9. Equal Opportunities & Diversity Policy
10. Environmental Policy (CL-aligned)
11. Quality Policy (CL-aligned)
12. GDPR Policy
13. Subcontractor Management Procedure
14. Insurance Limits Calculator
15. Renewal Reminder Workflow

### Database schema implications

Same accreditation pattern as CHAS — re-use `chas_applications` table generalised:

```
accreditations (rename of chas_applications)
└── (id, company_id, scheme [chas|constructionline|acclaim|...], tier, application_date, expiry, status, evidence_bundle_doc_id)

accreditation_evidence_map
└── (id, accreditation_id, requirement_code, source_table, source_record_id, status, notes)

references
└── (id, company_id, client_name, contact, project_value, project_date, response_doc_id, verified bool)
```

---

# PRIORITY 3 — WEEK 4+

---

## ISO 27001:2022 — Information Security Management

**Version + date:** ISO/IEC 27001:2022 (replaced 2013 version; transition deadline for legacy 2013 certificates was 31 October 2025).
**Issuing body + URL:** ISO/IEC — https://www.iso.org/standard/27001
**Who needs it:** Any organisation processing significant volumes of sensitive data, especially SaaS providers, MSPs, financial services, healthcare. Increasingly demanded in B2B procurement.
**Cost:** £8,000–£25,000 first-year SME with consultancy. £2,000–£4,500 annual surveillance.

### Mandatory documents required

| Document | Clause | Description | Pages |
|---|---|---|---|
| Scope of the ISMS | 4.3 | Boundary, locations, assets, services. | 1–2 |
| Information security policy | 5.2 | Top-level policy. | 1–2 |
| Information security risk assessment process | 6.1.2 | Methodology. | 2–4 |
| Information security risk treatment process | 6.1.3 | Methodology. | 2–4 |
| Statement of Applicability (SoA) | 6.1.3 | All 93 Annex A controls — applied / excluded with justifications. | 8–20 |
| Risk treatment plan | 6.1.3 | Per risk: option, control, owner, deadline. | 4–10 |
| Information security objectives | 6.2 | SMART. | 1–2 |
| Evidence of competence | 7.2 | Records. | per role |
| Operational planning & control | 8.1 | Documented to extent needed. | per process |
| Risk assessment + treatment results | 8.2 / 8.3 | Output records. | running |

Annex A documentation triggered only if the corresponding control applies — common ones: access control policy, supplier security policy, incident response procedure, business continuity plan, secure development policy, cryptography policy, acceptable use policy.

(Source: Advisera 27001Academy mandatory list; Sprinto 2025 checklist; ISMS.online; Drata.)

### Records to maintain

- Risk register (live).
- SoA version history.
- Internal audit reports.
- Management review minutes.
- Incident register.
- Access reviews (typically quarterly).
- Vulnerability scan / pen test reports.
- Training and awareness records.
- Supplier security assessments.
- Backup test logs.
- BCP / DR test logs.
- Change management records.

### Mandatory cycles

- Internal audit: annual minimum.
- Management review: annual minimum.
- Risk reassessment: annual minimum, plus on significant change.
- SoA review: annual minimum.
- Surveillance: annual.
- Recertification: every 3 years.

### Common audit failure points

1. SoA inconsistent with actual control implementation.
2. Risk assessment treats assets generically — no link to specific risks.
3. Supplier security clauses missing from contracts.
4. Access reviews irregular or undocumented.
5. Incident register exists but lessons-learned never feed into risk reassessment.
6. Business continuity plan never tested.
7. Cryptographic policy exists but key management is informal.

### Pre-built template list for ClickNComply

1. ISMS Scope Statement
2. Information Security Policy
3. Risk Assessment Methodology
4. Risk Treatment Plan Template
5. Statement of Applicability (auto-generator with 93 controls)
6. Asset Register
7. Access Control Policy
8. Acceptable Use Policy
9. Cryptography Policy
10. Supplier Security Policy + Assessment
11. Incident Response Plan
12. Incident Register
13. Business Continuity Plan
14. Backup & Restore Procedure
15. Change Management Procedure
16. Secure Development Policy
17. Vulnerability Management Procedure
18. Pen Test ToR Template
19. Internal ISMS Audit Programme
20. Management Review (ISMS) Minutes
21. Awareness Training Pack

### Database schema implications

```
isms_assets
└── (id, company_id, name, type, owner, classification, location)

isms_risks
└── (id, company_id, asset_id, threat, vulnerability, likelihood, impact, inherent, treatment, controls[], residual, owner, review_date)

isms_soa
└── (id, company_id, version, control_ref [A.5.1...A.8.34], applied bool, justification, implementation_status)

isms_incidents
└── (id, company_id, occurred_at, severity, type, affected_assets[], root_cause, actions[], lessons[])

isms_access_reviews
└── (id, system_id, reviewer, reviewed_at, results_jsonb)
```

---

## UK GDPR + EU GDPR

**Version + date:** UK GDPR (retained EU law as amended by the Data Protection Act 2018) + EU GDPR (Regulation (EU) 2016/679).
**Issuing body + URL:** ICO (UK) — https://ico.org.uk; European Data Protection Board (EU).
**Who needs it:** Every organisation processing personal data of UK / EU data subjects.
**Cost:** ICO registration fee £40–£2,900/yr depending on tier. DPO outsourcing £2,000–£10,000/yr. No certification cycle — but ICO can audit.

### Mandatory documents required

| Document | Article | Description | Pages |
|---|---|---|---|
| Records of Processing Activities (ROPA) | Art 30 | Inventory of all processing — purposes, categories, recipients, retention. | 4–20 |
| Privacy notice (data subjects) | Arts 13/14 | Public-facing transparency notice. | 2–4 |
| Internal Data Protection Policy | Accountability (Art 5(2)) | Roles, principles, breach response. | 4–8 |
| Data Protection Impact Assessment (DPIA) procedure + DPIAs | Art 35 | For high-risk processing. | per processing |
| Data subject rights procedure | Arts 12–22 | SAR, erasure, rectification handling. | 2–4 |
| Data breach response procedure | Arts 33/34 | Includes 72-hour notification. | 2–4 |
| Data Processing Agreements (DPAs) | Art 28 | Contracts with processors. | per supplier |
| International transfer safeguards | Arts 44–49 | SCCs / IDTA / adequacy decisions evidence. | per transfer |
| Lawful basis register | Art 6 | One per processing purpose. | 2–4 |
| Consent records (where consent is the basis) | Art 7 | When, how, withdrawal mechanism. | running |
| Retention schedule | Art 5(1)(e) | Per data category. | 2–4 |

(Source: ico.org.uk Article 30 guidance; UK GDPR text on legislation.gov.uk.)

### Records to maintain

- ROPA (live, reviewed annually).
- DPIAs per high-risk processing.
- SAR log + response within 1 month.
- Breach register + 72-hour ICO notifications where applicable.
- Training records.
- Consent log.
- Sub-processor list.
- Data transfer impact assessments.

### Mandatory cycles

- ROPA review: at least annual.
- ICO fee renewal: annual.
- DPIA refresh: on material change.
- DPO reporting: annual to top management.
- No external recertification (no scheme).

### Common audit failure points (ICO inspection)

1. No ROPA at all (or template-only with no real entries).
2. Privacy notice doesn't list lawful basis per purpose.
3. No DPIA for clearly high-risk processing.
4. Sub-processors not listed in contracts.
5. No documented retention schedule — "we keep everything".
6. International transfers without an adequacy mechanism / SCCs.
7. SAR responses overdue or incomplete.
8. Breach not reported within 72 hours.
9. Consent UX uses pre-ticked boxes / soft opt-in.

### Pre-built template list for ClickNComply

1. ROPA (controller + processor variants)
2. Privacy Notice — Customers
3. Privacy Notice — Employees
4. Privacy Notice — Job Applicants
5. Privacy Notice — Website Visitors
6. Cookie Policy + Banner Spec
7. Data Protection Policy
8. DPIA Procedure
9. DPIA Template
10. SAR Procedure + Log
11. Breach Response Plan
12. Breach Register
13. Lawful Basis Register
14. Retention Schedule
15. Sub-processor Register
16. DPA Template (controller-to-processor)
17. International Transfer Risk Assessment
18. ICO Fee Tier Calculator
19. DPO Annual Report Template
20. Awareness Training Pack

### Database schema implications

```
gdpr_processing_activities (ROPA)
└── (id, company_id, purpose, lawful_basis, data_categories[], data_subjects[], recipients[], transfers[], retention, security_measures[], updated_at)

gdpr_dpias
└── (id, company_id, processing_id, status, risks[], mitigations[], outcome, dpo_sign_off)

gdpr_sars
└── (id, company_id, requester, received_at, due_at, status, response_doc_id)

gdpr_breaches
└── (id, company_id, occurred_at, discovered_at, ico_notified_at, affected_subjects, severity, containment, lessons)

gdpr_consents
└── (id, company_id, subject_id, purpose, granted_at, withdrawn_at, evidence_doc_id)
```

---

## Cyber Essentials / Cyber Essentials Plus

**Version + date:** v3.3 of NCSC Requirements for IT Infrastructure (live from 27 April 2026 — assessed via the new "Danzell" question set, replacing "Willow"). Cyber Essentials = self-assessment. Cyber Essentials Plus = independent technical audit.
**Issuing body + URL:** UK National Cyber Security Centre — https://www.ncsc.gov.uk/cyberessentials/overview (delivered via IASME and accredited certification bodies).
**Who needs it:** Mandatory for most UK central government contracts handling personal data; increasingly demanded in B2B and insurance tenders.
**Cost:** Cyber Essentials self-assessment £320–£500+VAT (turnover-banded). CE Plus £1,500–£3,500+VAT depending on org size. Annual.

### Five technical controls

1. Firewalls
2. Secure configuration
3. Security update management (critical/high patches within 14 days)
4. User access control (least privilege, MFA wherever available)
5. Malware protection

### 2026 v3.3 changes (the ones that fail certifications)

- MFA must be enabled on all cloud services where available — even paid-extra MFA.
- Minimum password length 12 characters.
- Cloud services cannot be excluded from scope.
- High/critical patches within 14 days.

### Mandatory documents required

CE doesn't require formal "documents" — it's an attestation scheme. Practically, you need:

| Item | Description |
|---|---|
| Asset inventory (in scope) | Endpoints, servers, cloud services, networks |
| Patch management procedure | How critical/high are applied within 14 days |
| Access control policy | Joiners/movers/leavers, MFA enforcement |
| Acceptable use policy | Endpoint behaviour |
| Malware protection config evidence | EDR / AV settings |
| Firewall rule baseline | Internet boundary |

### Mandatory cycles

- **Annual recertification** (both CE and CE+).
- Patch cycle: 14 days for critical/high.
- MFA enforcement: continuous.
- CE+ adds: external + internal vulnerability scan, on-host config audit, MFA + patch verification on a sample of endpoints.

### Common audit failure points

1. MFA off on a cloud service that supports it.
2. Endpoints with patches >14 days late.
3. Default admin accounts active.
4. BYOD in scope without MDM / config evidence.
5. Browser/Office not the latest supported version.
6. Cloud services excluded from scope.
7. Local admin rights for normal users.

### Pre-built template list for ClickNComply

1. Asset Inventory (CE-scoped)
2. Patch Management Procedure
3. Access Control Policy
4. MFA Enforcement Checklist (per cloud service)
5. Acceptable Use Policy
6. Joiner / Mover / Leaver Procedure
7. Mobile Device / BYOD Policy
8. Antimalware Standard
9. Firewall Configuration Baseline
10. CE Self-Assessment Pre-flight Checklist (Danzell mapped)
11. CE+ Audit Prep Pack
12. Annual Renewal Reminder Workflow

### Database schema implications

```
ce_assets
└── (id, company_id, type [endpoint|server|cloud_service|network], make, os_version, last_seen, in_scope bool)

ce_patch_status
└── (id, asset_id, patch_id, severity, released_at, applied_at, days_to_apply)

ce_mfa_status
└── (id, cloud_service_id, mfa_enforced bool, evidence_doc_id, last_verified)

ce_certifications
└── (id, company_id, type [CE|CE+], achieved_at, expires_at, certificate_doc_id)
```

---

## HACCP — Food Safety

**Version + date:** Codex Alimentarius General Principles of Food Hygiene (CXC 1-1969, latest revision 2022) — the source of the seven HACCP principles. UK enforcement under the Food Safety Act 1990 + Regulation (EC) 852/2004 (retained).
**Issuing body + URL:** Codex Alimentarius / FAO+WHO — https://www.fao.org/fao-who-codexalimentarius; UK enforcement: Food Standards Agency — https://www.food.gov.uk.
**Who needs it:** All food businesses by UK / EU law (proportionate to size). Independent HACCP certification (e.g. Campden BRI scheme) is voluntary but common in B2B food supply.
**Cost:** Independent HACCP certification £1,500–£5,000 first year for SME. SALSA / BRCGS / SQF higher.

### The seven HACCP principles

1. Conduct a hazard analysis
2. Determine the Critical Control Points (CCPs)
3. Establish critical limits at each CCP
4. Establish monitoring procedures
5. Establish corrective actions
6. Establish verification procedures
7. Establish record-keeping and documentation procedures

(Source: FDA HACCP Principles & Application Guidelines; FSAI principles of HACCP.)

### Mandatory documents required

| Document | Description | Pages |
|---|---|---|
| HACCP Plan | The whole plan, per product / process line | 10–30 |
| Process flow diagram | Receipt → store → prep → cook → cool → serve | 1–2 |
| Hazard analysis | Biological / chemical / physical / allergen at each step | 4–10 |
| CCP decision-tree records | How CCPs were chosen | 2–4 |
| CCP monitoring procedures | Frequency, method, who, what action | 2–4 |
| Corrective action procedures | Per CCP failure | 2 |
| Verification procedures | Including review, calibration, microbiological testing | 2 |
| Prerequisite Programmes (PRPs) | Cleaning, pest control, supplier approval, allergen, training | 1–4 each |
| Recall procedure | Traceability + withdrawal | 2 |

### Records to maintain

- CCP monitoring logs (e.g. cook temps, fridge temps).
- Cleaning records.
- Pest control reports.
- Supplier approval + delivery checks.
- Calibration records (probes, thermometers).
- Training records (allergen awareness, hand hygiene).
- Internal audit (HACCP review).
- Customer complaints + corrective actions.
- Recall test records.

### Mandatory cycles

- HACCP plan review: annual minimum, plus on any process / product / supplier change.
- Internal verification audit: typically 6-monthly or annual.
- Probe calibration: typically weekly check, formal calibration annual.
- Supplier review: annual.
- Recall test: annual.
- Independent certification: annual surveillance, 3-year recert.

### Common audit failure points

1. Flow diagram doesn't match what actually happens on the line.
2. CCPs identified but critical limits not measurable / verifiable.
3. Monitoring records gappy on weekends / nightshifts.
4. Allergen-specific risk treatment absent (UK FIR + Natasha's Law gaps).
5. Corrective actions don't include root cause.
6. Training records lapsed.
7. Pest control: external contractor reports filed but recommendations never closed out.

### Pre-built template list for ClickNComply

1. HACCP Plan Template
2. Process Flow Diagram Builder
3. Hazard Analysis Worksheet
4. CCP Decision Tree
5. CCP Monitoring Log (per CCP type — cook, chill, hot-hold)
6. Allergen Matrix
7. Cleaning Schedule + Sign-off
8. Cleaning Specification (per area)
9. Pest Control Visit Log
10. Supplier Approval Form
11. Goods-In Check Sheet
12. Probe Calibration Log
13. Fridge / Freezer Temperature Log
14. Hot Hold Temperature Log
15. Cooking Temperature Log
16. Cooling Down Log
17. Hand Hygiene Sign Pack
18. Allergen Training Module
19. Customer Complaint Log
20. Recall Procedure + Test Record
21. Internal HACCP Audit Checklist

### Database schema implications

```
haccp_plans
└── (id, company_id, product_or_line, version, signed_off_at, next_review)

haccp_steps
└── (id, plan_id, sequence, name, hazards_jsonb, ccp bool)

haccp_ccps
└── (id, step_id, hazard, critical_limit, monitoring_method, frequency, action_on_deviation)

haccp_monitoring_logs
└── (id, ccp_id, observed_at, value, in_limit bool, action, evidence_doc_id, signed_by)

haccp_suppliers
└── (id, company_id, name, products, approval_status, last_audit, cert_doc_ids[])

haccp_pest_visits
└── (id, company_id, date, contractor, findings[], actions_required[], closed bool)
```

---

## CDM 2015 — Construction (Design and Management) Regulations

**Version + date:** Construction (Design and Management) Regulations 2015 (SI 2015/51). Note interaction with the Building Safety Act 2022 — distinct **Building Regs Principal Designer** role for higher-risk buildings (≥ 18 m / 7 storeys / specified uses).
**Issuing body + URL:** HSE — https://www.hse.gov.uk/construction/cdm/2015/index.htm
**Who needs it:** Every UK construction project. Not a certification — a legal duty. All dutyholders: client, principal designer, principal contractor, designer, contractor, worker.
**Cost:** No certification cost. PD / PC services on a project: typically £1,500–£15,000+ depending on scale. F10 notification is free.

### The three core CDM documents

1. **Pre-Construction Information (PCI)** — provided by client (with PD support) to designers and contractors.
2. **Construction Phase Plan (CPP)** — produced by PC (or sole contractor) before construction starts. **Required for every project regardless of size.**
3. **Health and Safety File (H&S File)** — assembled by PD, handed over to client at end of project. Lives with the building.

(Source: HSE CDM 2015 summary of duties; designingbuildings.co.uk; HASpod.)

### F10 notification

Required when a project is **notifiable**:
- Construction work likely to last >30 working days **and** have >20 workers simultaneously, **OR**
- Exceeds 500 person-days.

Submitted to HSE by the client.

### Mandatory documents required

| Document | Owner | Description | Pages |
|---|---|---|---|
| Pre-Construction Information (PCI) | Client (PD assists) | Project info, hazards, design assumptions, H&S File format expectations. | 5–30 |
| Construction Phase Plan (CPP) | Principal Contractor | Site rules, RAMS index, welfare, emergency, phasing. | 10–60 |
| F10 Notification | Client | HSE online form (where notifiable). | 1 |
| Health & Safety File | Principal Designer | Residual hazards for future cleaning / maintenance / demolition. | 10–50 |
| Designer risk register / design risk management info | Designers | Hazards introduced or remaining from design. | 2–10 |
| Site induction record | PC | Per worker. | 1 each |
| Toolbox talks | PC | Continuous. | 1 each |
| Site rules | PC | PPE, permits, hot works. | 2–4 |
| Welfare arrangements | PC | Toilets, drying, rest, drinking water. | 1 |
| Emergency procedures | PC | Fire, first aid, near-utility strikes. | 2–4 |
| Permits | PC | Hot works, confined space, working at height, electrical. | per permit |
| Subcontractor RAMS reviewed | PC | Per subbie / package. | per |

### Records to maintain

- Site induction register.
- Toolbox talk attendance.
- Permit log.
- Site diary / progress + incident log.
- Inspection records (scaffold, excavation, plant).
- Plant/equipment LOLER + PUWER inspection certs.
- Accident book.
- Visitor log.

### Mandatory cycles

- CPP: live document, reviewed at least at each phase change.
- Scaffold inspections: every 7 days (Work at Height Regs).
- Excavation inspections: at start of each shift.
- LOLER: 6-monthly for personnel-lifting, 12-monthly for goods.
- H&S File: handed over at project completion; client retains for life of building.

### Common audit failure points (HSE inspection / client review)

1. CPP missing for sub-30-day projects (it's always required).
2. F10 not submitted or submitted too late.
3. PD appointment not confirmed in writing where >1 contractor.
4. PCI generic — doesn't reflect actual site hazards (e.g. asbestos survey not referenced).
5. Designer risk info omitted — no design risk register from architects / engineers.
6. H&S File handed over containing only construction info — no future maintenance content.
7. Subcontractor RAMS rubber-stamped without review.
8. Welfare absent at small projects.
9. Building Safety Act PD / BR-PD confusion on HRBs.

### Pre-built template list for ClickNComply

1. Pre-Construction Information (PCI) Template
2. Construction Phase Plan (CPP) — Small Project
3. CPP — Medium Project
4. CPP — Notifiable Project
5. F10 Submission Helper
6. Health & Safety File Index
7. H&S File Cover & Handover Letter
8. Designer Risk Register
9. Site Induction Slide Deck (editable)
10. Site Induction Sign-off
11. Site Rules
12. Welfare Plan
13. Emergency Plan
14. Permit-to-Work Pack (Hot Works, Confined Space, WAH, Electrical, Excavation)
15. Subcontractor RAMS Review Form
16. Subcontractor Pre-Qualification Form
17. RAMS Library (top 30 trades — re-used from ISO 45001 set)
18. Toolbox Talk Library
19. Scaffold Weekly Inspection Form
20. Excavation Daily Inspection Form
21. Plant / LOLER Register
22. Site Diary
23. Visitor Log
24. Accident Book

### Database schema implications

```
cdm_projects
└── (id, company_id, project_ref, address, client_name, value, start_date, planned_end, notifiable bool, f10_ref, hrb bool)

cdm_dutyholders
└── (id, project_id, role [client|pd|pc|designer|contractor], party_id, appointed_at, appointment_doc_id)

cdm_documents
└── (id, project_id, type [pci|cpp|hsf|f10|design_risk_register], version, owner, status, doc_id)

cdm_inductions
└── (id, project_id, worker_id, completed_at, version, evidence_doc_id)

cdm_permits
└── (id, project_id, type, issued_to, valid_from, valid_to, controls[], signed_by, withdrawn_at)

cdm_inspections
└── (id, project_id, type [scaffold|excavation|plant|loler], asset_or_zone, inspected_at, by, status, defects[], next_due)
```

---

# Cross-framework architecture notes

The Priority 1–3 frameworks share an enormous amount of underlying data. ClickNComply should resist building a separate silo per framework. The recommended approach:

### Shared "core" tables (used by every framework)

```
companies (multi-site supported via company_sites)
users + roles + competencies
documents (versioned, controlled)
policies (with policy_reviews lifecycle)
risks (uniform shape, polymorphic via framework + clause_ref)
audits (internal | external | surveillance | recert)
audit_findings
nonconformities + corrective_actions (CAPA)
management_reviews (framework-tagged)
training_records
incidents (H&S, environmental, security — discriminated by category)
suppliers + supplier_assessments
calibration_assets
permits
inspections
toolbox_talks + attendance
insurance_policies
references
accreditations + accreditation_evidence_map
```

### Framework-specific extensions

Only build a dedicated table when the data shape genuinely differs from the core (e.g. `fab_pieces`, `fab_welds`, `haccp_ccps`, `haccp_monitoring_logs`, `gdpr_processing_activities`, `isms_soa`, `cdm_projects`).

### The "evidence map" pattern

The single biggest UX win is the `accreditation_evidence_map` pattern — a CHAS / ConstructionLine / Cyber Essentials / ISO 9001 application is just a curated bundle of pointers to existing core records. The platform should:

1. Hold the source-of-truth data once (a policy, a training cert, an insurance doc).
2. Tag it with which framework requirements it satisfies.
3. Generate the framework-specific evidence bundle on demand (PDF for CHAS, ZIP for ConstructionLine, structured upload for IASME / Acclaim).

This is the architectural moat: legacy compliance vendors (Veriforce CHAS portal, ConstructionLine portal, IASME portal) make companies re-enter the same evidence into each scheme. ClickNComply can hold it once and submit everywhere.

### Cycles + reminders

A single `compliance_cycles` table drives every recurring date in the platform — surveillance audits, policy reviews, calibration, welder revalidation, scaffold inspections, ICO renewals, CHAS renewals, F-gas register, RIDDOR retention purges, GDPR retention purges. The whole platform becomes a date-driven workflow engine on top of the evidence library.

---

## Sources

**ISO 9001:2015**
- Advisera — https://advisera.com/9001academy/knowledgebase/list-of-mandatory-documents-required-by-iso-90012015/
- 9001 Simplified PDF — https://www.9001simplified.com/free-downloads/pdf/required-documents-and-records.pdf
- ISO-9001-Checklist — https://www.iso-9001-checklist.co.uk/mandatory-procedures.htm
- Cost (RKMS / YourISO / Candy MC, 2026) — https://www.rkmsuk.co.uk/iso-consultancy/how-much-does-iso-9001-cost/

**BS EN 1090-2:2018+A1:2024**
- BSI — https://knowledge.bsigroup.com/products/execution-of-steel-structures-and-aluminium-structures-technical-requirements-for-steel-structures-2
- DNV — https://www.dnv.com/services/en-1090-certification-of-steel-structures-28473/
- TÜV SÜD — https://www.tuvsud.com/en-us/services/product-certification/ce-marking/en-1090
- BOC EN 1090 white paper — https://www.boconline.co.uk/en/images/EN_1090_White_paper_tcm410-119019.pdf
- Welders-Handbook — https://welders-handbook.com/execution-classes-exc/
- BSI structural steel guide — https://www.bsigroup.com/globalassets/localfiles/en-in/industries-sectors/product-certification/bsi-en-1090-structural-steel-guide-in-en.pdf

**ISO 14001:2015**
- ISO — https://www.iso.org/standard/60857.html
- Advisera 14001Academy — https://advisera.com/14001academy/knowledgebase/list-of-mandatory-documents-required-by-iso-140012015/
- Certikit — https://certikit.com/list-of-mandatory-documents-for-iso-140012015/
- DNV — https://www.dnv.us/siteassets/images/pdf-documents/iso14001-documentationreqs.pdf

**ISO 45001:2018**
- ISO — https://www.iso.org/standard/63787.html
- Advisera 45001Academy — https://advisera.com/45001academy/blog/2018/03/28/list-of-mandatory-documents-according-to-iso-45001/
- ISOQAR top-5 nonconformities — https://isoqar.com/resources/blog/top-5-nonconformities-in-iso-45001/
- LRQA — https://www.lrqa.com/en-us/resources/iso-45001-top-5-nonconformities/

**CHAS**
- CHAS products & packages — https://www.chas.co.uk/contractors/products-packages/
- CHAS PAS 91 vs SSIP vs CAS — https://www.chas.co.uk/blog/pas-91-vs-ssip-vs-cas-which-assessment-do-you-need/

**ConstructionLine**
- Gold/Platinum Supplier Checklist Feb 2026 — https://www.constructionline.co.uk/wp-content/uploads/2026/02/CL-Gold-Platinum-Supplier-Checklist-Guide-February-2026.pdf
- Silver Supplier Checklist — https://www.constructionline.co.uk/wp-content/uploads/2026/01/423-CL-Silver-Supplier-Checklist-Guide-v7.pdf
- Beaconrisk Gold requirements — https://www.beaconrisk.co.uk/news/107-requirements-for-constructionline-gold

**ISO 27001:2022**
- ISMS.online Annex A — https://www.isms.online/iso-27001/annex-a-2022/
- Advisera 27001Academy mandatory documents — https://advisera.com/27001academy/knowledgebase/list-of-mandatory-documents-required-by-iso-27001-revision/
- HighTable SoA — https://hightable.io/statement-of-applicability-iso-27001/

**UK GDPR**
- ICO Article 30 guidance — https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/documentation/what-do-we-need-to-document-under-article-30-of-the-gdpr/
- ICO documentation hub — https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/documentation/
- UK GDPR text (legislation.gov.uk) — https://www.legislation.gov.uk/eur/2016/679/

**Cyber Essentials**
- NCSC overview — https://www.ncsc.gov.uk/cyberessentials/overview
- NCSC v3.3 Requirements PDF — https://www.ncsc.gov.uk/files/cyber-essentials-requirements-for-it-infrastructure-v3-3.pdf
- 2026 update guidance (PGI) — https://www.pgitl.com/insights/2026-cyber-essentials-plus-changes

**HACCP**
- FDA HACCP Principles — https://www.fda.gov/food/hazard-analysis-critical-control-point-haccp/haccp-principles-application-guidelines
- FSAI Principles of HACCP — https://www.fsai.ie/business-advice/running-a-food-business/food-safety-management-system-(haccp)/principles-of-haccp
- FSIS Guidebook for HACCP plans — https://www.fsis.usda.gov/sites/default/files/media_file/2021-03/Guidebook-for-the-Preparation-of-HACCP-Plans.pdf

**CDM 2015**
- HSE summary of duties — https://www.hse.gov.uk/construction/cdm/2015/summary.htm
- HSE Principal Designers — https://www.hse.gov.uk/construction/cdm/2015/principal-designers.htm
- HSE Principal Contractors — https://www.hse.gov.uk/construction/cdm/2015/principal-contractors.htm
- HASpod CDM documents explained — https://www.haspod.com/blog/cdm/cdm-2015-documents-explained
