from fastapi import FastAPI, Depends, HTTPException, status, APIRouter, Request, Body
from fastapi.security import HTTPBasic, HTTPBasicCredentials, OAuth2PasswordRequestForm
from app.database import engine
from app.models import Base
from routers.users import user_router
from routers.events import event_router
from routers.auth import auth_router

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(user_router)
app.include_router(event_router)
app.include_router(auth_router)


@app.get("/")
def root():
    return {"status": "Ok"}
