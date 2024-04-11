from fastapi import FastAPI, Depends, HTTPException, status, APIRouter, Request, Body
from fastapi.security import HTTPBasic, HTTPBasicCredentials, OAuth2PasswordRequestForm
from app.database import engine
from app.models import Base
from routers.users import user_router
from routers.events import event_router
from routers.auth import auth_router
from fastapi.security import OAuth2PasswordBearer

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(user_router, tags=["Users"])
app.include_router(event_router, tags=["Events"])
app.include_router(auth_router, tags=["Authentication"])


@app.get("/", tags=["Root"])
def root():
    return {"status": "Ok"}
