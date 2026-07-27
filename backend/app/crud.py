from sqlalchemy.orm import Session
from datetime import datetime

from . import models, schemas


def generate_ticket_id(db: Session):
    count = db.query(models.Ticket).count() + 1
    return f"TKT-{count:04d}"


def create_ticket(db: Session, ticket: schemas.TicketCreate):
    db_ticket = models.Ticket(
        ticket_id=generate_ticket_id(db),
        customer_name=ticket.customer_name,
        customer_email=ticket.customer_email,
        subject=ticket.subject,
        description=ticket.description,
        status="Open",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)

    return db_ticket

def get_tickets(db: Session, search: str = None, status: str = None):
    query = db.query(models.Ticket)

    if search:
        query = query.filter(
            (models.Ticket.ticket_id.contains(search)) |
            (models.Ticket.customer_name.contains(search)) |
            (models.Ticket.customer_email.contains(search)) |
            (models.Ticket.subject.contains(search)) |
            (models.Ticket.description.contains(search))
        )

    if status:
        query = query.filter(models.Ticket.status == status)

    return query.all()

def get_ticket_by_id(db: Session, ticket_id: str):
    return db.query(models.Ticket).filter(
        models.Ticket.ticket_id == ticket_id
    ).first()

def update_ticket(db: Session, ticket_id: str, ticket_update: schemas.TicketUpdate):
    ticket = db.query(models.Ticket).filter(
        models.Ticket.ticket_id == ticket_id
    ).first()

    if not ticket:
        return None

    ticket.status = ticket_update.status
    ticket.updated_at = datetime.utcnow()

    note = models.Note(
        ticket_id=ticket.id,
        note_text=ticket_update.note_text
    )

    db.add(note)
    db.commit()
    db.refresh(ticket)

    return ticket

def add_note(db: Session, ticket_id: str, note: schemas.NoteCreate):
    ticket = db.query(models.Ticket).filter(
        models.Ticket.ticket_id == ticket_id
    ).first()

    if not ticket:
        return None

    db_note = models.Note(
        ticket_id=ticket.id,
        note_text=note.note_text,
        created_at=datetime.utcnow()
    )

    db.add(db_note)
    ticket.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(ticket)

    return ticket