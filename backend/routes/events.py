from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import List
import uuid

from backend.database.connection import get_db
from backend.database.models import Venue, Event, Ticket, User
from backend.models.schemas import (
    VenueCreate, VenueResponse,
    EventCreate, EventResponse,
    TicketResponse, BookingRequest,
)

router = APIRouter(prefix="/api/events", tags=["Events & Tickets"])


@router.get("/venues", response_model=List[VenueResponse])
def get_venues(db: Session = Depends(get_db)):
    return db.query(Venue).filter(Venue.is_active == True).all()


@router.post("/venues", response_model=VenueResponse)
def create_venue(data: VenueCreate, db: Session = Depends(get_db)):
    venue = Venue(**data.model_dump())
    db.add(venue)
    db.commit()
    db.refresh(venue)
    return venue


@router.get("", response_model=List[EventResponse])
def get_events(
    category: str = None,
    event_type: str = None,
    status: str = "upcoming",
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    q = db.query(Event).options(db.query(Event).joinedload(Event.venue).execution_options())
    q = db.query(Event)
    if category:
        q = q.filter(Event.category == category)
    if event_type:
        q = q.filter(Event.event_type == event_type)
    if status:
        q = q.filter(Event.status == status)
    events = q.order_by(Event.start_date.asc()).offset((page - 1) * page_size).limit(page_size).all()
    result = []
    for e in events:
        result.append(EventResponse(
            id=e.id,
            venue_id=e.venue_id,
            title=e.title,
            description=e.description,
            event_type=e.event_type,
            category=e.category,
            start_date=e.start_date,
            end_date=e.end_date,
            poster_url=e.poster_url,
            status=e.status,
            is_featured=e.is_featured,
            view_count=e.view_count,
            created_at=e.created_at,
            venue=VenueResponse.model_validate(e.venue) if e.venue else None,
        ))
    return result


@router.post("", response_model=EventResponse)
def create_event(data: EventCreate, db: Session = Depends(get_db)):
    venue = db.query(Venue).filter(Venue.id == data.venue_id).first()
    if not venue:
        raise HTTPException(404, "Venue not found")
    event = Event(**data.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return EventResponse(
        id=event.id,
        venue_id=event.venue_id,
        title=event.title,
        description=event.description,
        event_type=event.event_type,
        category=event.category,
        start_date=event.start_date,
        end_date=event.end_date,
        poster_url=event.poster_url,
        status=event.status,
        is_featured=event.is_featured,
        view_count=event.view_count,
        created_at=event.created_at,
        venue=VenueResponse.model_validate(event.venue) if event.venue else None,
    )


@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(404, "Event not found")
    event.view_count += 1
    db.commit()
    return EventResponse(
        id=event.id,
        venue_id=event.venue_id,
        title=event.title,
        description=event.description,
        event_type=event.event_type,
        category=event.category,
        start_date=event.start_date,
        end_date=event.end_date,
        poster_url=event.poster_url,
        status=event.status,
        is_featured=event.is_featured,
        view_count=event.view_count,
        created_at=event.created_at,
        venue=VenueResponse.model_validate(event.venue) if event.venue else None,
    )


@router.get("/{event_id}/tickets", response_model=List[TicketResponse])
def get_event_tickets(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(404, "Event not found")
    return db.query(Ticket).filter(Ticket.event_id == event_id).all()


@router.post("/{event_id}/book", response_model=List[TicketResponse])
def book_tickets(event_id: int, data: BookingRequest, user_id: int = Query(1), db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(404, "Event not found")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")

    available = db.query(Ticket).filter(
        Ticket.event_id == event_id,
        Ticket.ticket_type == data.ticket_type,
        Ticket.status == "available",
    ).limit(data.quantity).all()

    if len(available) < data.quantity:
        raise HTTPException(400, f"Only {len(available)} tickets available")

    booked = []
    for ticket in available:
        ticket.user_id = user_id
        ticket.status = "booked"
        ticket.purchased_at = datetime.now(timezone.utc)
        ticket.qr_code = f"TKT-{event_id}-{ticket.id}-{uuid.uuid4().hex[:8].upper()}"
        booked.append(ticket)

    db.commit()
    for t in booked:
        db.refresh(t)
    return booked
