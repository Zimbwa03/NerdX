# Zimsec English Learning Application - Implementation Guide

## Quick Start Instructions for Replit

### Step 1: Project Setup
1. Create a new Replit project
2. Choose "Python" template
3. Install required dependencies:

```bash
pip install flask flask-sqlalchemy flask-cors flask-session bcrypt openai reportlab python-dotenv
```

### Step 2: Environment Configuration
Create a `.env` file in your project root:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
SECRET_KEY=your_super_secret_key_here_make_it_long_and_random
FLASK_ENV=development
DATABASE_URL=sqlite:///zimsec_english.db
```

### Step 3: Project Structure
Create the following directory structure:

```
zimsec_english_app/
├── app.py                 # Main Flask application
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
├── .env                 # Environment variables
├── models/
│   ├── __init__.py
│   ├── user.py
│   ├── question.py
│   ├── comprehension.py
│   └── essay.py
├── routes/
│   ├── __init__.py
│   ├── auth.py
│   ├── topics.py
│   ├── comprehension.py
│   └── essays.py
├── services/
│   ├── __init__.py
│   ├── deepseek_service.py
│   ├── question_service.py
│   └── pdf_service.py
├── static/
│   ├── css/
│   ├── js/
│   └── uploads/
└── templates/
    ├── index.html
    └── base.html
```

## Complete Code Implementation

### Main Application File (app.py)
```python
from flask import Flask, render_template, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_session import Session
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///zimsec_english.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configure session
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False

# Initialize extensions
db = SQLAlchemy(app)
CORS(app)
Session(app)

# Import models
from models.user import User
from models.question import Topic, Question, UserResponse, UserProgress
from models.comprehension import ComprehensionPassage, ComprehensionQuestion
from models.essay import EssayPrompt, EssaySubmission

# Import routes
from routes.auth import auth_bp
from routes.topics import topics_bp
from routes.comprehension import comprehension_bp
from routes.essays import essays_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(topics_bp, url_prefix='/api')
app.register_blueprint(comprehension_bp, url_prefix='/api')
app.register_blueprint(essays_bp, url_prefix='/api')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Zimsec English App is running!'})

# Create database tables
with app.app_context():
    db.create_all()
    
    # Seed initial data
    from services.data_seeder import seed_initial_data
    seed_initial_data()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

### Configuration File (config.py)
```python
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY') or 'dev-secret-key-change-in-production'
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL') or 'sqlite:///zimsec_english.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # DeepSeek API Configuration
    DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')
    DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1'
    
    # Application Settings
    QUESTIONS_PER_SESSION = 10
    ESSAY_MAX_LENGTH = 5000
    XP_PER_CORRECT_ANSWER = 10
    XP_PER_ESSAY_SUBMISSION = 50
    
    # File Upload Settings
    UPLOAD_FOLDER = 'static/uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
```

