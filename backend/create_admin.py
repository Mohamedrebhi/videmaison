import os
import sys
from getpass import getpass
from app import db
from app.models.user import User

def create_admin_user():
    """Create an admin user with proper validation and security"""
    print("=== VideMaison Admin User Creation ===")
    print()
    
    try:
        # Get admin details
        while True:
            admin_email = input("Enter admin email: ").strip()
            if User.validate_email(admin_email):
                break
            print("❌ Invalid email format. Please try again.")
        
        # Check if admin already exists
        existing_user = User.get_user_by_email(admin_email)
        if existing_user:
            print(f"⚠️  User with email {admin_email} already exists.")
            
            if existing_user.get('role') == 'admin':
                print("✅ User is already an admin.")
                return
            
            update_role = input("Update existing user to admin role? (y/N): ").lower()
            if update_role == 'y':
                db.users.update_one(
                    {"_id": existing_user["_id"]},
                    {"$set": {"role": "admin", "updated_at": datetime.utcnow()}}
                )
                print(f"✅ Updated user {admin_email} to admin role.")
            return
        
        # Get password with validation
        while True:
            admin_password = getpass("Enter admin password: ")
            confirm_password = getpass("Confirm admin password: ")
            
            if admin_password != confirm_password:
                print("❌ Passwords don't match. Please try again.")
                continue
            
            is_valid, message = User.validate_password(admin_password)
            if is_valid:
                break
            print(f"❌ {message}")
        
        # Get optional details
        first_name = input("Enter first name (optional): ").strip() or None
        last_name = input("Enter last name (optional): ").strip() or None
        
        # Create admin user
        user = User.create_user(
            email=admin_email,
            password=admin_password,
            role="admin",
            first_name=first_name,
            last_name=last_name
        )
        
        # Mark email as verified for admin
        db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"email_verified": True}}
        )
        
        print(f"\n✅ Successfully created admin user: {admin_email}")
        print("🔐 Admin account is ready to use.")
        
    except ValueError as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n❌ Operation cancelled.")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    create_admin_user()