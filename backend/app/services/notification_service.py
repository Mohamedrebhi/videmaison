from app import mail
from flask_mail import Message
from datetime import datetime

def send_email_notification(subject, body, recipient, html=None):
    try:
        msg = Message(
            subject=subject,
            recipients=[recipient],
            body=body,
            html=html
        )
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False