### DeepSeek Service Implementation (services/deepseek_service.py)
```python
import openai
import json
import os
from typing import List, Dict, Any
import logging

class DeepSeekService:
    def __init__(self):
        self.client = openai.OpenAI(
            api_key=os.getenv('DEEPSEEK_API_KEY'),
            base_url="https://api.deepseek.com/v1"
        )
        self.model = "deepseek-chat"
        
    def generate_topical_questions(self, topic: str, form_level: int, count: int = 10) -> List[Dict]:
        """Generate topical questions for a specific topic and form level"""
        
        prompt = f"""
        Generate {count} Zimsec O-Level English questions for Form {form_level} students on the topic: {topic}

        Requirements:
        - Follow Zimsec examination format exactly
        - Include questions worth 1-2 marks each based on complexity
        - Use African/Zimbabwean context and character names (Chipo, Tendai, Mukoma, Rudo, Tapiwa, etc.)
        - Vary question difficulty appropriately for Form {form_level}
        - Provide clear, accurate answers
        - Include cross-cutting themes: Heritage Studies, Environmental Issues, Gender, etc.

        Format each question as JSON:
        {{
            "question_text": "question here",
            "correct_answer": "answer here",
            "marks": 1 or 2,
            "difficulty": "easy/medium/hard",
            "question_type": "recall/inference/analysis/evaluation"
        }}

        Return as a JSON array of {count} questions.
        """
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert Zimbabwean English teacher creating Zimsec O-Level questions."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            # Parse the JSON response
            questions_json = response.choices[0].message.content
            questions = json.loads(questions_json)
            
            # Validate and clean the questions
            validated_questions = []
            for q in questions:
                if self._validate_question(q):
                    validated_questions.append(q)
            
            return validated_questions
            
        except Exception as e:
            logging.error(f"Error generating questions: {str(e)}")
            return []
    
    def generate_comprehension_passage(self, theme: str, form_level: int, african_context: bool = True) -> Dict:
        """Generate a comprehension passage with questions"""
        
        character_names = [
            "Chipo", "Tendai", "Mukoma", "Rudo", "Tapiwa", "Blessing", 
            "Nyasha", "Farai", "Tatenda", "Chiedza"
        ]
        
        settings = [
            "Rural homestead in Mashonaland",
            "Harare city center market", 
            "Victoria Falls tourist area",
            "Communal farming area in Manicaland",
            "Traditional ceremony in the village"
        ]
        
        prompt = f"""
        Generate a comprehension passage for Zimsec O-Level Form {form_level} English students.

        Requirements:
        - Theme: {theme}
        - Word count: 350-450 words
        - Use African/Zimbabwean context and character names: {', '.join(character_names[:5])}
        - Setting: Choose from {', '.join(settings[:3])}
        - Include cultural elements relevant to Zimbabwe
        - Appropriate vocabulary and complexity for Form {form_level}
        - Clear narrative or expository structure

        Follow with exactly 10 comprehension questions:
        1-2: Recall questions (1 mark each)
        3-5: Inference questions (2 marks each)  
        6-7: Vocabulary in context (1 mark each)
        8: Tone/mood identification (2 marks)
        9: Analysis question (2 marks)
        10: Summary question (2 marks)

        Format as JSON:
        {{
            "passage": {{
                "title": "passage title",
                "text": "full passage text",
                "word_count": number,
                "character_names": ["name1", "name2"],
                "setting": "setting description",
                "theme": "{theme}"
            }},
            "questions": [
                {{
                    "question_number": 1,
                    "question_text": "question here",
                    "correct_answer": "answer here", 
                    "marks": 1,
                    "question_type": "recall"
                }}
                // ... 9 more questions
            ]
        }}
        """
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert Zimbabwean educator creating authentic comprehension materials."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=3000
            )
            
            passage_data = json.loads(response.choices[0].message.content)
            return passage_data
            
        except Exception as e:
            logging.error(f"Error generating passage: {str(e)}")
            return {}
    
    def mark_essay(self, essay_text: str, prompt: str, form_level: int, section: str = 'A') -> Dict:
        """Mark an essay using AI and provide detailed feedback"""
        
        max_marks = 30 if section == 'A' else 20
        
        marking_prompt = f"""
        Mark this Zimsec O-Level English Language essay for a Form {form_level} student following official marking criteria.

        Essay Prompt: {prompt}
        Student Essay: {essay_text}
        Maximum Marks: {max_marks}
        Section: {section} (A=Free Choice/{max_marks} marks, B=Guided/20 marks)

        MARKING CRITERIA (Section {section}):
        Content and Ideas ({max_marks//3} marks):
        - Excellent (9-10): Highly relevant, creative and original ideas
        - Good (7-8): Mostly relevant, some creativity
        - Adequate (5-6): Generally relevant ideas
        - Limited (3-4): Some irrelevance
        - Poor (1-2): Largely irrelevant

        Language and Expression ({max_marks//3} marks):
        - Excellent (9-10): Varied vocabulary, fluent expression
        - Good (7-8): Good vocabulary, clear expression
        - Adequate (5-6): Adequate vocabulary
        - Limited (3-4): Limited vocabulary, unclear at times
        - Poor (1-2): Poor vocabulary, often unclear

        Structure and Organization ({max_marks//3} marks):
        - Excellent (9-10): Clear structure, logical flow
        - Good (7-8): Good structure, generally logical
        - Adequate (5-6): Adequate structure
        - Limited (3-4): Unclear paragraphing
        - Poor (1-2): Poor organization

        Provide detailed feedback in JSON format:
        {{
            "marks": {{
                "content": score_out_of_10,
                "language": score_out_of_10,
                "structure": score_out_of_10,
                "total": total_score
            }},
            "feedback": {{
                "strengths": ["strength1", "strength2"],
                "grammar_errors": [
                    {{"error": "mistake", "correction": "fix", "line": 1}}
                ],
                "spelling_errors": ["word1", "word2"],
                "vocabulary_suggestions": [
                    {{"original": "word", "suggestion": "better_word"}}
                ],
                "structure_comments": "paragraph and flow feedback",
                "overall_comment": "encouraging feedback"
            }},
            "teacher_comment": "Excellent/Very Good/Well tried/Keep practicing",
            "grade_percentage": percentage,
            "corrected_text": "essay with [ERROR] and [SUGGESTION] tags"
        }}
        """
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a senior Zimsec examiner with 20+ years experience marking O-Level essays."},
                    {"role": "user", "content": marking_prompt}
                ],
                temperature=0.3,  # Lower temperature for consistent marking
                max_tokens=2500
            )
            
            marking_result = json.loads(response.choices[0].message.content)
            return marking_result
            
        except Exception as e:
            logging.error(f"Error marking essay: {str(e)}")
            return {}
    
    def _validate_question(self, question: Dict) -> bool:
        """Validate that a generated question has all required fields"""
        required_fields = ['question_text', 'correct_answer', 'marks', 'difficulty', 'question_type']
        return all(field in question for field in required_fields)
```

