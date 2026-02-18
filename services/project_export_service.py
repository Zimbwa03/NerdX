"""
ZIMSEC Project Export Service
Generates submission-ready PDF documents for School-Based Projects
"""

import os
import json
import logging
import re
from datetime import datetime
from typing import Dict, List, Optional
from jinja2 import Environment, FileSystemLoader, select_autoescape

logger = logging.getLogger(__name__)

# Try to import WeasyPrint for PDF generation
try:
    from weasyprint import HTML, CSS
    WEASYPRINT_AVAILABLE = True
except ImportError:
    WEASYPRINT_AVAILABLE = False
    logger.warning("WeasyPrint not installed. PDF generation will use fallback method.")

# Try to import python-docx for DOCX generation
try:
    from docx import Document
    from docx.shared import Inches, Pt
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    DOCX_AVAILABLE = True
except ImportError:
    DOCX_AVAILABLE = False
    logger.warning("python-docx not installed. DOCX generation will be disabled.")

from database.external_db import make_supabase_request


class ProjectExportService:
    """Service for generating project submission packs"""
    
    # Stage titles
    STAGE_TITLES = {
        1: "Problem Identification",
        2: "Investigation of Related Ideas",
        3: "Generation of Ideas",
        4: "Development / Refinement",
        5: "Presentation of Results",
        6: "Evaluation & Recommendations"
    }
    
    # Stage section keys and titles
    STAGE_SECTIONS = {
        1: [
            ('title', 'Project Title'),
            ('background', 'Background'),
            ('problem_statement', 'Problem Statement'),
            ('aim', 'Aim'),
            ('objectives', 'Objectives'),
            ('research_questions', 'Research Questions / Design Brief'),
            ('scope', 'Scope'),
            ('success_criteria', 'Success Criteria'),
            ('work_plan', 'Work Plan')
        ],
        2: [
            ('literature_review', 'Literature / Background Review'),
            ('existing_solutions', 'Existing Solutions'),
            ('stakeholder_insights', 'Stakeholder Insights'),
            ('data_collection_plan', 'Data Collection Plan'),
            ('constraints', 'Risks, Constraints & Resources')
        ],
        3: [
            ('solution_ideas', 'Possible Solutions'),
            ('selection_criteria', 'Selection Criteria'),
            ('decision_matrix', 'Decision Matrix'),
            ('chosen_solution', 'Chosen Solution Justification')
        ],
        4: [
            ('design_details', 'Design / Methodology Details'),
            ('materials_list', 'Materials / Tools / Software'),
            ('implementation_plan', 'Implementation Plan'),
            ('prototype_notes', 'Prototype / Draft Notes'),
            ('testing_plan', 'Testing Plan')
        ],
        5: [
            ('final_output', 'Final Output Description'),
            ('results', 'Results / Findings'),
            ('objectives_met', 'How Objectives Were Met'),
            ('user_guide', 'User Guide / Exhibition Notes')
        ],
        6: [
            ('evaluation_table', 'Evaluation Against Success Criteria'),
            ('strengths', 'Strengths'),
            ('limitations', 'Limitations'),
            ('improvements', 'Improvements'),
            ('recommendations', 'Recommendations'),
            ('reflection', 'Personal Reflection')
        ]
    }
    
    def __init__(self):
        self.exports_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'exports')
        self.templates_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'templates', 'exports')
        
        # Ensure directories exist
        os.makedirs(self.exports_dir, exist_ok=True)
        os.makedirs(self.templates_dir, exist_ok=True)
        
        # Initialize Jinja2 environment
        self.jinja_env = Environment(
            loader=FileSystemLoader(self.templates_dir),
            autoescape=select_autoescape(['html', 'xml'])
        )
    
    def get_project_data(self, project_id: int, user_id: str) -> Optional[Dict]:
        """Get complete project data for export"""
        try:
            # Get project details
            projects = make_supabase_request("GET", "user_projects", filters={
                "id": f"eq.{project_id}",
                "user_id": f"eq.{user_id}"
            })
            
            if not projects:
                return None
            
            project = projects[0]
            
            # Parse project_data if it's a string
            project_data = project.get('project_data', {})
            if isinstance(project_data, str):
                try:
                    project_data = json.loads(project_data)
                except:
                    project_data = {}
            
            # Get sections
            sections = make_supabase_request("GET", "project_sections", filters={
                "project_id": f"eq.{project_id}"
            }) or []
            
            # Get evidence
            evidence = make_supabase_request("GET", "project_evidence", filters={
                "project_id": f"eq.{project_id}"
            }) or []
            
            # Get references
            references = make_supabase_request("GET", "project_references", filters={
                "project_id": f"eq.{project_id}"
            }) or []
            
            # Get logbook entries
            logbook = make_supabase_request("GET", "project_logbook", filters={
                "project_id": f"eq.{project_id}"
            }) or []
            
            # Get user info
            from database.external_db import get_user_registration
            user_data = get_user_registration(user_id) or {}
            
            return {
                'project': project,
                'project_data': project_data,
                'sections': sections,
                'evidence': evidence,
                'references': references,
                'logbook': logbook,
                'user': user_data
            }
            
        except Exception as e:
            logger.error(f"Error getting project data for export: {e}", exc_info=True)
            return None
    
    def get_submission_checklist(self, project_id: int, user_id: str) -> Dict:
        """Get checklist of required items and completion status"""
        data = self.get_project_data(project_id, user_id)
        
        if not data:
            return {'error': 'Project not found'}
        
        # Safely get lists with defaults
        evidence = data.get('evidence', [])
        references = data.get('references', [])
        logbook = data.get('logbook', [])
        sections = data.get('sections', [])
        
        checklist = {
            'project_id': project_id,
            'stages': {},
            'evidence_count': len(evidence) if isinstance(evidence, list) else 0,
            'references_count': len(references) if isinstance(references, list) else 0,
            'logbook_entries_count': len(logbook) if isinstance(logbook, list) else 0,
            'overall_completion': 0
        }
        
        # Organize sections by stage
        sections_by_stage = {}
        if isinstance(sections, list):
            for section in sections:
                if not isinstance(section, dict):
                    continue
                stage = self._coerce_stage_number(section.get('stage_number'))
                if stage is None:
                    continue
                if stage not in sections_by_stage:
                    sections_by_stage[stage] = {}
                section_key = section.get('section_key')
                if section_key:
                    sections_by_stage[stage][section_key] = section
        
        total_items = 0
        completed_items = 0
        
        # Check each stage
        for stage_num, stage_sections in self.STAGE_SECTIONS.items():
            stage_title = self.STAGE_TITLES.get(stage_num, f"Stage {stage_num}")
            stage_checklist = {
                'title': stage_title,
                'items': [],
                'completed': 0,
                'total': len(stage_sections) if isinstance(stage_sections, (list, tuple)) else 0
            }
            
            for key, title in stage_sections:
                total_items += 1
                section = sections_by_stage.get(stage_num, {}).get(key)
                
                is_completed = False
                if section:
                    content = section.get('content_json', {})
                    if isinstance(content, str):
                        try:
                            content = json.loads(content)
                        except:
                            content = {}
                    is_completed = bool(content.get('content'))
                
                if is_completed:
                    completed_items += 1
                    stage_checklist['completed'] += 1
                
                stage_checklist['items'].append({
                    'key': key,
                    'title': title,
                    'completed': is_completed
                })
            
            checklist['stages'][stage_num] = stage_checklist
        
        checklist['overall_completion'] = round((completed_items / total_items) * 100) if total_items > 0 else 0
        
        return checklist

    def _coerce_stage_number(self, value) -> Optional[int]:
        """Coerce mixed stage values (int/str) into a valid stage number."""
        try:
            stage = int(value)
        except (TypeError, ValueError):
            return None
        return stage if stage in self.STAGE_TITLES else None
    
    def _resolve_selected_stages(self, stage_number: Optional[int]) -> Optional[List[int]]:
        """Resolve export stage selection."""
        if stage_number is None:
            return [1, 2, 3, 4, 5, 6]
        try:
            stage = int(stage_number)
        except (TypeError, ValueError):
            return None
        if stage not in self.STAGE_TITLES:
            return None
        return [stage]

    def generate_pdf(self, project_id: int, user_id: str, stage_number: Optional[int] = None) -> Dict:
        """Generate PDF submission pack (full project or a single stage)."""
        try:
            data = self.get_project_data(project_id, user_id)
            
            if not data:
                return {'success': False, 'error': 'Project not found'}
            
            project = data['project']
            selected_stages = self._resolve_selected_stages(stage_number)
            if not selected_stages:
                return {'success': False, 'error': 'Invalid stage number. Use 1-6.'}
            
            # Build context for template
            context = self._build_export_context(data, selected_stages=selected_stages)
            
            # Generate filename
            title_slug = re.sub(r'[^\w\s-]', '', project.get('project_title', 'Project')).strip().replace(' ', '_')[:30]
            subject_slug = re.sub(r'[^\w\s-]', '', project.get('subject', 'General')).strip().replace(' ', '_')[:20]
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            scope_slug = f"Stage{selected_stages[0]}" if len(selected_stages) == 1 else "Full"
            filename = f"ZIMSEC_ProjectPack_{subject_slug}_{title_slug}_{scope_slug}_{timestamp}.pdf"
            filepath = os.path.join(self.exports_dir, filename)
            
            # Generate HTML
            html_content = self._render_html_template(context)
            
            # Convert to PDF
            if WEASYPRINT_AVAILABLE:
                html = HTML(string=html_content)
                css = CSS(string=self._get_pdf_styles())
                html.write_pdf(filepath, stylesheets=[css])
            else:
                # Fallback: save HTML and return error about PDF
                html_path = filepath.replace('.pdf', '.html')
                with open(html_path, 'w', encoding='utf-8') as f:
                    f.write(html_content)
                return {
                    'success': False,
                    'error': 'WeasyPrint not installed. HTML file saved instead.',
                    'html_path': html_path
                }
            
            # Save export record
            export_record = {
                'project_id': project_id,
                'user_id': user_id,
                'file_type': 'pdf',
                'file_path': filepath,
                'file_url': f'/static/exports/{filename}',
                'status': 'completed'
            }
            result = make_supabase_request("POST", "project_exports", export_record, use_service_role=True)
            export_id = result[0]['id'] if result else None
            
            return {
                'success': True,
                'export_id': export_id,
                'filename': filename,
                'file_path': filepath,
                'download_url': f'/static/exports/{filename}',
                'selected_stages': selected_stages,
            }
            
        except Exception as e:
            logger.error(f"Error generating PDF: {e}", exc_info=True)
            return {'success': False, 'error': str(e)}
    
    def _build_export_context(self, data: Dict, selected_stages: Optional[List[int]] = None) -> Dict:
        """Build context for template rendering"""
        project = data['project']
        project_data = data['project_data']
        user = data['user']
        selected_stages = selected_stages or [1, 2, 3, 4, 5, 6]
        
        # Organize sections by stage
        sections_by_stage = {}
        for section in data.get('sections', []):
            if not isinstance(section, dict):
                continue
            stage = self._coerce_stage_number(section.get('stage_number'))
            if stage is None or stage not in selected_stages:
                continue
            if stage not in sections_by_stage:
                sections_by_stage[stage] = {}
            section_key = section.get('section_key')
            if not section_key:
                continue
            
            content = section.get('content_json', {})
            if isinstance(content, str):
                try:
                    content = json.loads(content)
                except:
                    content = {}
            
            sections_by_stage[stage][section_key] = {
                'title': section.get('section_title') or section_key,
                'content': content.get('content', ''),
                'completed': bool(content.get('content'))
            }
        
        # Organize evidence by stage
        evidence_by_stage = {}
        for ev in data.get('evidence', []):
            if not isinstance(ev, dict):
                continue
            stage = self._coerce_stage_number(ev.get('stage_number'))
            if stage is None or stage not in selected_stages:
                continue
            if stage not in evidence_by_stage:
                evidence_by_stage[stage] = []
            evidence_by_stage[stage].append(ev)
        
        # Sort logbook by date
        logbook = sorted(
            data.get('logbook', []),
            key=lambda x: x.get('entry_date', '') if isinstance(x, dict) else '',
        )
        
        # Generate executive summary
        executive_summary = self._generate_executive_summary(project, project_data, sections_by_stage)
        
        return {
            'project': project,
            'project_data': project_data,
            'user': user,
            'sections_by_stage': sections_by_stage,
            'evidence_by_stage': evidence_by_stage,
            'references': data['references'],
            'logbook': logbook,
            'stage_titles': self.STAGE_TITLES,
            'stage_sections': self.STAGE_SECTIONS,
            'selected_stages': selected_stages,
            'executive_summary': executive_summary,
            'generation_date': datetime.now().strftime('%d %B %Y'),
            'year': datetime.now().year
        }
    
    def _generate_executive_summary(self, project: Dict, project_data: Dict, sections: Dict) -> str:
        """Generate an executive summary from the project content"""
        parts = []
        
        title = project.get('project_title', 'Untitled Project')
        subject = project.get('subject', 'General')
        level = project_data.get('level', 'O-Level')
        
        parts.append(f"This {level} {subject} project titled \"{title}\" addresses a real-world problem through the ZIMSEC School-Based Project (SBP) framework.")
        
        # Add problem statement if available
        if 1 in sections and 'problem_statement' in sections[1]:
            problem = sections[1]['problem_statement'].get('content', '')
            if problem:
                parts.append(f"The project investigates: {problem[:200]}...")
        
        # Add chosen solution if available
        if 3 in sections and 'chosen_solution' in sections[3]:
            solution = sections[3]['chosen_solution'].get('content', '')
            if solution:
                parts.append(f"The selected approach involves: {solution[:200]}...")
        
        # Add conclusion if available
        if 6 in sections and 'recommendations' in sections[6]:
            recommendations = sections[6]['recommendations'].get('content', '')
            if recommendations:
                parts.append(f"Key recommendations include: {recommendations[:200]}...")
        
        if len(parts) == 1:
            parts.append("The project follows a systematic approach through six stages: Problem Identification, Investigation, Idea Generation, Development, Presentation, and Evaluation.")
        
        return ' '.join(parts)
    
    def _render_html_template(self, context: Dict) -> str:
        """Render the HTML template for PDF generation"""
        # Check if template exists, otherwise use inline template
        template_path = os.path.join(self.templates_dir, 'project_export.html')
        
        if os.path.exists(template_path):
            template = self.jinja_env.get_template('project_export.html')
            return template.render(**context)
        else:
            # Use inline template
            return self._get_inline_template().format(**self._flatten_context(context))
    
    def _flatten_context(self, context: Dict) -> Dict:
        """Flatten context for simple string formatting"""
        project = context['project']
        project_data = context['project_data']
        user = context['user']
        
        # Build stages HTML
        toc_html = self._build_toc_html(context['selected_stages'])
        stages_html = self._build_stages_html(context)
        references_html = self._build_references_html(context['references'])
        appendices_html = self._build_appendices_html(context['evidence_by_stage'], context['selected_stages'])
        logbook_html = self._build_logbook_html(context['logbook'])
        
        return {
            'project_title': project.get('project_title', 'Untitled Project'),
            'subject': project.get('subject', 'Not specified'),
            'level': project_data.get('level', 'O-Level'),
            'student_name': f"{user.get('name', '')} {user.get('surname', '')}".strip() or 'Not specified',
            'school': project_data.get('school', 'Not specified'),
            'year': context['year'],
            'generation_date': context['generation_date'],
            'executive_summary': context['executive_summary'],
            'toc_html': toc_html,
            'stages_html': stages_html,
            'references_html': references_html,
            'appendices_html': appendices_html,
            'logbook_html': logbook_html
        }

    def _build_toc_html(self, selected_stages: List[int]) -> str:
        """Build dynamic table-of-contents HTML."""
        html_parts = ['<ol>', '<li>Executive Summary</li>']
        for stage_num in selected_stages:
            stage_title = self.STAGE_TITLES.get(stage_num, f"Stage {stage_num}")
            html_parts.append(f'<li>Stage {stage_num}: {stage_title}</li>')
        html_parts.extend([
            '<li>References / Bibliography</li>',
            '<li>Appendices</li>',
            '<li>Project Logbook</li>',
            '</ol>',
        ])
        return '\n'.join(html_parts)
    
    def _build_stages_html(self, context: Dict) -> str:
        """Build HTML for all stages"""
        html_parts = []
        sections_by_stage = context['sections_by_stage']
        selected_stages = context.get('selected_stages', [1, 2, 3, 4, 5, 6])
        
        for stage_num in selected_stages:
            stage_title = self.STAGE_TITLES.get(stage_num, f"Stage {stage_num}")
            html_parts.append(f'<div class="stage"><h2>Stage {stage_num}: {stage_title}</h2>')
            
            stage_sections = self.STAGE_SECTIONS[stage_num]
            stage_data = sections_by_stage.get(stage_num, {})
            
            for key, title in stage_sections:
                section = stage_data.get(key, {})
                content = section.get('content', '')
                
                html_parts.append(f'<div class="section"><h3>{title}</h3>')
                
                if content:
                    # Convert newlines to paragraphs
                    paragraphs = content.split('\n\n')
                    for p in paragraphs:
                        if p.strip():
                            html_parts.append(f'<p>{p.strip()}</p>')
                else:
                    html_parts.append('<p class="incomplete"><em>Not completed yet. This section requires: {}</em></p>'.format(
                        self._get_section_requirement(stage_num, key)
                    ))
                
                html_parts.append('</div>')
            
            html_parts.append('</div>')
        
        return '\n'.join(html_parts)
    
    def _get_section_requirement(self, stage: int, key: str) -> str:
        """Get requirement description for incomplete sections"""
        requirements = {
            1: {
                'title': 'A specific, measurable project title',
                'background': 'Local context and why this problem matters',
                'problem_statement': 'A clear problem statement (1 paragraph)',
                'aim': 'One-sentence aim statement',
                'objectives': '3-6 SMART objectives',
                'research_questions': 'Research questions or design brief',
                'scope': 'What will and will not be covered',
                'success_criteria': 'Measurable success criteria',
                'work_plan': 'Timeline with milestones'
            },
            2: {
                'literature_review': '3-8 relevant sources reviewed',
                'existing_solutions': 'Local and global solutions explored',
                'stakeholder_insights': 'Interviews, surveys, or observations',
                'data_collection_plan': 'Data collection tools and methods',
                'constraints': 'Risks, constraints, and available resources'
            },
            3: {
                'solution_ideas': '3-6 diverse solution ideas',
                'selection_criteria': 'Criteria for evaluating solutions',
                'decision_matrix': 'Matrix comparing solutions against criteria',
                'chosen_solution': 'Justification for chosen solution'
            },
            4: {
                'design_details': 'Detailed design or methodology',
                'materials_list': 'Materials, tools, and software list',
                'implementation_plan': 'Step-by-step implementation plan',
                'prototype_notes': 'Prototype or draft documentation',
                'testing_plan': 'Testing plan with metrics'
            },
            5: {
                'final_output': 'Description of final product/solution',
                'results': 'Results and findings with data',
                'objectives_met': 'How objectives were achieved',
                'user_guide': 'User guide or exhibition notes'
            },
            6: {
                'evaluation_table': 'Evaluation against success criteria',
                'strengths': 'Project strengths',
                'limitations': 'Project limitations',
                'improvements': 'Suggested improvements',
                'recommendations': 'Recommendations for future work',
                'reflection': 'Personal learning reflection'
            }
        }
        return requirements.get(stage, {}).get(key, 'Content for this section')
    
    def _build_references_html(self, references: List) -> str:
        """Build HTML for references section"""
        if not references:
            return '<p class="incomplete"><em>No references added yet.</em></p>'
        
        html_parts = ['<ol class="references-list">']
        for ref in references:
            citation = ref.get('citation_text', '')
            link = ref.get('link_optional', '')
            if link:
                html_parts.append(f'<li>{citation} <a href="{link}">[Link]</a></li>')
            else:
                html_parts.append(f'<li>{citation}</li>')
        html_parts.append('</ol>')
        
        return '\n'.join(html_parts)
    
    def _build_appendices_html(self, evidence_by_stage: Dict, selected_stages: Optional[List[int]] = None) -> str:
        """Build HTML for appendices section"""
        if not evidence_by_stage:
            return '<p class="incomplete"><em>No evidence uploaded yet.</em></p>'
        
        html_parts = []
        selected = selected_stages or [1, 2, 3, 4, 5, 6]
        
        for stage_num in selected:
            evidence = evidence_by_stage.get(stage_num, [])
            if evidence:
                html_parts.append(f'<h3>Stage {stage_num} Evidence</h3>')
                html_parts.append('<ul class="evidence-list">')
                for ev in evidence:
                    ev_type = ev.get('evidence_type', 'other')
                    description = ev.get('description', 'No description')
                    file_url = ev.get('file_url_or_path', '')
                    
                    if file_url:
                        html_parts.append(f'<li><strong>{ev_type.title()}:</strong> {description} <a href="{file_url}">[View]</a></li>')
                    else:
                        html_parts.append(f'<li><strong>{ev_type.title()}:</strong> {description}</li>')
                html_parts.append('</ul>')
        
        return '\n'.join(html_parts) if html_parts else '<p class="incomplete"><em>No evidence uploaded yet.</em></p>'
    
    def _build_logbook_html(self, logbook: List) -> str:
        """Build HTML for logbook section"""
        if not logbook:
            return '<p class="incomplete"><em>No logbook entries yet.</em></p>'
        
        html_parts = ['<table class="logbook-table"><thead><tr><th>Date</th><th>Stage</th><th>Activities</th><th>Challenges</th><th>Next Steps</th></tr></thead><tbody>']
        
        for entry in logbook:
            date = entry.get('entry_date', '')
            stage = entry.get('stage_number', '-')
            activities = entry.get('activities_text', '')
            challenges = entry.get('challenges', '')
            next_steps = entry.get('next_steps', '')
            
            html_parts.append(f'<tr><td>{date}</td><td>{stage}</td><td>{activities}</td><td>{challenges}</td><td>{next_steps}</td></tr>')
        
        html_parts.append('</tbody></table>')
        
        return '\n'.join(html_parts)
    
    def _get_inline_template(self) -> str:
        """Get inline HTML template for PDF generation"""
        return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{project_title} - ZIMSEC Project Submission Pack</title>
