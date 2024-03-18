from fastapi import FastAPI, Depends, HTTPException, status, APIRouter, Request, Body
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from database import SessionLocal
from users import user_router
from events import event_router
import random

app = FastAPI()

app.include_router(user_router)
app.include_router(event_router)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


users = {}

sessions = {}


@app.post("/signup")
def signup(username: str = Body(...), password: str = Body(...)):
    user = users.get(username)
    if user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, details="Username already exists"
        )
    new_user_id = len(users) + 1
    new_user = {"username": username, "password": password, "id": new_user_id}
    users[username] = new_user
    return {"message": "Successfully Registered!"}
