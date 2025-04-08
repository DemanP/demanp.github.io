@echo off
start "" http://localhost:8000/
color 0A
cd /d %~dp0
echo "Launching, proceed from website, close this cmd if you don't need to see the site."
echo(
echo "Bat file modified from original bat file by Bluplaper, by G_Kat"
py -m http.server
