import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT

def create_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#1E293B')
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=12,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#64748B')
    )

    h2_style = ParagraphStyle(
        'Heading2Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=10,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155')
    )

    bold_label = ParagraphStyle(
        'BoldLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#0F172A')
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#0F172A')
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor('#334155')
    )

    story = []

    # Header Section
    story.append(Paragraph("Woxsen University — School of Technology", ParagraphStyle('Univ', parent=title_style, fontSize=13, leading=16)))
    story.append(Spacer(1, 2))
    story.append(Paragraph("Startup Idea Registration Form", title_style))
    story.append(Spacer(1, 2))
    story.append(Paragraph("For Information Collection Only — Not an Application for Relaxation", subtitle_style))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E1'), spaceAfter=8))

    # Section 1
    story.append(Paragraph("1. Startup / Idea Details", h2_style))
    
    sec1_data = [
        [Paragraph("Startup / Project Name:", bold_label), Paragraph("FixO (FixO - Facility Operations System by Invarsoft)", body_style)],
        [Paragraph("One-line Description:", bold_label), Paragraph("A multi-tenant enterprise facility operations SaaS platform for real-time maintenance dispatch, SLA tracking, and OTP-verified resolution across educational campuses, hospitals, and commercial real estate.", body_style)],
        [Paragraph("Sector / Domain:", bold_label), Paragraph("Enterprise SaaS / B2B PropTech / Facility Operations & Management", body_style)],
        [Paragraph("Date of Registration:", bold_label), Paragraph("02 / 09 / 2026", body_style)],
        [Paragraph("Problem Statement:", bold_label), Paragraph("Large institutions and commercial complexes—including universities, hospitals, IT parks, and residential towers—suffer from fragmented manual maintenance tracking. This leads to zero visibility for administrators, un-enforced SLA deadlines, delayed technician dispatches, and unverified work closures.", body_style)],
        [Paragraph("Proposed Solution / Product:", bold_label), Paragraph("FixO is a scalable multi-tenant Web & Mobile SaaS portal. It offers domain-restricted multi-role authentication, automated trade-skill technician dispatching, a 6-step visual service lifecycle tracker, mandatory OTP resolution verification before ticket closure, and an executive SLA escalation engine adaptable for universities, healthcare facilities, and corporate offices.", body_style)],
        [Paragraph("Core Technology Used:", bold_label), Paragraph("Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, FastAPI / Node.js REST APIs, PostgreSQL Multi-tenant Architecture, JWT Authentication & OTP Engine.", body_style)]
    ]

    t1 = Table(sec1_data, colWidths=[130, 410])
    t1.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t1)
    story.append(Spacer(1, 8))

    # Section 2
    story.append(Paragraph("2. Current Stage", h2_style))
    sec2_data = [
        [Paragraph("Technology Readiness Level (TRL):", bold_label), Paragraph("[X] TRL 4–5 (Prototype / MVP)", body_style)],
        [Paragraph("Legal Entity Registered?:", bold_label), Paragraph("[X] No", body_style)],
        [Paragraph("If yes, entity name & registration type:", bold_label), Paragraph("N/A", body_style)],
        [Paragraph("External Incubation / Accelerator Support Obtained?:", bold_label), Paragraph("[X] No", body_style)],
        [Paragraph("If yes, name of Incubator / accelerator:", bold_label), Paragraph("N/A", body_style)],
    ]
    t2 = Table(sec2_data, colWidths=[200, 340])
    t2.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('TOPPADDING', (0,0), (-1,-1), 1),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t2)
    story.append(Spacer(1, 8))

    # Section 3
    story.append(Paragraph("3. Team Details", h2_style))
    story.append(Paragraph("List all team members involved in this venture:", body_style))
    story.append(Spacer(1, 4))

    team_table_data = [
        [
            Paragraph("Name", table_header),
            Paragraph("Roll No.", table_header),
            Paragraph("Program / Sem", table_header),
            Paragraph("Email", table_header),
            Paragraph("Role", table_header)
        ],
        [
            Paragraph("G. Trigun Babu", table_cell),
            Paragraph("24WU0101095", table_cell),
            Paragraph("AIML- Whales/ 5", table_cell),
            Paragraph("trigun.g_2028@woxsen.edu.in", table_cell),
            Paragraph("Team Lead & Technical Lead (Full-Stack)", table_cell)
        ],
        [
            Paragraph("K. Rithvik Reddy", table_cell),
            Paragraph("24WU0104088T", table_cell),
            Paragraph("AIML- Whales/ 5", table_cell),
            Paragraph("rithvik.konduri_2028@woxsen.edu.in", table_cell),
            Paragraph("Technical Lead (Backend & Architecture)", table_cell)
        ],
        [
            Paragraph("K. Aditya Reddy", table_cell),
            Paragraph("24WU0102240", table_cell),
            Paragraph("AIML- Whales/ 5", table_cell),
            Paragraph("kasi.reddy_2028@woxsen.edu.in", table_cell),
            Paragraph("Frontend & UI/UX Developer", table_cell)
        ],
        [
            Paragraph("S. Bharat Reddy", table_cell),
            Paragraph("24WU0104089T", table_cell),
            Paragraph("AIML- Whales/ 5", table_cell),
            Paragraph("sanam.reddy_2028@woxsen.edu.in", table_cell),
            Paragraph("System Integration & QA Engineer", table_cell)
        ],
        [
            Paragraph("Ranadeep Yasa", table_cell),
            Paragraph("24WU0104081", table_cell),
            Paragraph("AIML- Whales/ 5", table_cell),
            Paragraph("ranadeep.reddy_2028@woxsen.edu.in", table_cell),
            Paragraph("Product & Operations Lead", table_cell)
        ]
    ]

    t3 = Table(team_table_data, colWidths=[90, 75, 80, 145, 150])
    t3.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#0F172A')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#94A3B8')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t3)
    story.append(Spacer(1, 8))

    # Section 4
    story.append(Paragraph("4. Faculty Mentor (if assigned)", h2_style))
    sec4_data = [
        [
            Paragraph("Mentor Name:", bold_label),
            Paragraph("Prof. Mulkala Saritha", body_style),
            Paragraph("Department:", bold_label),
            Paragraph("School of Technology / Computer Science & Engineering", body_style)
        ]
    ]
    t4 = Table(sec4_data, colWidths=[80, 160, 70, 230])
    t4.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t4)
    story.append(Spacer(1, 8))

    # Section 5
    story.append(Paragraph("5. Declaration", h2_style))
    story.append(Paragraph(
        "We confirm that the information provided above is accurate to the best of our knowledge, and that this venture is technology-oriented, innovation-driven, or research-based as required by the Entrepreneurship Engagement and Attendance Relaxation Policy.",
        ParagraphStyle('Decl', parent=body_style, fontSize=8, leading=11, fontName='Helvetica-Oblique')
    ))
    story.append(Spacer(1, 15))

    sec5_data = [
        [Paragraph("Signature of Team Lead: ____________________", bold_label), Paragraph("Date: ____ / ____ / ________", bold_label)],
        [Spacer(1, 10), Spacer(1, 10)],
        [Paragraph("Received By (Entrepreneurship Coordinator): ____________________", bold_label), Paragraph("Date: ____ / ____ / ________", bold_label)],
    ]
    t5 = Table(sec5_data, colWidths=[360, 180])
    t5.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t5)

    doc.build(story)

if __name__ == '__main__':
    target_path = "/Users/trigun/Desktop/Invarsoft/facilityos/Startup_Idea_Registration_Form_FixO.pdf"
    create_pdf(target_path)
    print("PDF successfully generated at:", target_path)
