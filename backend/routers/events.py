from fastapi import APIRouter, HTTPException, Depends, APIRouter, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from fastapi import Depends, HTTPException
from jose import JWTError, jwt
from app.models import User, Post, user_post_association
from app.schema import PostCreate
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import desc
from datetime import datetime
from app.settings import Settings
from app.helper_funcs import (
    verify_token,
    get_coordinates_from_address,
    get_events_from_database,
    is_author,
)

auth_router = APIRouter(prefix="/auth")

SECRET_KEY = Settings.SECRET_KEY
ALGORITHM = Settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = Settings.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS = Settings.REFRESH_TOKEN_EXPIRE_DAYS
TOKEN_TYPE = Settings.TOKEN_TYPE
RESET_CODE_EXPIRE_MINUTES = 30
GOOGLE_MAPS_API_KEY = Settings.GOOGLE_MAPS_API_KEY
OAUTH_SCHEME = Settings.OAUTH_SCHEME

reset_codes = {}

event_router = APIRouter(prefix="/events")


@event_router.post("/make-post")
def make_post(post_data: PostCreate, db: Session = Depends(get_db), access_token = str):
    """
    Endpoint to create a post. Requires a valid token for authentication.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if verify_token(access_token):
        data = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = data.get("sub")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        db_user = db.query(User).filter(User.id == user_id).first()
        if db_user is None:
            raise HTTPException(status_code=404, detail="User not found")

        # Geocode the provided address to get coordinates
        coordinates = get_coordinates_from_address(post_data.address)

        if not coordinates:
            raise HTTPException(status_code=400, detail="Invalid address")

        new_post = Post(
            user_id=db_user.id,
            username=db_user.username,
            title=post_data.title,
            content=post_data.content,
            address=post_data.address,
            deadline=post_data.deadline,
            latitude=coordinates["lat"],
            longitude=coordinates["lng"],
            created_at=datetime.now(),
        )

        # Add the new_post to the user's posts relationship
        db_user.posts.append(new_post)

        # Add the new_post to the attendees relationship (optional, if you want the user to attend their own post)
        db_user.attending.append(new_post)

        db.add(new_post)
        db.commit()
        db.refresh(new_post)

        return {
            "post_id": new_post.id,
            "user_id": new_post.user_id,
            "user_name": new_post.username,
            "title": new_post.title,
            "content": new_post.content,
            "address": new_post.address,
            "latitude": new_post.latitude,
            "longitude": new_post.longitude,
            "created_at": new_post.created_at,
            "attendees": new_post.attendee_count,
            "deadline": new_post.deadline,
        }

    else:
        raise credentials_exception


@event_router.get("/attending-events", response_model=list[dict])
def get_attending_events(db: Session = Depends(get_db), access_token=str):
    """
    Endpoint to get all events that the user is attending. Requires a valid token for authentication.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if verify_token(access_token):
        data = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = data.get("sub")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        db_user = db.query(User).filter(User.id == user_id).first()
        if db_user is None:
            raise HTTPException(status_code=404, detail="User not found")

        attending_events = db_user.attending

        # Convert the attending_events to a list of dictionaries
        attending_events_list = [
            {
                "post_id": event.id,
                "title": event.title,
                "content": event.content,
                "address": event.address,
                "created_at": event.created_at,
                "attendees": [
                    attendee.id for attendee in event.attendees
                ],  # Convert relationship to list
            }
            for event in attending_events
        ]

        return attending_events_list

    else:
        raise credentials_exception


@event_router.get("/events-in-area")
def get_events_in_area(
    address: str, radius: int = 50, db: Session = Depends(get_db), access_token: str = str
):
    """
    Endpoint to get events in a specific area from the database.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Call Google Maps Geocoding API to get coordinates from the address
    coordinates = get_coordinates_from_address(address)

    if not coordinates:
        raise HTTPException(status_code=400, detail="Invalid address")

    if verify_token(access_token):
        # Get events from the database within the specified radius
        events = get_events_from_database(
            coordinates["lat"], coordinates["lng"], radius, db
        )

        return events

    else:
        raise credentials_exception


@event_router.get("/newest-events")
def get_newest_events(db: Session = Depends(get_db), access_token=str):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if verify_token(access_token):
        try:
            events_as_dict = []

            for event in db.query(Post).order_by(desc(Post.created_at)).all():
                events_as_dict.append(
                    {
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
                )

            return events_as_dict
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Internal Server Error: {str(e)}"
            )
    else:
        raise credentials_exception


@event_router.post("/edit-event")
def edit_event(
    post_data: PostCreate, post_id: str, access_token: str, db: Session = Depends(get_db)
):
    if verify_token(access_token):
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if is_author(user_id, post_id, db):
            post = db.query(Post).filter(Post.id == post_id).first()
            if post:
                post.title = post_data.title
                post.content = post_data.content
                post.address = post_data.address
                post.deadline = post_data.deadline
                db.commit()
                return {"message": "Post updated successfully"}
            else:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Post not found",
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User is not post author.",
                headers={"WWW-Authenticate": "Bearer"},
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Couldn't validate credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )


@event_router.post("/attend-event/{post_id}")
def attend_event(post_id: str, access_token: str, db: Session = Depends(get_db)):
    """
    Endpoint to attend an event. Requires a valid token for authentication.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if verify_token(access_token):
        data = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = data.get("sub")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        db_user = db.query(User).filter(User.id == user_id).first()
        if db_user is None:
            raise HTTPException(status_code=404, detail="User not found")

        event_to_attend = db.query(Post).filter(Post.id == post_id).first()
        if event_to_attend is None:
            raise HTTPException(status_code=404, detail="Event not found")

        try:
            # Try to add the user to the attendees of the event
            event_to_attend.attendees.append(db_user)

            # Increment the attendee_count for the event
            event_to_attend.attendee_count += 1

            db.commit()

            return {"message": "Successfully attended the event"}
        except IntegrityError as e:
            # Handle unique constraint violation
            db.rollback()
            return {"message": "User is already attending the event"}

    else:
        raise credentials_exception


@event_router.post("/unattend-event/{post_id}")
def unattend_event(post_id: int, db: Session = Depends(get_db), access_token=str):
    """
    Endpoint to unattend an event. Requires a valid token for authentication.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if verify_token(access_token):
        data = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = data.get("sub")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        db_user = db.query(User).filter(User.id == user_id).first()
        if db_user is None:
            raise HTTPException(status_code=404, detail="User not found")

        event_to_unattend = db.query(Post).filter(Post.id == post_id).first()
        if event_to_unattend is None:
            raise HTTPException(status_code=404, detail="Event not found")

        try:
            # Try to remove the user from the attendees of the event
            event_to_unattend.attendees.remove(db_user)

            # Decrement the attendee_count for the event
            event_to_unattend.attendee_count -= 1

            db.commit()

            return {"message": "Successfully unattended the event"}
        except ValueError:
            # Handle if the user is not found in the attendees list
            db.rollback()
            return {"message": "User is not attending the event"}

    else:
        raise credentials_exception


@event_router.delete("/delete-event")
def delete_event(post_id: str, access_token: str, db: Session = Depends(get_db)):
    if verify_token(access_token):
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if is_author(user_id, post_id, db):
            db.query(user_post_association).filter(
                user_post_association.c.post_id == post_id
            ).delete()
            db.query(Post).filter(Post.id == post_id).delete()
            db.commit()
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User is not post author.",
                headers={"WWW-Authenticate": "Bearer"},
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Couldn't validate credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )
