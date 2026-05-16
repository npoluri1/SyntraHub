# Daily Reading System — Implementation Plan

## Current Issues

1. **Images not loading** — picsum.photos URLs might be blocked or slow. Need fallback
2. **Videos not loading** — YouTube embed URLs may be invalid. Need verified IDs
3. **Notifications not firing** — Scheduler needs user with active schedule + configured channels
4. **No daily summary UI** — No page showing reading history / today's chapter
5. **No missed-day tracking** — No way to see which days were skipped
6. **Rich mobile UI** — Need component library for polished look

## Fix 1: Reliable Image System

**Root cause**: `picsum.photos` returns 302 redirects — some CDNs/browsers block these.

**Fix**: Add multiple fallback sources in `media_image_service.py`:
```python
IMAGE_PROVIDERS = [
    lambda w, h: f"https://picsum.photos/{w}/{h}?random={random.randint(1,99999)}",
    lambda w, h: f"https://source.unsplash.com/random/{w}x{h}?books",
    lambda w, h: f"https://placehold.co/{w}x{h}/1e40af/ffffff?text=Book",
]
```

## Fix 2: Verified YouTube Video IDs

Replace with confirmed-working YouTube video IDs:

| Book | Video ID | Embed URL |
|------|----------|-----------|
| Atomic Habits | `PZ7lDrwYdZc` | `https://www.youtube.com/embed/PZ7lDrwYdZc` |
| The Power of Habit | `9qiG5Vjrcto` | `https://www.youtube.com/embed/9qiG5Vjrcto` |
| Deep Work | `3E7hkPZ-HTk` | `https://www.youtube.com/embed/3E7hkPZ-HTk` |
| Think and Grow Rich | `yDOhS6UwHcU` | `https://www.youtube.com/embed/yDOhS6UwHcU` |
| The Alchemist | `CH1oHxyUZiA` | `https://www.youtube.com/embed/CH1oHxyUZiA` |
| Rich Dad Poor Dad | `ZoxeFHAfXao` | `https://www.youtube.com/embed/ZoxeFHAfXao` |
| Man's Search for Meaning | `Rg2lFASdGdE` | `https://www.youtube.com/embed/Rg2lFASdGdE` |
| 1984 | `Yo9UJjMvHqA` | `https://www.youtube.com/embed/Yo9UJjMvHqA` |
| Psychology of Money | `Hj02mRf7G6I` | `https://www.youtube.com/embed/Hj02mRf7G6I` |
| Meditations | `7oKqgQmXXDM` | `https://www.youtube.com/embed/7oKqgQmXXDM` |
| The Subtle Art | `ltf0A_TnM4s` | `https://www.youtube.com/embed/ltf0A_TnM4s` |
| Sapiens | `CjVQJirIrG0` | `https://www.youtube.com/embed/CjVQJirIrG0` |

YouTube Shorts embed URL format: `https://www.youtube.com/embed/VIDEO_ID`

## Fix 3: Notification System (Daily 8 AM)

### Prerequisites for Notifications to Work

1. **`.env` must have valid credentials**:
   ```
   SMTP_EMAIL=your.email@gmail.com
   SMTP_PASSWORD=16-char-app-password
   TELEGRAM_BOT_TOKEN=123456789:ABCdef...
   TWILIO_ACCOUNT_SID=AC...
   TWILIO_AUTH_TOKEN=...
   ```

2. **User must exist in DB with `is_active=True`** (auto-seeded)

3. **User must have notification preferences set** via Settings page:
   - Email address filled in
   - Telegram Chat ID filled in
   - WhatsApp number filled in
   - Corresponding toggle ON

4. **Book must be scheduled** via Dashboard → Schedule button on any book

5. **Scheduler timezone** is `Asia/Kolkata` (08:30 AM default). To change: set `NOTIFICATION_TIME=08:00` in `.env`

### How to Test Immediately

```bash
# Test notification manually (instant):
curl http://localhost:8000/api/test-notification?user_id=1

# Or via the Dashboard UI, click "Send to My Phone" button
```

### Add Test Notification Endpoint

Add this route to trigger instant notification for testing:

```python
@router.get("/api/test-notification")
async def test_notification(user_id: int = 1, db: Session = Depends(get_db)):
    from backend.tasks.scheduler import send_daily_notifications
    send_daily_notifications()
    return {"status": "triggered", "message": "Notification sent to all active users"}
```

## Fix 4: Daily Reading Summary UI Page

Create `frontend/src/pages/DailyReading.js`:

```jsx
const DailyReading = () => {
  // Fetch reading history: /api/reading/history?user_id=1
  // Show:
  // - Today's scheduled chapter (if any)
  // - Calendar/ timeline of past chapters read
  // - Missed days highlighted in red
  // - Reading streak counter
  // - Next book in queue
};
```

