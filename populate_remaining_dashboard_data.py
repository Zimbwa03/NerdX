#!/usr/bin/env python3
"""
Populate remaining empty dashboard tables with realistic data.
Now that foreign key constraints are fixed, this should work properly.
"""

import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta
import random

# Database connection
DATABASE_URL = "postgresql://postgres.hvlvwvzliqrlmqjbfgoa:Ngonidzashe2003.@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

def populate_remaining_dashboard_data():
    """Populate all remaining empty dashboard tables"""
    try:
        print("Connecting to database...")
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        print("Populating remaining dashboard tables...\n")
        
        # Get existing users for foreign key references
        cursor.execute("SELECT nerdx_id FROM users LIMIT 20;")
        users = [row[0] for row in cursor.fetchall()]
        
        if not users:
            print("❌ No users found in database!")
            return
        
        print(f"Found {len(users)} users for data population")
        
        # 1. Populate user_stats table
        print("\n1. Populating user_stats table...")
        for user_id in users:
            try:
                cursor.execute("""
                    INSERT INTO user_stats (
                        user_id, total_points, streak_count, questions_answered,
                        correct_answers, wrong_answers, credits, last_activity,
                        is_active, created_at
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                    ) ON CONFLICT (user_id) DO NOTHING;
                """, (
                    user_id,
                    random.randint(100, 2000),
                    random.randint(0, 30),
                    random.randint(10, 500),
                    random.randint(8, 450),
                    random.randint(2, 50),
                    random.randint(50, 200),
                    datetime.now() - timedelta(days=random.randint(0, 7)),
                    True,
                    datetime.now() - timedelta(days=random.randint(1, 30))
                ))
            except Exception as e:
                print(f"Error inserting user_stats for {user_id}: {e}")
        
        print("✓ user_stats populated")
        
        # 2. Populate user_engagement_metrics table
        print("\n2. Populating user_engagement_metrics table...")
        for user_id in users:
            for i in range(random.randint(1, 3)):  # 1-3 sessions per user
                try:
                    cursor.execute("""
                        INSERT INTO user_engagement_metrics (
                            user_id, session_date, time_spent_minutes, questions_per_session,
                            subjects_accessed, features_used, session_quality_score
                        ) VALUES (
                            %s, %s, %s, %s, %s, %s, %s
                        );
                    """, (
                        user_id,
                        datetime.now() - timedelta(days=random.randint(0, 30)),
                        random.randint(15, 120),
                        random.randint(5, 25),
                        random.randint(1, 5),
                        random.randint(1, 3),
                        random.uniform(3.0, 5.0)
                    ))
                except Exception as e:
                    print(f"Error inserting user_engagement_metrics for {user_id}: {e}")
        
        print("✓ user_engagement_metrics populated")
        
        # 3. Populate subject_usage_analytics table
        print("\n3. Populating subject_usage_analytics table...")
        subjects = ['Mathematics', 'Combined Science', 'English', 'Physics', 'Chemistry']
        question_types = ['Topical', 'Exam', 'Graphs', 'Comprehension', 'Essay Writing']
        
        for subject in subjects:
            for question_type in question_types:
                try:
                    cursor.execute("""
                        INSERT INTO subject_usage_analytics (
                            subject_name, question_type, usage_count, success_rate,
                            average_time_spent, popular_topics, date_recorded
                        ) VALUES (
                            %s, %s, %s, %s, %s, %s, %s
                        );
                    """, (
                        subject,
                        question_type,
                        random.randint(50, 500),
                        random.uniform(60.0, 95.0),
                        random.randint(2, 15),
                        f"Topic {random.randint(1, 10)}",
                        datetime.now() - timedelta(days=random.randint(0, 30))
                    ))
                except Exception as e:
                    print(f"Error inserting subject_usage_analytics: {e}")
        
        print("✓ subject_usage_analytics populated")
        
        # 4. Populate feature_usage_analytics table
        print("\n4. Populating feature_usage_analytics table...")
        features = ['Question Generation', 'Audio Generation', 'Credit Purchase', 'Progress Tracking']
        
        for feature in features:
            try:
                cursor.execute("""
                    INSERT INTO feature_usage_analytics (
                        feature_name, usage_count, success_rate, average_response_time,
                        user_satisfaction, date_recorded
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s
                    );
                """, (
                    feature,
                    random.randint(100, 1000),
                    random.uniform(85.0, 98.0),
                    random.randint(1, 10),
                    random.uniform(4.0, 5.0),
                    datetime.now() - timedelta(days=random.randint(0, 30))
                ))
            except Exception as e:
                print(f"Error inserting feature_usage_analytics: {e}")
        
        print("✓ feature_usage_analytics populated")
        
        # 5. Populate credit_transactions table
        print("\n5. Populating credit_transactions table...")
        transaction_types = ['usage', 'purchase', 'bonus', 'refund', 'admin_adjustment']
        
        for user_id in users:
            for i in range(random.randint(2, 5)):  # 2-5 transactions per user
                try:
                    transaction_type = random.choice(transaction_types)
                    credits_change = random.randint(1, 50) if transaction_type == 'usage' else random.randint(10, 200)
                    
                    cursor.execute("""
                        INSERT INTO credit_transactions (
                            user_id, transaction_type, credits_change, description,
                            transaction_date, created_at
                        ) VALUES (
                            %s, %s, %s, %s, %s, %s
                        );
                    """, (
                        user_id,
                        transaction_type,
                        credits_change,
                        f"{transaction_type.capitalize()} transaction",
                        datetime.now() - timedelta(days=random.randint(0, 30)),
                        datetime.now() - timedelta(days=random.randint(0, 30))
                    ))
                except Exception as e:
                    print(f"Error inserting credit_transactions for {user_id}: {e}")
        
        print("✓ credit_transactions populated")
        
        # 6. Populate broadcast_logs table
        print("\n6. Populating broadcast_logs table...")
        messages = [
            "Welcome to NerdX! Start your learning journey today.",
            "New study materials available for Mathematics!",
            "Don't forget to check your progress dashboard.",
            "Special offer: 20% off credit packages this week!",
            "Maintenance scheduled for tomorrow at 2 AM."
        ]
        
        for i in range(10):  # 10 broadcast messages
            try:
                cursor.execute("""
                    INSERT INTO broadcast_logs (
                        admin_user, message, target_group, total_recipients,
                        successful_sends, failed_sends, created_at
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s
                    );
                """, (
                    f"admin_{random.randint(1, 3)}",
                    random.choice(messages),
                    random.choice(['all', 'active', 'inactive']),
                    random.randint(50, 200),
                    random.randint(45, 190),
                    random.randint(0, 10),
                    datetime.now() - timedelta(days=random.randint(0, 30))
                ))
            except Exception as e:
                print(f"Error inserting broadcast_logs: {e}")
        
        print("✓ broadcast_logs populated")
        
        # Commit all changes
        conn.commit()
        print("\n✓ All data committed successfully!")
        
        # Verify the population
        print("\n=== VERIFICATION ===")
        tables_to_check = [
            'user_stats', 'user_engagement_metrics', 'subject_usage_analytics',
            'feature_usage_analytics', 'credit_transactions', 'broadcast_logs'
        ]
        
        for table in tables_to_check:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table};")
                count = cursor.fetchone()[0]
                print(f"{table}: {count} records")
            except Exception as e:
                print(f"{table}: ERROR - {e}")
        
        cursor.close()
        conn.close()
        print("\n✓ Database connection closed")
        print("\n🎉 Dashboard data population completed successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()

if __name__ == "__main__":
    populate_remaining_dashboard_data()
