from flask import Blueprint, request, jsonify
from app.models.chat import Chat
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import socketio 
from flask_socketio import join_room 

bp = Blueprint('chat', __name__, url_prefix='/api/chat')

@bp.route('/messages/<receiver_id>', methods=['POST'])
@jwt_required()
def send_message(receiver_id):
    sender_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('content'):
        return jsonify({'error': 'Message content is required'}), 400
    
    message_type = data.get('message_type', 'text')
    
    message = Chat.create_message(
        sender_id=sender_id,
        receiver_id=receiver_id,
        content=data['content'],
        message_type=message_type
    )
    
    # Emit message to receiver
    socketio.emit('new_message', {
        'id': message['_id'],
        'sender_id': message['sender_id'],
        'content': message['content'],
        'message_type': message['message_type'],
        'created_at': message['created_at'].isoformat()
    }, room=receiver_id)
    
    return jsonify({
        'id': message['_id'],
        'sender_id': message['sender_id'],
        'receiver_id': message['receiver_id'],
        'content': message['content'],
        'message_type': message['message_type'],
        'created_at': message['created_at'].isoformat()
    }), 201

@bp.route('/messages/<user_id>', methods=['GET'])
@jwt_required()
def get_conversation(user_id):
    current_user_id = get_jwt_identity()
    messages = Chat.get_conversation(current_user_id, user_id)
    
    return jsonify(messages), 200

@bp.route('/messages/<message_id>/read', methods=['PUT'])
@jwt_required()
def mark_as_read(message_id):
    success = Chat.mark_as_read(message_id)
    if not success:
        return jsonify({'error': 'Failed to mark message as read'}), 500
    
    return jsonify({'message': 'Message marked as read'}), 200

# Socket.IO event handlers
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('join')
def handle_join(data):
    room = data.get('user_id')
    if room:
        join_room(room)
        print(f'User {room} joined their room')