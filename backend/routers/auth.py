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
from typing import Annotated
from email.mime.text import MIMEText
import math
import hashlib

auth_router = APIRouter(prefix="/auth")

SECRET_KEY = Settings.SECRET_KEY
ALGORITHM = Settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = Settings.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS = Settings.REFRESH_TOKEN_EXPIRE_DAYS
OAUTH_SCHEME = Settings.OAUTH_SCHEME
TOKEN_TYPE = Settings.TOKEN_TYPE
RESET_CODE_EXPIRE_MINUTES = 30
GOOGLE_MAPS_API_KEY = Settings.GOOGLE_MAPS_API_KEY

reset_codes = {}


@auth_router.get("/token/check")
def check_token(access_token: str = Depends(OAUTH_SCHEME)):
    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        exp = payload.get("exp")

        if exp is None:
            raise HTTPException(
                status_code=400, detail="Missing expiration time in token"
            )

        if exp < math.floor(time()):
            return {"result": True}
        else:
            return {"result": False}
    except jwt.ExpiredSignatureError:
        return {"result": True}
    except jwt.JWTError as e:
        raise HTTPException(status_code=401, detail="Invalid token") from e


from fastapi import HTTPException


@auth_router.post("/token/refresh")
def refresh_access_token(
    refresh_token: str = Depends(OAUTH_SCHEME), db: Session = Depends(get_db)
):
    """
    Endpoint to refresh the user's access token using a valid refresh token.
    """
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload["sub"]

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
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@auth_router.post("/password/forgot")
def forgot_password(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if user:
        reset_code = generate_reset_code()
        hashed_email = hashlib.sha256(email.encode()).hexdigest()  # Hash the email
        reset_codes[hashed_email] = {
            "email": email,
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


@auth_router.post("/password/reset")
def reset_password(request_data: dict, db: Session = Depends(get_db)):
    hashed_email = request_data.get("hashed_email")
    hashed_code = request_data.get("hashed_code")
    new_password = request_data.get("new_password")

    # Check if the reset code is valid and not expired
    if str(hashed_email) in reset_codes:
        user = (
            db.query(User)
            .filter(User.email == reset_codes[hashed_email]["email"])
            .first()
        )
        if user:
            # Invalidate the reset code immediately after use
            del reset_codes[hashed_email]

            # Hash the new password before storing
            hashed_password = hash_password(new_password)
            user.password = hashed_password
            db.commit()

            return {"message": "Password reset successfully"}
    raise HTTPException(status_code=400, detail="Invalid reset code or expired")