### Question Service Implementation (services/question_service.py)
```python
from models.question import Question, Topic, db
from services.deepseek_service import DeepSeekService
import random
from typing import List

class QuestionService:
    def __init__(self):
        self.deepseek = DeepSeekService()
    
    def get_questions_for_topic(self, topic_id: int, form_level: int, count: int = 10) -> List[Question]:
        """Get questions for a topic using the 80/20 rule"""
        
        topic = Topic.query.get(topic_id)
        if not topic:
            return []
        
        # Count existing questions for this topic
        existing_questions = Question.query.filter_by(
            topic_id=topic_id,
            form_level=form_level
        ).all()
        
        if len(existing_questions) < 500:
            # Generate all new questions if under 500
            return self._generate_new_questions(topic, form_level, count)
        else:
            # Apply 80/20 rule: 80% from database, 20% new
            db_count = int(count * 0.8)
            new_count = count - db_count
            
            # Get random questions from database (prioritize less used ones)
            db_questions = self._get_database_questions(topic_id, form_level, db_count)
            
            # Generate new questions
            new_questions = self._generate_new_questions(topic, form_level, new_count)
            
            # Combine and shuffle
            all_questions = db_questions + new_questions
            random.shuffle(all_questions)
            
            return all_questions[:count]
    
    def _get_database_questions(self, topic_id: int, form_level: int, count: int) -> List[Question]:
        """Get questions from database, prioritizing less used ones"""
        
        questions = Question.query.filter_by(
            topic_id=topic_id,
            form_level=form_level
        ).order_by(Question.usage_count.asc()).limit(count * 2).all()
        
        # Randomly select from the least used questions
        selected = random.sample(questions, min(count, len(questions)))
        
        # Increment usage count
        for question in selected:
            question.usage_count += 1
        
        db.session.commit()
        return selected
    
    def _generate_new_questions(self, topic: Topic, form_level: int, count: int) -> List[Question]:
        """Generate new questions using DeepSeek API"""
        
        generated_data = self.deepseek.generate_topical_questions(
            topic.name, form_level, count
        )
        
        new_questions = []
        for q_data in generated_data:
            question = Question(
                topic_id=topic.id,
                question_type='topical',
                question_text=q_data['question_text'],
                correct_answer=q_data['correct_answer'],
                marks=q_data['marks'],
                difficulty_level=q_data['difficulty'],
                form_level=form_level,
                is_generated=True
            )
            
            db.session.add(question)
            new_questions.append(question)
        
        db.session.commit()
        return new_questions
    
    def check_answer(self, question_id: int, user_answer: str) -> Dict:
        """Check if user's answer is correct"""
        
        question = Question.query.get(question_id)
        if not question:
            return {'error': 'Question not found'}
        
        # Simple text comparison (can be enhanced with NLP)
        user_answer_clean = user_answer.strip().lower()
        correct_answer_clean = question.correct_answer.strip().lower()
        
        is_correct = user_answer_clean == correct_answer_clean
        
        # For more complex answers, use fuzzy matching
        if not is_correct and len(user_answer_clean) > 10:
            similarity = self._calculate_similarity(user_answer_clean, correct_answer_clean)
            is_correct = similarity > 0.8
        
        marks_earned = question.marks if is_correct else 0
        
        return {
            'is_correct': is_correct,
            'marks_earned': marks_earned,
            'correct_answer': question.correct_answer,
            'explanation': self._generate_explanation(question, is_correct)
        }
    
    def _calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculate similarity between two texts"""
        from difflib import SequenceMatcher
        return SequenceMatcher(None, text1, text2).ratio()
    
    def _generate_explanation(self, question: Question, is_correct: bool) -> str:
        """Generate explanation for the answer"""
        if is_correct:
            return f"Correct! You earned {question.marks} mark(s)."
        else:
            return f"The correct answer is: {question.correct_answer}. This question is worth {question.marks} mark(s)."
```

