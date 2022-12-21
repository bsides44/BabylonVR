// https://jsfiddle.net/fabsharp/w3dephvm/

//TODO 
// get mapbox working on browser
// add terrain layer with trees texture

 /** GPS **/

 let userLocation = [174.85546448262812, -41.07448707375911] 
 let userFacingDirection = 135
 let camera
 let engine

 const gpsSuccess = (position) => {
    userLocation = [position.coords.longitude, position.coords.latitude]
    console.log('GPS:', userLocation); 
    userFacingDirection = position.coords.heading ? position.coords.heading : -90
    buildWorld()
 }

 const gpsError = (error) => {
    console.log('GPS error:', error);
    alert("Please turn on Location Services")
    buildWorld()
  };

function buildWorld(){
    /** BABYLON SETUP **/
    let scene;

    // function createEngine(glContext) {
    //     return new BABYLON.Engine(glContext, true);
    // }

    function createEngine() {
        const canvas = document.getElementById("renderCanvas"); // Canvas element is essential for ease of navigation
        engine = new BABYLON.Engine(canvas, true);
        return 
    }
    
    async function createScene(engine) {
        scene = new BABYLON.Scene(engine);
        var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(1, 1, 0), scene)
        let camera = new BABYLON.UniversalCamera("mapbox-Camera", new BABYLON.Vector3(0, 0, 0), scene);
        scene.autoClear = false;
        scene.detachControl();
        scene.activeCamera = camera
        camera.speed=0.2


        var ground = BABYLON.Mesh.CreateGround('ground', 100, 100, 3, scene)
        ground.position.y = 0
        ground.material = new BABYLON.StandardMaterial('', scene)
        window.m = ground.material.specularColor = BABYLON.Color3.Black()
        ground.material.diffuseColor = BABYLON.Color3.FromInts(50, 100, 50)

        // camera.applyGravity = true;
        // scene.collisionsEnabled = true;
        // camera.checkCollisions = true;
        // ground.checkCollisions = true;

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
        //   }
        
        //   var m1 = makeMesh(-20, 0, BABYLON.Mesh.BILLBOARDMODE_NONE)
        //   var m2 = makeMesh(-10, 0, BABYLON.Mesh.BILLBOARDMODE_X)
        //   var m3 = makeMesh(0, 0, BABYLON.Mesh.BILLBOARDMODE_Y)
        //   var m4 = makeMesh(10, 0, BABYLON.Mesh.BILLBOARDMODE_Z)
        //   var m5 = makeMesh(20, 0, BABYLON.Mesh.BILLBOARDMODE_ALL)
        
        //   var ref1 = makeMesh(-20, 10, BABYLON.Mesh.BILLBOARDMODE_NONE)
        //   var ref2 = makeMesh(-10, 10, BABYLON.Mesh.BILLBOARDMODE_NONE)
        //   var ref3 = makeMesh(0, 10, BABYLON.Mesh.BILLBOARDMODE_NONE)
        //   var ref4 = makeMesh(10, 10, BABYLON.Mesh.BILLBOARDMODE_NONE)
        //   var ref5 = makeMesh(20, 10, BABYLON.Mesh.BILLBOARDMODE_NONE)
        
        //   var parent = BABYLON.Mesh.CreateBox('parent', 0.5, scene);
        //   var m6 = makeMesh(-20, 0, BABYLON.Mesh.BILLBOARDMODE_NONE, parent)
        //   var m7 = makeMesh(-10, 0, BABYLON.Mesh.BILLBOARDMODE_X, parent)
        //   var m8 = makeMesh(0, 0, BABYLON.Mesh.BILLBOARDMODE_Y, parent)
        //   var m9 = makeMesh(10, 0, BABYLON.Mesh.BILLBOARDMODE_Z, parent)
        //   var m10 = makeMesh(20, 0, BABYLON.Mesh.BILLBOARDMODE_ALL, parent)
        
        //   var a = 0;
          
        //   scene.registerBeforeRender(function () {
        //     var diff2 = ref2.position.subtract(camera.position)
        //     var diff3 = ref3.position.subtract(camera.position)
        //     var diff4 = ref4.position.subtract(camera.position)
        
        //     ref2.rotation.x = Math.atan2(-diff2.y, diff2.z)
        //     ref3.rotation.y = Math.atan2(diff3.x, diff3.z)
        //     ref4.rotation.z = Math.atan2(diff4.y, diff4.x)
        //     ref5.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(camera.getViewMatrix().clone().invert())
        
        //     parent.position.z = 20 * Math.cos(a);
        //     a += 0.01;
        //   })

        /**  XR SETUP */
        const vrSupported = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-vr');
        
        if (!vrSupported) {
          // local desktop : webXR won't work in local server, use old webVR standard
          var vrHelper = scene.createDefaultVRExperience({createDeviceOrientationCamera:false, useXR: true,
              disableDefaultUI: true,
              floorMeshes: [ground]
          });
          vrHelper.enableTeleportation({floorMeshes: [ground]});
          console.log('VR is running')
      }
      if (vrSupported) {
          // quest browser / prod  
          var defaultXRExperience = await BABYLON.WebXRDefaultExperience.CreateAsync(scene, /* optional configuration options */ )

          if (!defaultXRExperience.baseExperience) {
            console.log("This browser does not support XR");
              alert("This browser does not support XR")
          } else {
              runVR()
          }

          function runVR(){
              console.log('VR is running')
          }
      }

      /**  AR */
      const arAvailable = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-ar');

      if (!arAvailable) {
          alert('Please open this link in a browser that supports immersive-ar (i.e. updated Chrome).');
      }

      var ar = await BABYLON.WebXRDefaultExperience.CreateAsync(scene, {
          uiOptions: {
            sessionMode: "immersive-ar",
            referenceSpaceType: "local-floor",
          },
          optionalFeatures: ["hit-test", "anchors"],
        } )

      if (!ar.baseExperience) {
          alert("Please open this link in a browser that supports XR (i.e. updated Chrome).")
      } else {
        //   runAR()
      }

      function runAR(){
          const { featuresManager } = ar.baseExperience;
          featuresManager.enableFeature(BABYLON.WebXRBackgroundRemover, 
            "latest", {
              environmentHelperRemovalFlags: {
                skyBox: true,
                ground: false,
              },
            });
          const hitTest = featuresManager.enableFeature(BABYLON.WebXRHitTest, 'latest')
          const anchorSystem = featuresManager.enableFeature(BABYLON.WebXRAnchorSystem, 'latest')

          //ar webcam bg
          const videoLayer = new BABYLON.Layer('videoLayer', null, scene, true);
          const videoTexture = BABYLON
              .VideoTexture
              .CreateFromWebCam(
                  scene, (videoTexture) => {
                      videoTexture._invertY = false;
                      videoTexture;
                      videoLayer.texture = videoTexture;
                  }, {
                      minWidth: "100%",
                      minHeight: "100%",
                      deviceId: ''
                  });

          console.log('AR is running')
      }

        // Handle browser resize.
        window.addEventListener('resize', function () {
            engine.resize();
        });

        return scene;	
    }
    
    function render(engine, matrix) {
        if(scene) {
            var projection = BABYLON.Matrix.FromArray(matrix);
            projection._m = matrix; 
            engine.wipeCaches(false);
                scene.activeCamera.freezeProjectionMatrix(getWorldMatrix().multiply(projection));
                let invert = scene.activeCamera.getProjectionMatrix().clone().invert();
                scene.activeCamera.position = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(), invert)
            scene.render(false);
        }
    }

    /** MAPBOX SETUP **/

    function getWorldMatrix() {
        var modelOrigin = userLocation;
        var modelAltitude = 0;

        var mercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude);
        var rotationMatrix = BABYLON.Matrix.RotationX(Math.PI / 2);
        var translateMatrix = BABYLON.Matrix.Identity().setTranslationFromFloats(mercatorCoordinate.x, mercatorCoordinate.y, mercatorCoordinate.z);
        var scaleFactor = mercatorCoordinate.meterInMercatorCoordinateUnits();
        var scaleMatrix = BABYLON.Matrix.Scaling(scaleFactor, scaleFactor, scaleFactor);
        var worldMatrix = scaleMatrix.multiply(rotationMatrix.multiply(translateMatrix));
        return worldMatrix;
    }

    mapboxgl.accessToken = 'pk.eyJ1IjoiYnNpZGVzNDQiLCJhIjoiY2xiYWR1Z29hMDdmbjN4bG1idndnajY1MyJ9.-s33q85oreynlcmXeqilOQ';

    var map = new mapboxgl.Map({
        bearing: userFacingDirection,
        container: 'map', 
        style: 'mapbox://styles/bsides44/clb9wiw5h000w14nx4dmxci2i', //from MapBox Style Editor
        center: userLocation, // [lng, lat] , 
        zoom: 16, 
        // minZoom: 20,
        // maxZoom: 22,
        optimizeForTerrain: true,
        pitch: 85, //0-84
        scrollZoom: true,
        antialias: true,
    })

    async function getElevation(){
        await map.once('idle');
        const elevation = Math.floor(
            map.queryTerrainElevation(userLocation, { exaggerated: false })
        );
        console.log(' current elevation is ', elevation)
    }
        
    /** 3D OBJECT LAYER **/

    var customLayer = {
        id: '3d-model',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function(map, gl) {
            this.map = map;
            this.engine = createEngine(gl);
            this.scene = createScene(this.engine)
        },
        render(gl, matrix) {
            if (this.scene) {
                render(engine, matrix)
            }
            this.map.triggerRepaint();
        }
    }

    map.on('style.load', () => {
        console.log('map', map)

        map.addLayer(customLayer, 'waterway-label');
    });

    // getElevation()
};
  


/** CALL GPS */

navigator.geolocation.watchPosition(gpsSuccess, gpsError);
