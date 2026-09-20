VITALYN — Explainable Temporal Sepsis Early Detection System

Time-aware clinical decision support that detects sepsis before it becomes critical.


Overview
Sepsis is a life-threatening emergency where every hour of delayed detection increases mortality risk. Current hospital monitoring systems evaluate vitals in isolation — a single snapshot in time — missing the gradual deterioration patterns that precede sepsis onset.
VITALYN transforms snapshot-based scoring into time-aware clinical reasoning. By combining qSOFA screening logic with temporal trend analysis and explainable alert generation, it enables healthcare professionals to detect deterioration earlier, reduce alert fatigue, and make better-informed decisions — faster.

The Problem
Standard sepsis monitoring falls short in four key ways:

Snapshot-based vitals miss gradual deterioration trends
qSOFA alone has low sensitivity in early stages
High false alert rates cause clinicians to ignore warnings
Existing systems provide no explanation for why an alert was raised

VITALYN addresses all four.

Key Features
Temporal Trend Analysis
Analyzes vital signs across consecutive readings rather than evaluating isolated values. Detects rate of change, persistent abnormalities, and gradual deterioration that point-in-time scoring misses.
qSOFA Screening Engine
Implements standard clinical qSOFA parameters — Respiratory Rate ≥ 22, Systolic BP ≤ 100, and Altered Mental Status — to produce an early risk score for each patient.
Stage-Based Risk Escalation
Risk is classified into four stages: Stable → Watch → Escalating → Critical. Staged escalation mimics real clinical workflows and prevents alert overload.
Explainable Alert Generation
Every alert includes a clinical reasoning statement. Instead of a generic flag, clinicians see: "Risk escalated due to increasing respiratory rate across consecutive readings and decreasing systolic blood pressure." This improves transparency and builds clinical trust.
Alert Acknowledgement System
Clinicians can acknowledge alerts, add clinical notes, and track decisions — keeping humans in the loop at every stage.
Patient Timeline Visualization
Full vital history, risk stage transitions, and alert timeline displayed per patient for retrospective review and ongoing monitoring.
PDF Report Generation
Generates comprehensive clinical reports including patient info, vital trends, alerts raised, clinical notes, and risk progression — exportable as PDF.

System Workflow
Login (Doctor / Nurse)
        ↓
Patient Registration & Management
        ↓
Vital Entry & Recording
        ↓
qSOFA Risk Calculation
        ↓
Temporal Trend Analysis
        ↓
Stage-Based Risk Escalation
        ↓
Explainable Alert Generation
        ↓
Alert Acknowledgement + Clinical Notes
        ↓
Timeline Visualization + PDF Report

Tech Stack
Frontend

React.js, TypeScript, Tailwind CSS, Vite

Backend

Python, Flask, REST API

Database

MySQL

Core Services

qSOFA Service — clinical risk scoring
Trend Service — temporal deterioration analysis
Stage Service — risk escalation logic
Explanation Service — alert reasoning generation
PDF Service — report generation
Persistence Service — data storage layer

Tools

Git & GitHub, VS Code


Project Structure
VITALYN/
│
├── S_BACK/                        (backend)
│   ├── models/
│   │   ├── alert_model.py
│   │   ├── audit_model.py
│   │   ├── patient_model.py
│   │   ├── user_model.py
│   │   └── vital_model.py
│   ├── routes/
│   │   ├── alert_routes.py
│   │   ├── audit_routes.py
│   │   ├── auth_routes.py
│   │   ├── patient_routes.py
│   │   ├── report_routes.py
│   │   └── vital_routes.py
│   ├── services/
│   │   ├── explanation_service.py
│   │   ├── pdf_service.py
│   │   ├── persistence_service.py
│   │   ├── qsofa_service.py
│   │   ├── stage_service.py
│   │   └── trend_service.py
│   ├── utils/
│   ├── app.py
│   ├── config.py
│   └── db.py
│
├── vitalyn/                       (frontend)
│   ├── src/
│   │   ├── components/
│   │   │   ├── doctor/
│   │   │   ├── patients/
│   │   │   │   ├── AddPatientDialog.tsx
│   │   │   │   ├── PatientCard.tsx
│   │   │   │   ├── PatientTable.tsx
│   │   │   │   └── RiskBadge.tsx
│   │   │   ├── vitals/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── pages/
│   │   │   ├── Auth.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Landing.tsx
│   │   │   ├── PatientDetail.tsx
│   │   │   └── NotFound.tsx
│   │   ├── contexts/
│   │   │   └── DataContext.tsx
│   │   ├── hooks/
│   │   └── api/
│   └── index.html
│
└── README.md

Getting Started
Prerequisites

Python 3.10+
Node.js 18+
MySQL running locally

Backend Setup
bashcd S_BACK
pip install -r requirements.txt
Configure your .env:
envDB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=vitalyn
Run the backend:
bashpython app.py
Frontend Setup
bashcd vitalyn
npm install
npm run dev

Clinical Impact
MetricImpactDetection timingEarlier than snapshot-based systemsAlert fatigueReduced through staged escalationClinical transparencyEvery alert has a human-readable explanationDecision auditFull acknowledgement and notes trailReportingPDF export for clinical handover

Future Enhancements

Machine learning integration for predictive risk modeling
Real-time IoT device integration for automated vital ingestion
Mobile application for bedside monitoring
Hospital EMR system integration
Predictive analytics dashboard


Users
Designed for use by Doctors, Nurses, Clinical Supervisors, and Hospital Staff.

License
MIT License — open for use, modification, and distribution.
