
import os

file_path = 'database/external_db.py'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# The problematic part is around line 1508
target = "questions_response.sort(key=lambda x: x.get('question_order', 0))"

if target not in content:
    print("❌ Target string not found!")
    exit(1)

# Split the content
parts = content.split(target)
pre_target = parts[0]
post_target = parts[1]

# Construct the correct ending
# We need to close the function, add the exception handler, and then define get_db_connection
correct_ending = """        questions_response.sort(key=lambda x: x.get('question_order', 0))
        
        return questions_response
        
    except Exception as e:
        logger.error(f"Error getting questions for passage {passage_id}: {e}")
        return []

def get_db_connection():
    \"\"\"
    Get direct database connection using psycopg2
    Required for DKT service which performs complex transactions
    \"\"\"
    try:
        import psycopg2
        import os
        database_url = os.getenv('DATABASE_URL')
        
        if not database_url:
            logger.error("DATABASE_URL environment variable not set - cannot establish direct connection")
            return None
            
        conn = psycopg2.connect(database_url)
        conn.autocommit = True
        return conn
    except ImportError:
        logger.error("psycopg2 not installed - cannot establish direct connection")
        return None
    except Exception as e:
        logger.error(f"Error connecting to database: {e}")
        return None
"""

# We need to be careful about what was in post_target.
# It likely contained the malformed try/except block.
# We should probably just discard the immediate next lines if they look like the bad code.

# Let's just look for the end of the file or the next function.
# Since get_db_connection was at the end, we can probably just truncate after the target and append the correct ending.

new_content = pre_target + correct_ending

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ Fixed external_db.py")