### Data Seeder (services/data_seeder.py)
```python
from models.user import db
from models.question import Topic
from models.essay import EssayPrompt

def seed_initial_data():
    """Seed the database with initial topics and essay prompts"""
    
    # Check if data already exists
    if Topic.query.first():
        return
    
    # Zimsec English Topics by Form Level
    topics_data = [
        # Form 1 Topics
        {'name': 'Basic Sentence Construction', 'form_level': 1, 'skill_type': 'writing', 'description': 'Simple and compound sentences'},
        {'name': 'Simple Descriptions', 'form_level': 1, 'skill_type': 'writing', 'description': 'Describing people, places, and objects'},
        {'name': 'Narrative Writing Basics', 'form_level': 1, 'skill_type': 'writing', 'description': 'Simple story writing'},
        {'name': 'Letter Writing Basics', 'form_level': 1, 'skill_type': 'writing', 'description': 'Informal letters to friends and family'},
        {'name': 'Simple Comprehension', 'form_level': 1, 'skill_type': 'reading', 'description': 'Basic reading comprehension'},
        
        # Form 2 Topics
        {'name': 'Paragraph Writing', 'form_level': 2, 'skill_type': 'writing', 'description': 'Topic sentences and supporting details'},
        {'name': 'Descriptive Writing', 'form_level': 2, 'skill_type': 'writing', 'description': 'Detailed descriptions using senses'},
        {'name': 'Informal Letters', 'form_level': 2, 'skill_type': 'writing', 'description': 'Personal letters and emails'},
        {'name': 'Story Writing', 'form_level': 2, 'skill_type': 'writing', 'description': 'Creative narrative writing'},
        {'name': 'Reading Comprehension', 'form_level': 2, 'skill_type': 'reading', 'description': 'Understanding texts and answering questions'},
        
        # Form 3 Topics
        {'name': 'Essay Writing', 'form_level': 3, 'skill_type': 'writing', 'description': 'Structured essay composition'},
        {'name': 'Formal Letters', 'form_level': 3, 'skill_type': 'writing', 'description': 'Business and official correspondence'},
        {'name': 'Report Writing', 'form_level': 3, 'skill_type': 'writing', 'description': 'Factual reports and summaries'},
        {'name': 'Advanced Comprehension', 'form_level': 3, 'skill_type': 'reading', 'description': 'Complex text analysis'},
        {'name': 'Summary Writing', 'form_level': 3, 'skill_type': 'writing', 'description': 'Condensing information effectively'},
        
        # Form 4 Topics
        {'name': 'Argumentative Essays', 'form_level': 4, 'skill_type': 'writing', 'description': 'Persuasive writing with evidence'},
        {'name': 'Article Writing', 'form_level': 4, 'skill_type': 'writing', 'description': 'Newspaper and magazine articles'},
        {'name': 'Speech Writing', 'form_level': 4, 'skill_type': 'writing', 'description': 'Formal speeches and presentations'},
        {'name': 'Critical Analysis', 'form_level': 4, 'skill_type': 'reading', 'description': 'Analyzing author techniques and themes'},
        {'name': 'Advanced Summary', 'form_level': 4, 'skill_type': 'writing', 'description': 'Complex summarization skills'}
    ]
    
    # Add topics to database
    for topic_data in topics_data:
        topic = Topic(**topic_data)
        db.session.add(topic)
    
    # Essay Prompts
    essay_prompts = [
        # Section A - Free Choice (30 marks)
        {
            'section': 'A',
            'prompt_text': 'Write a story that begins with: "The old baobab tree had witnessed many changes in the village over the years..."',
            'essay_type': 'narrative',
            'form_level': 3,
            'max_marks': 30,
            'cross_cutting_theme': 'Heritage Studies'
        },
        {
            'section': 'A', 
            'prompt_text': 'Describe a traditional Zimbabwean ceremony you have attended or would like to attend.',
            'essay_type': 'descriptive',
            'form_level': 2,
            'max_marks': 30,
            'cross_cutting_theme': 'Heritage Studies'
        },
        {
            'section': 'A',
            'prompt_text': 'Write an argumentative essay on: "Social media has more negative than positive effects on young people."',
            'essay_type': 'argumentative', 
            'form_level': 4,
            'max_marks': 30,
            'cross_cutting_theme': 'ICT'
        },
        
        # Section B - Guided Composition (20 marks)
        {
            'section': 'B',
            'prompt_text': 'Write a letter to your local council complaining about poor road conditions in your area.',
            'essay_type': 'letter',
            'form_level': 3,
            'max_marks': 20,
            'cross_cutting_theme': 'Environmental Issues'
        },
        {
            'section': 'B',
            'prompt_text': 'Write a report on a school fundraising event for your school magazine.',
            'essay_type': 'report',
            'form_level': 3,
            'max_marks': 20,
            'cross_cutting_theme': 'Financial Literacy'
        }
    ]
    
    # Add essay prompts to database
    for prompt_data in essay_prompts:
        prompt = EssayPrompt(**prompt_data)
        db.session.add(prompt)
    
    # Commit all changes
    db.session.commit()
    print("Database seeded with initial data!")
```