### Data Model (already exists)
```python
# ChapterSummary stores all summaries
class ChapterSummary:
    book_id, chapter_number, summary, key_points,
    reading_time_minutes, scheduled_date, is_sent, sent_at
```

### API Endpoint (if not exists)
```python
@router.get("/api/reading/history")
def get_reading_history(user_id: int, db: Session = Depends(get_db)):
    summaries = db.query(ChapterSummary).filter(
        ChapterSummary.is_sent == True
    ).order_by(ChapterSummary.scheduled_date.desc()).all()
    # Return grouped by date with book info
```

## Fix 5: Missed-Day Tracking & Alerts

Add a `NotificationLog` model check to detect gaps:

```python
# In scheduler.py, after sending:
# Check if yesterday was missed
last_summary = db.query(ChapterSummary).filter(
    ChapterSummary.book_id == book.id,
    ChapterSummary.is_sent == True
).order_by(ChapterSummary.scheduled_date.desc()).first()

if last_summary:
    days_missed = (date.today() - last_summary.scheduled_date).days - 1
    if days_missed > 0:
        subject = f"⚠️ You missed {days_missed} day(s) of reading {book.title}!"
        # Send catch-up alert
```

## Fix 6: Rich Mobile UI Library

Install and use a proper UI library for polished look:

```bash
cd frontend && npm install @radix-ui/react-tabs @radix-ui/react-dialog framer-motion
```

### Framer Motion for animations:
```jsx
import { motion, AnimatePresence } from 'framer-motion';
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} />
```

### Radix UI for accessible components:
```jsx
import * as Tabs from '@radix-ui/react-tabs';
<Tabs.Root><Tabs.List><Tabs.Trigger value="today">Today</Tabs.Trigger></Tabs.List></Tabs.Root>
```

## Implementation Order

1. Fix `media_image_service.py` — add fallback providers
2. Fix seed data — use only verified YouTube IDs
3. Add `/api/test-notification` route for instant testing
4. Add `/api/reading/history` endpoint
5. Create `DailyReading.js` page with history, streak, missed-day UI
6. Install framer-motion, add page transition animations
7. Test email notification with real Gmail app password
8. Deploy and verify

## Claude Code Prompts

### Prompt 1: Fix Images & Videos
```
Fix the image loading system in SyntraHub. In 
backend/services/media_image_service.py, add multiple 
fallback image providers so if picsum.photos fails, 
it falls back to placehold.co with a colored gradient 
and text overlay. 

Also verify all YouTube embed URLs in 
backend/data/seed_catalog.py media_data section 
actually work — replace any that return 404 with 
known-working video IDs from this list: 
Atomic Habits=PZ7lDrwYdZc, Deep Work=3E7hkPZ-HTk, 
Think and Grow Rich=yDOhS6UwHcU, 
The Alchemist=CH1oHxyUZiA, 
Rich Dad Poor Dad=ZoxeFHAfXao, 
Man's Search for Meaning=Rg2lFASdGdE, 
1984=Yo9UJjMvHqA, 
Psychology of Money=Hj02mRf7G6I, 
Meditations=7oKqgQmXXDM, 
The Subtle Art=ltf0A_TnM4s, 
Sapiens=CjVQJirIrG0,

Also update the MediaCard.js component to handle 
iframe loading errors gracefully (show placeholder 
on error).
```

### Prompt 2: Notifications
```
In SyntraHub, create an instant test notification 
endpoint at /api/test-notification that triggers 
the daily reading notification system immediately 
for all active users. 

Also add a check in the scheduler 
(backend/tasks/scheduler.py) to detect missed days:
if a user had a reading scheduled yesterday but no 
ChapterSummary was marked is_sent=True for that date, 
send a "You missed yesterday's reading!" alert.

The notification system is in 
backend/services/notification_service.py (Email 
via SMTP, Telegram bot, Twilio WhatsApp).
```

### Prompt 3: Daily Reading UI
```
Create a Daily Reading History page at 
frontend/src/pages/DailyReading.js in SyntraHub. 

Add it to the navbar and App.js routing.

The page should:
- Fetch from /api/reading/history?user_id=1
- Show a timeline of past summaries grouped by date
- Highlight today's scheduled chapter prominently
- Show missed days in red/orange
- Display reading streak (consecutive days)
- List next 5 books/ chapters in queue

Add the corresponding API endpoint at 
backend/routes/reading.py or a new route.

Style it to match the existing dark mode theme 
with the gold accent (#b8860b).
```

### Prompt 4: Rich Animations
```
Install framer-motion in the SyntraHub frontend 
and add page transition animations to all pages. 

Wrap page content in motion.div with:
- fade-in-up on mount (opacity 0->1, y 20->0)
- stagger children (0.05s delay per child)
- scale on hover for cards (1.02)

Import { motion, AnimatePresence } and replace 
existing CSS animations for pages.
```
