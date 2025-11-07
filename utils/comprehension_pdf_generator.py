"""
Comprehension PDF Generator
Generates professional, exam-style PDFs for English comprehension passages
"""

import os
import logging
from datetime import datetime
from typing import Dict, List, Optional
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib import colors

logger = logging.getLogger(__name__)


class ComprehensionPDFGenerator:
    """Generates professional PDF documents for comprehension passages"""
    
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
        
        # Title style (ZIMSEC header)
        styles.add(ParagraphStyle(
            name='ZIMSECTitle',
            parent=styles['Heading1'],
            fontSize=16,
            textColor=colors.HexColor('#1a5490'),
            spaceAfter=6,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        # Subtitle style
        styles.add(ParagraphStyle(
            name='ZIMSECSubtitle',
            parent=styles['Normal'],
            fontSize=11,
            textColor=colors.HexColor('#666666'),
            spaceAfter=12,
            alignment=TA_CENTER,
            fontName='Helvetica'
        ))
        
        # Section header style
        styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=styles['Heading2'],
            fontSize=12,
            textColor=colors.HexColor('#1a5490'),
            spaceAfter=8,
            spaceBefore=12,
            fontName='Helvetica-Bold'
        ))
        
        # Passage style (justified text for better readability)
        styles.add(ParagraphStyle(
            name='PassageText',
            parent=styles['Normal'],
            fontSize=11,
            alignment=TA_JUSTIFY,
            spaceAfter=8,
            leading=16,
            fontName='Helvetica'
        ))
        
        # Question style
        styles.add(ParagraphStyle(
            name='QuestionText',
            parent=styles['Normal'],
            fontSize=10,
            spaceAfter=10,
            leading=14,
            fontName='Helvetica',
            leftIndent=20
        ))
        
        # Info box style
        styles.add(ParagraphStyle(
            name='InfoBox',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.HexColor('#555555'),
            spaceAfter=12,
            alignment=TA_CENTER,
            fontName='Helvetica-Oblique'
        ))
        
        return styles
    
    def generate_comprehension_pdf(
        self,
        passage_data: Dict,
        user_name: str = "Student",
        filename: Optional[str] = None
    ) -> str:
        """
        Generate a professional comprehension PDF
        
        Args:
            passage_data: Dictionary with 'passage' and 'questions' keys
            user_name: Name of the student
            filename: Custom filename (auto-generated if not provided)
        
        Returns:
            Path to the generated PDF file
        """
        try:
            # Clean up old PDFs before generating new ones (keep last 24 hours)
            self.cleanup_old_pdfs(max_age_hours=24)
            
            # Extract data
            passage = passage_data.get('passage', {})
            questions = passage_data.get('questions', [])
            
            passage_text = passage.get('text', 'Passage not available')
            passage_title = passage.get('title', 'Comprehension Passage')
            word_count = len(passage_text.split())
            reading_time = max(2, word_count // 200)
            
            # Generate filename
            if not filename:
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                safe_title = "".join(c if c.isalnum() else "_" for c in passage_title[:30])
                filename = f"comprehension_{safe_title}_{timestamp}.pdf"
            
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
            
            # Header - ZIMSEC branding
            content.append(Paragraph(
                "ZIMBABWE SCHOOL EXAMINATIONS COUNCIL",
                self.styles['ZIMSECTitle']
            ))
            content.append(Paragraph(
                "O Level English Language - Comprehension Exercise",
                self.styles['ZIMSECSubtitle']
            ))
            content.append(Spacer(1, 0.2*inch))
            
            # Passage title and info
            content.append(Paragraph(
                f"<b>{passage_title}</b>",
                self.styles['SectionHeader']
            ))
            
            # Info box with word count and reading time
            info_text = f"📊 Words: {word_count} | ⏱️ Reading time: ~{reading_time} minutes | 👤 Student: {user_name}"
            content.append(Paragraph(info_text, self.styles['InfoBox']))
            content.append(Spacer(1, 0.15*inch))
            
            # Instructions
            instructions = Paragraph(
                "<b>INSTRUCTIONS:</b> Read the passage carefully, then answer ALL questions based on your understanding.",
                self.styles['Normal']
            )
            content.append(instructions)
            content.append(Spacer(1, 0.15*inch))
            
            # Divider line
            content.append(self._create_divider())
            content.append(Spacer(1, 0.1*inch))
            
            # Passage section
            content.append(Paragraph(
                "<b>PASSAGE</b>",
                self.styles['SectionHeader']
            ))
            
            # Split passage into paragraphs for better formatting
            paragraphs = passage_text.split('\n\n')
            for para in paragraphs:
                if para.strip():
                    content.append(Paragraph(para.strip(), self.styles['PassageText']))
                    content.append(Spacer(1, 0.1*inch))
            
            content.append(Spacer(1, 0.2*inch))
            content.append(self._create_divider())
            content.append(Spacer(1, 0.2*inch))
            
            # Questions section
            content.append(Paragraph(
                "<b>QUESTIONS</b>",
                self.styles['SectionHeader']
            ))
            content.append(Paragraph(
                "Answer ALL questions. Write your answers on a separate sheet.",
                self.styles['InfoBox']
            ))
            content.append(Spacer(1, 0.15*inch))
            
            # Add each question
            for i, question in enumerate(questions[:10], 1):
                marks = question.get('marks', 1)
                question_text = question.get('question', f'Question {i}')
                
                # Question number and text
                q_text = f"<b>{i}.</b> {question_text}"
                if marks:
                    q_text += f" <b>[{marks} mark{'s' if marks != 1 else ''}]</b>"
                
                content.append(Paragraph(q_text, self.styles['QuestionText']))
                content.append(Spacer(1, 0.08*inch))
            
            # Footer
            content.append(Spacer(1, 0.3*inch))
            content.append(self._create_divider())
            footer_text = f"Generated: {datetime.now().strftime('%B %d, %Y at %I:%M %p')} | NerdX ZIMSEC Quiz Bot"
            content.append(Paragraph(footer_text, self.styles['InfoBox']))
            
            # Build PDF
            doc.build(content)
            
            logger.info(f"Generated comprehension PDF: {filepath}")
            return filepath
            
        except Exception as e:
            logger.error(f"Error generating comprehension PDF: {e}")
            raise
    
    def _create_divider(self):
        """Create a horizontal divider line"""
        divider_table = Table([['']], colWidths=[6.5*inch])
        divider_table.setStyle(TableStyle([
            ('LINEABOVE', (0, 0), (-1, 0), 1, colors.HexColor('#1a5490')),
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
                logger.info(f"Cleaned up {removed_count} old PDF files")
                
        except Exception as e:
            logger.error(f"Error cleaning up old PDFs: {e}")