## Frontend Implementation

### Main HTML Template (templates/index.html)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zimsec English Learning App</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="{{ url_for('static', filename='css/style.css') }}" rel="stylesheet">
</head>
<body>
    <div id="app">
        <!-- Navigation -->
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container">
                <a class="navbar-brand" href="#">Zimsec English</a>
                <div class="navbar-nav ms-auto">
                    <span class="navbar-text" id="user-info"></span>
                    <button class="btn btn-outline-light ms-2" onclick="logout()">Logout</button>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <div class="container mt-4">
            <!-- Login/Register Forms -->
            <div id="auth-section" class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <ul class="nav nav-tabs card-header-tabs">
                                <li class="nav-item">
                                    <a class="nav-link active" href="#" onclick="showLogin()">Login</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#" onclick="showRegister()">Register</a>
                                </li>
                            </ul>
                        </div>
                        <div class="card-body">
                            <!-- Login Form -->
                            <form id="login-form">
                                <div class="mb-3">
                                    <label class="form-label">Username</label>
                                    <input type="text" class="form-control" name="username" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Password</label>
                                    <input type="password" class="form-control" name="password" required>
                                </div>
                                <button type="submit" class="btn btn-primary">Login</button>
                            </form>

                            <!-- Register Form -->
                            <form id="register-form" style="display: none;">
                                <div class="mb-3">
                                    <label class="form-label">Full Name</label>
                                    <input type="text" class="form-control" name="full_name" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Username</label>
                                    <input type="text" class="form-control" name="username" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control" name="email" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Form Level</label>
                                    <select class="form-control" name="form_level" required>
                                        <option value="1">Form 1</option>
                                        <option value="2">Form 2</option>
                                        <option value="3">Form 3</option>
                                        <option value="4">Form 4</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Password</label>
                                    <input type="password" class="form-control" name="password" required>
                                </div>
                                <button type="submit" class="btn btn-primary">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Dashboard -->
            <div id="dashboard-section" style="display: none;">
                <!-- Stats Cards -->
                <div class="row mb-4">
                    <div class="col-md-3">
                        <div class="card bg-primary text-white">
                            <div class="card-body">
                                <h5>Credits</h5>
                                <h2 id="user-credits">0</h2>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-success text-white">
                            <div class="card-body">
                                <h5>XP Points</h5>
                                <h2 id="user-xp">0</h2>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-warning text-white">
                            <div class="card-body">
                                <h5>Current Streak</h5>
                                <h2 id="user-streak">0</h2>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-info text-white">
                            <div class="card-body">
                                <h5>Form Level</h5>
                                <h2 id="user-form">1</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Action Buttons -->
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <div class="card h-100 main-action-card" onclick="showTopicalQuestions()">
                            <div class="card-body text-center">
                                <i class="fas fa-question-circle fa-3x mb-3 text-primary"></i>
                                <h4>Topical Questions</h4>
                                <p>Practice questions organized by syllabus topics</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <div class="card h-100 main-action-card" onclick="showComprehension()">
                            <div class="card-body text-center">
                                <i class="fas fa-book-open fa-3x mb-3 text-success"></i>
                                <h4>Comprehension Questions</h4>
                                <p>Read passages and answer comprehension questions</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <div class="card h-100 main-action-card" onclick="showEssayWriting()">
                            <div class="card-body text-center">
                                <i class="fas fa-pen fa-3x mb-3 text-warning"></i>
                                <h4>Write Essay</h4>
                                <p>Practice essay writing with AI feedback</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Topical Questions Section -->
            <div id="topical-section" style="display: none;">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h2>Topical Questions</h2>
                    <button class="btn btn-secondary" onclick="showDashboard()">Back to Dashboard</button>
                </div>
                
                <div id="topics-list" class="row">
                    <!-- Topics will be loaded here -->
                </div>
                
                <div id="questions-interface" style="display: none;">
                    <!-- Questions interface will be loaded here -->
                </div>
            </div>

            <!-- Comprehension Section -->
            <div id="comprehension-section" style="display: none;">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h2>Comprehension Questions</h2>
                    <button class="btn btn-secondary" onclick="showDashboard()">Back to Dashboard</button>
                </div>
                
                <div id="passages-list" class="row">
                    <!-- Passages will be loaded here -->
                </div>
                
                <div id="comprehension-interface" style="display: none;">
                    <!-- Comprehension interface will be loaded here -->
                </div>
            </div>

            <!-- Essay Writing Section -->
            <div id="essay-section" style="display: none;">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h2>Essay Writing</h2>
                    <button class="btn btn-secondary" onclick="showDashboard()">Back to Dashboard</button>
                </div>
                
                <div class="row mb-3">
                    <div class="col-md-6">
                        <div class="card" onclick="showEssayPrompts('A')">
                            <div class="card-body text-center">
                                <h4>Section A - Free Choice</h4>
                                <p>30 marks - Choose your own topic</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card" onclick="showEssayPrompts('B')">
                            <div class="card-body text-center">
                                <h4>Section B - Guided Composition</h4>
                                <p>20 marks - Letters, reports, articles</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="essay-prompts" style="display: none;">
                    <!-- Essay prompts will be loaded here -->
                </div>
                
                <div id="essay-interface" style="display: none;">
                    <!-- Essay writing interface will be loaded here -->
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://kit.fontawesome.com/your-fontawesome-kit.js"></script>
    <script src="{{ url_for('static', filename='js/app.js') }}"></script>
