from flask_mail import Message

def send_email(to_email, subject, body):
    try:
        from app import mail

        msg = Message(
            subject,
            recipients=[to_email],
            body=body
        )

        mail.send(msg)

    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")

def send_password_reset_email(name, email, reset_link):
    subject = "Notes App Password Reset"

    body = f"""
Hello {name},

We received a request to reset the password for your Notes App account.

Click the link below to reset your password:

{reset_link}

This link will expire in 15 minutes.

If you did not request a password reset, you can safely ignore this email.

Regards,
Notes App Team
"""

    send_email(email, subject, body)