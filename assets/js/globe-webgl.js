/* Three.js interactive WebGL globe with traffic arcs and animated rings */
import*as THREE from'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
const canvas=document.getElementById('webgl-canvas-wow');
if(canvas){
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(45,canvas.clientWidth/canvas.clientHeight,0.1,1000);
  camera.position.z=28;
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setSize(canvas.clientWidth,canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  const globeGroup=new THREE.Group();scene.add(globeGroup);
  const sphereGeometry=new THREE.SphereGeometry(10,64,64);
  const sphereMaterial=new THREE.MeshBasicMaterial({color:0x020617,transparent:true,opacity:0.92});
  const sphere=new THREE.Mesh(sphereGeometry,sphereMaterial);globeGroup.add(sphere);
  const wireframeMaterial=new THREE.MeshBasicMaterial({color:0x60a5fa,wireframe:true,transparent:true,opacity:0.14});
  const wireframe=new THREE.Mesh(sphereGeometry,wireframeMaterial);globeGroup.add(wireframe);
  const dotsGeometry=new THREE.BufferGeometry();
  const dotsCount=1500;
  const dotsPos=new Float32Array(dotsCount*3);
  const dotsColors=new Float32Array(dotsCount*3);
  const colorPalette=[new THREE.Color(0x67e8f9),new THREE.Color(0xa78bfa),new THREE.Color(0x60a5fa),new THREE.Color(0xc4b5fd)];
  for(let i=0;i<dotsCount;i++){
    const phi=Math.acos(1-2*(i+0.5)/dotsCount);
    const theta=Math.PI*(1+Math.sqrt(5))*i;
    const r=10.05+Math.random()*0.12;
    const x=r*Math.cos(theta)*Math.sin(phi);
    const y=r*Math.sin(theta)*Math.sin(phi);
    const z=r*Math.cos(phi);
    dotsPos[i*3]=x;dotsPos[i*3+1]=y;dotsPos[i*3+2]=z;
    const color=colorPalette[Math.floor(Math.random()*colorPalette.length)];
    dotsColors[i*3]=color.r;dotsColors[i*3+1]=color.g;dotsColors[i*3+2]=color.b;
  }
  dotsGeometry.setAttribute('position',new THREE.BufferAttribute(dotsPos,3));
  dotsGeometry.setAttribute('color',new THREE.BufferAttribute(dotsColors,3));
  const dotsMaterial=new THREE.PointsMaterial({size:0.095,vertexColors:true,transparent:true,opacity:1,blending:THREE.AdditiveBlending});
  const dotsMesh=new THREE.Points(dotsGeometry,dotsMaterial);globeGroup.add(dotsMesh);
  const curves=[];const numArcs=44;
  for(let i=0;i<numArcs;i++){
    const index1=Math.floor(Math.random()*dotsCount);
    const index2=Math.floor(Math.random()*dotsCount);
    const p1=new THREE.Vector3(dotsPos[index1*3],dotsPos[index1*3+1],dotsPos[index1*3+2]);
    const p2=new THREE.Vector3(dotsPos[index2*3],dotsPos[index2*3+1],dotsPos[index2*3+2]);
    const distance=p1.distanceTo(p2);
    if(distance>5&&distance<18){
      const mid=p1.clone().add(p2).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(10+distance*0.4);
      const curve=new THREE.QuadraticBezierCurve3(p1,mid,p2);
      curves.push(curve);
      const tubeGeometry=new THREE.TubeGeometry(curve,20,0.025,8,false);
      const tubeMaterial=new THREE.MeshBasicMaterial({color:0x67e8f9,transparent:true,opacity:0.22,blending:THREE.AdditiveBlending});
      const tubeMesh=new THREE.Mesh(tubeGeometry,tubeMaterial);globeGroup.add(tubeMesh);
    }
  }
  const traffics=[];
  const trafficGeom=new THREE.SphereGeometry(0.09,8,8);
  const trafficMat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:1,blending:THREE.AdditiveBlending});
  curves.forEach(curve=>{
    const traffic=new THREE.Mesh(trafficGeom,trafficMat);
    globeGroup.add(traffic);
    traffics.push({mesh:traffic,curve,progress:Math.random(),speed:0.003+Math.random()*0.005});
  });
  const rings=[];
  for(let i=0;i<3;i++){
    const ringGeom=new THREE.TorusGeometry(13+i*1.2,0.018,16,100);
    const ringMat=new THREE.MeshBasicMaterial({color:i%2===0?0x67e8f9:0xa78bfa,transparent:true,opacity:0.28,blending:THREE.AdditiveBlending});
    const ring=new THREE.Mesh(ringGeom,ringMat);
    ring.rotation.x=Math.random()*Math.PI;ring.rotation.y=Math.random()*Math.PI;
    globeGroup.add(ring);
    rings.push({mesh:ring,speedX:(Math.random()-0.5)*0.005,speedY:(Math.random()-0.5)*0.005});
  }
  const atmosphereGeom=new THREE.SphereGeometry(10.8,64,64);
  const atmosphereMat=new THREE.MeshBasicMaterial({color:0x60a5fa,transparent:true,opacity:0.13,side:THREE.BackSide,blending:THREE.AdditiveBlending});
  const atmosphere=new THREE.Mesh(atmosphereGeom,atmosphereMat);globeGroup.add(atmosphere);
  const outerGlowGeom=new THREE.SphereGeometry(11.8,64,64);
  const outerGlowMat=new THREE.MeshBasicMaterial({color:0x8b5cf6,transparent:true,opacity:0.045,side:THREE.BackSide,blending:THREE.AdditiveBlending});
  const outerGlow=new THREE.Mesh(outerGlowGeom,outerGlowMat);globeGroup.add(outerGlow);
  const bgGeom=new THREE.BufferGeometry();
  const bgCount=900;const bgPos=new Float32Array(bgCount*3);
  for(let i=0;i<bgCount;i++){bgPos[i*3]=(Math.random()-0.5)*60;bgPos[i*3+1]=(Math.random()-0.5)*60;bgPos[i*3+2]=(Math.random()-0.5)*60}
  bgGeom.setAttribute('position',new THREE.BufferAttribute(bgPos,3));
  const bgMat=new THREE.PointsMaterial({size:0.06,color:0x60a5fa,transparent:true,opacity:0.42,blending:THREE.AdditiveBlending});
  const bgParticles=new THREE.Points(bgGeom,bgMat);scene.add(bgParticles);
  window.addEventListener('resize',()=>{if(!canvas.clientWidth)return;camera.aspect=canvas.clientWidth/canvas.clientHeight;camera.updateProjectionMatrix();renderer.setSize(canvas.clientWidth,canvas.clientHeight)});
  let mouseX=0,mouseY=0;
  const container=canvas.parentElement;
  container.addEventListener('mousemove',e=>{const rect=container.getBoundingClientRect();mouseX=((e.clientX-rect.left)/container.clientWidth)*2-1;mouseY=-((e.clientY-rect.top)/container.clientHeight)*2+1});
  const clock=new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    const elapsedTime=clock.getElapsedTime();
    globeGroup.rotation.y+=0.002;
    globeGroup.rotation.x=Math.sin(elapsedTime*0.2)*0.05;
    bgParticles.rotation.y=-elapsedTime*0.02;
    traffics.forEach(t=>{t.progress+=t.speed;if(t.progress>1)t.progress=0;const point=t.curve.getPoint(t.progress);t.mesh.position.copy(point)});
    rings.forEach(r=>{r.mesh.rotation.x+=r.speedX;r.mesh.rotation.y+=r.speedY});
    camera.position.x+=(mouseX*4-camera.position.x)*0.05;
    camera.position.y+=(mouseY*4-camera.position.y)*0.05;
    camera.lookAt(scene.position);
    renderer.render(scene,camera);
  }
  animate();
}
