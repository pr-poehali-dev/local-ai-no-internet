import json
import os
from urllib import request, error, parse

def handler(event: dict, context) -> dict:
    '''Telegram бот с подключением к локальной ИИ модели'''
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method == 'GET':
        query_params = event.get('queryStringParameters', {}) or {}
        action = query_params.get('action', '')
        
        if action == 'setup':
            webhook_url = query_params.get('webhook_url', '')
            if not webhook_url:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'webhook_url parameter required'})
                }
            
            bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
            if not bot_token:
                return {
                    'statusCode': 500,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'TELEGRAM_BOT_TOKEN not configured'})
                }
            
            result = set_webhook(bot_token, webhook_url)
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps(result)
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({
                'status': 'Telegram bot webhook is running',
                'setup': 'Add ?action=setup&webhook_url=YOUR_URL to configure'
            })
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        if not bot_token:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'TELEGRAM_BOT_TOKEN not configured'})
            }
        
        body = json.loads(event.get('body', '{}'))
        
        if 'message' not in body:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True})
            }
        
        message = body['message']
        chat_id = message['chat']['id']
        user_text = message.get('text', '').strip()
        
        if not user_text:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True})
            }
        
        if user_text.startswith('/start'):
            welcome_text = '''👋 Привет! Я локальный ИИ-ассистент.

Могу помочь с:
• Программированием (Python, JavaScript, React)
• Математикой и решением задач
• Научными вопросами (физика, химия, биология)
• Общими знаниями (история, философия)

Просто задай любой вопрос! 🚀'''
            send_message(bot_token, chat_id, welcome_text)
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True})
            }
        
        send_message(bot_token, chat_id, '⏳ Думаю...')
        
        ai_response = call_ai_api(user_text)
        
        send_message(bot_token, chat_id, ai_response)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True})
        }
        
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Invalid JSON'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)})
        }


def call_ai_api(user_message: str) -> str:
    '''Вызов локальной ИИ модели'''
    try:
        api_url = 'https://functions.poehali.dev/0a0e0a33-b555-4ac3-8ed6-b952de2816f7'
        
        request_data = json.dumps({
            'message': user_message,
            'model': 'llama'
        }).encode('utf-8')
        
        req = request.Request(
            api_url,
            data=request_data,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        
        with request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result.get('response', 'Извините, не удалось получить ответ')
    except Exception as e:
        return f'Ошибка при обращении к ИИ: {str(e)}'


def send_message(bot_token: str, chat_id: int, text: str) -> dict:
    '''Отправка сообщения в Telegram'''
    api_url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
    
    request_data = json.dumps({
        'chat_id': chat_id,
        'text': text,
        'parse_mode': 'Markdown'
    }).encode('utf-8')
    
    req = request.Request(
        api_url,
        data=request_data,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    
    try:
        with request.urlopen(req, timeout=10) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        return {'ok': False, 'error': str(e)}


def set_webhook(bot_token: str, webhook_url: str) -> dict:
    '''Установка webhook для Telegram бота'''
    api_url = f'https://api.telegram.org/bot{bot_token}/setWebhook'
    
    request_data = json.dumps({
        'url': webhook_url
    }).encode('utf-8')
    
    req = request.Request(
        api_url,
        data=request_data,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    
    try:
        with request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            if result.get('ok'):
                return {'success': True, 'message': 'Webhook установлен успешно!'}
            else:
                return {'success': False, 'error': result.get('description', 'Unknown error')}
    except Exception as e:
        return {'success': False, 'error': str(e)}
