# BabylonVR

Working with Babylon JS and Mapbox

In a terminal use 

*npm -g install local-web-server*

to install a simple local web server globally

and 

with the terminal path at the project folder use

*ws* 

to run the server and use the url address displayed in your browser to open index.html

i.e.
http://localhost:8000/mapWorld/boxMapVR.html


QUEST LOCAL SETUP


In terminal run 

adb devices 

One device should show up - this is your tethered Quest 2

You should be in the workspace in Quest, not Air Link

In terminal, run 

adb reverse tcp:8000 tcp:8000

Open http://localhost:8000/mapWorld/boxMapVR.html in wolvic quest browser

debug() prints to html in lieu of console logging