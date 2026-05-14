from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone
from typing import List

from backend.database.connection import get_db
from backend.database.models import CreditTransaction, RewardRedemption, UserAchievement, User
from backend.models.schemas import (
    CreditTransactionResponse,
    RewardRedemptionCreate, RewardRedemptionResponse,
    UserAchievementResponse, LeaderboardEntry,
)

router = APIRouter(prefix="/api/rewards", tags=["Earn-to-Earn"])


@router.get("/credits", response_model=List[CreditTransactionResponse])
def get_credit_history(user_id: int = Query(1), db: Session = Depends(get_db)):
    return db.query(CreditTransaction).filter(
        CreditTransaction.user_id == user_id
    ).order_by(CreditTransaction.created_at.desc()).limit(50).all()


@router.get("/credits/balance")
def get_credit_balance(user_id: int = Query(1), db: Session = Depends(get_db)):
    total = db.query(func.coalesce(func.sum(CreditTransaction.credits), 0)).filter(
        CreditTransaction.user_id == user_id
    ).scalar()
    spent = db.query(func.coalesce(func.sum(RewardRedemption.credits_spent), 0)).filter(
        RewardRedemption.user_id == user_id, RewardRedemption.status == "completed"
    ).scalar()
    return {"balance": total - spent, "total_earned": total, "total_spent": spent}


@router.post("/quests", response_model=CreditTransactionResponse)
def complete_quest(action: str = Query(...), credits: int = Query(10), user_id: int = Query(1), db: Session = Depends(get_db)):
    txn = CreditTransaction(
        user_id=user_id,
        action=action,
        credits=credits,
        description=f"Completed quest: {action}",
    )
    db.add(txn)

    existing = db.query(UserAchievement).filter(
        UserAchievement.user_id == user_id,
        UserAchievement.achievement == f"first_{action}",
    ).first()
    if not existing:
        achievement = UserAchievement(
            user_id=user_id,
            achievement=f"first_{action}",
            description=f"First {action} completed",
            icon="🎯",
        )
        db.add(achievement)

    db.commit()
    db.refresh(txn)
    return txn


@router.get("/redeem", response_model=List[RewardRedemptionResponse])
def get_redemptions(user_id: int = Query(1), db: Session = Depends(get_db)):
    return db.query(RewardRedemption).filter(
        RewardRedemption.user_id == user_id
    ).order_by(RewardRedemption.created_at.desc()).all()


@router.post("/redeem", response_model=RewardRedemptionResponse)
def redeem_reward(data: RewardRedemptionCreate, user_id: int = Query(1), db: Session = Depends(get_db)):
    total = db.query(func.coalesce(func.sum(CreditTransaction.credits), 0)).filter(
        CreditTransaction.user_id == user_id
    ).scalar()
    spent = db.query(func.coalesce(func.sum(RewardRedemption.credits_spent), 0)).filter(
        RewardRedemption.user_id == user_id, RewardRedemption.status == "completed"
    ).scalar()
    if total - spent < data.credits_spent:
        raise HTTPException(400, "Insufficient credits")

    redemption = RewardRedemption(user_id=user_id, **data.model_dump(), status="completed")
    db.add(redemption)
    db.commit()
    db.refresh(redemption)
    return redemption


@router.get("/achievements", response_model=List[UserAchievementResponse])
def get_achievements(user_id: int = Query(1), db: Session = Depends(get_db)):
    return db.query(UserAchievement).filter(
        UserAchievement.user_id == user_id
    ).order_by(UserAchievement.created_at.desc()).all()


@router.get("/leaderboard", response_model=List[LeaderboardEntry])
def get_leaderboard(db: Session = Depends(get_db)):
    credits = (
        db.query(
            CreditTransaction.user_id,
            func.coalesce(func.sum(CreditTransaction.credits), 0).label("total_credits"),
        )
        .group_by(CreditTransaction.user_id)
        .subquery()
    )
    ach_count = (
        db.query(
            UserAchievement.user_id,
            func.count(UserAchievement.id).label("ach_count"),
        )
        .group_by(UserAchievement.user_id)
        .subquery()
    )
    rows = (
        db.query(User, credits.c.total_credits, ach_count.c.ach_count)
        .outerjoin(credits, User.id == credits.c.user_id)
        .outerjoin(ach_count, User.id == ach_count.c.user_id)
        .order_by(credits.c.total_credits.desc().nulls_last())
        .limit(50)
        .all()
    )
    result = []
    for i, (user, tc, ac) in enumerate(rows):
        result.append(LeaderboardEntry(
            user_id=user.id,
            name=user.name or user.email,
            total_credits=tc or 0,
            achievements=ac or 0,
            rank=i + 1,
        ))
    return result
