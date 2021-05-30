import * as THREE from 'three';
import { TWEEN } from '../libs/tween'

const EARTH_RADIUS = 6378 * 1000; // Earth radius is between 6375 to 7378 km

/**
 * Convert Geolocation from WGS84 to Vector3
 * @param {Number} lat - latitude
 * @param {Number} lng - longitude
 * @param {Number} altitude - altitude in meter
 * @returns 
*/
export const geoToVec3 = function (lat, lng, altitude = 0, radius=32) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (90 - lng) * Math.PI / 180;
  const ratio = radius / EARTH_RADIUS;
  const height = (ratio * altitude) * (Math.PI / 180);
  // console.log(height);
  const r = radius * (1 + height);
  
  return {
    x: r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.cos(phi),
    z: r * Math.sin(phi) * Math.sin(theta)
  };
}

/**
 * Convert Geolocation from Vector3 to WGS84
 * @param {Object} position - vector 3 position {x,y,z}
 * @param {Number} radius - Sphere radius
 * @returns 
*/
export const Vec3ToGeo = function ({ x, y, z }, radius=32) {
  const r = Math.sqrt(x*x + y*y + z*z);
  const phi = Math.acos(y / r);
  const theta = Math.atan2(z, x);

  return {
    lat: 90 - phi * 180 / Math.PI,
    lng: 90 - theta * 180 / Math.PI - (theta < -Math.PI / 2 ? 360 : 0), // keep within [-180, 180] boundaries
    altitude: r / radius - 1
  }
}

/**
 * Camera Focus on certain objects
 * @param {THREE.Object3D} obj - Three js 3d object
 * @param {OrbitControls} controls - Three js orbit controls
 */
export const cameraFocus = function (obj, controls) {

  const objCGB = getObjPositionInstant(getObjCenter(obj));

  if(objCGB) {
    objectsSmoothMove(controls, {
      x: objCGB.x,
      y: objCGB.y,
      z: objCGB.z,
      isCam:true,
      time:600
    })
  }

}

/**
 * Deep copy three js 3d object position
 * @param {THREE.Object3D} obj - Three js 3d object
 * @returns 
 */
export const getObjPositionInstant = function (obj) {

  // Campatiable with obj.position and obj.xyz
  let originalTemp;
  if(obj.position){
    originalTemp = Object.values(obj.position)
  }else{
    originalTemp = Object.values(obj)
  }
  
  const originalObj = {
      x: originalTemp[0],
      y: originalTemp[1],
      z: originalTemp[2]
  }
  return originalObj
}

// Basic Function: smooth move object. compatiable with object, camera, control
/**
 * 
 * @param {THREE.Object3D} obj - three js 3d object
 * @param {Number} config.x - target x position
 * @param {Number} config.y - target y position
 * @param {Number} config.z - target z position
 */
export const objectsSmoothMove = function (obj, config={x: 0, y: 0, z: 0}) {

  const xFinal = config.x;
  const yFinal = config.y;
  let zFinal = config.z;

  const isCam = config.isCam ? true : false

  // If is camera, and camera position is on back than reverse target z position
  const posi = obj.position ? obj.position : obj.target
  if(isCam && posi.z < 0){
    zFinal = -zFinal;
  }

  const time = config.time ? config.time : 800;

  const posiInstant = getObjPositionInstant(posi);

  // Powered by Tween.js
  // Setup the animation loop.
  function animate(time) {
      requestAnimationFrame(animate);
      TWEEN.update(time);
  }
  requestAnimationFrame(animate);


  // Start Calculation
  const coords = { x: posiInstant.x, y: posiInstant.y, z: posiInstant.z }; 
  new TWEEN.Tween(coords) 
      .to({ x: xFinal, y: yFinal, z:zFinal }, time) 
      .easing(TWEEN.Easing.Quadratic.Out) 
      .onUpdate(function() { 
          posi.x = coords.x
          posi.y = coords.y
          posi.z = coords.z
      })
      .start(); // Start the tween immediately.

}

// Get object center function
/**
 * 
 * @param {THREE.Object3D} obj 
 * @returns 
 */
const getObjCenter = function (obj) {

  let gOC_res;

  if(obj.type === 'Group') {

    let bbox = new THREE.Box3().setFromObject(obj);
    const center = new THREE.Vector3();
    gOC_res = bbox.getCenter(center);

  } else{

    gOC_res = obj.children[0].geometry.boundingSphere.center;

    if(obj.twin && gOC_res.x != 0){
      gOC_res.x = (gOC_res.x + (-gOC_res.x)) / 2;
    }
  }
  
  return gOC_res
}