import * as THREE from 'three';
import { TWEEN } from '../libs/tween'

// Baisc Function: Camera Focus on certain objects
export const cameraFocus = function (obj, controls) {

  const objCGB = getObjPositionInstant(getObjCenter(obj));

  // if (obj) {

  //   objCGB = getObjPositionInstant(getObjCenter(obj))

  // }else{
  //   return
  // }

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

// 深拷贝
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
export const objectsSmoothMove = function (obj, config) {

  const xFinal = config.x 
  const yFinal = config.y
  let zFinal = config.z

  const isCam = config.isCam ? true : false

  // If is camera, and camera position is on back than reverse target z position
  const posi = obj.position ? obj.position : obj.target
  if(isCam && posi.z < 0){
      zFinal = -zFinal
  }

  const time = config.time ? config.time : 800

  
  const posiInstant = getObjPositionInstant(posi)

  // Animation is using tween.js

  // Setup the animation loop.
  function animate(time) {
      requestAnimationFrame(animate);
      TWEEN.update(time);
  }
  requestAnimationFrame(animate);


  // Start Calculation
  const coords = { x: posiInstant.x, y: posiInstant.y, z: posiInstant.z }; 
  const tween = new TWEEN.Tween(coords) 
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
const getObjCenter = function (obj, index) {

  let gOC_res;

  if(!index){
    gOC_res = null
  }

  console.log(obj);

  if(obj.type === 'Group') {
    let bbox = new THREE.Box3().setFromObject(obj);
    const center = new THREE.Vector3();
    gOC_res = bbox.getCenter(center);
    console.log(gOC_res);
  } else{
    gOC_res = obj.children[0].geometry.boundingSphere.center
    if(obj.twin && gOC_res.x != 0){
        gOC_res.x = (gOC_res.x + (-gOC_res.x)) / 2
    }
  }
  
  return gOC_res
}