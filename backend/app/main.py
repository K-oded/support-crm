from fastapi import FastAPI
from .database import Base, engine
from .routers import tickets
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Support CRM API")

# Create all database tables
Base.metadata.create_all(bind=engine)

app.include_router(tickets.router)

@app.get("/")
def root():
    return {"message": "Support CRM API is running!"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles

app.mount("/", StaticFiles(directory="app/static", html=True), name="static")
