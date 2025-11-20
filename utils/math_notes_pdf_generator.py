"""
Math Notes PDF Generator
Generates professional PDF notes for Mathematics sessions
"""

import os
import logging
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

logger = logging.getLogger(__name__)

class MathNotesPDFGenerator:
    """Generates professional PDF notes for Mathematics"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
        
        # Ensure output directory exists
        self.output_dir = os.path.join('static', 'notes')
        os.makedirs(self.output_dir, exist_ok=True)
        
    def _setup_custom_styles(self):
        """Setup custom paragraph styles"""
        self.styles.add(ParagraphStyle(
            name='Title',
            parent=self.styles['Heading1'],
            fontSize=24,
            leading=30,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#1a237e'),
            spaceAfter=20
        ))
        
        self.styles.add(ParagraphStyle(
            name='Subtitle',
            parent=self.styles['Heading2'],
            fontSize=14,
            leading=18,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#303f9f'),
            spaceAfter=30
        ))
        
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading2'],
            fontSize=16,
            leading=20,
            textColor=colors.HexColor('#0d47a1'),
            spaceBefore=15,
            spaceAfter=10,
            borderPadding=5,
            borderColor=colors.HexColor('#e3f2fd'),
            borderWidth=1,
            backColor=colors.HexColor('#e3f2fd')
        ))
        
        self.styles.add(ParagraphStyle(
            name='ConceptTitle',
            parent=self.styles['Heading3'],
            fontSize=12,
            leading=16,
            textColor=colors.HexColor('#1565c0'),
            spaceBefore=10,
            spaceAfter=5
        ))
        
        self.styles.add(ParagraphStyle(
            name='NormalJustified',
            parent=self.styles['Normal'],
            alignment=TA_JUSTIFY,
            fontSize=11,
            leading=14,
            spaceAfter=8
        ))
        
        self.styles.add(ParagraphStyle(
            name='ExampleBox',
            parent=self.styles['Normal'],
            fontSize=10,
            leading=14,
            backColor=colors.HexColor('#f5f5f5'),
            borderPadding=10,
            borderColor=colors.HexColor('#bdbdbd'),
            borderWidth=0.5,
            spaceBefore=10,
            spaceAfter=10
        ))
        
    def generate_notes_pdf(self, notes_data: dict, user_id: str) -> str:
        """Generate PDF from notes data"""
        try:
            filename = f"Math_Notes_{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            filepath = os.path.join(self.output_dir, filename)
            
            doc = SimpleDocTemplate(
                filepath,
                pagesize=A4,
                rightMargin=72,
                leftMargin=72,
                topMargin=72,
                bottomMargin=72
            )
            
            story = []
            
            # Header
            story.append(Paragraph(notes_data.get('title', 'Mathematics Notes'), self.styles['Title']))
            story.append(Paragraph(f"{notes_data.get('grade_level', '')} • {notes_data.get('subject', 'Mathematics')}", self.styles['Subtitle']))
            story.append(Spacer(1, 0.2*inch))
            
            # Learning Objectives
            if notes_data.get('learning_objectives'):
                story.append(Paragraph("🎯 Learning Objectives", self.styles['SectionHeader']))
                for obj in notes_data['learning_objectives']:
                    story.append(Paragraph(f"• {obj}", self.styles['NormalJustified']))
            
            # Key Concepts
            if notes_data.get('key_concepts'):
                story.append(Paragraph("🔑 Key Concepts", self.styles['SectionHeader']))
                for concept, definition in notes_data['key_concepts'].items():
                    story.append(Paragraph(f"<b>{concept}</b>", self.styles['ConceptTitle']))
                    story.append(Paragraph(definition, self.styles['NormalJustified']))
            
            # Detailed Explanation
            if notes_data.get('detailed_explanation'):
                story.append(Paragraph("📖 Detailed Explanation", self.styles['SectionHeader']))
                # Split by paragraphs if possible
                explanation = notes_data['detailed_explanation']
                paragraphs = explanation.split('\n\n')
                for p in paragraphs:
                    if p.strip():
                        story.append(Paragraph(p.strip(), self.styles['NormalJustified']))
            
            # Worked Examples
            if notes_data.get('worked_examples'):
                story.append(Paragraph("📝 Worked Examples", self.styles['SectionHeader']))
                for example in notes_data['worked_examples']:
                    story.append(Paragraph(f"<b>Problem:</b> {example.get('problem', '')}", self.styles['NormalJustified']))
                    
                    steps_text = "<b>Solution:</b><br/>"
                    if isinstance(example.get('solution_steps'), list):
                        for i, step in enumerate(example['solution_steps'], 1):
                            steps_text += f"{i}. {step}<br/>"
                    else:
                        steps_text += str(example.get('solution_steps', ''))
                        
                    if example.get('final_answer'):
                        steps_text += f"<br/><b>Answer:</b> {example['final_answer']}"
                        
                    story.append(Paragraph(steps_text, self.styles['ExampleBox']))
            
            # Real World Applications
            if notes_data.get('real_world_applications'):
                story.append(Paragraph("🌍 Real World Applications", self.styles['SectionHeader']))
                for app in notes_data['real_world_applications']:
                    story.append(Paragraph(f"• {app}", self.styles['NormalJustified']))
            
            # Common Mistakes
            if notes_data.get('common_mistakes'):
                story.append(Paragraph("⚠️ Common Mistakes", self.styles['SectionHeader']))
                for mistake in notes_data['common_mistakes']:
                    story.append(Paragraph(f"• {mistake}", self.styles['NormalJustified']))
            
            # Summary
            if notes_data.get('summary'):
                story.append(Paragraph("📝 Summary", self.styles['SectionHeader']))
                story.append(Paragraph(notes_data['summary'], self.styles['NormalJustified']))
            
            # Footer
            story.append(Spacer(1, 0.5*inch))
            story.append(Paragraph("Generated by NerdX AI Math Tutor", self.styles['Subtitle']))
            
            doc.build(story)
            
            # Return public URL
            from utils.url_utils import convert_local_path_to_public_url
            return convert_local_path_to_public_url(filepath)
            
        except Exception as e:
            logger.error(f"Error generating PDF: {e}")
            raise e
