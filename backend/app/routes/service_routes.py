from flask import Blueprint, request, jsonify
from app.models.service_request import ServiceRequest
from app.services.notification_service import send_email_notification
from flask_socketio import emit
from app import socketio
from datetime import datetime

bp = Blueprint('services', __name__, url_prefix='/api/services')

@bp.route('/request', methods=['POST'])
def create_service_request():
    data = request.get_json()
    
    # Validate input
    required_fields = ['name', 'email', 'phone', 'address', 'service_type', 'message']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    # Get user's language (default to French if not provided)
    user_language = data.get('language', 'fr')
    
    # Create service request with language
    service_request = ServiceRequest.create_request(
        name=data['name'],
        email=data['email'],
        phone=data['phone'],
        address=data['address'],
        service_type=data['service_type'],
        message=data['message'],
        language=user_language  # Store the user's language preference
    )
    
    # Get service type name for emails
    service_types = {
        'vide_maison': 'Vide Maison',
        'vide_appartement': 'Vide Appartement',
        'vide_grenier': 'Vide Grenier',
        'vide_locaux': 'Vide Locaux Professionnels',
        'vide_bureau': 'Vide Bureau',
        'nettoyage': 'Nettoyage'
    }
    service_type_name = service_types.get(data['service_type'], data['service_type'])
    
    # Email translations
    translations = {
        'en': {
            'admin_subject': 'New Service Request',
            'admin_title': '🔔 New Service Request',
            'admin_name': 'Name',
            'admin_email': 'Email',
            'admin_phone': 'Phone',
            'admin_service': 'Service',
            'admin_address': 'Address',
            'admin_message': 'Message',
            'admin_submitted': 'Submitted on',
            'user_subject': 'Confirmation of your service request - Vide Maison',
            'user_title': 'Vide Maison',
            'user_thank_you': 'Thank you for your request!',
            'user_dear': f'Dear {data["name"]},',
            'user_received': f'We have received your request for <strong>{service_type_name}</strong> at <strong>{data["address"]}</strong>.',
            'user_contact': f'Our team will review your request and contact you within <strong>24 hours</strong> at <strong>{data["phone"]}</strong>.',
            'user_details': 'Your request details:',
            'user_service': 'Service',
            'user_address': 'Address',
            'user_message': 'Message',
            'user_regards': 'Best regards,',
            'user_team': 'The Vide Maison Team',
            'user_footer': 'Vide Maison - Professional Clearance Service<br>Brussels and Surroundings'
        },
        'fr': {
            'admin_subject': 'Nouvelle Demande de Service',
            'admin_title': '🔔 Nouvelle Demande de Service',
            'admin_name': 'Nom',
            'admin_email': 'Email',
            'admin_phone': 'Téléphone',
            'admin_service': 'Service',
            'admin_address': 'Adresse',
            'admin_message': 'Message',
            'admin_submitted': 'Soumis le',
            'user_subject': 'Confirmation de votre demande de service - Vide Maison',
            'user_title': 'Vide Maison',
            'user_thank_you': 'Merci pour votre demande!',
            'user_dear': f'Cher(e) {data["name"]},',
            'user_received': f'Nous avons bien reçu votre demande pour <strong>{service_type_name}</strong> à <strong>{data["address"]}</strong>.',
            'user_contact': f'Notre équipe examinera votre demande et vous contactera dans les <strong>24 heures</strong> au <strong>{data["phone"]}</strong>.',
            'user_details': 'Détails de votre demande:',
            'user_service': 'Service',
            'user_address': 'Adresse',
            'user_message': 'Message',
            'user_regards': 'Cordialement,',
            'user_team': "L'équipe Vide Maison",
            'user_footer': 'Vide Maison - Service Professionnel de Débarras<br>Bruxelles et Environs'
        },
        'nl': {
            'admin_subject': 'Nieuwe Serviceaanvraag',
            'admin_title': '🔔 Nieuwe Serviceaanvraag',
            'admin_name': 'Naam',
            'admin_email': 'Email',
            'admin_phone': 'Telefoon',
            'admin_service': 'Dienst',
            'admin_address': 'Adres',
            'admin_message': 'Bericht',
            'admin_submitted': 'Ingediend op',
            'user_subject': 'Bevestiging van uw serviceaanvraag - Vide Maison',
            'user_title': 'Vide Maison',
            'user_thank_you': 'Bedankt voor uw aanvraag!',
            'user_dear': f'Beste {data["name"]},',
            'user_received': f'We hebben uw aanvraag voor <strong>{service_type_name}</strong> op <strong>{data["address"]}</strong> goed ontvangen.',
            'user_contact': f'Ons team zal uw aanvraag bekijken en binnen <strong>24 uur</strong> contact met u opnemen op <strong>{data["phone"]}</strong>.',
            'user_details': 'Details van uw aanvraag:',
            'user_service': 'Dienst',
            'user_address': 'Adres',
            'user_message': 'Bericht',
            'user_regards': 'Met vriendelijke groet,',
            'user_team': 'Het Vide Maison Team',
            'user_footer': 'Vide Maison - Professionele Ontruimingsdienst<br>Brussel en Omgeving'
        }
    }
    
    # Default to French if language not available
    lang = user_language if user_language in translations else 'fr'
    trans = translations[lang]
    
    # Send email notification to admin with HTML template in admin language (always French)
    admin_email_html = f""" 
    <html> 
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;"> 
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);"> 
                <h2 style="color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">{translations['fr']['admin_title']}</h2> 
                <div style="margin: 20px 0;"> 
                    <p style="margin: 10px 0;"><strong>{translations['fr']['admin_name']}:</strong> {data['name']}</p> 
                    <p style="margin: 10px 0;"><strong>{translations['fr']['admin_email']}:</strong> {data['email']}</p> 
                    <p style="margin: 10px 0;"><strong>{translations['fr']['admin_phone']}:</strong> {data['phone']}</p> 
                    <p style="margin: 10px 0;"><strong>{translations['fr']['admin_service']}:</strong> {service_type_name}</p> 
                    <p style="margin: 10px 0;"><strong>{translations['fr']['admin_address']}:</strong> {data['address']}</p> 
                    <p style="margin: 10px 0;"><strong>{translations['fr']['admin_message']}:</strong> {data['message']}</p> 
                    <p style="margin: 10px 0;"><strong>Langue/Language:</strong> {lang.upper()}</p>
                </div> 
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;"> 
                    <p style="color: #666; font-size: 12px;">{translations['fr']['admin_submitted']}: {datetime.now().strftime('%d/%m/%Y à %H:%M')}</p> 
                </div> 
            </div> 
        </body> 
    </html> 
    """
    
    send_email_notification(
        translations['fr']['admin_subject'],
        f'New service request from {data["name"]} for {service_type_name} service.',
        'alifar1457@gmail.com',
        html=admin_email_html
    )
    
    # Send confirmation email to user with HTML template in user's language
    customer_email_html = f""" 
    <html> 
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;"> 
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);"> 
                <h2 style="color: #d4af37; text-align: center;">{trans['user_title']}</h2> 
                <h3 style="color: #333;">{trans['user_thank_you']}</h3> 
                <p style="color: #666; line-height: 1.6;"> 
                    {trans['user_dear']} 
                </p> 
                <p style="color: #666; line-height: 1.6;"> 
                    {trans['user_received']} 
                </p> 
                <p style="color: #666; line-height: 1.6;"> 
                    {trans['user_contact']} 
                </p> 
                <div style="background-color: #f9f9f9; border-left: 4px solid #d4af37; padding: 15px; margin: 20px 0;"> 
                    <p style="margin: 0; color: #333;"><strong>{trans['user_details']}</strong></p> 
                    <p style="margin: 5px 0; color: #666;">{trans['user_service']}: {service_type_name}</p> 
                    <p style="margin: 5px 0; color: #666;">{trans['user_address']}: {data['address']}</p> 
                    <p style="margin: 5px 0; color: #666;">{trans['user_message']}: {data['message']}</p> 
                </div> 
                <p style="color: #666; line-height: 1.6;"> 
                    {trans['user_regards']}<br> 
                    <strong>{trans['user_team']}</strong> 
                </p> 
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;"> 
                    <p style="color: #999; font-size: 12px;"> 
                        {trans['user_footer']} 
                    </p> 
                </div> 
            </div> 
        </body> 
    </html> 
    """
    
    # Create plain text version for fallback
    plain_text = f"{trans['user_dear']}\n\n{data['name'].replace('<strong>', '').replace('</strong>', '')},\n\n{trans['user_received'].replace('<strong>', '').replace('</strong>', '')}\n\n{trans['user_contact'].replace('<strong>', '').replace('</strong>', '')}\n\n{trans['user_details']}\n{trans['user_service']}: {service_type_name}\n{trans['user_address']}: {data['address']}\n{trans['user_message']}: {data['message']}\n\n{trans['user_regards']}\n{trans['user_team']}\n"
    
    send_email_notification(
        trans['user_subject'],
        plain_text,
        data['email'],
        html=customer_email_html
    )
    
    # Send real-time notification to admin
    socketio.emit('new_request', {
        'id': service_request['_id'],
        'name': service_request['name'],
        'service_type': service_request['service_type'],
        'email': service_request['email'],
        'phone': service_request['phone'],
        'address': service_request['address'],
        'language': user_language,  # Include language in the notification
        'created_at': service_request['created_at'].isoformat()
    }, namespace='/admin')
    
    return jsonify({
        'message': 'Service request submitted successfully',
        'request_id': service_request['_id']
    }), 201

@bp.route('/types', methods=['GET'])
def get_service_types():
    # Return list of service types
    service_types = [
        {'id': 'vide_maison', 'name': 'Vide Maison'},
        {'id': 'vide_appartement', 'name': 'Vide Appartement'},
        {'id': 'vide_grenier', 'name': 'Vide Grenier'},
        {'id': 'vide_locaux', 'name': 'Vide Locaux Professionnels'},
        {'id': 'vide_bureau', 'name': 'Vide Bureau'},
        {'id': 'nettoyage', 'name': 'Nettoyage'}
    ]
    
    return jsonify(service_types), 200