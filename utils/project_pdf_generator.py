"""
ZIMSEC Project Document PDF Generator
Generates professional project documents for ZIMSEC students
"""

import os
import logging
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT

logger = logging.getLogger(__name__)

class ProjectDocumentGenerator:
    """Generates professional ZIMSEC project documents"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
        
        # Ensure output directory exists
        self.output_dir = os.path.join('static', 'projects')
        os.makedirs(self.output_dir, exist_ok=True)
        
    def _setup_custom_styles(self):
        """Setup custom paragraph styles for ZIMSEC projects"""
        
        # Cover page title
        self.styles.add(ParagraphStyle(
            name='CoverTitle',
            parent=self.styles['Heading1'],
            fontSize=28,
            leading=34,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#1a237e'),
            spaceAfter=30,
            fontName='Helvetica-Bold'
        ))
        
        # Student info style
        self.styles.add(ParagraphStyle(
            name='StudentInfo',
            parent=self.styles['Normal'],
            fontSize=14,
            leading=20,
            alignment=TA_CENTER,
            spaceAfter=10
        ))
        
        # Section headers (e.g., "Section A: Investigation")
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading1'],
            fontSize=18,
            leading=22,
            textColor=colors.HexColor('#9C27B0'),
            spaceBefore=20,
            spaceAfter=15,
            borderPadding=8,
            borderColor=colors.HexColor('#E1BEE7'),
            borderWidth=1,
            backColor=colors.HexColor('#F3E5F5')
        ))
        
        # Subsection headers
        self.styles.add(ParagraphStyle(
            name='SubsectionHeader',
            parent=self.styles['Heading2'],
            fontSize=14,
            leading=18,
            textColor=colors.HexColor('#7B1FA2'),
            spaceBefore=12,
            spaceAfter=8,
            fontName='Helvetica-Bold'
        ))
        
        # Body text
        self.styles.add(ParagraphStyle(
            name='ProjectBody',
            parent=self.styles['Normal'],
            alignment=TA_JUSTIFY,
            fontSize=12,
            leading=16,
            spaceAfter=10,
            firstLineIndent=20
        ))
        
        # Bullet points
        self.styles.add(ParagraphStyle(
            name='BulletPoint',
            parent=self.styles['Normal'],
            fontSize=12,
            leading=16,
            leftIndent=20,
            spaceAfter=6
        ))
        
    def generate_project_document(self, project_data: dict, user_id: str) -> str:
        """Generate complete ZIMSEC project document"""
        try:
            project_id = project_data.get('id', 'unknown')
            filename = f"ZIMSEC_Project_{project_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            filepath = os.path.join(self.output_dir, filename)
            
            doc = SimpleDocTemplate(
                filepath,
                pagesize=A4,
                rightMargin=2.5*cm,
                leftMargin=2.5*cm,
                topMargin=2.5*cm,
                bottomMargin=2.5*cm
            )
            
            story = []
            
            # Cover Page
            story.extend(self._create_cover_page(project_data))
            story.append(PageBreak())
            
            # Table of Contents (placeholder)
            story.extend(self._create_table_of_contents())
            story.append(PageBreak())
            
            # Main Content Sections
            story.extend(self._create_section_a(project_data))
            story.append(PageBreak())
            
            story.extend(self._create_section_b(project_data))
            story.append(PageBreak())
            
            story.extend(self._create_implementation_section(project_data))
            story.append(PageBreak())
            
            story.extend(self._create_testing_section(project_data))
            story.append(PageBreak())
            
            story.extend(self._create_documentation_section(project_data))
            story.append(PageBreak())
            
            story.extend(self._create_evaluation_section(project_data))
            
            # Build PDF
            doc.build(story)
            
            logger.info(f"✅ Generated project document: {filename}")
            
            # Return public URL
            try:
                from utils.url_utils import convert_local_path_to_public_url
                return convert_local_path_to_public_url(filepath)
            except:
                return filepath
                
        except Exception as e:
            logger.error(f"Error generating project PDF: {e}")
            raise e
    
    def _create_cover_page(self, project_data: dict):
        """Create cover page with student and project details"""
        elements = []
        
        # School/Institution
        data = project_data.get('project_data', {})
        school = data.get('school', 'School Name')
        
        elements.append(Spacer(1, 1*inch))
        elements.append(Paragraph(school.upper(), self.styles['StudentInfo']))
        elements.append(Spacer(1, 0.5*inch))
        
        # Project Title
        title = project_data.get('project_title', 'Project Title')
        elements.append(Paragraph(title, self.styles['CoverTitle']))
        elements.append(Spacer(1, 0.3*inch))
        
        # Subject
        subject = project_data.get('subject', 'Subject')
        elements.append(Paragraph(f"<b>Subject:</b> {subject}", self.styles['StudentInfo']))
        elements.append(Spacer(1, 1*inch))
        
        # Student Details Table
        student_data = [
            ['Student Name:', f"{data.get('student_name', '')} {data.get('student_surname', '')}"],
            ['Form:', data.get('form', '')],
            ['School:', school],
            ['Date:', datetime.now().strftime('%B %Y')]
        ]
        
        table = Table(student_data, colWidths=[3*cm, 10*cm])
        table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        elements.append(table)
        
        return elements
    
    def _create_table_of_contents(self):
        """Create table of contents"""
        elements = []
        
        elements.append(Paragraph("TABLE OF CONTENTS", self.styles['SectionHeader']))
        elements.append(Spacer(1, 0.2*inch))
        
        toc_items = [
            "Section A: Selection, Investigation and Analysis",
            "Section B: Design",
            "Implementation",
            "Testing",
            "Documentation",
            "Evaluation",
            "Appendices"
        ]
        
        for item in toc_items:
            elements.append(Paragraph(f"• {item}", self.styles['BulletPoint']))
        
        return elements
    
    def _create_section_a(self, project_data: dict):
        """Create Section A: Selection, Investigation and Analysis"""
        elements = []
        data = project_data.get('project_data', {})
        
        elements.append(Paragraph("SECTION A: SELECTION, INVESTIGATION AND ANALYSIS", self.styles['SectionHeader']))
        
        # Problem Definition
        elements.append(Paragraph("1. Problem Definition", self.styles['SubsectionHeader']))
        problem = data.get('problem_definition', 'The problem definition will describe the issue or need that this project addresses.')
        elements.append(Paragraph(problem, self.styles['ProjectBody']))
        
        # Investigation
        elements.append(Paragraph("2. Investigation of Current System", self.styles['SubsectionHeader']))
        investigation = data.get('investigation', 'This section describes how the current system works and its limitations.')
        elements.append(Paragraph(investigation, self.styles['ProjectBody']))
        
        # Requirements
        elements.append(Paragraph("3. Requirements", self.styles['SubsectionHeader']))
        requirements = data.get('requirements', [])
        if isinstance(requirements, list):
            for req in requirements:
                elements.append(Paragraph(f"• {req}", self.styles['BulletPoint']))
        else:
            elements.append(Paragraph(str(requirements), self.styles['ProjectBody']))
        
        # Objectives
        elements.append(Paragraph("4. Aims and Objectives", self.styles['SubsectionHeader']))
        objectives = data.get('objectives', [])
        if isinstance(objectives, list):
            for obj in objectives:
                elements.append(Paragraph(f"• {obj}", self.styles['BulletPoint']))
        else:
            elements.append(Paragraph(str(objectives), self.styles['ProjectBody']))
        
        return elements
    
    def _create_section_b(self, project_data: dict):
        """Create Section B: Design"""
        elements = []
        data = project_data.get('project_data', {})
        
        elements.append(Paragraph("SECTION B: DESIGN", self.styles['SectionHeader']))
        
        # Alternative Methods
        elements.append(Paragraph("1. Alternative Methods Considered", self.styles['SubsectionHeader']))
        alternatives = data.get('alternatives', 'Different approaches were considered for solving this problem.')
        elements.append(Paragraph(alternatives, self.styles['ProjectBody']))
        
        # Input Design
        elements.append(Paragraph("2. Input Design", self.styles['SubsectionHeader']))
        input_design = data.get('input_design', 'This section describes the inputs required for the system.')
        elements.append(Paragraph(input_design, self.styles['ProjectBody']))
        
        # Output Design
        elements.append(Paragraph("3. Output Design", self.styles['SubsectionHeader']))
        output_design = data.get('output_design', 'This section describes the expected outputs from the system.')
        elements.append(Paragraph(output_design, self.styles['ProjectBody']))
        
        # Test Plan
        elements.append(Paragraph("4. Test Plan", self.styles['SubsectionHeader']))
        test_plan = data.get('test_plan', 'A comprehensive test plan was developed to ensure the system works correctly.')
        elements.append(Paragraph(test_plan, self.styles['ProjectBody']))
        
        return elements
    
    def _create_implementation_section(self, project_data: dict):
        """Create Implementation section"""
        elements = []
        data = project_data.get('project_data', {})
        
        elements.append(Paragraph("IMPLEMENTATION", self.styles['SectionHeader']))
        
        implementation = data.get('implementation', 'This section describes how the project was implemented, including tools, technologies, and methods used.')
        elements.append(Paragraph(implementation, self.styles['ProjectBody']))
        
        return elements
    
    def _create_testing_section(self, project_data: dict):
        """Create Testing section"""
        elements = []
        data = project_data.get('project_data', {})
        
        elements.append(Paragraph("TESTING", self.styles['SectionHeader']))
        
        testing = data.get('testing', 'This section documents the testing process, test cases, and results.')
        elements.append(Paragraph(testing, self.styles['ProjectBody']))
        
        return elements
    
    def _create_documentation_section(self, project_data: dict):
        """Create Documentation section"""
        elements = []
        data = project_data.get('project_data', {})
        
        elements.append(Paragraph("DOCUMENTATION", self.styles['SectionHeader']))
        
        # User Documentation
        elements.append(Paragraph("User Documentation", self.styles['SubsectionHeader']))
        user_docs = data.get('user_documentation', 'Instructions for users on how to use the system.')
        elements.append(Paragraph(user_docs, self.styles['ProjectBody']))
        
        # Technical Documentation
        elements.append(Paragraph("Technical Documentation", self.styles['SubsectionHeader']))
        tech_docs = data.get('technical_documentation', 'Technical details for developers and maintainers.')
        elements.append(Paragraph(tech_docs, self.styles['ProjectBody']))
        
        return elements
    
    def _create_evaluation_section(self, project_data: dict):
        """Create Evaluation section"""
        elements = []
        data = project_data.get('project_data', {})
        
        elements.append(Paragraph("EVALUATION", self.styles['SectionHeader']))
        
        evaluation = data.get('evaluation', 'This section evaluates the success of the project against the original objectives.')
        elements.append(Paragraph(evaluation, self.styles['ProjectBody']))
        
        # Conclusion
        elements.append(Paragraph("Conclusion", self.styles['SubsectionHeader']))
        conclusion = data.get('conclusion', 'Summary of the project outcomes and lessons learned.')
        elements.append(Paragraph(conclusion, self.styles['ProjectBody']))
        
        return elements
