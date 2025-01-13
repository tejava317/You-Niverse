# /backend/app/utils/crypt.py
# Hash user password
import secrets
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def generate_user_id():
    return secrets.token_hex(8)

def generate_project_id():
    return secrets.token_hex(10)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)
