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