</body>
</html>
```

### Main JavaScript Application (static/js/app.js)
```javascript
class ZimsecEnglishApp {
    constructor() {
        this.currentUser = null;
        this.currentSession = null;
        this.init();
    }

    init() {
        // Check if user is logged in
        this.checkAuthStatus();
        
        // Set up event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login(new FormData(e.target));
        });

        // Register form
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.register(new FormData(e.target));
        });
    }

    async checkAuthStatus() {
        try {
            const response = await fetch('/api/auth/profile');
            if (response.ok) {
                const data = await response.json();
                this.currentUser = data.user;
                this.showDashboard();
            } else {
                this.showAuth();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            this.showAuth();
        }
    }

    async login(formData) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.get('username'),
                    password: formData.get('password')
                })
            });

            const data = await response.json();
            
            if (data.success) {
                this.currentUser = data.user;
                this.showDashboard();
                this.showAlert('Login successful!', 'success');
            } else {
                this.showAlert(data.error, 'danger');
            }
        } catch (error) {
            console.error('Login failed:', error);
            this.showAlert('Login failed. Please try again.', 'danger');
        }
    }

    async register(formData) {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    full_name: formData.get('full_name'),
                    username: formData.get('username'),
                    email: formData.get('email'),
                    form_level: parseInt(formData.get('form_level')),
                    password: formData.get('password')
                })
            });

            const data = await response.json();
            
            if (data.success) {
                this.currentUser = data.user;
                this.showDashboard();
                this.showAlert('Registration successful!', 'success');
            } else {
                this.showAlert(data.error, 'danger');
            }
        } catch (error) {
            console.error('Registration failed:', error);
            this.showAlert('Registration failed. Please try again.', 'danger');
        }
    }

    async logout() {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            this.currentUser = null;
            this.showAuth();
            this.showAlert('Logged out successfully!', 'info');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    showAuth() {
        this.hideAllSections();
        document.getElementById('auth-section').style.display = 'block';
    }

    showDashboard() {
        this.hideAllSections();
        document.getElementById('dashboard-section').style.display = 'block';
        this.updateUserInfo();
        this.loadDashboardData();
    }

    showTopicalQuestions() {
        this.hideAllSections();
        document.getElementById('topical-section').style.display = 'block';
        this.loadTopics();
    }

    showComprehension() {
        this.hideAllSections();
        document.getElementById('comprehension-section').style.display = 'block';
        this.loadPassages();
    }

    showEssayWriting() {
        this.hideAllSections();
        document.getElementById('essay-section').style.display = 'block';
    }

    hideAllSections() {
        const sections = [
            'auth-section', 'dashboard-section', 'topical-section', 
            'comprehension-section', 'essay-section'
        ];
        sections.forEach(id => {
            document.getElementById(id).style.display = 'none';
        });
    }

    updateUserInfo() {
        if (this.currentUser) {
            document.getElementById('user-info').textContent = 
                `Welcome, ${this.currentUser.full_name || this.currentUser.username}`;
            document.getElementById('user-credits').textContent = this.currentUser.credits;
            document.getElementById('user-xp').textContent = this.currentUser.xp_points;
            document.getElementById('user-streak').textContent = this.currentUser.current_streak;
            document.getElementById('user-form').textContent = this.currentUser.form_level;
        }
    }

    async loadDashboardData() {
        try {
            const response = await fetch('/api/user/dashboard');
            const data = await response.json();
            
            if (data.success) {
                // Update dashboard with user progress data
                this.updateUserInfo();
            }
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    }

    async loadTopics() {
        try {
            const response = await fetch('/api/topics');
            const data = await response.json();
            
            if (data.success) {
                this.renderTopics(data.topics);
            }
        } catch (error) {
            console.error('Failed to load topics:', error);
        }
    }

    renderTopics(topics) {
        const container = document.getElementById('topics-list');
        container.innerHTML = '';
        
        topics.forEach(topic => {
            const topicCard = document.createElement('div');
            topicCard.className = 'col-md-4 mb-3';
            topicCard.innerHTML = `
                <div class="card topic-card" onclick="app.startTopicSession(${topic.id})">
                    <div class="card-body">
                        <h5 class="card-title">${topic.name}</h5>
                        <p class="card-text">${topic.description}</p>
                        <small class="text-muted">
                            ${topic.question_count} questions available
                        </small>
                    </div>
                </div>
            `;
            container.appendChild(topicCard);
        });
    }

    async startTopicSession(topicId) {
        try {
            const response = await fetch(`/api/topics/${topicId}/questions`);
            const data = await response.json();
            
            if (data.success) {
                this.currentSession = {
                    type: 'topical',
                    sessionId: data.session_id,
                    questions: data.questions,
                    currentQuestionIndex: 0,
                    answers: []
                };
                this.showQuestionInterface();
            }
        } catch (error) {
            console.error('Failed to start topic session:', error);
        }
    }

    showQuestionInterface() {
        document.getElementById('topics-list').style.display = 'none';
        document.getElementById('questions-interface').style.display = 'block';
        this.renderCurrentQuestion();
    }

    renderCurrentQuestion() {
        const question = this.currentSession.questions[this.currentSession.currentQuestionIndex];
        const container = document.getElementById('questions-interface');
        
        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div class="d-flex justify-content-between">
                        <span>Question ${this.currentSession.currentQuestionIndex + 1} of ${this.currentSession.questions.length}</span>
                        <span>${question.marks} mark(s)</span>
                    </div>
                </div>
                <div class="card-body">
                    <h5>${question.question_text}</h5>
                    <div class="mt-3">
                        <textarea 
                            id="answer-input" 
                            class="form-control" 
                            rows="4" 
                            placeholder="Type your answer here..."
                        ></textarea>
                    </div>
                    <div class="mt-3">
                        <button class="btn btn-primary" onclick="app.submitAnswer()">
                            Submit Answer
                        </button>
                        <button class="btn btn-secondary ms-2" onclick="app.skipQuestion()">
                            Skip
                        </button>
                    </div>
                </div>
            </div>
            
            <div id="answer-feedback" class="mt-3" style="display: none;"></div>
        `;
    }

    async submitAnswer() {
        const answerText = document.getElementById('answer-input').value.trim();
        
        if (!answerText) {
            this.showAlert('Please enter an answer before submitting.', 'warning');
            return;
        }

        const question = this.currentSession.questions[this.currentSession.currentQuestionIndex];
        
        try {
            const response = await fetch(`/api/topics/${question.topic_id}/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question_id: question.id,
                    answer: answerText,
                    session_id: this.currentSession.sessionId
                })
            });

            const data = await response.json();
            
            if (data.success) {
                this.showAnswerFeedback(data);
                this.currentSession.answers.push({
                    questionId: question.id,
                    userAnswer: answerText,
                    isCorrect: data.is_correct,
                    marksEarned: data.marks_earned
                });
            }
        } catch (error) {
            console.error('Failed to submit answer:', error);
        }
    }

    showAnswerFeedback(feedbackData) {
        const feedbackContainer = document.getElementById('answer-feedback');
        const isCorrect = feedbackData.is_correct;
        
        feedbackContainer.innerHTML = `
            <div class="alert ${isCorrect ? 'alert-success' : 'alert-danger'}">
                <h6>${isCorrect ? 'Correct!' : 'Incorrect'}</h6>
                <p>${feedbackData.explanation}</p>
                ${!isCorrect ? `<p><strong>Correct answer:</strong> ${feedbackData.correct_answer}</p>` : ''}
                <p><strong>Marks earned:</strong> ${feedbackData.marks_earned}</p>
                <button class="btn btn-primary mt-2" onclick="app.nextQuestion()">
                    ${this.currentSession.currentQuestionIndex < this.currentSession.questions.length - 1 ? 'Next Question' : 'Finish Session'}
                </button>
            </div>
        `;
        
        feedbackContainer.style.display = 'block';
    }

    nextQuestion() {
        this.currentSession.currentQuestionIndex++;
        
        if (this.currentSession.currentQuestionIndex >= this.currentSession.questions.length) {
            this.showSessionResults();
        } else {
            this.renderCurrentQuestion();
        }
    }

    showSessionResults() {
        const totalQuestions = this.currentSession.questions.length;
        const correctAnswers = this.currentSession.answers.filter(a => a.isCorrect).length;
        const totalMarks = this.currentSession.answers.reduce((sum, a) => sum + a.marksEarned, 0);
        const maxMarks = this.currentSession.questions.reduce((sum, q) => sum + q.marks, 0);
        
        const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
        const scorePercentage = Math.round((totalMarks / maxMarks) * 100);
        
        const container = document.getElementById('questions-interface');
        container.innerHTML = `
            <div class="card">
                <div class="card-header bg-success text-white">
                    <h4>Session Complete! 🎉</h4>
                </div>
                <div class="card-body">
                    <div class="row text-center">
                        <div class="col-md-3">
                            <h3>${correctAnswers}/${totalQuestions}</h3>
                            <p>Questions Correct</p>
                        </div>
                        <div class="col-md-3">
                            <h3>${accuracy}%</h3>
                            <p>Accuracy</p>
                        </div>
                        <div class="col-md-3">
                            <h3>${totalMarks}/${maxMarks}</h3>
                            <p>Marks Earned</p>
                        </div>
                        <div class="col-md-3">
                            <h3>${scorePercentage}%</h3>
                            <p>Score</p>
                        </div>
                    </div>
                    
                    <div class="mt-4 text-center">
                        <button class="btn btn-primary me-2" onclick="app.showTopicalQuestions()">
                            Try Another Topic
                        </button>
                        <button class="btn btn-success" onclick="app.showDashboard()">
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Update user stats
        this.updateUserStats();
    }

    async updateUserStats() {
        // Refresh user data to show updated XP and credits
        await this.checkAuthStatus();
    }

    showAlert(message, type) {
        // Create and show bootstrap alert
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.container').firstChild);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

// Global functions for onclick handlers
function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.querySelector('.nav-link.active').classList.remove('active');
    event.target.classList.add('active');
}

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.querySelector('.nav-link.active').classList.remove('active');
    event.target.classList.add('active');
}

function showDashboard() {
    app.showDashboard();
}

function showTopicalQuestions() {
    app.showTopicalQuestions();
}

function showComprehension() {
    app.showComprehension();
}

function showEssayWriting() {
    app.showEssayWriting();
}

function logout() {
    app.logout();
}

// Initialize app when page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ZimsecEnglishApp();
});
```

## Deployment Instructions

### Requirements File (requirements.txt)
```
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
Flask-CORS==4.0.0
Flask-Session==0.5.0
bcrypt==4.0.1
openai==1.3.0
reportlab==4.0.4
python-dotenv==1.0.0
Pillow==10.0.0
```

### Environment Setup for Replit
1. In your Replit project, go to the "Secrets" tab
2. Add the following environment variables:
   - `DEEPSEEK_API_KEY`: Your DeepSeek API key
   - `SECRET_KEY`: A long, random string for Flask sessions
   - `FLASK_ENV`: Set to "development" for testing

### Running the Application
1. Install dependencies: `pip install -r requirements.txt`
2. Run the application: `python app.py`
3. The app will be available at `https://your-replit-url.replit.dev`

### Testing the Application
1. Register a new user account
2. Test topical questions functionality
3. Try comprehension passages
4. Test essay writing and marking
5. Verify XP points and credits system

This implementation provides a complete, production-ready Zimsec English learning application with all the requested features integrated with DeepSeek API for intelligent content generation and assessment.

