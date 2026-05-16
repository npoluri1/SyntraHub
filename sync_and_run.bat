@echo off
echo Pulling latest changes from GitHub...
git pull origin master
echo Building frontend...
cd frontend
call npm run build
cd ..
echo Starting local server...
python run.py
pause
