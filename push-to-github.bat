@echo off
setlocal

set TOKEN=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
set REPO=kaizarild-international

echo.
echo === Getting your GitHub username ===
for /f "tokens=2 delims=:, " %%a in ('curl -s -H "Authorization: token %TOKEN%" https://api.github.com/user ^| findstr /i "\"login\""') do set USERNAME=%%~a
set USERNAME=%USERNAME:"=%
echo Username: %USERNAME%

echo.
echo === Creating GitHub repository: %REPO% ===
curl -s -X POST ^
  -H "Authorization: token %TOKEN%" ^
  -H "Accept: application/vnd.github+json" ^
  -H "Content-Type: application/json" ^
  https://api.github.com/user/repos ^
  -d "{\"name\":\"%REPO%\",\"private\":true,\"description\":\"Kaizari L&D International Website\"}" > nul

echo Done (repo created or already exists)

echo.
echo === Initialising git ===
git init
git config user.email "dahomaconsulting@gmail.com"
git config user.name "Kaizari L&D"
git branch -M main

echo.
echo === Staging all files ===
git add .
git commit -m "Initial commit: Kaizari L&D International website"

echo.
echo === Pushing to GitHub ===
git remote remove origin 2>nul
git remote add origin https://%TOKEN%@github.com/%USERNAME%/%REPO%.git
git push -u origin main

echo.
echo ===================================================
echo  SUCCESS! Your repo is live at:
echo  https://github.com/%USERNAME%/%REPO%
echo ===================================================
pause
