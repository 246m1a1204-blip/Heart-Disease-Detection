from pydantic import BaseModel, EmailStr

# Module 1: Authentication Roles & Schema [cite: 63]
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str # 'Patient' or 'Doctor' as per document requirements [cite: 65]

class UserLogin(BaseModel):
    email: EmailStr
    password: str