"""
Netlify serverless function handler for Django WSGI application
"""

import os
import sys
import django
from pathlib import Path

# In Netlify/Lambda, LAMBDA_TASK_ROOT=/var/task and included project files
# (config/, apex/, etc.) are placed directly at that root.
# In local dev, fall back to the repo root three levels up.
project_dir = os.environ.get('LAMBDA_TASK_ROOT') or str(Path(__file__).resolve().parent.parent.parent)
sys.path.insert(0, project_dir)

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Setup Django
django.setup()

from django.core.wsgi import get_wsgi_application

# Get the WSGI application
wsgi_app = get_wsgi_application()


def handler(event, context):
    """
    Netlify serverless function handler
    Converts Netlify function event to WSGI-compatible request
    """
    from urllib.parse import unquote
    
    # Build the environ dict
    environ = {
        'REQUEST_METHOD': event.get('httpMethod', 'GET'),
        'SCRIPT_NAME': '',
        'PATH_INFO': unquote(event.get('path', '/')),
        'QUERY_STRING': event.get('queryStringParameters', '') or '',
        'CONTENT_TYPE': event.get('headers', {}).get('content-type', ''),
        'CONTENT_LENGTH': event.get('headers', {}).get('content-length', '0'),
        'SERVER_NAME': event.get('headers', {}).get('host', 'localhost').split(':')[0],
        'SERVER_PORT': '443',
        'SERVER_PROTOCOL': 'HTTP/1.1',
        'wsgi.version': (1, 0),
        'wsgi.url_scheme': 'https',
        'wsgi.input': None,
        'wsgi.errors': sys.stderr,
        'wsgi.multithread': True,
        'wsgi.multiprocess': False,
        'wsgi.run_once': False,
    }
    
    # Add headers
    for header_name, header_value in event.get('headers', {}).items():
        key = f'HTTP_{header_name.upper().replace("-", "_")}'
        if header_name.lower() not in ['content-type', 'content-length']:
            environ[key] = header_value
    
    # Handle body
    body = event.get('body', '')
    if isinstance(body, str):
        body = body.encode('utf-8')
    
    from io import BytesIO
    environ['wsgi.input'] = BytesIO(body)
    
    # Call the WSGI app
    response_data = {}
    response_status = None
    response_headers = []
    
    def start_response(status, headers, exc_info=None):
        nonlocal response_status, response_headers
        response_status = status
        response_headers = headers
        return lambda s: None
    
    try:
        response_body = wsgi_app(environ, start_response)
        
        # Collect response body
        body_parts = []
        for data in response_body:
            if isinstance(data, bytes):
                body_parts.append(data)
            else:
                body_parts.append(data.encode('utf-8'))
        
        response_body_str = b''.join(body_parts).decode('utf-8')
        
        # Extract status code
        status_code = int(response_status.split()[0])
        
        # Convert headers to dict
        headers_dict = {}
        for key, value in response_headers:
            headers_dict[key] = value
        
        return {
            'statusCode': status_code,
            'headers': headers_dict,
            'body': response_body_str,
        }
    except Exception as e:
        import traceback
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'text/plain'},
            'body': f'Internal Server Error: {str(e)}\n\n{traceback.format_exc()}',
        }
