#!/usr/bin/env python3
"""
Mathematics question generation and rendering extracted from whatsapp_main_backup.py
All function bodies are preserved verbatim.
"""

import logging
import os
import json
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

# Import configuration values to preserve global names
from config import DEEPSEEK_API_KEY, DESMOS_API_KEY

# Dependencies that were originally in the same module
from rate_limit import check_rate_limit, update_rate_limit, get_cached_question, cache_question
from database_local import has_question_been_asked, save_question_to_history


def generate_math_questions(topic: str, difficulty: str, count: int = 1) -> Optional[List[Dict]]:
    """Generate mathematics questions using Deepseek AI with LaTeX formatting for image conversion"""
    try:
        import requests
        import time

        difficulty_descriptions = {
            "easy": "Direct application of basic concepts, straightforward calculations, minimal steps",
            "medium": "Requires understanding of multiple concepts, moderate calculations, 2-3 steps",
            "difficult": "Complex problem-solving, multi-step reasoning, synthesis of several concepts"
        }

        prompt = f"""
You are MathMentor, an expert O-Level Mathematics tutor for ZIMSEC curriculum. 

CRITICAL INSTRUCTION: Generate EXACTLY ONE single question - never return arrays or multiple questions.

Topic: {topic}
Difficulty: {difficulty} - {difficulty_descriptions[difficulty]}

STRICT REQUIREMENTS:
1. NEVER use arrays or lists - generate ONE single question only
2. Questions must be ZIMSEC O-Level Mathematics standard (Forms 1-4, 2015-2022)
3. Use simple mathematical notation (x², not complex LaTeX)
4. Provide clear, step-by-step solutions with explanations
5. Make the question educational and unique

MANDATORY JSON FORMAT (single object, not array):
{
    "question": "A clear mathematics problem statement",
    "solution": "Step 1: Clear explanation\nStep 2: Next step\nStep 3: Final answer",
    "points": {10 if difficulty == 'easy' else 20 if difficulty == 'medium' else 50}
}

EXAMPLE for {topic}:
- Question should be concise and clear
- Solution should show ALL working steps
- Points are: Easy=10, Medium=20, Difficult=50

Generate ONE question now (not multiple, not an array):
"""

        headers = {
            'Authorization': f'Bearer {DEEPSEEK_API_KEY}',
            'Content-Type': 'application/json'
        }

        data = {
            'model': 'deepseek-chat',
            'messages': [
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            'max_tokens': 3000,
            'temperature': 0.7
        }

        # Try with very short timeouts and more retries for better responsiveness
        timeouts = [10, 12, 15]
        max_retries = 5
        
        for attempt in range(max_retries):
            try:
                timeout = timeouts[min(attempt, len(timeouts) - 1)]
                logger.info(f"DeepSeek API attempt {attempt + 1}/{max_retries} with {timeout}s timeout")
                
                response = requests.post(
                    'https://api.deepseek.com/chat/completions',
                    headers=headers,
                    json=data,
                    timeout=timeout
                )

                if response.status_code == 200:
                    result = response.json()
                    content = result['choices'][0]['message']['content']

                    # Extract JSON from response
                    try:
                        json_start = content.find('{')
                        json_end = content.rfind('}') + 1
                        json_str = content[json_start:json_end]

                        question_data = json.loads(json_str)
                        
                        # STRICT validation - ONLY accept single question format
                        if (isinstance(question_data, dict) and 
                            'question' in question_data and 
                            'solution' in question_data and 
                            'points' in question_data and
                            not isinstance(question_data.get('question'), list)):
                            
                            # Ensure we have a single question (not array)
                            logger.info(f"✅ Successfully generated SINGLE question on attempt {attempt + 1}")
                            logger.info(f"Question preview: {question_data['question'][:100]}...")
                            return [question_data]  # Return as array for consistency
                        else:
                            logger.error(f"❌ REJECTED: Invalid format or array detected: {type(question_data)}")
                            logger.error(f"Required: single dict with question, solution, points")
                            if isinstance(question_data, list):
                                logger.error("ARRAYS NOT ALLOWED - must be single question object")
                            
                    except json.JSONDecodeError as e:
                        logger.error(f"Failed to parse JSON from AI response: {e}")
                        
                else:
                    logger.error(f"DeepSeek API error: {response.status_code} - {response.text}")
                    
            except requests.exceptions.Timeout:
                logger.warning(f"DeepSeek API timeout on attempt {attempt + 1}/{max_retries} (waited {timeout}s)")
                if attempt == max_retries - 1:
                    logger.error("All DeepSeek API attempts timed out, using fallback")
                    return generate_fallback_math_questions(topic, difficulty, count)
                if attempt < max_retries - 1:
                    time.sleep(1)  # Short wait before retry
            except requests.exceptions.ConnectionError as conn_error:
                logger.warning(f"DeepSeek API connection error on attempt {attempt + 1}/{max_retries}: {conn_error}")
                if attempt == max_retries - 1:
                    logger.error("All DeepSeek API connection attempts failed, using fallback")
                    return generate_fallback_math_questions(topic, difficulty, count)
                if attempt < max_retries - 1:
                    time.sleep(1)  # Short wait before retry
            except Exception as e:
                logger.error(f"DeepSeek API error on attempt {attempt + 1}: {e}")
                if attempt == max_retries - 1:
                    logger.error("All DeepSeek API attempts failed, using fallback")
                    return generate_fallback_math_questions(topic, difficulty, count)

        # If all API attempts fail, generate fallback questions - only 1 question
        logger.warning("All DeepSeek API attempts failed. Generating fallback questions.")
        return generate_fallback_math_questions(topic, difficulty, 1)
    except Exception as e:
        logger.error(f"Error generating mathematics questions: {e}")
        return None


def generate_fallback_math_questions(topic: str, difficulty: str, count: int = 1) -> List[Dict]:
    """Generate fallback mathematics questions when API fails"""
    try:
        question_templates = {
            "Real Numbers": {
                "easy": [
                    {
                        "question": "Simplify: 3/4 + 1/2",
                        "solution": "Convert to common denominator: 3/4 + 2/4 = 5/4 = 1 1/4",
                        "points": 10
                    },
                    {
                        "question": "Find the value of: 2^3 × 2^2",
                        "solution": "Add exponents: 2^(3+2) = 2^5 = 32",
                        "points": 10
                    }
                ],
                "medium": [
                    {
                        "question": "Solve: $x^2 + 5x + 6 = 0$",
                        "solution": "Step 1: Factor the quadratic\\nLook for two numbers that multiply to 6 and add to 5\\nThose numbers are 2 and 3\\n\\n$x^2 + 5x + 6 = (x + 2)(x + 3) = 0\\n\\nStep 2: Apply zero product rule\\n$x + 2 = 0$ or $x + 3 = 0$\\n\\nStep 3: Solve for x\\n$x = -2$ or $x = -3$\\n\\nTherefore, $x = -2$ or $x = -3$",
                        "points": 20
                    },
                    {
                        "question": "Solve for x: $2x^2 - 8x = 0$",
                        "solution": "Step 1: Factor out common factor\\n$2x^2 - 8x = 2x(x - 4) = 0$\\n\\nStep 2: Apply zero product rule\\n$2x = 0$ or $x - 4 = 0$\\n\\nStep 3: Solve each equation\\nFrom $2x = 0$: $x = 0$\\nFrom $x - 4 = 0$: $x = 4$\\n\\nTherefore, $x = 0$ or $x = 4$",
                        "points": 20
                    }
                ],
                "difficult": [
                    {
                        "question": "Solve using the quadratic formula: $x^2 - 4x + 1 = 0$",
                        "solution": "Step 1: Identify coefficients\\n$a = 1$, $b = -4$, $c = 1$\\n\\nStep 2: Apply quadratic formula\\n$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$\\n\\nStep 3: Substitute values\\n$x = \\frac{-(-4) \\pm \\sqrt{(-4)^2 - 4(1)(1)}}{2(1)}$\\n\\nStep 4: Simplify\\n$x = \\frac{4 \\pm \\sqrt{16 - 4}}{2}$\\n$x = \\frac{4 \\pm \\sqrt{12}}{2}$\\n$x = \\frac{4 \\pm 2\\sqrt{3}}{2}$\\n$x = 2 \\pm \\sqrt{3}$\\n\\nTherefore, $x = 2 + \\sqrt{3}$ or $x = 2 - \\sqrt{3}$",
                        "points": 50
                    }
                ]
            }
        }
        
        # Get appropriate questions based on topic and difficulty
        if topic in question_templates and difficulty in question_templates[topic]:
            available_questions = question_templates[topic][difficulty]
        else:
            # Default questions if topic not found
            available_questions = question_templates["Real Numbers"]["easy"]
        
        # Select questions (cycle through if not enough)
        selected_questions = []
        for i in range(count):
            question_index = i % len(available_questions)
            question = available_questions[question_index].copy()
            
            # Modify slightly to make each question unique
            if i >= len(available_questions):
                question["question"] = f"Question {i+1}: " + question["question"]
            
            selected_questions.append(question)
        
        logger.info(f"Generated {len(selected_questions)} fallback questions")
        return selected_questions
        
    except Exception as e:
        logger.error(f"Error generating fallback questions: {e}")
        return []


def generate_unique_math_question(chat_id: str, topic: str, difficulty: str, max_attempts: int = 3) -> Optional[Dict]:
    """Generate a unique mathematics question with rate limiting and caching"""
    try:
        # First, try to get from cache
        cached_question = get_cached_question(topic, difficulty, chat_id)
        if cached_question:
            save_question_to_history(chat_id, cached_question.get('question', ''), topic, difficulty)
            logger.info(f"Served cached unique question for user {chat_id}")
            return cached_question
        
        # Check rate limiting
        if not check_rate_limit(chat_id):
            logger.warning(f"Rate limit exceeded for user {chat_id} - using fallback questions")
            # Use fallback questions instead of API to prevent overwhelming
            fallback_questions = generate_fallback_math_questions(topic, difficulty, 1)
            if fallback_questions:
                question = fallback_questions[0]
                save_question_to_history(chat_id, question.get('question', ''), topic, difficulty)
                return question
            return None
        
        # Generate new questions with reduced attempts
        for attempt in range(max_attempts):
            logger.info(f"Generating unique question attempt {attempt + 1}/{max_attempts}")
            
            # Update rate limiting
            update_rate_limit(chat_id)
            
            # Generate question using existing function
            questions = generate_math_questions(topic, difficulty, 1)
            
            if not questions or len(questions) == 0:
                # Use fallback on failure
                if attempt == max_attempts - 1:
                    fallback_questions = generate_fallback_math_questions(topic, difficulty, 1)
                    if fallback_questions:
                        question = fallback_questions[0]
                        save_question_to_history(chat_id, question.get('question', ''), topic, difficulty)
                        cache_question(topic, difficulty, question)
                        return question
                continue
                
            question = questions[0]
            question_text = question.get('question', '')
            
            if not question_text:
                continue
                
            # Cache the question for other users
            cache_question(topic, difficulty, question)
            
            # Check if this question has been asked before
            question_hash = generate_question_hash(question_text)
            
            if not has_question_been_asked(chat_id, question_hash):
                # This is a new question, save it to history
                save_question_to_history(chat_id, question_text, topic, difficulty)
                logger.info(f"Generated unique question for user {chat_id} on attempt {attempt + 1}")
                return question
            else:
                logger.info(f"Question already asked, trying again (attempt {attempt + 1})")
                
        # Final fallback - use fallback questions
        logger.warning(f"Using fallback questions for user {chat_id}")
        fallback_questions = generate_fallback_math_questions(topic, difficulty, 1)
        if fallback_questions:
            question = fallback_questions[0]
            save_question_to_history(chat_id, question.get('question', ''), topic, difficulty)
            return question
            
        return None
        
    except Exception as e:
        logger.error(f"Error generating unique math question: {e}")
        # Emergency fallback
        try:
            fallback_questions = generate_fallback_math_questions(topic, difficulty, 1)
            if fallback_questions:
                return fallback_questions[0]
        except:
            pass
        return None


def generate_desmos_graph(expression: str, title: str = "Mathematical Graph") -> Optional[str]:
    """Generate a mathematical graph using the advanced graph generator"""
    try:
        logger.info(f"Generating mathematical graph for expression: {expression}")
        
        # Use the existing graph generator from desmos_graph_generator.py
        from desmos_graph_generator import generate_function_graph
        
        # The expression will be cleaned inside the generator, so pass it as-is
        # Generate the graph using the advanced generator
        graph_path = generate_function_graph(expression, title)
        
        if graph_path and os.path.exists(graph_path):
            logger.info(f"Mathematical graph generated successfully: {graph_path}")
            return graph_path
        else:
            logger.error("Graph generation failed using advanced generator")
            return None
            
    except Exception as e:
        logger.error(f"Error generating mathematical graph: {e}")
        import traceback
        logger.error(f"Graph generation traceback: {traceback.format_exc()}")
        return None


def create_enhanced_math_image_with_graph(question_data: Dict, question_num: int, total_questions: int) -> Optional[str]:
    """Create an enhanced math image with optional Desmos graph"""
    try:
        # Check if the question involves graphable functions
        question_text = question_data['question'].lower()
        graphable_patterns = ['y =', 'f(x)', 'graph', 'plot', 'function', 'equation', 'parabola', 'line']
        
        needs_graph = any(pattern in question_text for pattern in graphable_patterns)
        
        if needs_graph and DESMOS_API_KEY:
            # Try to extract mathematical expression for graphing
            import re
            # Look for patterns like y = mx + c, f(x) = ax^2 + bx + c, etc.
            equation_patterns = [
                r'y\s*=\s*([^,.\n]+)',
                r'f\(x\)\s*=\s*([^,.\n]+)',
                r'([x^2\+\-\s\d]+\s*=\s*\d+)'
            ]
            
            graph_expression = None
            for pattern in equation_patterns:
                match = re.search(pattern, question_data['question'])
                if match:
                    graph_expression = match.group(1).strip()
                    break
            
            if graph_expression:
                # Generate Desmos graph
                graph_path = generate_desmos_graph(graph_expression, f"Question {question_num}")
                if graph_path:
                    logger.info(f"Enhanced math question with Desmos graph: {graph_path}")
                    return graph_path
        
        # Fall back to regular math image generation
        return create_math_question_image(question_data, question_num, total_questions)
        
    except Exception as e:
        logger.error(f"Error creating enhanced math image with graph: {e}")
        return create_math_question_image(question_data, question_num, total_questions)


def latex_to_image(latex_text: str, filename: str, is_solution: bool = False, add_watermark: bool = False) -> Optional[str]:
    """Convert LaTeX text to image using matplotlib with enhanced formatting and smart spacing"""
    try:
        # Check if matplotlib is available
        try:
            import matplotlib
            matplotlib.use('Agg')  # Use non-interactive backend
            import matplotlib.pyplot as plt
            import matplotlib.patches as patches
            import os
            import uuid
            import re
            logger.info("Matplotlib imported successfully")
        except ImportError as e:
            logger.error(f"Matplotlib not available: {e}")
            return None  # No text fallbacks - PNG only
        except Exception as e:
            logger.error(f"Error importing matplotlib: {e}")
            return None  # No text fallbacks - PNG only
        
        logger.info(f"Converting LaTeX to image: {filename}")
        
        # Create temp directory if it doesn't exist
        temp_dir = "temp_images"
        try:
            os.makedirs(temp_dir, exist_ok=True)
            logger.info(f"Temp directory ensured: {temp_dir}")
        except Exception as e:
            logger.error(f"Failed to create temp directory: {e}")
            return None  # No text fallbacks - PNG only
        
        # Process the text for mathematical formatting with error handling
        try:
            processed_text = latex_text.replace('\\n', '\n')
        except Exception as e:
            logger.error(f"Error processing latex text: {e}")
            return None  # No text fallbacks - PNG only
        
        # Simplified mathematical formatting for better readability
        def format_math_expression(text):
            try:
                # Clean and simple superscript handling
                text = re.sub(r'x\^2', 'x²', text)
                text = re.sub(r'x\^3', 'x³', text)
                text = re.sub(r'(\w)\^2', r'\1²', text)
                text = re.sub(r'(\w)\^3', r'\1³', text)
                text = re.sub(r'(\d+)x\^2', r'\1x²', text)
                text = re.sub(r'(\d+)x\^3', r'\1x³', text)
                
                # Handle fractions more clearly
                text = re.sub(r'\\frac\{([^}]+)\}\{([^}]+)\}', r'(\1)/(\2)', text)
                text = re.sub(r'\$\\frac\{([^}]+)\}\{([^}]+)\}\$', r'(\1)/(\2)', text)
                
                # Handle square roots simply
                text = re.sub(r'\\sqrt\{([^}]+)\}', r'√(\1)', text)
                text = re.sub(r'\\sqrt(\d+)', r'√\1', text)
                text = re.sub(r'\$\\sqrt\{([^}]+)\}\$', r'√(\1)', text)
                
                # Basic mathematical operators
                text = text.replace('\\times', '×')
                text = text.replace('\\div', '÷')
                text = text.replace('\\pm', '±')
                text = text.replace('\\therefore', '∴')
                
                # Remove LaTeX dollar signs for cleaner display
                text = re.sub(r'\$([^$]+)\$', r'\1', text)
                text = re.sub(r'\$\$([^$]+)\$\$', r'\1', text)
                
                return text
            except Exception as regex_error:
                logger.error(f"Error in math formatting: {regex_error}")
                return text
        
        # Apply mathematical formatting
        processed_text = format_math_expression(processed_text)
        
        # Remove $ symbols used for LaTeX math mode
        processed_text = processed_text.replace('$', '')
        
        logger.info(f"Processed mathematical text: {processed_text[:100]}...")
        
        # Smart text processing for better layout
        lines = processed_text.split('\n')
        non_empty_lines = [line.strip() for line in lines if line.strip()]
        
        # Analyze content for smart sizing
        total_chars = sum(len(line) for line in non_empty_lines)
        max_line_length = max(len(line) for line in non_empty_lines) if non_empty_lines else 50
        estimated_lines = len(non_empty_lines)
        
        # Smart figure dimensions based on content analysis
        if is_solution:
            # Solution images need more space
            fig_width = min(12, max(8, max_line_length * 0.12))
            fig_height = min(16, max(10, estimated_lines * 0.8 + 2))
        else:
            # Question images are more compact
            fig_width = min(10, max(8, max_line_length * 0.1))
            fig_height = min(12, max(8, estimated_lines * 0.7 + 2))
        
        # Ensure minimum readable size
        fig_width = max(fig_width, 8)
        fig_height = max(fig_height, 6)
        
        logger.info(f"Smart sizing: {fig_width}x{fig_height} for {estimated_lines} lines")
        
        try:
            # Create figure with smart DPI for crisp text
            fig, ax = plt.subplots(figsize=(fig_width, fig_height), dpi=150)
            ax.axis('off')
            
            # Set clean white background
            fig.patch.set_facecolor('white')
            ax.set_facecolor('white')
            
            # Create elegant card-style background
            card_padding = 0.03
            card_rect = patches.FancyBboxPatch(
                (card_padding, card_padding), 
                1 - 2*card_padding, 1 - 2*card_padding, 
                boxstyle="round,pad=0.015", 
                facecolor='#fdfdfd', 
                edgecolor='#e1e5e9', 
                linewidth=1.5,
                transform=ax.transAxes,
                alpha=0.95
            )
            ax.add_patch(card_rect)
            
            # Smart typography with content-aware sizing
            if estimated_lines <= 5:
                base_font_size = 16
                title_font_size = 20
                line_spacing = 0.12
            elif estimated_lines <= 10:
                base_font_size = 14
                title_font_size = 18
                line_spacing = 0.10
            elif estimated_lines <= 20:
                base_font_size = 12
                title_font_size = 16
                line_spacing = 0.08
            else:
                base_font_size = 10
                title_font_size = 14
                line_spacing = 0.06
            
            # Smart margin and content area
            margin_x = 0.08
            margin_y = 0.08
            content_width = 1 - 2 * margin_x
            y_position = 1 - margin_y
            
            # Process lines with enhanced formatting
            for i, line in enumerate(non_empty_lines):
                if not line:
                    continue
                
                # Smart content categorization and styling
                if i == 0 or any(keyword in line for keyword in ['MathMentor', 'Question', 'Solution']):
                    # Header styling
                    font_size = title_font_size
                    font_weight = 'bold'
                    color = '#1a365d'
                    current_spacing = line_spacing * 1.8
                elif any(keyword in line for keyword in ['Points:', 'Step', 'Given:', 'Find:', 'Answer:']):
                    # Emphasis styling
                    font_size = base_font_size + 2
                    font_weight = 'bold'
                    color = '#2d3748'
                    current_spacing = line_spacing * 1.4
                elif line.startswith('Therefore') or line.startswith('∴') or 'answer is' in line.lower():
                    # Final answer styling
                    font_size = base_font_size + 1
                    font_weight = 'bold'
                    color = '#2f855a'
                    current_spacing = line_spacing * 1.3
                else:
                    # Regular content styling
                    font_size = base_font_size
                    font_weight = 'normal'
                    color = '#4a5568'
                    current_spacing = line_spacing
                
                # Smart line wrapping for long content
                max_chars = max(45, int(content_width * fig_width * 12))
                
                if len(line) > max_chars:
                    # Intelligent word wrapping
                    words = line.split()
                    wrapped_lines = []
                    current_line = ""
                    
                    for word in words:
                        test_line = f"{current_line} {word}".strip()
                        if len(test_line) <= max_chars:
                            current_line = test_line
                        else:
                            if current_line:
                                wrapped_lines.append(current_line)
                            current_line = word
                    
                    if current_line:
                        wrapped_lines.append(current_line)
                    
                    # Render wrapped lines with consistent spacing
                    for j, wrapped_line in enumerate(wrapped_lines):
                        ax.text(margin_x, y_position, wrapped_line, 
                               transform=ax.transAxes, 
                               fontsize=font_size,
                               fontweight=font_weight,
                               color=color,
                               verticalalignment='top',
                               horizontalalignment='left',
                               family='DejaVu Sans',
                               linespacing=1.3)
                        y_position -= current_spacing * (0.8 if j > 0 else 1.0)  # Tighter spacing for continuation lines
                else:
                    # Single line rendering
                    ax.text(margin_x, y_position, line, 
                           transform=ax.transAxes, 
                           fontsize=font_size,
                           fontweight=font_weight,
                           color=color,
                           verticalalignment='top',
                           horizontalalignment='left',
                           family='DejaVu Sans',
                           linespacing=1.3)
                    y_position -= current_spacing
                
                # Smart spacing after sections
                if any(keyword in line for keyword in ['Step', 'Therefore', '∴', 'equation', 'Given:']):
                    y_position -= current_spacing * 0.5
                
                # Prevent content overflow - allow more content to fit
                if y_position < margin_y + 0.05:
                    logger.warning(f"Content overflow detected at line {i+1}, stopping here")
                    # Add truncation message
                    ax.text(margin_x, y_position, "...(content continues)", 
                           transform=ax.transAxes, 
                           fontsize=base_font_size - 2,
                           fontweight='italic',
                           color='#718096',
                           verticalalignment='top',
                           horizontalalignment='left',
                           family='DejaVu Sans')
                    break
            
            # Enhanced NerdX branding watermark
            if add_watermark:
                # Main watermark at bottom
                watermark_text = '🚀 NerdX - Advanced ZIMSEC Mathematics 🚀'
                ax.text(0.5, margin_y/3, watermark_text, 
                        transform=ax.transAxes,
                        fontsize=max(10, base_font_size - 2),
                        verticalalignment='center',
                        horizontalalignment='center',
                        alpha=0.7,
                        weight='bold',
                        color='#4f46e5',
                        family='DejaVu Sans')
                
                # Subtle corner watermark
                ax.text(0.95, 0.05, 'NerdX', 
                        transform=ax.transAxes,
                        fontsize=8,
                        verticalalignment='bottom',
                        horizontalalignment='right',
                        alpha=0.3,
                        style='italic',
                        color='#9ca3af',
                        family='DejaVu Sans')
            else:
                # Standard subtle watermark
                watermark_text = 'NerdX - Advanced ZIMSEC Mathematics'
                ax.text(0.5, margin_y/2, watermark_text, 
                        transform=ax.transAxes,
                        fontsize=max(8, base_font_size - 4),
                        verticalalignment='center',
                        horizontalalignment='center',
                        alpha=0.5,
                        style='italic',
                        color='#718096',
                        family='DejaVu Sans')
            
            # Optimize layout
            plt.tight_layout(pad=0.5)
            
            # Generate unique filename
            unique_id = uuid.uuid4().hex[:8]
            image_path = os.path.join(temp_dir, f"{filename}_{unique_id}.png")
            
            # Save PNG image ONLY - no text fallbacks
            success = False
            try:
                plt.savefig(image_path, 
                           dpi=120,  # Stable DPI
                           bbox_inches='tight', 
                           facecolor='white', 
                           edgecolor='none',
                           format='png',
                           pad_inches=0.1)
                success = True
                logger.info(f"✅ PNG image saved successfully: {image_path}")
            except Exception as save_error:
                logger.error(f"Primary PNG save failed: {save_error}")
                # Alternative save method
                try:
                    fig.savefig(image_path, format='png', dpi=100, facecolor='white')
                    success = True
                    logger.info(f"✅ PNG saved with alternative method: {image_path}")
                except Exception as alt_error:
                    logger.error(f"Alternative PNG save failed: {alt_error}")
                    
            if not success:
                plt.close(fig)
                logger.error("❌ ALL PNG save attempts failed - returning None")
                return None
            
            # Clean up matplotlib resources
            try:
                plt.close(fig)
                plt.clf()
                logger.info("Matplotlib resources cleaned up")
            except Exception as cleanup_error:
                logger.warning(f"Error during matplotlib cleanup: {cleanup_error}")
            
            # Verify and log creation
            try:
                if os.path.exists(image_path):
                    file_size = os.path.getsize(image_path)
                    logger.info(f"✅ Enhanced mathematical image created: {image_path} ({file_size:,} bytes)")
                    return image_path
                else:
                    logger.error("❌ Image file creation failed - file does not exist")
                    return None
            except Exception as verify_error:
                logger.error(f"Error verifying image file: {verify_error}")
                return None
                
        except Exception as plot_error:
            logger.error(f"❌ Plotting error: {plot_error}")
            try:
                plt.close('all')
                plt.clf()
            except:
                pass
            return None  # No text fallbacks - PNG only
        
    except ImportError as e:
        logger.error(f"Missing required libraries for image generation: {e}")
        return None  # No text fallbacks - PNG only
    except Exception as e:
        logger.error(f"Error converting LaTeX to image: {e}")
        import traceback
        logger.error(f"Full traceback: {traceback.format_exc()}")
        return None  # No text fallbacks - PNG only


def create_math_question_image(question_data: Dict, question_num: int, total_questions: int) -> Optional[str]:
    """Create a clean, well-formatted image for a mathematics question with NerdX watermark"""
    try:
        # Clean header with NerdX branding
        question_text = f"📚 NerdX MATHEMATICS QUESTION {question_num}/{total_questions} 📚\n"
        question_text += f"=" * 55 + "\n\n"
        
        # Format the question with proper organization
        question_text += f"PROBLEM:\n"
        question_text += f"{question_data['question']}\n\n"
        
        # Add clear instructions
        question_text += f"INSTRUCTIONS:\n"
        question_text += f"• Show all your working steps clearly\n"
        question_text += f"• Write your final answer clearly\n"
        question_text += f"• Points available: {question_data['points']}\n\n"
        
        question_text += f"=" * 55 + "\n"
        question_text += f"                   🚀 Powered by NerdX Education 🚀"
        
        return latex_to_image(question_text, f"math_question_{question_num}", add_watermark=True)
        
    except Exception as e:
        logger.error(f"Error creating math question image: {e}")
        return None


def create_math_solution_image(question_data: Dict) -> Optional[str]:
    """Create a clean, well-organized solution image with NerdX watermark"""
    try:
        # Clean header with NerdX branding
        solution_text = f"📝 NerdX MATHEMATICS SOLUTION 📝\n"
        solution_text += f"=" * 55 + "\n\n"
        
        # Show original question concisely
        if len(question_data['question']) > 70:
            question_preview = question_data['question'][:70] + "..."
        else:
            question_preview = question_data['question']
            
        solution_text += f"QUESTION:\n{question_preview}\n\n"
        solution_text += f"-" * 35 + "\n\n"
        
        # Detailed solution with proper formatting
        solution_text += f"STEP-BY-STEP SOLUTION:\n\n"
        solution_text += f"{question_data['solution']}\n\n"
        
        solution_text += f"=" * 55 + "\n"
        solution_text += f"POINTS EARNED: {question_data['points']}\n\n"
        solution_text += f"               🚀 Powered by NerdX Education 🚀"
        
        return latex_to_image(solution_text, "math_solution", is_solution=True, add_watermark=True)
        
    except Exception as e:
        logger.error(f"Error creating math solution image: {e}")
        return None


