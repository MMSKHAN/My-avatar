import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import { Avatar } from './Avatars/Avatar';
import { Cylinder, Environment, OrbitControls, Sky, Stars } from '@react-three/drei';
import { TextureLoader } from 'three';

function AvatarMain() {
  const texture = useLoader(TextureLoader, '/textures/wood.jpg');

  return (
    <>
    <Canvas style={{ height: '100vh' }}>
  <Suspense  fallback={null} >
        <OrbitControls  /> 
    {/* <Sky/> */}
    <Stars/>
 <group>
 <group position={[3,-2,2.6]} >
    <directionalLight position={[5,5,5]} castShadow color={"white"} />
    <ambientLight intensity={2} />
     <Avatar/>
     
     </group>
  <group position={[0,-1.16,2.3]}  >
    
  <Cylinder scale={[1,0.2,1]} >
{/* <meshStandardMaterial color={"white"} /> */}
<meshBasicMaterial map={texture} />
     </Cylinder>
  </group>
 </group>
  </Suspense>
    </Canvas>
    </>);
}

export default AvatarMain;