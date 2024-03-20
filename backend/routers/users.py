from fastapi import HTTPException, Depends, APIRouter, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schema import UserCreate, UserLogin
from fastapi import Depends, HTTPException
from jose import JWTError, jwt
from app.models import User
from app.schema import UserCreate
from sqlalchemy.orm import Session
from app.settings import Settings
from app.helper_funcs import (
    create_access_token,
    create_refresh_token,
    link_refresh_token_to_user,
    revoke_refresh_token_from_user,
    get_users_refresh_token,
    get_user_by_id,
    hash_password,
    verify_password,
    verify_token,
)
import smtplib
from email.mime.text import MIMEText
import json

user_router = APIRouter(prefix="/users")

SECRET_KEY = Settings.SECRET_KEY
ALGORITHM = Settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = Settings.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS = Settings.REFRESH_TOKEN_EXPIRE_DAYS
TOKEN_TYPE = Settings.TOKEN_TYPE
RESET_CODE_EXPIRE_MINUTES = 30
GOOGLE_MAPS_API_KEY = Settings.GOOGLE_MAPS_API_KEY

reset_codes = {}


@user_router.post("/register")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = hash_password(user.password)
    db_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        username=user.username,
        email=user.email,
        password=hashed_password,
        date_of_birth=user.date_of_birth,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    access_token = create_access_token(
        data={"sub": str(db_user.id), "username": db_user.username}
    )
    refresh_token = create_refresh_token(
        data={"sub": str(db_user.id), "username": db_user.username}
    )
    link_refresh_token_to_user(db, db_user.id, refresh_token)
    return {
        "user_id": db_user.id,
        "username": db_user.username,
        "email": db_user.email,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": TOKEN_TYPE,
        "message": "User registered successfully",
    }


@user_router.post("/login")
def login_user(user_login: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user_login.email).first()
    if db_user is None:
        raise HTTPException(status_code=400, detail="Invalid user")
    elif not verify_password(user_login.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token(
        data={"sub": str(db_user.id), "username": db_user.username}
    )
    refresh_token = get_users_refresh_token(db, db_user.id)

    if refresh_token:
        return {
            "access_token": access_token,
            "refresh_token": refresh_token.token,
            "token_type": TOKEN_TYPE,
        }
    else:
        refresh_token = create_refresh_token(
            data={"sub": str(db_user.id), "username": db_user.username}
        )
        link_refresh_token_to_user(db, db_user.id, refresh_token)
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": TOKEN_TYPE,
        }


@user_router.post("/doc-login")
def login_user(user_login: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user_login.email).first()
    if db_user is None:
        raise HTTPException(status_code=400, detail="Invalid user")
    elif not verify_password(user_login.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token(
        data={"sub": str(db_user.id), "username": db_user.username}
    )

    return {
        "access_token": access_token
    }


@user_router.post("/logout")
def logout_user(access_token: str, db: Session = Depends(get_db)):
    try:
        token_valid = verify_token(access_token)
        if token_valid:
            payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload["sub"]
            refresh_token = get_users_refresh_token(db, user_id).token
            revoke_refresh_token_from_user(db, refresh_token)
            return {"message": "Logout successful"}
        else:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@user_router.get("/me")
def get_current_user(db: Session = Depends(get_db), token=str):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    is_token_valid = verify_token(token)

    if is_token_valid:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            db_user = get_user_by_id(db, user_id)
            if user_id is None:
                raise credentials_exception
            else:
                return {
                    "id": db_user.id,
                    "first_name": db_user.first_name,
                    "last_name": db_user.last_name,
                    "username": db_user.username,
                    "email": db_user.email,
                    "date_of_birth": db_user.date_of_birth,
                    "created_at": db_user.created_at,
                    "is_verified": db_user.is_verified,
                    "verified_at": db_user.verified_at,
                    "updated_last": db_user.updated_last,
                }
        except JWTError:
            raise credentials_exception
    else:
        raise credentials_exception
