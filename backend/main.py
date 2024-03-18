from fastapi import FastAPI, Depends, HTTPException, status, APIRouter, Request, Body
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from app.database import engine
from app.models import Base
from users import user_router
from events import event_router
import random

app = FastAPI()
Base.metadata.create_all(bind=engine)

app.include_router(user_router)
app.include_router(event_router)