import logging
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()


def start_scheduler():
    if scheduler.running:
        return

    # Check every minute
    scheduler.add_job(
        send_daily_notifications,
        trigger="cron",
        minute="*",
        id="daily_reading_notification",
        replace_existing=True,
    )

    scheduler.start()
    logger.info("Scheduler started (minute-interval mode)")


async def _send_notifications():
    from backend.database.connection import SessionLocal
    from backend.database.models import User, ReadingSchedule, Book, ChapterSummary as ChapterDB, NotificationLog
    from backend.services.ai_summarizer import summarizer
    from backend.services.notification_service import (
        email_notifier, telegram_notifier, whatsapp_notifier,
    )
    from datetime import date, datetime

    db = SessionLocal()
    try:
        now = datetime.now()
        current_time = now.strftime("%H:%M")
        today = date.today().isoformat()
        
        # Get users scheduled for this exact minute
        users = db.query(User).filter(User.is_active == True, User.notification_time == current_time).all()
            schedules = db.query(ReadingSchedule).filter(
                ReadingSchedule.user_id == user.id,
                ReadingSchedule.is_active == True,
            ).all()

            for schedule in schedules:
                book = db.query(Book).filter(Book.id == schedule.book_id).first()
                if not book or not book.is_active:
                    continue

                next_chapter = schedule.current_chapter + 1
                if next_chapter > (book.total_chapters or 999):
                    schedule.is_active = False
                    db.commit()
                    continue

                chapter = db.query(ChapterDB).filter(
                    ChapterDB.book_id == book.id,
                    ChapterDB.chapter_number == next_chapter,
                ).first()

                if not chapter:
                    result = summarizer.generate_summary(
                        book_title=book.title,
                        chapter_number=next_chapter,
                        book_author=book.author,
                    )
                    chapter = ChapterDB(
                        book_id=book.id,
                        chapter_number=next_chapter,
                        summary=result.get("summary", ""),
                        key_points=result.get("key_points", []),
                        reading_time_minutes=result.get("reading_time_minutes", 5),
                        scheduled_date=today,
                    )
                    db.add(chapter)
                    db.commit()
                    db.refresh(chapter)

                schedule.current_chapter = next_chapter
                book.current_chapter = next_chapter

                key_points = chapter.key_points or []

                if user.email_notifications and user.email:
                    # AI Agent Personalized Intro
                    ai_intro = f"Good morning, {user.name}! I'm your Syntra AI Assistant. Here's your curated reading for today."
                    ai_outro = "I'll be back tomorrow with your next chapter. Happy reading!"
                    
                    email_notifier.send_daily_reading(
                        to_email=user.email,
                        book_title=book.title,
                        chapter_num=next_chapter,
                        chapter_title=chapter.chapter_title,
                        summary=f"{ai_intro}\n\n{chapter.summary}\n\n{ai_outro}",
                        key_points=key_points,
                    )

                if user.telegram_notifications and user.telegram_chat_id:
                    telegram_notifier.send_daily_reading(
                        chat_id=user.telegram_chat_id,
                        book_title=book.title,
                        chapter_num=next_chapter,
                        chapter_title=chapter.chapter_title,
                        summary=chapter.summary,
                        key_points=key_points,
                    )

                if user.whatsapp_notifications and user.whatsapp_number:
                    whatsapp_notifier.send_daily_reading(
                        to_number=user.whatsapp_number,
                        book_title=book.title,
                        chapter_num=next_chapter,
                        chapter_title=chapter.chapter_title,
                        summary=chapter.summary,
                        key_points=key_points,
                    )

                missed = db.query(ChapterDB).filter(
                    ChapterDB.book_id == book.id,
                    ChapterDB.is_sent == True,
                ).order_by(ChapterDB.scheduled_date.desc()).first()
                if missed and missed.scheduled_date:
                    from datetime import timedelta
                    missed_date = datetime.strptime(missed.scheduled_date, "%Y-%m-%d").date()
                    days_missed = (date.today() - missed_date).days - 1
                    if days_missed > 0:
                        alert_msg = f"⚠️ You missed {days_missed} day(s) reading {book.title}! Your last reading was on {missed.scheduled_date}. Catch up with Chapter {next_chapter} today!"
                        
                        if user.email_notifications and user.email:
                            email_notifier.send_email(
                                to_email=user.email,
                                subject=f"⚠️ You missed {days_missed} day(s) reading {book.title}",
                                html_content=f"<p>{alert_msg}</p><p><a href='https://syntrahub.onrender.com'>Open SyntraHub</a></p>",
                            )
                        
                        if user.telegram_notifications and user.telegram_chat_id:
                            telegram_notifier.send_message(user.telegram_chat_id, alert_msg)
                            
                        if user.whatsapp_notifications and user.whatsapp_number:
                            whatsapp_notifier.send_message(user.whatsapp_number, alert_msg)

                if book.total_chapters and next_chapter >= book.total_chapters:
                    schedule.is_active = False

                db.commit()

    except Exception as e:
        logger.error("Notification task error: %s", e)
    finally:
        db.close()
