import os
import logging
from typing import Dict, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

class PDFGenerator:
    """Generate PDF documents for essays, reports, and educational content"""
    
    def __init__(self):
        self.temp_dir = "temp"
        self.ensure_temp_directory()
    
    def ensure_temp_directory(self):
        """Ensure temp directory exists"""
        try:
            if not os.path.exists(self.temp_dir):
                os.makedirs(self.temp_dir)
                logger.info(f"Created temp directory: {self.temp_dir}")
        except Exception as e:
            logger.error(f"Error creating temp directory: {e}")
    
    def generate_essay_report(self, essay_data: Dict, marking_data: Dict, student_name: str = "Student") -> Optional[str]:
        """Generate a PDF report for essay marking"""
        try:
            import time
            timestamp = int(time.time())
            filename = f"essay_report_{timestamp}.html"  # HTML as fallback to PDF
            file_path = os.path.join(self.temp_dir, filename)
            
            # Generate HTML report (can be converted to PDF with additional libraries)
            html_content = self._generate_essay_html(essay_data, marking_data, student_name)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            logger.info(f"Essay report generated: {file_path}")
            return file_path
            
        except Exception as e:
            logger.error(f"Error generating essay report: {e}")
            return None
    
    def _generate_essay_html(self, essay_data: Dict, marking_data: Dict, student_name: str) -> str:
        """Generate HTML content for essay report"""
        try:
            current_date = datetime.now().strftime("%B %d, %Y")
            
            html_template = f"""
<!DOCTYPE html>
<html>
<head>
    <title>Essay Marking Report - {student_name}</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }}
        .header {{ text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }}
        .student-info {{ margin: 20px 0; }}
        .essay-section {{ margin: 20px 0; padding: 15px; background-color: #f9f9f9; }}
        .marking-section {{ margin: 20px 0; }}
        .score-breakdown {{ display: flex; justify-content: space-around; margin: 20px 0; }}
        .score-item {{ text-align: center; padding: 10px; background-color: #e9e9e9; border-radius: 5px; }}
        .feedback {{ margin: 15px 0; padding: 10px; border-left: 4px solid #007bff; }}
        .strengths {{ color: #28a745; }}
        .improvements {{ color: #dc3545; }}
        .grade {{ font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; }}
        .footer {{ text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>ZIMSEC O-Level English Language Essay Report</h1>
        <p>Student: <strong>{student_name}</strong></p>
        <p>Date: {current_date}</p>
    </div>
    
    <div class="essay-section">
        <h2>Essay Question</h2>
        <p><strong>Type:</strong> {essay_data.get('essay_type', 'N/A').title()}</p>
        <p><strong>Question:</strong> {essay_data.get('question', 'N/A')}</p>
        <p><strong>Word Count:</strong> {essay_data.get('word_count', 'N/A')}</p>
    </div>
    
    <div class="marking-section">
        <div class="grade">
            Overall Grade: {marking_data.get('grade', 'N/A')} 
            ({marking_data.get('overall_score', 0)}/50 marks)
        </div>
        
        <h2>Score Breakdown</h2>
        <div class="score-breakdown">
            <div class="score-item">
                <h4>Content & Ideas</h4>
                <p>{marking_data.get('breakdown', {}).get('content', {}).get('score', 0)}/15</p>
            </div>
            <div class="score-item">
                <h4>Structure</h4>
                <p>{marking_data.get('breakdown', {}).get('structure', {}).get('score', 0)}/15</p>
            </div>
            <div class="score-item">
                <h4>Language</h4>
                <p>{marking_data.get('breakdown', {}).get('language', {}).get('score', 0)}/10</p>
            </div>
            <div class="score-item">
                <h4>Mechanics</h4>
                <p>{marking_data.get('breakdown', {}).get('mechanics', {}).get('score', 0)}/10</p>
            </div>
        </div>
        
        <h2>Detailed Feedback</h2>
        
        <div class="feedback">
            <h4>Content & Ideas</h4>
            <p>{marking_data.get('breakdown', {}).get('content', {}).get('feedback', 'No feedback available')}</p>
        </div>
        
        <div class="feedback">
            <h4>Structure & Organization</h4>
            <p>{marking_data.get('breakdown', {}).get('structure', {}).get('feedback', 'No feedback available')}</p>
        </div>
        
        <div class="feedback">
            <h4>Language & Style</h4>
            <p>{marking_data.get('breakdown', {}).get('language', {}).get('feedback', 'No feedback available')}</p>
        </div>
        
        <div class="feedback">
            <h4>Grammar & Mechanics</h4>
            <p>{marking_data.get('breakdown', {}).get('mechanics', {}).get('feedback', 'No feedback available')}</p>
        </div>
        
        <div class="feedback strengths">
            <h4>Strengths</h4>
            <ul>
"""
            
            # Add strengths
            strengths = marking_data.get('strengths', [])
            for strength in strengths:
                html_template += f"<li>{strength}</li>"
            
            html_template += """
            </ul>
        </div>
        
        <div class="feedback improvements">
            <h4>Areas for Improvement</h4>
            <ul>
"""
            
            # Add improvements
            improvements = marking_data.get('areas_for_improvement', [])
            for improvement in improvements:
                html_template += f"<li>{improvement}</li>"
            
            html_template += f"""
            </ul>
        </div>
        
        <div class="feedback">
            <h4>Overall Assessment</h4>
            <p>{marking_data.get('detailed_feedback', 'No detailed feedback available')}</p>
        </div>
        
        <div class="feedback">
            <h4>Recommendations for Improvement</h4>
            <ul>
"""
            
            # Add recommendations
            recommendations = marking_data.get('recommendations', [])
            for recommendation in recommendations:
                html_template += f"<li>{recommendation}</li>"
            
            html_template += f"""
            </ul>
        </div>
    </div>
    
    <div class="footer">
        <p>Generated by NerdX ZIMSEC Education Assistant</p>
        <p>This report provides AI-generated feedback to help improve your writing skills.</p>
    </div>
</body>
</html>
"""
            
            return html_template
            
        except Exception as e:
            logger.error(f"Error generating essay HTML: {e}")
            return "<html><body><h1>Error generating report</h1></body></html>"
    
    def generate_question_sheet(self, questions: list, subject: str, topic: str) -> Optional[str]:
        """Generate a PDF question sheet"""
        try:
            import time
            timestamp = int(time.time())
            filename = f"question_sheet_{timestamp}.html"
            file_path = os.path.join(self.temp_dir, filename)
            
            html_content = self._generate_question_sheet_html(questions, subject, topic)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            logger.info(f"Question sheet generated: {file_path}")
            return file_path
            
        except Exception as e:
            logger.error(f"Error generating question sheet: {e}")
            return None
    
    def _generate_question_sheet_html(self, questions: list, subject: str, topic: str) -> str:
        """Generate HTML for question sheet"""
        try:
            current_date = datetime.now().strftime("%B %d, %Y")
            
            html = f"""
<!DOCTYPE html>
<html>
<head>
    <title>{subject} - {topic} Questions</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 40px; }}
        .header {{ text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }}
        .question {{ margin: 20px 0; padding: 15px; border: 1px solid #ddd; }}
        .question-number {{ font-weight: bold; color: #007bff; }}
        .points {{ float: right; font-weight: bold; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>ZIMSEC O-Level {subject}</h1>
        <h2>{topic}</h2>
        <p>Date: {current_date}</p>
    </div>
"""
            
            for i, question in enumerate(questions, 1):
                points = question.get('points', 10)
                html += f"""
    <div class="question">
        <div class="points">[{points} marks]</div>
        <div class="question-number">Question {i}:</div>
        <p>{question.get('question', 'No question available')}</p>
    </div>
"""
            
            html += """
</body>
</html>
"""
            
            return html
            
        except Exception as e:
            logger.error(f"Error generating question sheet HTML: {e}")
            return "<html><body><h1>Error</h1></body></html>"