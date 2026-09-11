import sys
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT

def create_pdf(output_filename="/Users/trigun/Desktop/FacilityOS_Team_Roles_Charter.pdf"):
    pdf_path = os.path.abspath(output_filename)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    PRIMARY = colors.HexColor("#0f172a")    # Deep Navy
    SECONDARY = colors.HexColor("#dc2626")  # Woxsen Red Accent
    TEXT_DARK = colors.HexColor("#1e293b")  # Dark Slate
    TEXT_MUTED = colors.HexColor("#64748b") # Muted Gray
    BG_LIGHT = colors.HexColor("#f8fafc")   # Light Gray Card
    BORDER_COLOR = colors.HexColor("#e2e8f0")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=PRIMARY,
        alignment=TA_LEFT,
        spaceAfter=2
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=SECONDARY,
        spaceAfter=12
    )

    meta_style = ParagraphStyle(
        'MetaText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=TEXT_MUTED,
        alignment=TA_LEFT
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=PRIMARY,
        spaceBefore=8,
        spaceAfter=4
    )

    role_title_style = ParagraphStyle(
        'RoleTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=PRIMARY
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=TEXT_DARK,
        spaceAfter=4
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=TEXT_DARK,
        leftIndent=12,
        spaceAfter=3
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=TEXT_DARK
    )

    story = []

    # 1. Header Banner (NO INVARSOFT)
    story.append(Paragraph("FACILITYOS &bull; SMART CAMPUS PLATFORM", title_style))
    story.append(Paragraph("TEAM ROLES & OPERATING CHARTER", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceBefore=0, spaceAfter=10))

    # 2. Executive Overview Paragraph
    overview_text = (
        "<b>Executive Overview:</b> FacilityOS operates through a structured, cross-functional team "
        "division to ensure seamless execution across engineering, product strategy, "
        "and operational administration across five core functional roles."
    )
    story.append(Paragraph(overview_text, body_style))
    story.append(Spacer(1, 8))

    # Team Members Data
    members = [
        {
            "name": "1. Trigun",
            "role": "Technical Lead, Frontend Developer & Quality Assurance Manager",
            "dept": "Engineering & Quality Assurance",
            "bullets": [
                "<b>Project Planning & Execution:</b> Directs overall technical strategy, sprint planning, feature roadmaps, and execution schedules.",
                "<b>Frontend Application Development:</b> Leads the construction of user interface architecture, client-side application flows, and core user screens.",
                "<b>Quality Assurance & Testing:</b> Performs comprehensive end-to-end system testing, feature validation, cross-device verification, and issue tracking prior to release deployment."
            ]
        },
        {
            "name": "2. Ranadeep",
            "role": "Frontend Developer",
            "dept": "Core Engineering (User Interface)",
            "bullets": [
                "<b>UI Component Development:</b> Builds responsive user-facing screens and reusable interactive client components.",
                "<b>Role-Based Portal Interface:</b> Develops specialized portal interfaces tailored for Student, Technician, Warden, and Admin consoles.",
                "<b>API Consumption & Visual Fidelity:</b> Integrates backend network endpoints into dynamic client states while maintaining layout fidelity across mobile and desktop viewports."
            ]
        },
        {
            "name": "3. Rithvik",
            "role": "Backend & Database Developer",
            "dept": "Core Engineering (Server Architecture)",
            "bullets": [
                "<b>Server & API Architecture:</b> Designs and implements high-performance server-side data endpoints, business logic handlers, and request pipelines.",
                "<b>Database & Data Management:</b> Formulates database relational schemas, data persistence models, and data integrity validation rules.",
                "<b>Security Services:</b> Implements token authentication protocols, role-based access control (RBAC), and OTP generation services."
            ]
        },
        {
            "name": "4. Aditya",
            "role": "Product Manager & Mobile Publishing Lead",
            "dept": "Product Strategy & Mobile Publishing",
            "bullets": [
                "<b>Market Research & Benchmarking:</b> Conducts competitive market research and feature benchmarking against existing enterprise platforms to identify product improvements.",
                "<b>Feature Optimization:</b> Formulates feature specifications and recommendations to enhance overall application value, usability, and workflow efficiency.",
                "<b>Mobile Store Publishing:</b> Manages submission requirements, developer compliance, and publishing pipelines for mobile application distribution."
            ]
        },
        {
            "name": "5. Bharat",
            "role": "Operations & Communications Lead",
            "dept": "Non-Technical Operations & Documentation",
            "bullets": [
                "<b>Documentation & Filing:</b> Authors and maintains all official non-technical documentation, business proposals, startup registration forms, and compliance files.",
                "<b>Internal Team Coordination:</b> Facilitates internal communication channels, meeting documentation, and task progress tracking.",
                "<b>External Relations:</b> Manages administrative correspondence with incubator coordinators, mentors, and external stakeholders."
            ]
        }
    ]

    for m in members:
        member_content = []
        header_table_data = [
            [
                Paragraph(f"<b>{m['name']}</b> &nbsp;&mdash;&nbsp; <font color='#dc2626'><b>{m['role']}</b></font>", role_title_style),
                Paragraph(f"<font color='#64748b'><b>{m['dept']}</b></font>", ParagraphStyle('RRight', parent=meta_style, alignment=2))
            ]
        ]
        t_header = Table(header_table_data, colWidths=[360, 172])
        t_header.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), BG_LIGHT),
            ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ('PADDING', (0, 0), (-1, -1), 6),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        member_content.append(t_header)
        member_content.append(Spacer(1, 4))

        for b in m['bullets']:
            member_content.append(Paragraph(f"&bull; {b}", bullet_style))

        member_content.append(Spacer(1, 6))
        story.append(KeepTogether(member_content))

    # 4. Summary Matrix Table
    story.append(Spacer(1, 4))
    story.append(Paragraph("SUMMARY RESPONSIBILITY MATRIX", h2_style))

    table_data = [
        [
            Paragraph("Member Name", table_header_style),
            Paragraph("Official Role", table_header_style),
            Paragraph("Domain", table_header_style),
            Paragraph("Core Responsibilities Focus", table_header_style)
        ]
    ]

    summary_rows = [
        ("Trigun", "Technical Lead & QA Manager", "Engineering & QA", "Project Planning, Execution, System Testing & Frontend Architecture"),
        ("Ranadeep", "Frontend Developer", "User Interface", "User Interface Development, Visual Styling & Client Interaction Logic"),
        ("Rithvik", "Backend Developer", "Server & DB", "Server API Services, Database Schema Design & Security Authentication"),
        ("Aditya", "Product Manager & Publishing Lead", "Product Strategy", "Market Research, Feature Optimization & Mobile Store Submissions"),
        ("Bharat", "Operations & Communications Lead", "Operations & Admin", "Documentation, Pitch Materials, Compliance & Team Operations")
    ]

    for row in summary_rows:
        table_data.append([
            Paragraph(row[0], table_cell_style),
            Paragraph(row[1], table_cell_style),
            Paragraph(row[2], table_cell_style),
            Paragraph(row[3], table_cell_style)
        ])

    summary_table = Table(table_data, colWidths=[70, 140, 100, 222])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(summary_table)

    # Footer Metadata (NO INVARSOFT)
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceBefore=4, spaceAfter=4))
    story.append(Paragraph("FacilityOS &bull; Internal Operational Charter &bull; Generated September 2026", meta_style))

    doc.build(story)
    print(f"Successfully generated PDF at: {pdf_path}")

if __name__ == "__main__":
    create_pdf()
