from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import os


def generate_patient_pdf(patient, vitals, alerts, notes, file_path):
    pdf = canvas.Canvas(file_path, pagesize=A4)
    width, height = A4

    y = height - 50
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(50, y, "Sepsis Monitoring Report")

    y -= 40
    pdf.setFont("Helvetica", 11)

    pdf.drawString(50, y, f"Patient Name: {patient['patient_name']}")
    y -= 20
    pdf.drawString(50, y, f"Age: {patient['age']}")
    y -= 20
    pdf.drawString(50, y, f"Ward / Room: {patient['ward_room']}")

    y -= 40
    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawString(50, y, "Vitals Timeline")

    y -= 25
    pdf.setFont("Helvetica", 10)

    for v in vitals:
        line = (
            f"{v['recorded_at']} | "
            f"RR: {v['respiratory_rate']} | "
            f"SBP: {v['systolic_bp']} | "
            f"Mental: {v['mental_status']}"
        )
        pdf.drawString(50, y, line)
        y -= 15

        if y < 80:
            pdf.showPage()
            y = height - 50

    y -= 30
    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawString(50, y, "Risk Alerts")

    y -= 25
    pdf.setFont("Helvetica", 10)

    for a in alerts:
        alert_line = f"[{a['stage'].upper()}] {a['explanation']}"
        pdf.drawString(50, y, alert_line)
        y -= 15

        if y < 80:
            pdf.showPage()
            y = height - 50

    y -= 30
    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawString(50, y, "Doctor Notes")

    y -= 20
    pdf.setFont("Helvetica", 10)

    for n in notes:
        note_line = f"{n['acknowledged_at']} - {n['note']}"
        pdf.drawString(50, y, note_line)
        y -= 15

        if y < 80:
            pdf.showPage()
            y = height - 50

    pdf.save()
