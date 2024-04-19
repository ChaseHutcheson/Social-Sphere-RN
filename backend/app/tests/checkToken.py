from fastapi import APIRouter, HTTPException, Depends, APIRouter, status
from jose import jwt
from time import time
from fastapi.security import OAuth2PasswordBearer
import math


class Settings:
    # Secret key for encoding and decoding JWT tokens
    SECRET_KEY = "HLBn0v0m3Uo0ZknwzqLRr3qYe6IeHCaf"

    # Algorithm used for encoding and decoding JWT tokens
    ALGORITHM = "HS256"

    # Expiry time for access tokens in minutes
    ACCESS_TOKEN_EXPIRE_MINUTES = 300

    # Expiry time for refresh tokens in days
    REFRESH_TOKEN_EXPIRE_DAYS = 7

    # Token type used in authorization headers
    TOKEN_TYPE = "Bearer"

    # Google Maps API key for geocoding addresses
    GOOGLE_MAPS_API_KEY = "AIzaSyDd0YxufG2QqTaN5JG00q_oT2lmbg-czWA"

    OAUTH_SCHEME = oauth_2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")


SECRET_KEY = Settings.SECRET_KEY
ALGORITHM = Settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = Settings.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS = Settings.REFRESH_TOKEN_EXPIRE_DAYS
TOKEN_TYPE = Settings.TOKEN_TYPE
RESET_CODE_EXPIRE_MINUTES = 30
OAUTH_SCHEME = Settings.OAUTH_SCHEME
GOOGLE_MAPS_API_KEY = Settings.GOOGLE_MAPS_API_KEY

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJBbGNvaG9saWNCcmVhc3RNaWxrIiwiZXhwIjoxfQ.bik9V02GajEVocfiAWYvql2Tkm8NUjvXQzznp5_EV6U"


def check_token(token: str):
    try:
        # Decode the token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # Get the expiration time from the payload
        exp = payload.get("exp")

        # Check if the expiration time is missing
        if exp is None:
            raise HTTPException(
                status_code=400, detail="Missing expiration time in token"
            )

        # Check if the token has expired
        if exp < math.floor(time()):
            return {"result": True}
        else:
            return {"result": False}
    except jwt.ExpiredSignatureError:
        return {"result": True}
    except jwt.JWTError as e:
        # If any other error occurs, log the error and raise an HTTP exception
        print(f"Error during JWT verification: {e}")


print(check_token(token=token))
