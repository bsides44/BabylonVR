// https://jsfiddle.net/fabsharp/w3dephvm/

//TODO 
// gps denied in quest browser
// option to replace mapbox with terrain built on elevation data from getElevation function
// location polling (watchLocation) breaks on mobile, forces constant reload

// Add gesture to get device orientation working
// error is: Requesting device orientation access requires a user gesture to prompt

// get camera to move with VR headset
// get left controller to rotate camera
// access full screen in wolvic?
// add trees and bird sounds
// add entrance screen
// add multiplayer
const locationButton = document.getElementById( "locationButton" );
locationButton.addEventListener( "click", getLocation );
const motionButton = document.getElementById( "motionButton" );
motionButton.addEventListener( "click", getMotion );

let userLocation = [174.85546448262812, -41.07448707375911] 
let userFacingDirection = 135
let camera
let engine
let canvas
// let beta = 0
// let gamma = 0

/** CALL GPS */
function getLocation(){
    locationButton.style.display = "none"
    navigator.geolocation.getCurrentPosition(gpsSuccess, gpsError);
    motionButton.style.display = "block"
}

 const gpsSuccess = (position) => {
    userLocation = [position.coords.longitude, position.coords.latitude] 
    userFacingDirection = position.coords.heading ? position.coords.heading : -90
 }

 const gpsError = (error) => {
    console.log('gps error', error.message)
    alert('Please turn on Location Services')
    debug('GPS error: ');
    debug(error.message);
  };

  /** MOTION */

  function getMotion(){
    console.log('getting orientaiton')
    motionButton.style.display = "none"
    // ios 13+
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        console.log('ios 13+')
        DeviceOrientationEvent.requestPermission()
        .then(response => {
            console.log('DeviceOrientationEvent permission', response)
            if (response == 'granted') {
                window.addEventListener('deviceorientation', (e) => {
                    userFacingDirection = e.webkitCompassHeading ? e.webkitCompassHeading : userFacingDirection
                    // 1. try device orientation camera
                    // scene.activeCamera.detachControl(canvas);
                    // const deviceCamera = new BABYLON.DeviceOrientationCamera("DeviceCamera", new BABYLON.Vector3(0, 15, -45), scene);
                    // scene.activeCamera = deviceCamera;
                    // deviceCamera.attachControl(canvas, false);
                    
                    //2. try bind camera to beta and game values with registerbeforerender
                    // beta = e.beta
                    // gamma = e.gamma

                    //3. try add vr device orientation controls
                    console.log('e.webkitCompassHeading', e.webkitCompassHeading)
                    console.log('OR facing direction', userFacingDirection)
                })
                buildWorld()
            }
        })
        .catch(console.error)
    } else {
        console.log('not ios')
        window.addEventListener('deviceorientation', (e) => {
            userFacingDirection = e.webkitCompassHeading ? e.webkitCompassHeading : userFacingDirection
        })
        buildWorld()
    }
}

