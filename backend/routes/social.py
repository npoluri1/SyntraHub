from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from typing import List

from backend.database.connection import get_db
from backend.database.models import (
    SocialPost, SocialComment, SocialStory, SocialReel,
    Conversation, Message, User, social_post_likes,
)
from backend.models.schemas import (
    SocialPostCreate, SocialPostResponse,
    SocialCommentCreate, SocialCommentResponse,
    SocialStoryCreate, SocialStoryResponse,
    SocialReelCreate, SocialReelResponse,
    ConversationCreate, ConversationResponse,
    MessageCreate, MessageResponse,
)

router = APIRouter(prefix="/api/social", tags=["Social Network"])


@router.get("/feed", response_model=List[SocialPostResponse])
def get_feed(page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100), db: Session = Depends(get_db)):
    posts = db.query(SocialPost).order_by(SocialPost.created_at.desc()).offset(
        (page - 1) * page_size
    ).limit(page_size).all()
    return posts


@router.post("/posts", response_model=SocialPostResponse)
def create_post(data: SocialPostCreate, user_id: int = Query(1), db: Session = Depends(get_db)):
    post = SocialPost(user_id=user_id, **data.model_dump())
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.get("/posts/{post_id}", response_model=SocialPostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(SocialPost).filter(SocialPost.id == post_id).first()
    if not post:
        raise HTTPException(404, "Post not found")
    return post


@router.delete("/posts/{post_id}")
def delete_post(post_id: int, user_id: int = Query(1), db: Session = Depends(get_db)):
    post = db.query(SocialPost).filter(SocialPost.id == post_id, SocialPost.user_id == user_id).first()
    if not post:
        raise HTTPException(404, "Post not found or not yours")
    db.delete(post)
    db.commit()
    return {"message": "Post deleted"}


@router.post("/posts/{post_id}/like")
def like_post(post_id: int, user_id: int = Query(1), db: Session = Depends(get_db)):
    post = db.query(SocialPost).filter(SocialPost.id == post_id).first()
    if not post:
        raise HTTPException(404, "Post not found")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    if user in post.liked_by:
        post.liked_by.remove(user)
        post.like_count = max(0, post.like_count - 1)
        db.commit()
        return {"liked": False, "like_count": post.like_count}
    post.liked_by.append(user)
    post.like_count += 1
    db.commit()
    return {"liked": True, "like_count": post.like_count}


@router.get("/posts/{post_id}/comments", response_model=List[SocialCommentResponse])
def get_comments(post_id: int, db: Session = Depends(get_db)):
    return db.query(SocialComment).filter(
        SocialComment.post_id == post_id, SocialComment.parent_id.is_(None)
    ).order_by(SocialComment.created_at.asc()).all()


@router.post("/posts/{post_id}/comments", response_model=SocialCommentResponse)
def create_comment(post_id: int, data: SocialCommentCreate, user_id: int = Query(1), db: Session = Depends(get_db)):
    post = db.query(SocialPost).filter(SocialPost.id == post_id).first()
    if not post:
        raise HTTPException(404, "Post not found")
    comment = SocialComment(post_id=post_id, user_id=user_id, **data.model_dump())
    db.add(comment)
    post.comment_count += 1
    db.commit()
    db.refresh(comment)
    return comment


@router.get("/stories", response_model=List[SocialStoryResponse])
def get_stories(db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    return db.query(SocialStory).filter(SocialStory.expires_at > now).order_by(SocialStory.created_at.desc()).all()


@router.post("/stories", response_model=SocialStoryResponse)
def create_story(data: SocialStoryCreate, user_id: int = Query(1), db: Session = Depends(get_db)):
    story = SocialStory(
        user_id=user_id,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=24),
        **data.model_dump(),
    )
    db.add(story)
    db.commit()
    db.refresh(story)
    return story


@router.get("/reels", response_model=List[SocialReelResponse])
def get_reels(page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100), db: Session = Depends(get_db)):
    return db.query(SocialReel).order_by(SocialReel.created_at.desc()).offset(
        (page - 1) * page_size
    ).limit(page_size).all()


@router.post("/reels", response_model=SocialReelResponse)
def create_reel(data: SocialReelCreate, user_id: int = Query(1), db: Session = Depends(get_db)):
    reel = SocialReel(user_id=user_id, **data.model_dump())
    db.add(reel)
    db.commit()
    db.refresh(reel)
    return reel


@router.get("/messenger/conversations", response_model=List[ConversationResponse])
def get_conversations(user_id: int = Query(1), db: Session = Depends(get_db)):
    convos = (
        db.query(Conversation)
        .join(Conversation.participants)
        .filter(User.id == user_id)
        .order_by(Conversation.updated_at.desc().nulls_last())
        .all()
    )
    result = []
    for c in convos:
        result.append(ConversationResponse(
            id=c.id,
            participant_ids=[p.id for p in c.participants],
            created_at=c.created_at,
            updated_at=c.updated_at,
        ))
    return result


@router.post("/messenger/conversations", response_model=ConversationResponse)
def create_conversation(data: ConversationCreate, db: Session = Depends(get_db)):
    conv = Conversation()
    for pid in data.participant_ids:
        user = db.query(User).filter(User.id == pid).first()
        if user:
            conv.participants.append(user)
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return ConversationResponse(
        id=conv.id,
        participant_ids=[p.id for p in conv.participants],
        created_at=conv.created_at,
        updated_at=conv.updated_at,
    )


@router.get("/messenger/conversations/{conv_id}/messages", response_model=List[MessageResponse])
def get_messages(conv_id: int, db: Session = Depends(get_db)):
    conv = db.query(Conversation).filter(Conversation.id == conv_id).first()
    if not conv:
        raise HTTPException(404, "Conversation not found")
    return db.query(Message).filter(Message.conversation_id == conv_id).order_by(Message.created_at.asc()).all()


@router.post("/messenger/messages", response_model=MessageResponse)
def send_message(data: MessageCreate, user_id: int = Query(1), db: Session = Depends(get_db)):
    conv = db.query(Conversation).filter(Conversation.id == data.conversation_id).first()
    if not conv:
        raise HTTPException(404, "Conversation not found")
    msg = Message(conversation_id=data.conversation_id, sender_id=user_id, content=data.content, media_url=data.media_url)
    db.add(msg)
    conv.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(msg)
    return msg


@router.get("/friends", response_model=List[dict])
def get_friends(user_id: int = Query(1), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    convos = (
        db.query(Conversation)
        .join(Conversation.participants)
        .filter(User.id == user_id)
        .all()
    )
    friends = set()
    for c in convos:
        for p in c.participants:
            if p.id != user_id:
                friends.add(p.id)
    users = db.query(User).filter(User.id.in_(list(friends))).all() if friends else []
    return [{"id": u.id, "name": u.name, "email": u.email, "avatar_url": u.avatar_url} for u in users]
