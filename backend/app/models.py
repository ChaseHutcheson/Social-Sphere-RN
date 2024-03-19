from sqlalchemy import (
    Table,
    Column,
    Integer,
    String,
    Boolean,
    Date,
    DateTime,
    LargeBinary,
    ForeignKey,
    Float,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from datetime import datetime
from .database import Base


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    token = Column(String(255), unique=True, index=True)
    user = relationship("User", back_populates="refresh_tokens")


user_post_association = Table(
    "user_post_association",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("post_id", Integer, ForeignKey("posts.id"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    username = Column(String(50))
    email = Column(String(100), unique=True, index=True)
    password = Column(String(255))
    date_of_birth = Column(Date, nullable=True, default=None)
    is_verified = Column(Boolean, default=False)
    verified_at = Column(DateTime, nullable=True, default=None)
    updated_last = Column(DateTime, nullable=True, default=None, onupdate=datetime.now)
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    refresh_tokens = relationship("RefreshToken", back_populates="user")
    posts = relationship("Post", back_populates="user")
    attending = relationship(
        "Post", secondary=user_post_association, back_populates="attendees"
    )


class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    username = username = Column(String(50))
    title = Column(String(100))
    content = Column(String(5000))
    address = Column(String(50))
    latitude = Column(Float)  # Add this line for latitude
    longitude = Column(Float)  # Add this line for longitude
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    attendee_count = Column(Integer, default=0)
    deadline = Column(DateTime)
    attendees = relationship(
        "User", secondary=user_post_association, back_populates="attending"
    )
    user = relationship("User", back_populates="posts")


class TokenRefresh(BaseModel):
    access_token: str
    token_type: str