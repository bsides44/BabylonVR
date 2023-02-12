# BabylonVR

A Work-in-progress Mapbox integration with Babylon.js

The aim is to have a virtual world geolocated and matching the user's device orientation, to show them what their surroundings would look like if the world were still covered in trees. The user will move their device around and view their surroundings as peaceful and nature-filled.

I wanted it to run as fully immersed VR in the Quest browser, but so far tests in Wolvic have only been able to generate the world on a 2D plane in front of the user.

Currently in questMap.js I have a geolocated rendering from Mapbox running with Mapbox controls. The next step is to tie VR headset movement and AR device movement to the Mapbox controls.

Later I would like to utilise Babylon to render 3D trees. In boxMapVRIntegration.js there are some preliminary experiments in adding 3D objects with babylon.

It may turn out better to build a terrain using elevation data, rather than using a mapbox map. Then we'll have more control over the 3D environment with Babylon.

To run:

In terminal use 

*npm -g install local-web-server*

to install a simple local web server globally

and run 

*ws*

from the BabylonVR folder to run the server. 

Use the url address displayed in your browser to open boxMapVR.html

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