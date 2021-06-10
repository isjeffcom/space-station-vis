<template>
  <div id="space">
    <div id="space-main"></div>
  </div>
</template>

<script>

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { cameraFocus, geoToVec3 } from '../utils/utils';
import { CSSPosition } from '../remote';

const EARTH_RADIUS = 6378 * 1000; // Earth Radius: ≈ 6378 km
const SPHERE_RADIUS = 63.78 // 3D Sphere radius in Vector 3
// let geometry, material, cube;

export default {
  name: 'space',
  props: {
    msg: String
  },
  data(){
    return{
      DOM: null,
    }
  },
  mounted(){
    this.DOM = document.getElementById('space-main');
    this.init();
  },
  methods: {
    init(){
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.00001, 10000 );

			const renderer = new THREE.WebGLRenderer({ antialias: true });
			renderer.setSize( window.innerWidth, window.innerHeight );
			this.DOM.appendChild( renderer.domElement );

      // Lighting
      const light = new THREE.AmbientLight( 0xffffff, .74 ); // soft white light
      scene.add( light );

      // White directional light at half intensity shining from the top.
      const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.98 );
      scene.add( directionalLight );

      // Add Control
      const controls = new OrbitControls( camera, renderer.domElement );

			camera.position.z = SPHERE_RADIUS + 10;
      camera.position.x = 0;
      camera.position.y = SPHERE_RADIUS + 5;
      controls.update();

      // Earth
      const earthGeometry = new THREE.SphereBufferGeometry( SPHERE_RADIUS, SPHERE_RADIUS * 10, SPHERE_RADIUS * 10 );
      const earthBaseMap = THREE.ImageUtils.loadTexture('assets/map/earth/2_no_clouds_4k.jpg');
      earthBaseMap.magFilter = THREE.NearestFilter;

      // const earthBumpMap = THREE.ImageUtils.loadTexture('assets/map/earth/elev_bump_4k.jpg');
      // earthBumpMap.magFilter = THREE.NearestFilter;

      const earthMat = new THREE.MeshPhongMaterial({
        map: earthBaseMap,
        // bumpMap: THREE.ImageUtils.loadTexture('assets/map/earth/elev_bump_4k.jpg'),
        // bumpScale: SPHERE_RADIUS / 3,
        specularMap: THREE.ImageUtils.loadTexture('assets/map/earth/specular.png'),
        specular: new THREE.Color(0x00c9ff),
        shininess: 15,
      });
      const earth = new THREE.Mesh( earthGeometry, earthMat );
      earth.rotation.y = -Math.PI / 2; // face prime meridian along Z axis
      // earth.position.x = -8;
      // earth.position.y = -32;
      scene.add( earth );

      // Load Model
      const loader = new GLTFLoader();

      loader.load( './assets/models/iss/scene.gltf', function ( gltf ) {

        // Load ISS model in gltf style
        const iss_model = gltf.scene;

        // Set ISS station position
        const ratio = (SPHERE_RADIUS / EARTH_RADIUS) * 1;
        iss_model.scale.set(ratio, ratio, ratio)

        // Set ISS station by Latitude, Longtitude and altitude
        const targetVec3 = geoToVec3(22.545369, 114.056742, 429000, SPHERE_RADIUS);

        iss_model.position.set(targetVec3.x, targetVec3.y, targetVec3.z);

        scene.add(iss_model);
        cameraFocus(iss_model, controls)

      }, undefined, function ( error ) {

        console.error( error );

      } );

			const animate = function () {
				requestAnimationFrame( animate );

				// earth.rotation.x += 0.0001;
				// earth.rotation.y += 0.0001;

        controls.update();

				renderer.render( scene, camera );
			};

			animate();
    },

    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#space{
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
}

#space-main{
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
}
</style>
