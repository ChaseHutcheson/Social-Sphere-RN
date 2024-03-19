from pydantic import BaseModel, EmailStr, PastDate, FutureDatetime


class UserCreate(BaseModel):
    """
    Pydantic model for creating a new user.
    """

    first_name: str  # First name of the user
    last_name: str  # Last name of the user
    username: str  # Username chosen by the user
    date_of_birth: PastDate  # Date of birth of the user (must be in the past)
    email: EmailStr  # Email address of the user
    password: str  # Password chosen by the user

class UserLogin(BaseModel):
    """
    Pydantic model for user login.
    """

    email: EmailStr  # Email address of the user
    password: str  # Password for user authentication


class TokenRequest(BaseModel):
    """
    Pydantic model for a token request.
    """

    access_token: str  # Access token requested by the user


class PostCreate(BaseModel):
    """
    Pydantic model for creating a new post.
    """

    title: str  # Title of the post
    content: str  # Content or description of the post
    address: str  # Address where the event or post is located
    deadline: FutureDatetime  # Deadline for the event or post (must be in the future)