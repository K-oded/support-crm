from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from fastapi import Query
from fastapi import HTTPException

from ..database import SessionLocal
from .. import crud, schemas

router = APIRouter(
    prefix="/api/tickets",
    tags=["Tickets"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=schemas.TicketResponse)
def create_ticket(ticket: schemas.TicketCreate, db: Session = Depends(get_db)):
    return crud.create_ticket(db, ticket)

@router.get("/", response_model=List[schemas.TicketResponse])
def get_all_tickets(
    search: str = Query(None),
    status: str = Query(None),
    db: Session = Depends(get_db)
):
    return crud.get_tickets(db, search, status)

@router.get("/{ticket_id}", response_model=schemas.TicketResponse)
def get_ticket(ticket_id: str, db: Session = Depends(get_db)):
    ticket = crud.get_ticket_by_id(db, ticket_id)

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    return ticket

@router.put("/{ticket_id}", response_model=schemas.TicketResponse)
def update_ticket(
    ticket_id: str,
    ticket_update: schemas.TicketUpdate,
    db: Session = Depends(get_db)
):
    ticket = crud.update_ticket(db, ticket_id, ticket_update)

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    return ticket

@router.post("/{ticket_id}/notes", response_model=schemas.TicketResponse)
def add_note(
    ticket_id: str,
    note: schemas.NoteCreate,
    db: Session = Depends(get_db)
):
    ticket = crud.add_note(db, ticket_id, note)

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    return ticket