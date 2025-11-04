from bson import ObjectId
from datetime import datetime
from app import db

class ServiceRequest:
    @staticmethod
    def create_request(name, email, phone, address, service_type, message, language='fr'):
        # Create a new service request document
        service_request = {
            '_id': str(ObjectId()),
            'name': name,
            'email': email,
            'phone': phone,
            'address': address,
            'service_type': service_type,
            'message': message,
            'language': language,  # Add language field
            'status': 'new',
            'read': False,  # Add this field to track if request has been read
            'created_at': datetime.now(),
            'updated_at': datetime.now()
        }
        
        # Insert into database
        db.service_requests.insert_one(service_request)
        
        return service_request
    # Add a new method to mark requests as read
    @staticmethod
    def mark_as_read(request_id):
        result = db.service_requests.update_one(
            {'_id': ObjectId(request_id)},
            {'$set': {'read': True, 'updated_at': datetime.utcnow()}}
        )
        return result.modified_count > 0

    # Add a method to count unread requests
    @staticmethod
    def count_unread_requests():
        return db.service_requests.count_documents({'read': False})
    @staticmethod
    def get_all_requests():
        requests = list(db.service_requests.find().sort('created_at', -1))
        for request in requests:
            request['_id'] = str(request['_id'])
        return requests
    
    @staticmethod
    def get_paginated_requests(page=1, per_page=10, status=None):
        # Create filter based on status if provided
        filter_query = {}
        if status:
            filter_query['status'] = status
        
        # Count total documents for pagination
        total_docs = db.service_requests.count_documents(filter_query)
        total_pages = (total_docs + per_page - 1) // per_page  # Ceiling division
        
        # Get paginated results
        skip = (page - 1) * per_page
        cursor = db.service_requests.find(filter_query).sort('created_at', -1).skip(skip).limit(per_page)
        
        # Convert to list and format IDs
        requests = list(cursor)
        for request in requests:
            request['_id'] = str(request['_id'])
        
        return requests, total_pages
    
    @staticmethod
    def get_request_by_id(request_id):
        request = db.service_requests.find_one({'_id': ObjectId(request_id)})
        if request:
            request['_id'] = str(request['_id'])
        return request
    
    @staticmethod
    def update_request_status(request_id, status):
        result = db.service_requests.update_one(
            {'_id': ObjectId(request_id)},
            {'$set': {'status': status, 'updated_at': datetime.utcnow()}}
        )
        return result.modified_count > 0
    
    @staticmethod
    def update_request(request_id, status, admin_notes=None):
        update_data = {
            'status': status,
            'updated_at': datetime.utcnow()
        }
        
        # Add admin_notes to update if provided
        if admin_notes is not None:
            update_data['admin_notes'] = admin_notes
        
        result = db.service_requests.update_one(
            {'_id': ObjectId(request_id)},
            {'$set': update_data}
        )
        return result.modified_count > 0