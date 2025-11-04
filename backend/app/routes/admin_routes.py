from flask import Blueprint, jsonify, request
from app.models.service_request import ServiceRequest
from flask_jwt_extended import jwt_required, get_jwt
from functools import wraps
import datetime

bp = Blueprint('admin', __name__, url_prefix='/api/admin')

# Admin middleware - fixed implementation
def admin_required():
    def wrapper(fn):
        @wraps(fn)  # Add this line to preserve function metadata
        @jwt_required()
        def decorator(*args, **kwargs):
            claims = get_jwt()
            if claims.get('role') != 'admin':
                return jsonify({'error': 'Admin access required'}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

@bp.route('/requests', methods=['GET'])
@admin_required()
def get_all_requests():
    page = request.args.get('page', 1, type=int)
    status = request.args.get('status')
    
    # Get paginated requests
    requests, total_pages = ServiceRequest.get_paginated_requests(page=page, status=status)
    
    return jsonify({
        'requests': requests,
        'total_pages': total_pages
    }), 200

@bp.route('/requests/<request_id>', methods=['GET'])
@admin_required()
def get_request(request_id):
    request = ServiceRequest.get_request_by_id(request_id)
    if not request:
        return jsonify({'error': 'Request not found'}), 404
    return jsonify(request), 200

@bp.route('/requests/<request_id>/read', methods=['PUT'])
@admin_required()
def mark_request_as_read(request_id):
    success = ServiceRequest.mark_as_read(request_id)
    if not success:
        return jsonify({'error': 'Failed to mark request as read'}), 500
    return jsonify({'message': 'Request marked as read'}), 200

@bp.route('/requests/unread-count', methods=['GET'])
@admin_required()
def get_unread_count():
    count = ServiceRequest.count_unread_requests()
    return jsonify({'unreadCount': count}), 200
    
@bp.route('/requests/<request_id>/status', methods=['PUT'])
@admin_required()
def update_request_status(request_id):
    data = request.get_json()
    if not data or 'status' not in data:
        return jsonify({'error': 'Status is required'}), 400
    
    valid_statuses = ['pending', 'in_progress', 'completed', 'cancelled']
    if data['status'] not in valid_statuses:
        return jsonify({'error': f'Status must be one of: {valid_statuses}'}), 400
    
    # Get admin notes if provided
    admin_notes = data.get('admin_notes')
    
    # Get the service request to access user email
    service_request = ServiceRequest.get_request_by_id(request_id)
    if not service_request:
        return jsonify({'error': 'Request not found'}), 404
    
    # Update request status and notes
    success = ServiceRequest.update_request(request_id, data['status'], admin_notes)
    if not success:
        return jsonify({'error': 'Failed to update request'}), 500
    
    # Send thank-you email if status is changed to completed
    if data['status'] == 'completed':
        # Get service type name for emails
        service_types = {
            'vide_maison': 'Vide Maison',
            'vide_appartement': 'Vide Appartement',
            'vide_grenier': 'Vide Grenier',
            'vide_locaux': 'Vide Locaux Professionnels',
            'vide_bureau': 'Vide Bureau',
            'nettoyage': 'Nettoyage'
        }
        service_type_name = service_types.get(service_request['service_type'], service_request['service_type'])
        
        # Send thank-you email if status is changed to completed
    if data['status'] == 'completed':
        # Get the service request to access user details
        req = ServiceRequest.get_request_by_id(request_id)
        if req:
            status_email = f"""
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px;">
                        <h2 style="color: #4caf50; text-align: center;">✅ Service Terminé!</h2>
                        <p style="color: #666;">Cher(e) {req['name']},</p>
                        <p style="color: #666;">
                            Nous sommes heureux de vous informer que votre service de débarras à <strong>{req['address']}</strong> a été complété avec succès.
                        </p>
                        <p style="color: #666;">
                            Merci d'avoir choisi Elite Clearance. Nous espérons que notre service a répondu à vos attentes!
                        </p>
                        <p style="color: #666;">
                            Cordialement,<br>
                            <strong>L'équipe Elite Clearance</strong>
                        </p>
                    </div>
                </body>
            </html>
            """
            
            from app.services.notification_service import send_email_notification
            send_email_notification(
                'Service Terminé - Elite Clearance',
                '',  # Empty body since we're using HTML
                req['email'],
                html=status_email
            )
    
    # Send cancellation email if status is changed to cancelled
    elif data['status'] == 'cancelled':
        # Get the service request to access user details
        req = ServiceRequest.get_request_by_id(request_id)
        if req:
            # Get cancellation reason from admin notes
            cancellation_reason = req['admin_notes'] if req['admin_notes'] else 'Raison non spécifiée'
            
            status_email = f"""
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px;">
                        <h2 style="color: #e74c3c; text-align: center;">❌ Service Annulé</h2>
                        <p style="color: #666;">Cher(e) {req['name']},</p>
                        <p style="color: #666;">
                            Nous regretons de vous informer que votre demande de service à <strong>{req['address']}</strong> a été annulée.
                        </p>
                        <p style="color: #666;">
                            <strong>Raison de l'annulation:</strong> {cancellation_reason}
                        </p>
                        <p style="color: #666;">
                            Si vous avez des questions concernant cette annulation, n'hésitez pas à nous contacter.
                        </p>
                        <p style="color: #666;">
                            Cordialement,<br>
                            <strong>L'équipe Elite Clearance</strong>
                        </p>
                    </div>
                </body>
            </html>
            """
            
            from app.services.notification_service import send_email_notification
            send_email_notification(
                'Service Annulé - Elite Clearance',
                '',  # Empty body since we're using HTML
                req['email'],
                html=status_email
            )
    
    return jsonify({'message': 'Request updated successfully'}), 200


@bp.route('/dashboard/stats', methods=['GET'])
@admin_required()
def get_dashboard_stats():
    # Get today's date range
    today = datetime.datetime.now()
    start_of_day = datetime.datetime(today.year, today.month, today.day, 0, 0, 0)
    end_of_day = datetime.datetime(today.year, today.month, today.day, 23, 59, 59)
    
    # Get counts for different statuses (all-time)
    total_requests = db.service_requests.count_documents({})
    
    # Get counts for today only
    today_filter = {
        'created_at': {
            '$gte': start_of_day,
            '$lte': end_of_day
        }
    }
    
    # Today's counts by status
    pending_requests = db.service_requests.count_documents({**today_filter, 'status': 'pending'})
    in_progress_requests = db.service_requests.count_documents({**today_filter, 'status': 'in_progress'})
    completed_requests = db.service_requests.count_documents({**today_filter, 'status': 'completed'})
    cancelled_requests = db.service_requests.count_documents({**today_filter, 'status': 'cancelled'})
    
    # Get today's requests instead of just recent requests
    todays_requests_cursor = db.service_requests.find(today_filter).sort('created_at', -1)
    
    recent_requests = []
    
    for req in todays_requests_cursor:
        req['_id'] = str(req['_id'])
        # Format date for display
        req['created_at_formatted'] = req['created_at'].strftime('%d/%m/%Y %H:%M')

        recent_requests.append({
            'id': req['_id'],
            'name': req['name'],
            'email': req['email'],
            'service_type': req['service_type'],
            'status': req['status'],
            'created_at': req['created_at_formatted']
        })
    
    return jsonify({
        'totalRequests': total_requests,
        'pendingRequests': pending_requests,
        'inProgressRequests': in_progress_requests,
        'completedRequests': completed_requests,
        'cancelledRequests': cancelled_requests,
        'recentRequests': recent_requests
    }), 200