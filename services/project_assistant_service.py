"""
ZIMSEC Project Assistant Service
Implements the complete 6-stage ZIMSEC School-Based Project workflow with AI assistance
"""

import logging
import json
from datetime import datetime
from typing import Dict, Optional, List
from utils.session_manager import session_manager
from services.whatsapp_service import WhatsAppService
from services.advanced_credit_service import AdvancedCreditService
from utils.web_search_tool import WebSearchTool
from utils.gemini_image_generator import GeminiImageGenerator
from utils.document_generator import DocumentGenerator

logger = logging.getLogger(__name__)


class ProjectAssistantService:
    """
    ZIMSEC Project Pro - Professional AI tutor for School-Based Projects
    Guides students through 6 stages with Socratic methodology
    """
    
    # Credit costs (1 credit = $0.02)
    CREDIT_COSTS = {
        'web_search': 0,         # FREE - Basic guidance (real API integration coming soon)
        'image_generation': 2,   # $0.04 per image (Gemini 2.5 Flash Image costs $0.039)
        'document_generation': 100,  # $2.00 for final document
        'ai_analysis': 5,        # $0.10 for deep analysis
    }
    
    # Project stages
    STAGES = {
        1: {
            'name': 'Problem Identification',
            'goal': 'Define a clear, real-world problem that needs improvement',
            'output': 'Project Title, Objectives, and Problem Statement (1-2 pages)'
        },
        2: {
            'name': 'Investigation of Related Ideas',
            'goal': 'Research existing solutions and gather data',
            'output': 'Literature Review Report (2 pages) and Data Collection/Analysis Report (3 pages)'
        },
        3: {
            'name': 'Generation of New Ideas',
            'goal': 'Brainstorm and create novel solutions',
            'output': 'List of new ideas with feasibility analysis'
        },
        4: {
            'name': 'Development of the Best Idea',
            'goal': 'Select, refine, and detail the most effective solution',
            'output': 'Detailed solution plan with materials, steps, and expected outcomes'
        },
        5: {
            'name': 'Presentation of Results',
            'goal': 'Create a tangible product or presentation',
            'output': 'Visual presentation, poster, or product demonstration'
        },
        6: {
            'name': 'Evaluation and Recommendations',
            'goal': 'Critically reflect on the process and solution',
            'output': 'Comprehensive evaluation and future recommendations'
        }
    }
    
    def __init__(self):
        self.whatsapp_service = WhatsAppService()
        self.credit_service = AdvancedCreditService()
        self.web_search = WebSearchTool()
        self.image_generator = GeminiImageGenerator()
        self.document_generator = DocumentGenerator()
    
    def show_main_menu(self, user_id: str):
        """Display the Project Assistant main menu"""
        try:
            # Check if user has an active project
            project_data = self._get_project_data(user_id)
            
            menu_text = "🎓 *ZIMSEC Project Assistant*\n"
            menu_text += "─────────────────────\n\n"
            menu_text += "Welcome to *ZIMSEC Project Pro* - your professional AI tutor for School-Based Projects!\n\n"
            
            if project_data and project_data.get('active'):
                # User has an active project
                current_stage = project_data.get('current_stage', 1)
                project_title = project_data.get('project_title', 'Untitled Project')
                subject = project_data.get('subject', 'Not specified')
                
                menu_text += f"📋 *Current Project:*\n"
                menu_text += f"Title: {project_title}\n"
                menu_text += f"Subject: {subject}\n"
                menu_text += f"Stage: {current_stage}/6 - {self.STAGES[current_stage]['name']}\n\n"
                
                buttons = [
                    {"text": "▶️ Continue Project", "callback_data": "project_continue"},
                    {"text": "🆕 Start New Project", "callback_data": "project_new"},
                    {"text": "📚 View Progress", "callback_data": "project_progress"},
                    {"text": "🔙 Main Menu", "callback_data": "main_menu"}
                ]
            else:
                # No active project
                menu_text += "I will guide you through the *6 stages* of a ZIMSEC School-Based Project:\n\n"
                
                for stage_num, stage_info in self.STAGES.items():
                    menu_text += f"*Stage {stage_num}:* {stage_info['name']}\n"
                
                menu_text += "\n🎯 *Features:*\n"
                menu_text += "• Web research for literature\n"
                menu_text += "• AI-powered image generation\n"
                menu_text += "• Professional document creation\n"
                menu_text += "• Socratic tutoring method\n"
                menu_text += "• Progress tracking & memory\n\n"
                
                menu_text += "Ready to create an excellent ZIMSEC project?"
                
                buttons = [
                    {"text": "🚀 Start New Project", "callback_data": "project_new"},
                    {"text": "💡 How It Works", "callback_data": "project_how_it_works"},
                    {"text": "🔙 Main Menu", "callback_data": "main_menu"}
                ]
            
            self.whatsapp_service.send_interactive_message(user_id, menu_text, buttons)
            
        except Exception as e:
            logger.error(f"Error showing project menu for {user_id}: {e}", exc_info=True)
            raise
    
    def start_new_project(self, user_id: str):
        """Initialize a new ZIMSEC project"""
        try:
            # Clear any existing project data
            self._clear_project_data(user_id)
            
            # Set session mode
            session_manager.set_session_data(user_id, {
                'mode': 'project_assistant',
                'awaiting': 'student_name',
                'active': True,
                'current_stage': 0,
                'created_at': datetime.now().isoformat()
            })
            
            message = "🎓 *Welcome to ZIMSEC Project Pro!*\n\n"
            message += "I'm your professional AI tutor, and I'll guide you through every stage of your School-Based Project with expert assistance.\n\n"
            message += "Let's begin by getting to know you better.\n\n"
            message += "📝 *What is your name?*"
            
            self.whatsapp_service.send_message(user_id, message)
            
        except Exception as e:
            logger.error(f"Error starting new project for {user_id}: {e}", exc_info=True)
            raise
    
    def continue_project(self, user_id: str):
        """Continue an existing project"""
        try:
            project_data = self._get_project_data(user_id)
            
            if not project_data or not project_data.get('active'):
                self.whatsapp_service.send_message(
                    user_id,
                    "❌ No active project found. Please start a new project."
                )
                self.show_main_menu(user_id)
                return
            
            # Resume from last point
            student_name = project_data.get('student_name', 'there')
            current_stage = project_data.get('current_stage', 1)
            project_title = project_data.get('project_title', 'your project')
            
            message = f"👋 Welcome back, *{student_name}*!\n\n"
            message += f"Let's continue working on: *{project_title}*\n\n"
            message += f"📍 *Current Stage:* {current_stage}/6\n"
            message += f"*{self.STAGES[current_stage]['name']}*\n\n"
            message += f"🎯 Goal: {self.STAGES[current_stage]['goal']}\n\n"
            
            # Provide stage-specific guidance
            message += self._get_stage_guidance(current_stage, project_data)
            
            self.whatsapp_service.send_message(user_id, message)
            
            # Set session mode
            session_manager.set_session_data(user_id, {
                'mode': 'project_assistant',
                'active': True
            })
            
        except Exception as e:
            logger.error(f"Error continuing project for {user_id}: {e}", exc_info=True)
            raise
    
    def handle_user_input(self, user_id: str, message_text: str):
        """Handle user messages in project assistant mode"""
        try:
            session_data = session_manager.get_session_data(user_id)
            project_data = self._get_project_data(user_id)
            
            if not session_data or session_data.get('mode') != 'project_assistant':
                return
            
            awaiting = session_data.get('awaiting')
            
            # Handle different input states
            if awaiting == 'student_name':
                self._handle_student_name(user_id, message_text)
            elif awaiting == 'subject':
                self._handle_subject(user_id, message_text)
            elif awaiting == 'project_idea':
                self._handle_project_idea(user_id, message_text)
            elif awaiting == 'stage_1_problem':
                self._handle_stage_1_input(user_id, message_text, project_data)
            elif awaiting == 'stage_2_research':
                self._handle_stage_2_input(user_id, message_text, project_data)
            elif awaiting == 'stage_3_ideas':
                self._handle_stage_3_input(user_id, message_text, project_data)
            elif awaiting == 'stage_4_development':
                self._handle_stage_4_input(user_id, message_text, project_data)
            elif awaiting == 'stage_5_presentation':
                self._handle_stage_5_input(user_id, message_text, project_data)
            elif awaiting == 'stage_6_evaluation':
                self._handle_stage_6_input(user_id, message_text, project_data)
            else:
                # General conversation within the current stage
                self._handle_general_conversation(user_id, message_text, project_data)
            
        except Exception as e:
            logger.error(f"Error handling project input for {user_id}: {e}", exc_info=True)
            raise
    
    def _handle_student_name(self, user_id: str, name: str):
        """Handle student name input"""
        # Update project data
        project_data = self._get_project_data(user_id) or {}
        project_data['student_name'] = name.strip()
        self._save_project_data(user_id, project_data)
        
        # Ask for subject
        session_manager.set_session_data(user_id, {
            'mode': 'project_assistant',
            'awaiting': 'subject',
            'active': True
        })
        
        message = f"Wonderful, *{name}*! 🌟\n\n"
        message += "Now, which subject is this School-Based Project for?\n\n"
        message += "Please specify (e.g., Geography, Home Economics, Design & Technology, Business Studies, Agriculture, etc.)"
        
        self.whatsapp_service.send_message(user_id, message)
    
    def _handle_subject(self, user_id: str, subject: str):
        """Handle subject input"""
        project_data = self._get_project_data(user_id)
        project_data['subject'] = subject.strip()
        self._save_project_data(user_id, project_data)
        
        student_name = project_data.get('student_name', 'there')
        
        # Ask for initial project idea
        session_manager.set_session_data(user_id, {
            'mode': 'project_assistant',
            'awaiting': 'project_idea',
            'active': True
        })
        
        message = f"Excellent choice, *{student_name}*! 📚\n\n"
        message += f"*Subject:* {subject}\n\n"
        message += "Now, let's identify the problem you want to solve.\n\n"
        message += "🤔 *Think about:*\n"
        message += "• What real-world problem have you noticed in your community?\n"
        message += "• What situation needs improvement?\n"
        message += "• Who is affected by this problem?\n\n"
        message += "💡 Share your initial idea or describe the problem you're interested in exploring."
        
        self.whatsapp_service.send_message(user_id, message)
    
    def _handle_project_idea(self, user_id: str, idea: str):
        """Handle initial project idea and start Stage 1"""
        project_data = self._get_project_data(user_id)
        project_data['initial_idea'] = idea
        project_data['current_stage'] = 1
        project_data['stage_1_data'] = {'problem_ideas': [idea]}
        self._save_project_data(user_id, project_data)
        
        student_name = project_data.get('student_name', 'there')
        
        # Move to Stage 1
        session_manager.set_session_data(user_id, {
            'mode': 'project_assistant',
            'awaiting': 'stage_1_problem',
            'active': True
        })
        
        message = f"Fantastic, *{student_name}*! 🎯\n\n"
        message += f"You're interested in: _{idea}_\n\n"
        message += "─────────────────────\n"
        message += "*STAGE 1: PROBLEM IDENTIFICATION*\n"
        message += "─────────────────────\n\n"
        message += "🎯 *Goal:* Define a clear, specific problem that needs solving.\n\n"
        message += "Let me guide you with some questions (Socratic method):\n\n"
        message += "1️⃣ *Where exactly* is this problem happening? (School, home, community, specific location)\n\n"
        message += "Please answer this first question in detail."
        
        self.whatsapp_service.send_message(user_id, message)
    
    def _handle_stage_1_input(self, user_id: str, message_text: str, project_data: dict):
        """Handle Stage 1: Problem Identification inputs"""
        stage_data = project_data.get('stage_1_data', {})
        
        # Track responses
        if 'location' not in stage_data:
            stage_data['location'] = message_text
            project_data['stage_1_data'] = stage_data
            self._save_project_data(user_id, project_data)
            
            response = "Great! 👍\n\n"
            response += "2️⃣ *Who is affected* by this problem? (Students, teachers, community members, family, etc.)\n\n"
            response += "Be specific about the target group."
            
            self.whatsapp_service.send_message(user_id, response)
        
        elif 'affected_people' not in stage_data:
            stage_data['affected_people'] = message_text
            project_data['stage_1_data'] = stage_data
            self._save_project_data(user_id, project_data)
            
            response = "Excellent insight! 💡\n\n"
            response += "3️⃣ *What specific challenges* does this problem create for them?\n\n"
            response += "Think about the impact and consequences."
            
            self.whatsapp_service.send_message(user_id, response)
        
        elif 'challenges' not in stage_data:
            stage_data['challenges'] = message_text
            project_data['stage_1_data'] = stage_data
            self._save_project_data(user_id, project_data)
            
            student_name = project_data.get('student_name', 'there')
            
            response = f"Perfect, *{student_name}*! 🌟\n\n"
            response += "Now let's create your *Project Title*.\n\n"
            response += "Based on your answers:\n"
            response += f"• Problem area: {stage_data.get('location', '')}\n"
            response += f"• Affected group: {stage_data.get('affected_people', '')}\n"
            response += f"• Key challenges: {message_text[:100]}...\n\n"
            response += "4️⃣ What would you like to call this project? (Keep it clear and specific)\n\n"
            response += "Example: \"Improving Waste Management in [Location]\" or \"Reducing Water Shortage at [School Name]\""
            
            self.whatsapp_service.send_message(user_id, response)
        
        elif 'project_title' not in project_data:
            project_data['project_title'] = message_text
            stage_data['completed'] = True
            project_data['stage_1_data'] = stage_data
            self._save_project_data(user_id, project_data)
            
            # Stage 1 complete, offer to move to Stage 2
            buttons = [
                {"text": "➡️ Move to Stage 2", "callback_data": "project_stage_2"},
                {"text": "📄 Review Stage 1", "callback_data": "project_review_stage_1"},
                {"text": "💾 Save & Exit", "callback_data": "project_save_exit"}
            ]
            
            response = "🎉 *Congratulations!*\n\n"
            response += f"*Stage 1 Complete:* Problem Identification ✅\n\n"
            response += f"📋 *Project Title:* {message_text}\n\n"
            response += "You've successfully defined your problem! Next, we'll research existing solutions and gather data.\n\n"
            response += "Ready to continue?"
            
            self.whatsapp_service.send_interactive_message(user_id, response, buttons)
        else:
            # Already complete, guide to next stage
            self._prompt_next_stage(user_id, project_data)
    
    def _handle_stage_2_input(self, user_id: str, message_text: str, project_data: dict):
        """Handle Stage 2: Investigation of Related Ideas"""
        stage_data = project_data.get('stage_2_data', {})
        
        if not stage_data:
            # First input - ask if they want web research
            stage_data['user_query'] = message_text
            project_data['stage_2_data'] = stage_data
            self._save_project_data(user_id, project_data)
            
            # Offer web search
            self._offer_web_search(user_id, message_text)
        else:
            # Continue with research analysis
            self._continue_stage_2_analysis(user_id, message_text, project_data)
    
    def _offer_web_search(self, user_id: str, query: str):
        """Offer web search guidance (free during beta)"""
        session_manager.set_session_data(user_id, {
            'mode': 'project_assistant',
            'pending_action': 'web_search',
            'pending_query': query,
            'active': True
        })
        
        credits_needed = self.CREDIT_COSTS['web_search']
        
        message = f"🔍 *Research Guidance Available*\n\n"
        message += f"I can provide research guidance to help you find:\n"
        message += f"• Existing solutions to similar problems\n"
        message += f"• Academic research and literature\n"
        message += f"• Case studies and examples\n"
        message += f"• Data and statistics\n\n"
        message += f"💡 *Cost:* FREE (Beta feature - research guidance)\n\n"
        message += f"Query: _{query}_\n\n"
        message += "Do you want research guidance for this topic?"
        
        buttons = [
            {"text": "✅ Yes, Get Guidance", "callback_data": f"project_confirm_web_search"},
            {"text": "❌ No, Skip", "callback_data": "project_cancel_action"}
        ]
        
        self.whatsapp_service.send_interactive_message(user_id, message, buttons)
    
    def execute_confirmed_action(self, user_id: str, action_id: str):
        """Execute a confirmed credit-deducting action"""
        try:
            session_data = session_manager.get_session_data(user_id)
            pending_action = session_data.get('pending_action')
            
            if action_id == 'project_confirm_web_search' and pending_action == 'web_search':
                query = session_data.get('pending_query', '')
                self._execute_web_search(user_id, query)
            
            elif action_id == 'project_confirm_image_gen':
                prompt = session_data.get('pending_image_prompt', '')
                self._execute_image_generation(user_id, prompt)
            
            elif action_id == 'project_confirm_document':
                self._execute_document_generation(user_id)
            
            else:
                self.whatsapp_service.send_message(user_id, "❌ Unknown action.")
            
        except Exception as e:
            logger.error(f"Error executing confirmed action for {user_id}: {e}", exc_info=True)
            raise
    
    def _execute_web_search(self, user_id: str, query: str):
        """Provide web research guidance (no credits deducted during beta)"""
        try:
            # No credit deduction for beta guidance feature
            credits_needed = self.CREDIT_COSTS['web_search']
            
            # Provide research guidance
            self.whatsapp_service.send_message(user_id, "🔍 Preparing research guidance... Please wait.")
            
            search_results = self.web_search.search(query)
            
            # Format and send guidance
            project_data = self._get_project_data(user_id)
            stage_data = project_data.get('stage_2_data', {})
            stage_data['search_results'] = search_results
            stage_data['search_query'] = query
            project_data['stage_2_data'] = stage_data
            self._save_project_data(user_id, project_data)
            
            result_message = "✅ *Research Guidance Provided!*\n\n"
            result_message += f"📚 *Suggested Research Areas:*\n{search_results[:1500]}\n\n"
            result_message += "💡 *Next Steps:*\n"
            result_message += "• Research the suggested areas using Google Scholar, your library, or online resources\n"
            result_message += "• Take notes on existing solutions you find\n"
            result_message += "• Analyze their strengths and weaknesses\n\n"
            result_message += "When you're ready, share what you discovered about existing solutions:"
            
            self.whatsapp_service.send_message(user_id, result_message)
            
            # Clear pending action
            session_manager.set_session_data(user_id, {
                'mode': 'project_assistant',
                'awaiting': 'stage_2_research',
                'active': True
            })
            
        except Exception as e:
            logger.error(f"Error providing research guidance for {user_id}: {e}", exc_info=True)
            self.whatsapp_service.send_message(user_id, "❌ Error providing guidance. Please try again.")
    
    def _execute_image_generation(self, user_id: str, prompt: str):
        """Execute image generation and deduct credits"""
        try:
            credits_needed = self.CREDIT_COSTS['image_generation']
            
            if not self.credit_service.deduct_credits(user_id, credits_needed, 'Image Generation for Project'):
                self.whatsapp_service.send_message(
                    user_id,
                    f"❌ Insufficient credits. You need {credits_needed} credits for image generation."
                )
                return
            
            self.whatsapp_service.send_message(user_id, "🎨 Generating image... Please wait.")
            
            image_url = self.image_generator.generate(prompt)
            
            if image_url:
                # Save to project data
                project_data = self._get_project_data(user_id)
                stage_data = project_data.get('stage_5_data', {})
                generated_images = stage_data.get('generated_images', [])
                generated_images.append({'prompt': prompt, 'url': image_url})
                stage_data['generated_images'] = generated_images
                project_data['stage_5_data'] = stage_data
                self._save_project_data(user_id, project_data)
                
                # Send image
                self.whatsapp_service.send_media_message(
                    user_id,
                    media_type='image',
                    media_url=image_url,
                    caption=f"✨ Generated: {prompt}"
                )
                
                self.whatsapp_service.send_message(
                    user_id,
                    "✅ Image generated successfully! You can request more images or continue with your presentation."
                )
            else:
                self.whatsapp_service.send_message(user_id, "❌ Failed to generate image. Please try again.")
            
            # Clear pending action
            session_manager.set_session_data(user_id, {
                'mode': 'project_assistant',
                'awaiting': 'stage_5_presentation',
                'active': True
            })
            
        except Exception as e:
            logger.error(f"Error generating image for {user_id}: {e}", exc_info=True)
            self.whatsapp_service.send_message(user_id, "❌ Error generating image. Please try again.")
    
    def _execute_document_generation(self, user_id: str):
        """Execute final document generation"""
        try:
            credits_needed = self.CREDIT_COSTS['document_generation']
            
            if not self.credit_service.deduct_credits(user_id, credits_needed, 'Final Project Document'):
                self.whatsapp_service.send_message(
                    user_id,
                    f"❌ Insufficient credits. You need {credits_needed} credits for document generation.\n\n"
                    f"Type 'menu' to buy more credits."
                )
                return
            
            self.whatsapp_service.send_message(user_id, "📄 Generating your professional document... Please wait.")
            
            project_data = self._get_project_data(user_id)
            document_url = self.document_generator.create_project_document(project_data)
            
            if document_url:
                self.whatsapp_service.send_media_message(
                    user_id,
                    media_type='document',
                    media_url=document_url,
                    caption=f"🎉 Your complete ZIMSEC Project document is ready!\n\n"
                            f"Project: {project_data.get('project_title', 'School-Based Project')}"
                )
                
                completion_message = "✅ *Congratulations!* 🎓\n\n"
                completion_message += "You have successfully completed your ZIMSEC School-Based Project with ZIMSEC Project Pro!\n\n"
                completion_message += "Your document includes all 6 stages and is ready for submission.\n\n"
                completion_message += "Best of luck with your presentation! 🌟"
                
                self.whatsapp_service.send_message(user_id, completion_message)
                
                # Mark project as completed
                project_data['completed'] = True
                project_data['completed_at'] = datetime.now().isoformat()
                self._save_project_data(user_id, project_data)
                
            else:
                self.whatsapp_service.send_message(user_id, "❌ Error generating document. Please try again.")
            
        except Exception as e:
            logger.error(f"Error generating document for {user_id}: {e}", exc_info=True)
            self.whatsapp_service.send_message(user_id, "❌ Error generating document. Please try again.")
    
    def cancel_pending_action(self, user_id: str):
        """Cancel a pending credit-deducting action"""
        session_manager.set_session_data(user_id, {
            'mode': 'project_assistant',
            'active': True
        })
        
        self.whatsapp_service.send_message(user_id, "Action cancelled. How would you like to continue?")
    
    def _continue_stage_2_analysis(self, user_id: str, message_text: str, project_data: dict):
        """Continue Stage 2 analysis after web search"""
        # Implementation for continuing stage 2
        stage_data = project_data.get('stage_2_data', {})
        stage_data['analysis'] = message_text
        stage_data['completed'] = True
        project_data['stage_2_data'] = stage_data
        self._save_project_data(user_id, project_data)
        
        buttons = [
            {"text": "➡️ Move to Stage 3", "callback_data": "project_stage_3"},
            {"text": "📄 Review Stage 2", "callback_data": "project_review_stage_2"}
        ]
        
        response = "🎉 *Stage 2 Complete!* ✅\n\n"
        response += "You've successfully researched and analyzed existing solutions.\n\n"
        response += "Next: Generate new, creative ideas!"
        
        self.whatsapp_service.send_interactive_message(user_id, response, buttons)
    
    def _handle_stage_3_input(self, user_id: str, message_text: str, project_data: dict):
        """Handle Stage 3: Generation of New Ideas"""
        # Simple implementation - collect ideas
        stage_data = project_data.get('stage_3_data', {})
        ideas = stage_data.get('ideas', [])
        ideas.append(message_text)
        stage_data['ideas'] = ideas
        
        if len(ideas) < 3:
            response = f"Great idea #{len(ideas)}! 💡\n\n"
            response += f"Can you think of {3 - len(ideas)} more creative solution(s)?"
            self.whatsapp_service.send_message(user_id, response)
        else:
            stage_data['completed'] = True
            project_data['stage_3_data'] = stage_data
            project_data['current_stage'] = 4
            self._save_project_data(user_id, project_data)
            
            buttons = [
                {"text": "➡️ Move to Stage 4", "callback_data": "project_stage_4"}
            ]
            
            response = "🎉 Excellent! You've generated multiple creative ideas! ✅\n\n"
            response += "Next, we'll select and develop the best one."
            
            self.whatsapp_service.send_interactive_message(user_id, response, buttons)
    
    def _handle_stage_4_input(self, user_id: str, message_text: str, project_data: dict):
        """Handle Stage 4: Development of the Best Idea"""
        stage_data = project_data.get('stage_4_data', {})
        stage_data['development_details'] = message_text
        stage_data['completed'] = True
        project_data['stage_4_data'] = stage_data
        project_data['current_stage'] = 5
        self._save_project_data(user_id, project_data)
        
        buttons = [
            {"text": "➡️ Move to Stage 5", "callback_data": "project_stage_5"}
        ]
        
        response = "🎉 *Stage 4 Complete!* ✅\n\n"
        response += "Your solution is well-developed!\n\n"
        response += "Next: Create a visual presentation."
        
        self.whatsapp_service.send_interactive_message(user_id, response, buttons)
    
    def _handle_stage_5_input(self, user_id: str, message_text: str, project_data: dict):
        """Handle Stage 5: Presentation of Results"""
        # Offer image generation
        session_manager.set_session_data(user_id, {
            'mode': 'project_assistant',
            'pending_action': 'image_generation',
            'pending_image_prompt': message_text,
            'active': True
        })
        
        credits_needed = self.CREDIT_COSTS['image_generation']
        cost_dollars = credits_needed * 0.02
        
        message = f"🎨 *Image Generation Available*\n\n"
        message += f"I can generate a professional image/diagram for your presentation:\n\n"
        message += f"Description: _{message_text}_\n\n"
        message += f"💰 *Cost:* {credits_needed} credits (${cost_dollars:.2f})\n\n"
        message += "Proceed with image generation?"
        
        buttons = [
            {"text": "✅ Yes, Generate", "callback_data": "project_confirm_image_gen"},
            {"text": "❌ No, Skip", "callback_data": "project_cancel_action"}
        ]
        
        self.whatsapp_service.send_interactive_message(user_id, message, buttons)
    
    def _handle_stage_6_input(self, user_id: str, message_text: str, project_data: dict):
        """Handle Stage 6: Evaluation and Recommendations"""
        stage_data = project_data.get('stage_6_data', {})
        stage_data['evaluation'] = message_text
        stage_data['completed'] = True
        project_data['stage_6_data'] = stage_data
        project_data['current_stage'] = 6
        self._save_project_data(user_id, project_data)
        
        # Offer final document generation
        credits_needed = self.CREDIT_COSTS['document_generation']
        cost_dollars = credits_needed * 0.02
        
        message = f"🎉 *All 6 Stages Complete!* 🎓\n\n"
        message += f"Congratulations! You've completed your entire ZIMSEC School-Based Project!\n\n"
        message += f"📄 *Final Service Available:*\n"
        message += f"I can compile all your work into a professional, submission-ready Word document.\n\n"
        message += f"💰 *Cost:* {credits_needed} credits (${cost_dollars:.2f})\n\n"
        message += "Proceed with document creation?"
        
        buttons = [
            {"text": "✅ Yes, Create Document", "callback_data": "project_confirm_document"},
            {"text": "❌ Not Now", "callback_data": "project_cancel_action"}
        ]
        
        self.whatsapp_service.send_interactive_message(user_id, message, buttons)
    
    def _handle_general_conversation(self, user_id: str, message_text: str, project_data: dict):
        """Handle general conversation within a stage (Socratic tutoring)"""
        current_stage = project_data.get('current_stage', 1)
        
        # Use Socratic questions to guide the student
        response = "That's an interesting thought! 💭\n\n"
        response += "Let me ask you: Why do you think that approach would work?\n\n"
        response += f"Consider the goal of Stage {current_stage}: {self.STAGES[current_stage]['goal']}"
        
        self.whatsapp_service.send_message(user_id, response)
    
    def _get_stage_guidance(self, stage_num: int, project_data: dict) -> str:
        """Get specific guidance for a stage"""
        guidance = ""
        
        if stage_num == 1:
            guidance = "Let's refine your problem statement. Think about:\n"
            guidance += "• The specific location\n"
            guidance += "• Who is affected\n"
            guidance += "• What challenges it creates\n\n"
            guidance += "What aspect would you like to work on?"
        
        elif stage_num == 2:
            guidance = "Time to research! 🔍\n\n"
            guidance += "What would you like to search for? (I can perform web research for you)\n\n"
            guidance += "Example: 'Existing solutions for waste management in schools'"
        
        # Add guidance for other stages...
        
        return guidance
    
    def _prompt_next_stage(self, user_id: str, project_data: dict):
        """Prompt user to move to next stage"""
        current_stage = project_data.get('current_stage', 1)
        next_stage = current_stage + 1
        
        if next_stage <= 6:
            message = f"Ready to move to Stage {next_stage}?\n\n"
            message += f"*{self.STAGES[next_stage]['name']}*\n"
            message += f"Goal: {self.STAGES[next_stage]['goal']}"
            
            buttons = [
                {"text": f"➡️ Start Stage {next_stage}", "callback_data": f"project_stage_{next_stage}"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
        else:
            self.whatsapp_service.send_message(user_id, "🎉 Project complete!")
    
    def _get_project_data(self, user_id: str) -> Optional[Dict]:
        """Retrieve project data from session"""
        session_data = session_manager.get_session_data(user_id)
        return session_data.get('project_data') if session_data else None
    
    def _save_project_data(self, user_id: str, project_data: dict):
        """Save project data to session"""
        session_data = session_manager.get_session_data(user_id) or {}
        session_data['project_data'] = project_data
        session_manager.set_session_data(user_id, session_data)
    
    def _clear_project_data(self, user_id: str):
        """Clear all project data"""
        session_manager.clear_session(user_id)
