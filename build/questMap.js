const locationButton = document.getElementById( "locationButton" );
locationButton.addEventListener( "click", getLocation );
const motionButton = document.getElementById( "motionButton" );
motionButton.addEventListener( "click", getMotion );

let userLocation = [174.85546448262812, -41.07448707375911] 
let userFacingDirection = 135
let camera
let engine
let canvas
let beta = 0
let gamma = 0

/** CALL GPS */
function  getLocation(){
    locationButton.style.display = "none"
    navigator.geolocation.getCurrentPosition(gpsSuccess, gpsError);
}

 const gpsSuccess = (position) => {
    userLocation = [position.coords.longitude, position.coords.latitude] 
    userFacingDirection = position.coords.heading ? position.coords.heading : -90
    buildWorld()
 }

 const gpsError = (error) => {
    console.log('gps error', error.message)
    alert('Please turn on Location Services')
    debug('GPS error: ');
    debug(error.message);
  };

  /** MOTION */

  function getMotion(){
    motionButton.style.display = "none"
    let sentOnce = false
    // ios 13+
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
        .then(response => {
            console.log('iOS DeviceOrientationEvent permission', response)
            if (response == 'granted') {
                window.addEventListener('deviceorientation', (e) => {
                    userFacingDirection = e.webkitCompassHeading
                    // 1. try device orientation camera
                    // scene.activeCamera.detachControl(canvas);
                    // const deviceCamera = new BABYLON.DeviceOrientationCamera("DeviceCamera", new BABYLON.Vector3(0, 15, -45), scene);
                    // scene.activeCamera = deviceCamera;
                    // deviceCamera.attachControl(canvas, false);
                    
                    //2. try bind camera to beta and game values with registerbeforerender
                    // beta = e.beta
                    // gamma = e.gamma

                    //3. try add vr device orientation controls
                    if (!sentOnce) {
                        sentOnce = !sentOnce
                    }
                })
            } 
        })
        .catch(console.error)
    } else {
        window.addEventListener('deviceorientation', (e) => {
            userFacingDirection = e.webkitCompassHeading

            if (!sentOnce) {
                sentOnce = !sentOnce
                buildWorld()
            }
        })
        buildWorld()
    }
    getLocation()
}

function buildWorld(){
    /** BABYLON SETUP **/
    let scene
    
    function createEngine() {
        canvas = document.getElementById("renderCanvas"); // Canvas element required for navigation
        engine = new BABYLON.Engine(canvas, true);
        return 
    }
    
    function createScene() {
        scene = new BABYLON.Scene(engine);
        scene.activeCamera = new BABYLON.FreeCamera("mapbox-Camera", new BABYLON.Vector3(), scene);
        camera = scene.activeCamera; 
        camera.inputs.addDeviceOrientation(0.5);
        scene.autoClear = false;
        scene.detachControl();
        camera.attachControl(canvas, true);

          /**  XR SETUP */
          async function waitForVRSupport(){
            const vrSupported = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-vr');
            return vrSupported
          }
        if (!waitForVRSupport()) {
            // webXR won't work in local server, use old webVR standard instead
            var vrHelper = scene.createDefaultVRExperience({createDeviceOrientationCamera:false, useXR: true,
                disableDefaultUI: true,
                floorMeshes: [ground]
            });
            vrHelper.enableTeleportation({floorMeshes: [ground]});
            const sessionManager = new BABYLON.WebXRSessionManager(scene);
            const xrCamera = new BABYLON.WebXRCamera("xrCamera", scene, sessionManager);
            // xrCamera.setTransformationFromNonVRCamera("mapbox-Camera", true);
        }
        if (waitForVRSupport()) {
            // secure browser
            async function waitForXRExperience(){
                var defaultXRExperience = await BABYLON.WebXRDefaultExperience.CreateAsync(scene)
                return defaultXRExperience
            }
            let wait = 0
            if (!waitForXRExperience() && wait < 20) {
                wait++
                waitForXRExperience()
            } 
            if (wait === 20) {
                alert("This browser does not support XR")
            } if (waitForXRExperience()) {
                runVR()
            }

            function runVR(){
                console.log('VR is running')
                // const sessionManager = new BABYLON.WebXRSessionManager(scene);
                // const xrCamera = new BABYLON.WebXRCamera("xrCamera", scene, sessionManager);

                // xrCamera.setTransformationFromNonVRCamera("mapbox-Camera", true);
            }
        }

        /**  BROWSER RESIZE */
        window.addEventListener('resize', function () {
            engine.resize();
        });

        return scene;	
    }

    /** MAPBOX SETUP **/

    mapboxgl.accessToken = 'pk.eyJ1IjoiYnNpZGVzNDQiLCJhIjoiY2xiYWR1Z29hMDdmbjN4bG1idndnajY1MyJ9.-s33q85oreynlcmXeqilOQ';

    var map = new mapboxgl.Map({
        bearing: userFacingDirection,
        container: 'map', 
        style: 'mapbox://styles/bsides44/clb9wiw5h000w14nx4dmxci2i', //from MapBox Style Editor
        center: userLocation, // [lng, lat] , 
        zoom: 19, 
        optimizeForTerrain: true,
        pitch: 85, //0-85
        scrollZoom: true,
        antialias: true,
    })

    // map.on('style.load', () => {
    //     map.addLayer(customLayer);
    // });

    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
    }));
};


/** DEBUG QUEST BROWSESR */
function debug(words){
    var paragraph = document.getElementById('printDebug')
    var text = document.createTextNode(words);
    paragraph.appendChild(text)
}