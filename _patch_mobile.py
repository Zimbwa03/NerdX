"""Patch mobile.py to add notification event endpoint"""

NOTIFICATION_CODE = '''
# ============================================================================
# NOTIFICATION EVENT ENDPOINTS
# ============================================================================

@mobile_bp.route('/notifications/event', methods=['POST'])
@require_auth
def create_notification_event():
    """
    Create notifications for platform events (new teacher post, comment, etc.)
    Body:
      event_type: 'new_post' | 'new_comment'
      post_id, post_title, teacher_name, teacher_id, comment_author, comment_content
    """
    try:
        data = request.get_json() or {}
        event_type = data.get('event_type')
        post_id = data.get('post_id', '')
        post_title = (data.get('post_title') or '')[:100]
        teacher_name = data.get('teacher_name', 'A teacher')
        teacher_id = data.get('teacher_id', '')
        comment_author = data.get('comment_author', 'Someone')
        comment_content = (data.get('comment_content') or '')[:80]

        if not event_type:
            return jsonify({'success': False, 'message': 'event_type is required'}), 400

        if event_type == 'new_post':
            title = f"New post from {teacher_name}"
            body = post_title if post_title else f"{teacher_name} shared a new post on the marketplace."
            notif_type = 'update'
            metadata = {'action_url': '/app/marketplace', 'action_label': 'View Post', 'post_id': post_id, 'teacher_id': teacher_id, 'event': 'new_post'}
        elif event_type == 'new_comment':
            title = f"{comment_author} commented on a post"
            body = comment_content if comment_content else f"{comment_author} left a comment."
            notif_type = 'info'
            metadata = {'action_url': '/app/marketplace', 'action_label': 'View Comment', 'post_id': post_id, 'event': 'new_comment'}
        else:
            return jsonify({'success': False, 'message': f'Unknown event_type: {event_type}'}), 400

        notification_data = {
            'title': title,
            'body': body,
            'type': notif_type,
            'audience': 'all' if event_type == 'new_post' else 'targeted',
            'metadata': metadata,
            'status': 'sent',
        }
        notification = make_supabase_request('POST', 'notifications', data=notification_data, use_service_role=True)
        if not notification:
            return jsonify({'success': False, 'message': 'Failed to create notification'}), 500

        notification_id = notification[0]['id'] if isinstance(notification, list) else notification.get('id')
        target_user_ids = []

        if event_type == 'new_post':
            import requests as http_req
            supabase_url = os.getenv('SUPABASE_URL')
            service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
            if supabase_url and service_key:
                page = 1
                while True:
                    resp = http_req.get(
                        f"{supabase_url}/auth/v1/admin/users",
                        headers={"apikey": service_key, "Authorization": f"Bearer {service_key}"},
                        params={"page": page, "per_page": 1000}, timeout=30
                    )
                    if resp.status_code == 200:
                        users = resp.json().get('users', [])
                        target_user_ids.extend([u['id'] for u in users])
                        if len(users) < 1000:
                            break
                        page += 1
                    else:
                        break

        elif event_type == 'new_comment':
            if teacher_id:
                tp = make_supabase_request('GET', 'teacher_profiles', select='user_id', filters={'id': f'eq.{teacher_id}'}, use_service_role=True)
                if tp and len(tp) > 0 and tp[0].get('user_id'):
                    target_user_ids.append(tp[0]['user_id'])
            if post_id:
                comments = make_supabase_request('GET', 'post_comments', select='user_id', filters={'post_id': f'eq.{post_id}'}, use_service_role=True)
                if comments:
                    current_uid = None
                    try:
                        reg = get_user_registration(g.current_user_id)
                        if reg:
                            current_uid = str(reg.get('chat_id') or g.current_user_id)
                    except Exception:
                        pass
                    for c in comments:
                        uid = c.get('user_id')
                        if uid and uid not in target_user_ids and uid != current_uid:
                            target_user_ids.append(uid)

        target_user_ids = list(set(target_user_ids))
        if not target_user_ids:
            return jsonify({'success': True, 'notification_id': notification_id, 'recipients_created': 0}), 200

        total_inserted = 0
        for i in range(0, len(target_user_ids), 1000):
            batch = target_user_ids[i:i + 1000]
            recipients = [{'notification_id': notification_id, 'user_id': uid} for uid in batch]
            result = make_supabase_request('POST', 'notification_recipients', data=recipients, use_service_role=True)
            if result:
                total_inserted += len(result) if isinstance(result, list) else 1

        logger.info(f"Notification event '{event_type}': {total_inserted} recipients")
        return jsonify({'success': True, 'notification_id': notification_id, 'recipients_created': total_inserted}), 200

    except Exception as e:
        logger.error(f"Notification event error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


'''

with open('api/mobile.py', 'r', encoding='utf-8') as f:
    content = f.read()

marker = '# ============================================================================\n# MATH ENDPOINTS\n# ============================================================================'
idx = content.find(marker)
if idx == -1:
    print("ERROR: Could not find MATH ENDPOINTS marker")
else:
    new_content = content[:idx] + NOTIFICATION_CODE + content[idx:]
    with open('api/mobile.py', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"SUCCESS: Inserted notification endpoints before MATH ENDPOINTS at index {idx}")
