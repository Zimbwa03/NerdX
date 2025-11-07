"""
Science Notes PDF Generator
Generates professional, personalized PDF notes for Combined Science teaching sessions
"""

import os
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, ListFlowable, ListItem
from reportlab.lib import colors

logger = logging.getLogger(__name__)


class ScienceNotesPDFGenerator:
    """Generates professional PDF notes for science teaching sessions"""
    
    def __init__(self, output_dir: str = "temp_pdfs"):
        """
        Initialize PDF generator
        
        Args:
            output_dir: Directory to save generated PDFs
        """
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        self.styles = self._create_styles()
    
    def _create_styles(self):
        """Create custom paragraph styles for the PDF"""
        styles = getSampleStyleSheet()
        
        # Main title style
        styles.add(ParagraphStyle(
            name='NotesTitle',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=colors.HexColor('#1a5490'),
            spaceAfter=6,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        # Subject badge style
        styles.add(ParagraphStyle(
            name='SubjectBadge',
            parent=styles['Normal'],
            fontSize=12,
            textColor=colors.white,
            spaceAfter=12,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        # Section header style
        styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=styles['Heading2'],
            fontSize=13,
            textColor=colors.HexColor('#1a5490'),
            spaceAfter=10,
            spaceBefore=14,
            fontName='Helvetica-Bold'
        ))
        
        # Subsection header
        styles.add(ParagraphStyle(
            name='SubsectionHeader',
            parent=styles['Heading3'],
            fontSize=11,
            textColor=colors.HexColor('#2c5aa0'),
            spaceAfter=8,
            spaceBefore=10,
            fontName='Helvetica-Bold'
        ))
        
        # Body text style
        styles.add(ParagraphStyle(
            name='NotesBody',
            parent=styles['Normal'],
            fontSize=10,
            alignment=TA_JUSTIFY,
            spaceAfter=8,
            leading=14,
            fontName='Helvetica'
        ))
        
        # Key concept style (highlighted)
        styles.add(ParagraphStyle(
            name='KeyConcept',
            parent=styles['Normal'],
            fontSize=10,
            spaceAfter=8,
            leading=14,
            fontName='Helvetica',
            leftIndent=15,
            backColor=colors.HexColor('#f0f7ff')
        ))
        
        # Objective/List style
        styles.add(ParagraphStyle(
            name='ObjectiveText',
            parent=styles['Normal'],
            fontSize=10,
            spaceAfter=6,
            leading=13,
            fontName='Helvetica',
            leftIndent=20
        ))
        
        # Info box style
        styles.add(ParagraphStyle(
            name='InfoBox',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.HexColor('#555555'),
            spaceAfter=10,
            alignment=TA_CENTER,
            fontName='Helvetica-Oblique'
        ))
        
        # Footer style
        styles.add(ParagraphStyle(
            name='Footer',
            parent=styles['Normal'],
            fontSize=8,
            textColor=colors.HexColor('#888888'),
            alignment=TA_CENTER,
            fontName='Helvetica-Oblique'
        ))
        
        return styles
    
    def generate_notes_pdf(
        self,
        notes_data: Dict,
        user_id: str,
        filename: Optional[str] = None
    ) -> str:
        """
        Generate a professional science notes PDF
        
        Args:
            notes_data: Dictionary with structured notes data
            user_id: User identifier for personalization
            filename: Custom filename (auto-generated if not provided)
        
        Returns:
            Path to the generated PDF file
        """
        try:
            # Clean up old PDFs
            self.cleanup_old_pdfs(max_age_hours=24)
            
            # Extract data
            title = notes_data.get('title', 'Science Topic')
            subject = notes_data.get('subject', 'Science')
            grade_level = notes_data.get('grade_level', 'O-Level')
            learning_objectives = notes_data.get('learning_objectives', [])
            key_concepts = notes_data.get('key_concepts', {})
            detailed_explanation = notes_data.get('detailed_explanation', '')
            real_world_applications = notes_data.get('real_world_applications', [])
            summary = notes_data.get('summary', '')
            revision_schedule = notes_data.get('revision_schedule', {})
            references = notes_data.get('references', [])
            
            # Generate filename
            if not filename:
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                safe_title = "".join(c if c.isalnum() else "_" for c in title[:30])
                filename = f"notes_{safe_title}_{timestamp}.pdf"
            
            filepath = os.path.join(self.output_dir, filename)
            
            # Create PDF document
            doc = SimpleDocTemplate(
                filepath,
                pagesize=A4,
                rightMargin=0.75*inch,
                leftMargin=0.75*inch,
                topMargin=0.75*inch,
                bottomMargin=0.75*inch
            )
            
            # Build content
            content = []
            
            # Header with subject badge
            subject_color = self._get_subject_color(subject)
            subject_table = Table([[subject]], colWidths=[2*inch])
            subject_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), subject_color),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 11),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('ROUNDEDCORNERS', [5, 5, 5, 5]),
            ]))
            content.append(subject_table)
            content.append(Spacer(1, 0.15*inch))
            
            # Title
            content.append(Paragraph(title, self.styles['NotesTitle']))
            
            # Grade level and date
            date_str = datetime.now().strftime('%B %d, %Y')
            info_text = f"{grade_level} • Generated: {date_str}"
            content.append(Paragraph(info_text, self.styles['InfoBox']))
            content.append(Spacer(1, 0.2*inch))
            
            # Divider
            content.append(self._create_divider())
            content.append(Spacer(1, 0.15*inch))
            
            # Learning Objectives
            if learning_objectives:
                content.append(Paragraph("🎯 Learning Objectives", self.styles['SectionHeader']))
                for i, objective in enumerate(learning_objectives, 1):
                    obj_text = f"<b>{i}.</b> {objective}"
                    content.append(Paragraph(obj_text, self.styles['ObjectiveText']))
                content.append(Spacer(1, 0.15*inch))
            
            # Key Concepts
            if key_concepts:
                content.append(Paragraph("📌 Key Concepts", self.styles['SectionHeader']))
                for concept_name, concept_desc in key_concepts.items():
                    concept_text = f"<b>{concept_name}:</b> {concept_desc}"
                    content.append(Paragraph(concept_text, self.styles['KeyConcept']))
                content.append(Spacer(1, 0.15*inch))
            
            # Detailed Explanation
            if detailed_explanation:
                content.append(Paragraph("📖 Detailed Explanation", self.styles['SectionHeader']))
                # Split into paragraphs for better formatting
                paragraphs = detailed_explanation.split('\n\n')
                for para in paragraphs:
                    if para.strip():
                        content.append(Paragraph(para.strip(), self.styles['NotesBody']))
                        content.append(Spacer(1, 0.08*inch))
                content.append(Spacer(1, 0.1*inch))
            
            # Real-World Applications
            if real_world_applications:
                content.append(Paragraph("🌍 Real-World Applications", self.styles['SectionHeader']))
                for i, application in enumerate(real_world_applications, 1):
                    app_text = f"<b>{i}.</b> {application}"
                    content.append(Paragraph(app_text, self.styles['ObjectiveText']))
                content.append(Spacer(1, 0.15*inch))
            
            # Summary
            if summary:
                content.append(Paragraph("✨ Key Takeaways", self.styles['SectionHeader']))
                content.append(Paragraph(summary, self.styles['NotesBody']))
                content.append(Spacer(1, 0.15*inch))
            
            # Revision Schedule
            if revision_schedule:
                content.append(Paragraph("📅 Revision Schedule", self.styles['SectionHeader']))
                
                # Calculate dates
                today = datetime.now()
                day_3_date = (today + timedelta(days=3)).strftime('%B %d, %Y')
                day_7_date = (today + timedelta(days=7)).strftime('%B %d, %Y')
                
                day_3_text = revision_schedule.get('day_3', 'Review main concepts')
                day_7_text = revision_schedule.get('day_7', 'Practice problems')
                
                revision_text = f"<b>Day 3 ({day_3_date}):</b> {day_3_text}<br/>"
                revision_text += f"<b>Day 7 ({day_7_date}):</b> {day_7_text}"
                
                content.append(Paragraph(revision_text, self.styles['NotesBody']))
                content.append(Spacer(1, 0.15*inch))
            
            # References
            if references:
                content.append(Paragraph("📚 References", self.styles['SectionHeader']))
                for ref in references:
                    ref_text = f"• {ref}"
                    content.append(Paragraph(ref_text, self.styles['ObjectiveText']))
                content.append(Spacer(1, 0.2*inch))
            
            # Footer
            content.append(Spacer(1, 0.3*inch))
            content.append(self._create_divider())
            footer_text = "Generated by Combined Science Teacher Bot • NerdX ZIMSEC Quiz Bot"
            content.append(Paragraph(footer_text, self.styles['Footer']))
            
            # Build PDF
            doc.build(content)
            
            logger.info(f"Generated science notes PDF: {filepath}")
            return filepath
            
        except Exception as e:
            logger.error(f"Error generating science notes PDF: {e}", exc_info=True)
            raise
    
    def _get_subject_color(self, subject: str) -> colors.Color:
        """Get color based on subject"""
        subject_colors = {
            'Biology': colors.HexColor('#2d8659'),      # Green
            'Chemistry': colors.HexColor('#c45508'),    # Orange
            'Physics': colors.HexColor('#1a5490'),      # Blue
        }
        return subject_colors.get(subject, colors.HexColor('#555555'))
    
    def _create_divider(self):
        """Create a horizontal divider line"""
        divider_table = Table([['']], colWidths=[6.5*inch])
        divider_table.setStyle(TableStyle([
            ('LINEABOVE', (0, 0), (-1, 0), 1, colors.HexColor('#cccccc')),
        ]))
        return divider_table
    
    def cleanup_old_pdfs(self, max_age_hours: int = 24):
        """
        Clean up old PDF files to prevent disk space issues
        
        Args:
            max_age_hours: Remove files older than this many hours
        """
        try:
            import time
            current_time = time.time()
            max_age_seconds = max_age_hours * 3600
            
            removed_count = 0
            for filename in os.listdir(self.output_dir):
                filepath = os.path.join(self.output_dir, filename)
                if filepath.endswith('.pdf'):
                    file_age = current_time - os.path.getmtime(filepath)
                    if file_age > max_age_seconds:
                        os.remove(filepath)
                        removed_count += 1
            
            if removed_count > 0:
                logger.info(f"Cleaned up {removed_count} old science notes PDF files")
                
        except Exception as e:
            logger.error(f"Error cleaning up old PDFs: {e}")
