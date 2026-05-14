from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import List
import uuid

from backend.database.connection import get_db
from backend.database.models import PaymentMethod, Wallet, Transaction, Invoice, User
from backend.models.schemas import (
    PaymentMethodCreate, PaymentMethodResponse,
    WalletResponse, TransferRequest, TransactionResponse,
    InvoiceResponse, QRPaymentRequest,
)

router = APIRouter(prefix="/api/payments", tags=["Payments & Wallet"])


def _get_or_create_wallet(user_id: int, db: Session) -> Wallet:
    wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()
    if not wallet:
        wallet = Wallet(user_id=user_id, balance_usd=1000.0, balances={"USD": 1000.0})
        db.add(wallet)
        db.commit()
        db.refresh(wallet)
    return wallet


@router.get("/wallet", response_model=WalletResponse)
def get_wallet(user_id: int = Query(1), db: Session = Depends(get_db)):
    wallet = _get_or_create_wallet(user_id, db)
    return wallet


@router.get("/wallet/transactions", response_model=List[TransactionResponse])
def get_transactions(user_id: int = Query(1), db: Session = Depends(get_db)):
    wallet = _get_or_create_wallet(user_id, db)
    return db.query(Transaction).filter(
        Transaction.wallet_id == wallet.id
    ).order_by(Transaction.created_at.desc()).all()


@router.post("/transfer", response_model=TransactionResponse)
def transfer(data: TransferRequest, user_id: int = Query(1), db: Session = Depends(get_db)):
    if data.amount <= 0:
        raise HTTPException(400, "Amount must be positive")
    wallet = _get_or_create_wallet(user_id, db)
    if wallet.balance_usd < data.amount:
        raise HTTPException(400, "Insufficient funds")

    wallet.balance_usd -= data.amount
    if "USD" in wallet.balances:
        wallet.balances["USD"] -= data.amount

    txn = Transaction(
        wallet_id=wallet.id,
        transaction_type="transfer_out" if data.to_user_id else "withdrawal",
        amount=data.amount,
        currency=data.currency,
        description=data.description,
        reference_id=f"TXN-{uuid.uuid4().hex[:12].upper()}",
        status="completed",
    )
    db.add(txn)
    wallet.updated_at = datetime.now(timezone.utc)

    if data.to_user_id:
        target = _get_or_create_wallet(data.to_user_id, db)
        target.balance_usd += data.amount
        if "USD" in target.balances:
            target.balances["USD"] += data.amount
        txn_in = Transaction(
            wallet_id=target.id,
            transaction_type="transfer_in",
            amount=data.amount,
            currency=data.currency,
            description=f"Received from user {user_id}",
            reference_id=txn.reference_id,
            status="completed",
        )
        db.add(txn_in)

    db.commit()
    db.refresh(txn)
    return txn


@router.get("/methods", response_model=List[PaymentMethodResponse])
def get_payment_methods(user_id: int = Query(1), db: Session = Depends(get_db)):
    return db.query(PaymentMethod).filter(
        PaymentMethod.user_id == user_id, PaymentMethod.is_active == True
    ).all()


@router.post("/methods", response_model=PaymentMethodResponse)
def add_payment_method(data: PaymentMethodCreate, user_id: int = Query(1), db: Session = Depends(get_db)):
    if data.is_default:
        db.query(PaymentMethod).filter(
            PaymentMethod.user_id == user_id
        ).update({"is_default": False})
    method = PaymentMethod(user_id=user_id, **data.model_dump())
    db.add(method)
    db.commit()
    db.refresh(method)
    return method


@router.delete("/methods/{method_id}")
def delete_payment_method(method_id: int, user_id: int = Query(1), db: Session = Depends(get_db)):
    method = db.query(PaymentMethod).filter(
        PaymentMethod.id == method_id, PaymentMethod.user_id == user_id
    ).first()
    if not method:
        raise HTTPException(404, "Payment method not found")
    method.is_active = False
    db.commit()
    return {"message": "Payment method removed"}


@router.post("/qr/generate")
def generate_qr_payment(data: QRPaymentRequest, user_id: int = Query(1), db: Session = Depends(get_db)):
    ref = f"QR-{uuid.uuid4().hex[:12].upper()}"
    return {
        "qr_data": f"superapp://pay?ref={ref}&amount={data.amount}&currency={data.currency}",
        "reference": ref,
        "amount": data.amount,
        "currency": data.currency,
        "description": data.description,
    }


@router.get("/invoices", response_model=List[InvoiceResponse])
def get_invoices(user_id: int = Query(1), db: Session = Depends(get_db)):
    return db.query(Invoice).filter(Invoice.user_id == user_id).order_by(Invoice.created_at.desc()).all()
