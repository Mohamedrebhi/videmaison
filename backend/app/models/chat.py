from app import db
from datetime import datetime
from bson.objectid import ObjectId

class Chat:
    @staticmethod
    def create_message(sender_id, receiver_id, content, message_type='text'):
        message = {
            'sender_id': sender_id,
            'receiver_id': receiver_id,
            'content': content,
            'message_type': message_type,
            'read': False,
            'created_at': datetime.utcnow()
        }
        result = db.messages.insert_one(message)
        message['_id'] = str(result.inserted_id)
        return message
    
    @staticmethod
    def get_conversation(user1_id, user2_id):
        messages = list(db.messages.find({
            '$or': [
                {'sender_id': user1_id, 'receiver_id': user2_id},
                {'sender_id': user2_id, 'receiver_id': user1_id}
            ]
        }).sort('created_at', 1))
        
        for message in messages:
            message['_id'] = str(message['_id'])
        
        return messages
    
    @staticmethod
    def mark_as_read(message_id):
        result = db.messages.update_one(
            {'_id': ObjectId(message_id)},
            {'$set': {'read': True}}
        )
        return result.modified_count > 0