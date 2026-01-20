#!/usr/bin/env python3
"""
Test script to verify all audio and video URLs are accessible.
This performs HEAD requests to check if media files can be streamed.
"""
import os
import re
import json
import time
import base64
from datetime import datetime
from urllib.parse import urlparse, unquote

# Try to import requests
try:
    import requests
except ImportError:
    print("Installing requests...")
    import subprocess
    subprocess.check_call(['pip', 'install', 'requests'])
    import requests

# Notes files to check
NOTES_FILES = [
    'NerdXApp/src/data/aLevelPhysics/notes.ts',
    'NerdXApp/src/data/aLevelBiology/notes.ts',
    'NerdXApp/src/data/aLevelChemistry/notes.ts',
    'NerdXApp/src/data/scienceNotes/biology.ts',
    'NerdXApp/src/data/scienceNotes/chemistry.ts',
    'NerdXApp/src/data/scienceNotes/physics.ts',
]


def extract_urls_from_file(filepath: str) -> dict:
    """Extract all audioUrl and videoUrl values from a notes file."""
    urls = {'audio': [], 'video': []}
    
    if not os.path.exists(filepath):
        return urls
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all audioUrl values
    audio_pattern = r'audioUrl:\s*["\']([^"\']+)["\']'
    for match in re.finditer(audio_pattern, content):
        url = match.group(1)
        if url.startswith('http'):
            urls['audio'].append(url)
    
    # Find all videoUrl values
    video_pattern = r'videoUrl:\s*["\']([^"\']+)["\']'
    for match in re.finditer(video_pattern, content):
        url = match.group(1)
        if url.startswith('http'):
            urls['video'].append(url)
    
    return urls


def check_jwt_expiry(url: str) -> dict:
    """Check if the JWT token in the URL has expired."""
    try:
        parsed = urlparse(url)
        # Extract token from query string
        if 'token=' in parsed.query:
            token = parsed.query.split('token=')[1].split('&')[0]
            # Decode JWT payload (second part)
            parts = token.split('.')
            if len(parts) >= 2:
                # Add padding if needed
                payload = parts[1]
                padding = 4 - len(payload) % 4
                if padding != 4:
                    payload += '=' * padding
                decoded = json.loads(base64.urlsafe_b64decode(payload))
                exp = decoded.get('exp', 0)
                iat = decoded.get('iat', 0)
                now = int(time.time())
                
                return {
                    'expired': now > exp,
                    'expires_at': datetime.fromtimestamp(exp).isoformat() if exp else None,
                    'issued_at': datetime.fromtimestamp(iat).isoformat() if iat else None,
                    'seconds_until_expiry': exp - now if exp else 0
                }
    except Exception as e:
        return {'error': str(e)}
    
    return {}


def test_url_accessibility(url: str, timeout: int = 10) -> dict:
    """Test if a URL is accessible via HEAD request."""
    result = {
        'url': url[:100] + '...' if len(url) > 100 else url,
        'accessible': False,
        'status_code': None,
        'content_type': None,
        'error': None
    }
    
    try:
        response = requests.head(url, timeout=timeout, allow_redirects=True)
        result['status_code'] = response.status_code
        result['content_type'] = response.headers.get('Content-Type', '')
        result['accessible'] = response.status_code == 200
    except requests.exceptions.Timeout:
        result['error'] = 'Timeout'
    except requests.exceptions.ConnectionError:
        result['error'] = 'Connection Error'
    except Exception as e:
        result['error'] = str(e)
    
    return result


def main():
    print("=" * 70)
    print("MEDIA PLAYBACK TEST - Checking Audio and Video URL Accessibility")
    print("=" * 70)
    
    all_results = []
    total_audio = 0
    total_video = 0
    accessible_audio = 0
    accessible_video = 0
    
    for filepath in NOTES_FILES:
        if not os.path.exists(filepath):
            print(f"\n[SKIP] File not found: {filepath}")
            continue
        
        print(f"\n{'=' * 60}")
        print(f"Testing: {filepath}")
        print('=' * 60)
        
        urls = extract_urls_from_file(filepath)
        
        # Test audio URLs
        print(f"\nAudio URLs: {len(urls['audio'])}")
        for url in urls['audio']:
            total_audio += 1
            
            # Check JWT expiry
            jwt_info = check_jwt_expiry(url)
            
            # Test accessibility
            result = test_url_accessibility(url)
            result['type'] = 'audio'
            result['file'] = filepath
            result['jwt_info'] = jwt_info
            
            if result['accessible']:
                accessible_audio += 1
                print(f"  [OK] {result['url']}")
            else:
                print(f"  [FAIL] {result['url']}")
                if jwt_info.get('expired'):
                    print(f"    -> Token EXPIRED at {jwt_info.get('expires_at')}")
                elif result['error']:
                    print(f"    -> Error: {result['error']}")
                else:
                    print(f"    -> Status: {result['status_code']}")
            
            all_results.append(result)
        
        # Test video URLs
        print(f"\nVideo URLs: {len(urls['video'])}")
        for url in urls['video']:
            total_video += 1
            
            # Check JWT expiry
            jwt_info = check_jwt_expiry(url)
            
            # Test accessibility
            result = test_url_accessibility(url)
            result['type'] = 'video'
            result['file'] = filepath
            result['jwt_info'] = jwt_info
            
            if result['accessible']:
                accessible_video += 1
                print(f"  [OK] {result['url']}")
            else:
                print(f"  [FAIL] {result['url']}")
                if jwt_info.get('expired'):
                    print(f"    -> Token EXPIRED at {jwt_info.get('expires_at')}")
                elif result['error']:
                    print(f"    -> Error: {result['error']}")
                else:
                    print(f"    -> Status: {result['status_code']}")
            
            all_results.append(result)
    
    # Summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"Audio: {accessible_audio}/{total_audio} accessible ({100*accessible_audio/total_audio:.1f}%)" if total_audio else "Audio: 0 URLs found")
    print(f"Video: {accessible_video}/{total_video} accessible ({100*accessible_video/total_video:.1f}%)" if total_video else "Video: 0 URLs found")
    print(f"Total: {accessible_audio + accessible_video}/{total_audio + total_video} accessible")
    
    # Save results
    report = {
        'timestamp': datetime.now().isoformat(),
        'summary': {
            'total_audio': total_audio,
            'accessible_audio': accessible_audio,
            'total_video': total_video,
            'accessible_video': accessible_video,
        },
        'results': all_results
    }
    
    with open('media_test_report.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"\nDetailed report saved to: media_test_report.json")
    
    # Return exit code based on results
    if accessible_audio + accessible_video == total_audio + total_video:
        print("\n[SUCCESS] All media URLs are accessible!")
        return 0
    else:
        print(f"\n[WARNING] {(total_audio + total_video) - (accessible_audio + accessible_video)} URLs are not accessible")
        return 1


if __name__ == '__main__':
    exit(main())
