REM SET mypath=%~dp0
REM set mydrive=%mypath:~0,2%
REM %mydrive%
REM cd %~dp0
SET mypath=C:\local\flask\work-notes-do\automation
set mydrive=%mypath:~0,2%
%mydrive%
cd %mypath%
cd ..
start C:\Python34\python.exe main.py
start "" http://127.0.0.1:5000
PAUSE