function buildWorld(){
    console.log('BW facing direction', userFacingDirection)
    /** BABYLON SETUP **/
    let scene
    
    function createEngine() {
        canvas = document.getElementById("renderCanvas"); // Canvas element required for navigation
        engine = new BABYLON.Engine(canvas, true);
        return 
    }
    
    function createScene() {
        scene = new BABYLON.Scene(engine);
        // scene.activeCamera = new BABYLON.ArcRotateCamera("mapbox-Camera", new BABYLON.Vector3(), scene);
        // scene.autoClear = false;
        // scene.detachControl();

        // camera = scene.activeCamera;
        // camera.attachControl(canvas, true);
        // // camera.inputs.add(new BABYLON.ArcRotateCameraVRDeviceOrientationInput());
        // camera.inputs.addVRDeviceOrientation()

        camera = new BABYLON.DeviceOrientationCamera("DevOr_camera", new BABYLON.Vector3(0, 0, 0), scene);
        // camera.setTarget(new BABYLON.Vector3(0, 0, -10));
        camera.angularSensibility = 10;
        camera.moveSensibility = 10;
        camera.attachControl(canvas, true);

        const light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(1, 1, 0), scene)
    
        const ground = BABYLON.Mesh.CreateGround('', 10, 10, 3, scene)
        ground.position.y = -3
        ground.material = new BABYLON.StandardMaterial('', scene)
        // window.m = ground.material.specularColor = BABYLON.Color3.Black()
        // ground.material.diffuseColor = BABYLON.Color3.FromInts(50, 100, 50)


        /** DRAW 3D MODEL **/

        // function makeMesh(x, z, mode, parent) {
        //     var m = BABYLON.Mesh.CreateBox('', 5, scene)
        //     m.scaling.z = 0.5
        //     m.position.copyFromFloats(x, 0, z)
        //     m.billboardMode = mode
        //     m.material = new BABYLON.StandardMaterial('', scene)
        //     var c = mode ? 150 : 0
        //     m.material.diffuseColor = BABYLON.Color3.FromInts(100 + c, 100, 250 - c)
        //     if (parent) {
        //       m.parent = parent;
        //     }
        //     return m
        // }
        
        // var m1 = makeMesh(-20, 0, BABYLON.Mesh.BILLBOARDMODE_NONE)
        // var m2 = makeMesh(-10, 0, BABYLON.Mesh.BILLBOARDMODE_X)
        // var m3 = makeMesh(0, 0, BABYLON.Mesh.BILLBOARDMODE_Y)
        // var m4 = makeMesh(10, 0, BABYLON.Mesh.BILLBOARDMODE_Z)
        // var m5 = makeMesh(20, 0, BABYLON.Mesh.BILLBOARDMODE_ALL)
    
        // var ref1 = makeMesh(-20, 10, BABYLON.Mesh.BILLBOARDMODE_NONE)
        // var ref2 = makeMesh(-10, 10, BABYLON.Mesh.BILLBOARDMODE_NONE)
        // var ref3 = makeMesh(0, 10, BABYLON.Mesh.BILLBOARDMODE_NONE)
        // var ref4 = makeMesh(10, 10, BABYLON.Mesh.BILLBOARDMODE_NONE)
        // var ref5 = makeMesh(20, 10, BABYLON.Mesh.BILLBOARDMODE_NONE)
    
        // var parent = BABYLON.Mesh.CreateBox('parent', 0.5, scene);
        // var m6 = makeMesh(-20, 0, BABYLON.Mesh.BILLBOARDMODE_NONE, parent)
        // var m7 = makeMesh(-10, 0, BABYLON.Mesh.BILLBOARDMODE_X, parent)
        // var m8 = makeMesh(0, 0, BABYLON.Mesh.BILLBOARDMODE_Y, parent)
        // var m9 = makeMesh(10, 0, BABYLON.Mesh.BILLBOARDMODE_Z, parent)
        // var m10 = makeMesh(20, 0, BABYLON.Mesh.BILLBOARDMODE_ALL, parent)
    
        // var a = 0;
        
        // scene.registerBeforeRender(function () {
        // var diff2 = ref2.position.subtract(camera.position)
        // var diff3 = ref3.position.subtract(camera.position)
        // var diff4 = ref4.position.subtract(camera.position)
    
        // ref2.rotation.x = Math.atan2(-diff2.y, diff2.z)
        // ref3.rotation.y = Math.atan2(diff3.x, diff3.z)
        // ref4.rotation.z = Math.atan2(diff4.y, diff4.x)
        // ref5.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(camera.getViewMatrix().clone().invert())
    
        // parent.position.z = 20 * Math.cos(a);
        // a += 0.01;
        // })

          /**  XR SETUP */
        //   async function waitForVRSupport(){
        //     const vrSupported = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-vr');
        //     return vrSupported
        //   }
        // if (!waitForVRSupport()) {
        //     // webXR won't work in local server, use old webVR standard instead
        //     debug("using webVR")
        //     var vrHelper = scene.createDefaultVRExperience({createDeviceOrientationCamera:false, useXR: true,
        //         disableDefaultUI: true,
        //         floorMeshes: [ground]
        //     });
        //     vrHelper.enableTeleportation({floorMeshes: [ground]});
        //     const sessionManager = new BABYLON.WebXRSessionManager(scene);
        //     const xrCamera = new BABYLON.WebXRCamera("xrCamera", scene, sessionManager);
        //     // xrCamera.setTransformationFromNonVRCamera("mapbox-Camera", true);
        // waitForVRSupport()
        // }
        // if (waitForVRSupport()) {
            // debug('VR is supported')
            // secure browser
            // async function waitForXRExperience(){
            //     var defaultXRExperience = await BABYLON.WebXRDefaultExperience.CreateAsync(scene)
            //     return defaultXRExperience
            // }
            // let wait = 0
            // if (!waitForXRExperience() && wait < 20) {
            //     wait++
            //     waitForXRExperience()
            // } 
            // if (wait === 20) {
            //     alert("This browser does not support XR")
            // } if (waitForXRExperience()) {
                // runVR()
            // }

            // function runVR(){
            //     debug('VR is running')
            //     // const sessionManager = new BABYLON.WebXRSessionManager(scene);
            //     // const xrCamera = new BABYLON.WebXRCamera("xrCamera", scene, sessionManager);

            //     // xrCamera.setTransformationFromNonVRCamera("mapbox-Camera", true);

        /**  AR */
        // const arAvailable = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-ar');

        // if (!arAvailable) {
        //     alert('Please open this link in a browser that supports immersive-ar.');
        // }

        // var ar = await BABYLON.WebXRDefaultExperience.CreateAsync(scene, {
        //     uiOptions: {
        //       sessionMode: "immersive-ar",
        //       referenceSpaceType: "local-floor",
        //     },
        //     optionalFeatures: ["hit-test", "anchors"],
        //   } )

        // if (!ar.baseExperience) {
        //     alert("Please open this link in a browser that supports XR.")
        // } else {
        //     runAR()
        // }

        // function runAR(){
        //     const { featuresManager } = ar.baseExperience;
        //     featuresManager.enableFeature(BABYLON.WebXRBackgroundRemover, "latest", {
        //         environmentHelperRemovalFlags: {
        //           skyBox: true,
        //           ground: true,
        //         },
        //       });
        //     const hitTest = featuresManager.enableFeature(BABYLON.WebXRHitTest, 'latest')
        //     const anchorSystem = featuresManager.enableFeature(BABYLON.WebXRAnchorSystem, 'latest')

        //     //ar webcam bg
        //     const videoLayer = new BABYLON.Layer('videoLayer', null, scene, true);
        //     const videoTexture = BABYLON
        //         .VideoTexture
        //         .CreateFromWebCam(
        //             scene, (videoTexture) => {
        //                 videoTexture._invertY = false;
        //                 videoTexture
        //                 videoLayer.texture = videoTexture;
        //             }, {
        //                 minWidth: "100%",
        //                 minHeight: "100%",
        //                 deviceId: ''
        //             });

        //     // replace bg with existing video/ movie
        //     // dome = new BABYLON.VideoDome(
        //     //     "testdome",
        //     //     ["./immvid.mp4"],
        //     //     {
        //     //         resolution: 32,
        //     //         clickToPlay: true,
        //     //         useDirectMapping: false,
        //     //         size: 200,
        //     //         halfDomeMode: true
        //     //     },
        //     //     scene
        //     // );
        // }


        // Handle browser resize.
        
        // window.addEventListener('resize', function () {
        //     engine.resize();
        // });
        
        
        // if (gamma) {
        //     console.log('registering gamma', gamma)
        //     scene.registerBeforeRender(() => {
        //         camera.alpha = BABYLON.Tools.ToRadians(gamma);
        //         camera.beta = BABYLON.Tools.ToRadians(beta);
        //     });
        // }

        return scene;	
    }
    
    // function renderBabylon(engine, matrix) {
    //     if(scene) {
    //         console.log('if scene')
    //         var projection = BABYLON.Matrix.FromArray(matrix);
    //         projection._m = matrix; 
    //         engine.wipeCaches(false);
    //             scene.activeCamera.freezeProjectionMatrix(getWorldMatrix().multiply(projection));
    //             let invert = scene.activeCamera.getProjectionMatrix().clone().invert();
    //             scene.activeCamera.position = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(), invert)
    //         scene.render(false);
    //     }
    // }

    /** MAPBOX SETUP **/

    // function getWorldMatrix() {
    //     var modelOrigin = userLocation;
    //     var modelAltitude = 0;

    //     var mercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude);
    //     var rotationMatrix = BABYLON.Matrix.RotationX(Math.PI / 2);
    //     var translateMatrix = BABYLON.Matrix.Identity().setTranslationFromFloats(mercatorCoordinate.x, mercatorCoordinate.y, mercatorCoordinate.z);
    //     var scaleFactor = mercatorCoordinate.meterInMercatorCoordinateUnits();
    //     var scaleMatrix = BABYLON.Matrix.Scaling(scaleFactor, scaleFactor, scaleFactor);
    //     var worldMatrix = scaleMatrix.multiply(rotationMatrix.multiply(translateMatrix));
    //     return worldMatrix;
    // }

    mapboxgl.accessToken = 'pk.eyJ1IjoiYnNpZGVzNDQiLCJhIjoiY2xiYWR1Z29hMDdmbjN4bG1idndnajY1MyJ9.-s33q85oreynlcmXeqilOQ';

    var map = new mapboxgl.Map({
        bearing: userFacingDirection,
        container: 'map', 
        style: 'mapbox://styles/bsides44/clb9wiw5h000w14nx4dmxci2i', //from MapBox Style Editor
        center: userLocation, // [lng, lat] , 
        zoom: 19, 
        // optimizeForTerrain: true,
        pitch: 85, //0-85
        scrollZoom: true,
        // antialias: true,
    })

    // async function getElevation(){
    //     await map.once('idle');

    //     const elevation = Math.floor(
    //         map.queryTerrainElevation(userLocation, { exaggerated: false })
    //     );
    //     console.log(' current elevation is ', elevation)
    // }

        
    // /** 3D OBJECT LAYER **/
    var customLayer = {
        id: '3d-model',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function(map) {
            this.map = map;
            this.engine = createEngine();
            this.scene = createScene()
        },
        render() {
            // renderBabylon(engine, matrix)
            if (this.scene) {
                this.scene.render()
            }
            this.map.triggerRepaint();
        }
    }

    map.on('style.load', () => {
        map.addLayer(customLayer);
    });

    // getElevation()

};


/** DEBUG QUEST BROWSESR */
function debug(words){
    var paragraph = document.getElementById('printDebug')
    var text = document.createTextNode(words);
    paragraph.appendChild(text)
}

