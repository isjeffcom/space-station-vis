<template>
  <div id="space">
    <div id="space-main"></div>
  </div>
</template>

<script>

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { cameraFocus } from '../utils/utils'

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
      const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );

			const renderer = new THREE.WebGLRenderer({ antialias: true });
			renderer.setSize( window.innerWidth, window.innerHeight );
			this.DOM.appendChild( renderer.domElement );

			// const geometry = new THREE.BoxGeometry();
			// const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
			// const cube = new THREE.Mesh( geometry, material );
			// scene.add( cube );

      // Lighting
      const light = new THREE.AmbientLight( 0xffffff, .44 ); // soft white light
      scene.add( light );

      // White directional light at half intensity shining from the top.
      const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.98 );
      scene.add( directionalLight );

      // Add Control
      const controls = new OrbitControls( camera, renderer.domElement );

			camera.position.z = 5;
      controls.update();

      // Earth
      const earthGeometry = new THREE.SphereGeometry( 32, 32, 32 );
      const earthMat = new THREE.MeshPhongMaterial( {
        map: THREE.ImageUtils.loadTexture('assets/map/earth/highres98.jpg'),
        bumpMap: THREE.ImageUtils.loadTexture('assets/map/earth/bump.jpg'),
        bumpScale: 1,
        specularMap: THREE.ImageUtils.loadTexture('assets/map/earth/specular.png'),
        specular: new THREE.Color('grey'),
        shininess: 5,
      } );
      const earth = new THREE.Mesh( earthGeometry, earthMat );
      earth.position.x = -8;
      earth.position.y = -32;
      scene.add( earth );

      // Load Model
      const loader = new GLTFLoader();

      loader.load( './assets/models/iss/scene.gltf', function ( gltf ) {

        const iss_model = gltf.scene;
        // iss_model.position.x = -7;
        iss_model.scale.set(.25, .25, .25)

        scene.add( iss_model );
        cameraFocus(iss_model, controls)

      }, undefined, function ( error ) {

        console.error( error );

      } );

			const animate = function () {
				requestAnimationFrame( animate );

				earth.rotation.x += 0.0001;
				earth.rotation.y += 0.0001;

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
