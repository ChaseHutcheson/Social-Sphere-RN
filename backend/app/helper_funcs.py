from jose import JWTError, jwt
from app.database import get_db
from app.models import User, RefreshToken, Post, user_post_association
from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy.types import Float
from sqlalchemy import and_
from app.settings import Settings
from fastapi import Depends
import bcrypt
from typing import Optional, List, Union
from datetime import datetime, timedelta
from random import randint
from sqlalchemy import text
import requests
import math


SECRET_KEY: str = Settings.SECRET_KEY
ALGORITHM: str = Settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES: int = Settings.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS: int = Settings.REFRESH_TOKEN_EXPIRE_DAYS
RESET_TOKEN_EXPIRE_MINUTES = 30
TOKEN_TYPE: str = Settings.TOKEN_TYPE
GOOGLE_MAPS_API_KEY = Settings.GOOGLE_MAPS_API_KEY


def create_access_token(data: dict) -> str:
    data_copy: dict = data.copy()
    token_expiry: datetime = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    data_copy.update({"exp": token_expiry})
    access_token: str = jwt.encode(data_copy, SECRET_KEY, algorithm=ALGORITHM)
    return access_token


def create_refresh_token(data: dict) -> str:
    data_copy: dict = data.copy()
    token_expiry: datetime = datetime.utcnow() + timedelta(
        days=REFRESH_TOKEN_EXPIRE_DAYS
    )
    data_copy.update({"exp": token_expiry})
    refresh_token: str = jwt.encode(data_copy, SECRET_KEY, algorithm=ALGORITHM)
    return refresh_token


def link_refresh_token_to_user(db: Session, user_id: int, token: str) -> None:
    """
    This function handles creating refresh token relationships in the database.
    It creates a RefreshToken object with the user's id and their refresh token.
    Then it adds it to the Database and commits the changes.
    """
    db_refresh_token: RefreshToken = RefreshToken(token=token, user_id=user_id)
    db.add(db_refresh_token)
    db.commit()


def revoke_refresh_token_from_user(db: Session, token: str) -> None:
    """
    This function handles deleting/revoking refresh token relationships in the database.
    It retrieves the RefreshToken object with the provided token from the database.
    If the token exists, it deletes it from the database and commits the changes.
    """
    db_refresh_token: Optional[RefreshToken] = (
        db.query(RefreshToken).filter(RefreshToken.token == token).first()
    )
    if db_refresh_token:
        db.delete(db_refresh_token)
        db.commit()


def get_users_refresh_token(db: Session, user_id: int) -> Optional[RefreshToken]:
    """
    This function retrieves all refresh tokens associated with a given user ID from the database.
    """
    refresh_token: Optional[RefreshToken] = (
        db.query(RefreshToken).filter(RefreshToken.user_id == user_id).first()
    )
    return refresh_token


def hash_password(password: str) -> str:
    """
    This function hashes a password using bcrypt with a randomly generated salt.
    """
    salt: bytes = bcrypt.gensalt()
    hashed_password: str = bcrypt.hashpw(password.encode("UTF-8"), salt)
    return hashed_password.decode("UTF-8")


def verify_password(password: str, hashed_password: str) -> bool:
    """
    This function verifies a password by checking if the provided password matches the hashed password.
    """
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))


def get_user_by_id(db: Session, id: str) -> Optional[User]:
    return db.query(User).filter(User.id == id).first()


def verify_token(token: str) -> bool:
    try:
        data: dict = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub: Union[str, None] = str(data.get("sub"))
        username: Union[str, None] = data.get("username")
        exp: Union[int, None] = data.get("exp")

        if sub is not None and username is not None and exp is not None:
            if datetime.utcnow() < datetime.utcfromtimestamp(exp):
                return True
            else:
                return False
        else:
            return False
    except JWTError as e:
        return False


def is_token_expired(token: str, current_time: datetime) -> bool:
    try:
        payload: dict = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        expiry_epoch: int = payload["exp"]
        expiry_datetime: datetime = datetime.utcfromtimestamp(expiry_epoch)
        return expiry_datetime <= current_time
    except jwt.JWTError:
        return True


def generate_reset_code():
    return str(randint(100000, 999999))


def is_valid_address(address: str) -> bool:
    """
    Validate an address using the Google Maps Geocoding API.
    """
    params = {"address": address, "key": GOOGLE_MAPS_API_KEY}

    response = requests.get(
        "https://maps.googleapis.com/maps/api/geocode/json", params=params
    )
    data = response.json()

    return "results" in data and len(data["results"]) > 0


def get_coordinates_from_address(address: str):
    """
    Get coordinates (latitude, longitude) from an address using Google Maps Geocoding API.
    """
    params = {"address": address, "key": GOOGLE_MAPS_API_KEY}

    response = requests.get(
        "https://maps.googleapis.com/maps/api/geocode/json", params=params
    )
    data = response.json()

    if data["status"] == "OK" and data.get("results"):
        location = data["results"][0]["geometry"]["location"]
        return {"lat": location["lat"], "lng": location["lng"]}
    else:
        return None


def get_events_from_database(
    latitude: float, longitude: float, radius: int, db: Session
):
    """
    Get events from the database within a specific radius of the provided coordinates.
    """
    # Earth's radius in miles
    earth_radius_miles = 3959

    # Calculate the bounding box for the radius in miles
    lat_min, lat_max = latitude - (radius / earth_radius_miles), latitude + (
        radius / earth_radius_miles
    )
    lng_min, lng_max = longitude - (
        radius / (earth_radius_miles * abs(math.cos(math.radians(latitude))))
    ), longitude + (
        radius / (earth_radius_miles * abs(math.cos(math.radians(latitude))))
    )

    # Query events within the bounding box
    events = (
        db.query(Post)
        .filter(
            and_(
                Post.latitude >= lat_min,
                Post.latitude <= lat_max,
                Post.longitude >= lng_min,
                Post.longitude <= lng_max,
            )
        )
        .all()
    )

    formatted_events = []
    for event in events:
        formatted_event = {
            "post_id": event.id,
            "user_id": event.user_id,
            "user_name": event.username,
            "title": event.title,
            "content": event.content,
            "address": event.address,
            "latitude": event.latitude,
            "longitude": event.longitude,
            "created_at": event.created_at,
            "attendees": event.attendee_count,
            "deadline": event.deadline,
        }
        formatted_events.append(formatted_event)

    return formatted_events


def is_author(user_id, post_id, db):
    user_post = (
        db.query(user_post_association)
        .filter_by(user_id=user_id, post_id=post_id)
        .first()
    )
    return user_post is not None
