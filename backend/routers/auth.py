from fastapi import APIRouter, HTTPException, Depends, APIRouter, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schema import UserLogin
from fastapi import Depends, HTTPException
from jose import jwt
from app.models import User
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from time import time
from app.settings import Settings
from app.helper_funcs import (
    create_access_token,
    get_users_refresh_token,
    get_user_by_id,
    hash_password,
    generate_reset_code,
)
import smtplib
from email.mime.text import MIMEText
import math
import jose

auth_router = APIRouter(prefix="/auth")

SECRET_KEY = Settings.SECRET_KEY
ALGORITHM = Settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = Settings.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS = Settings.REFRESH_TOKEN_EXPIRE_DAYS
TOKEN_TYPE = Settings.TOKEN_TYPE
RESET_CODE_EXPIRE_MINUTES = 30
GOOGLE_MAPS_API_KEY = Settings.GOOGLE_MAPS_API_KEY

reset_codes = {}


@auth_router.get("/is-token-expired")
def check_token(access_token: str):
    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        exp = payload["exp"]
        if exp < math.floor(time()):
            pass
        else:
            return {"result": False}
    except jose.exceptions.ExpiredSignatureError:
        return {"result": True}

@auth_router.post("/refresh-access-token")
def refresh_access_token(refresh_token: str, db: Session = Depends(get_db)):
    """
    Endpoint to refresh the user's access token using a valid refresh token.
    """
    try:
        # Decode the refresh token and get user ID
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload["sub"]

        # Check if the user exists
        db_user = get_user_by_id(db, user_id)
        if db_user is None:
            raise HTTPException(status_code=404, detail="User not found")

        # Check if the refresh token is valid
        get_users_refresh_token(db, user_id)

        # Generate a new access token
        access_token = create_access_token(
            data={"sub": str(user_id), "username": db_user.username}
        )

        return {"access_token": access_token, "token_type": TOKEN_TYPE}
    except jwt.JWTError as e:
        raise HTTPException(status_code=401, detail=f"JWT Error: {e}")


@auth_router.post("/forgot-password")
def forgot_password(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if user:
        reset_code = generate_reset_code()
        reset_codes[email] = {
            "code": reset_code,
            "expire_at": datetime.utcnow()
            + timedelta(minutes=RESET_CODE_EXPIRE_MINUTES),
        }

        # Create the email message
        subject = "Password Reset Code"
        body = f"Here's your reset code: {reset_code}"
        message = MIMEText(body)
        message["Subject"] = subject
        message["From"] = "chasehutcheson2006@gmail.com"
        message["To"] = user.email

        # Connect to the SMTP server and send the email
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login("chasehutcheson2006@gmail.com", "bqeo cjrf ryiw ovqk")
            server.sendmail(
                "chasehutcheson2006@gmail.com", [user.email], message.as_string()
            )

        return {"message": "Password reset code sent"}
    raise HTTPException(status_code=404, detail="User not found")


@auth_router.post("/reset-password")
def reset_password(
    email: str, code: str, new_password: str, db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if (
        email in reset_codes
        and reset_codes[email]["code"] == code
        and reset_codes[email]["expire_at"] > datetime.utcnow()
    ):
        user = db.query(User).filter(User.email == email).first()
        if user:
            hashed_password = hash_password(new_password)
            user.password = hashed_password
            db.commit()
            del reset_codes[email]  # Remove the used reset code
            return {"message": "Password reset successfully"}
    else:
        raise HTTPException(status_code=400, detail="Invalid reset code or expired")

    raise HTTPException(status_code=400, detail="Invalid reset code")
