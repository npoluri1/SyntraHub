from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.database.models import User
from backend.services.auth_service import create_access_token, verify_password, get_password_hash
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

@router.post("/register")
async def register(data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        email=data.email,
        hashed_password=get_password_hash(data.password),
        name=data.name,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "name": user.name}
    }

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "name": user.name}
    }