</head>
<body>
    <div class="cover-page">
        <h1>ZIMSEC School-Based Project</h1>
        <h2 class="project-title">{project_title}</h2>
        <table class="cover-details">
            <tr><td>Subject:</td><td>{subject}</td></tr>
            <tr><td>Level:</td><td>{level}</td></tr>
            <tr><td>Candidate Name:</td><td>{student_name}</td></tr>
            <tr><td>School:</td><td>{school}</td></tr>
            <tr><td>Year:</td><td>{year}</td></tr>
        </table>
        <p class="generated">Generated: {generation_date}</p>
    </div>
    
    <div class="toc">
        <h2>Table of Contents</h2>
        {toc_html}
    </div>
    
    <div class="section">
        <h2>Executive Summary</h2>
        <p>{executive_summary}</p>
    </div>
    
    {stages_html}
    
    <div class="section">
        <h2>References / Bibliography</h2>
        {references_html}
    </div>
    
    <div class="section">
        <h2>Appendices</h2>
        {appendices_html}
    </div>
    
    <div class="section">
        <h2>Project Logbook</h2>
        {logbook_html}
    </div>
</body>
</html>"""
    
    def _get_pdf_styles(self) -> str:
        """Get CSS styles for PDF generation"""
        return """
            @page {
                size: A4;
                margin: 2cm;
            }
            
            body {
                font-family: 'Times New Roman', Times, serif;
                font-size: 12pt;
                line-height: 1.6;
                color: #333;
            }
            
            .cover-page {
                text-align: center;
                page-break-after: always;
                padding-top: 100px;
            }
            
            .cover-page h1 {
                font-size: 28pt;
                color: #1a5f7a;
                margin-bottom: 50px;
            }
            
            .cover-page h2.project-title {
                font-size: 24pt;
                color: #333;
                margin-bottom: 50px;
                border: 2px solid #1a5f7a;
                padding: 20px;
            }
            
            .cover-details {
                margin: 0 auto;
                text-align: left;
                border-collapse: collapse;
            }
            
            .cover-details td {
                padding: 8px 20px;
                font-size: 14pt;
            }
            
            .cover-details td:first-child {
                font-weight: bold;
                color: #1a5f7a;
            }
            
            .generated {
                margin-top: 100px;
                font-style: italic;
                color: #666;
            }
            
            .toc {
                page-break-after: always;
            }
            
            .toc h2 {
                color: #1a5f7a;
                border-bottom: 2px solid #1a5f7a;
                padding-bottom: 10px;
            }
            
            .toc ol {
                list-style-type: decimal;
                padding-left: 30px;
            }
            
            .toc li {
                padding: 5px 0;
            }
            
            .stage {
                page-break-before: always;
            }
            
            h2 {
                color: #1a5f7a;
                border-bottom: 2px solid #1a5f7a;
                padding-bottom: 10px;
                margin-top: 30px;
            }
            
            h3 {
                color: #2c7a7b;
                margin-top: 20px;
                margin-bottom: 10px;
            }
            
            .section {
                margin-bottom: 20px;
            }
            
            .incomplete {
                color: #e53e3e;
                background-color: #fff5f5;
                padding: 10px;
                border-left: 4px solid #e53e3e;
            }
            
            .references-list li {
                margin-bottom: 10px;
            }
            
            .evidence-list {
                list-style-type: disc;
                padding-left: 20px;
            }
            
            .logbook-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            
            .logbook-table th,
            .logbook-table td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
            
            .logbook-table th {
                background-color: #1a5f7a;
                color: white;
            }
            
            .logbook-table tr:nth-child(even) {
                background-color: #f9f9f9;
            }
        """


# Create singleton instance
project_export_service = ProjectExportService()

