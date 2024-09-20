import {  Text, useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { TextureLoader } from "three";

import * as THREE from 'three'
export function Avatar({ data, ...props }) {

  const { nodes, materials } = useGLTF('/models/Avatar.glb');
  const texture = useLoader(TextureLoader, '/textures/wood.jpg');
 
  const [animation, setAnimation] = useState('idle');
  const { animations: run } = useFBX('/animations/Running.fbx');
  const { animations: walk } = useFBX('/animations/Walking.fbx');
  const { animations: idle } = useFBX('/animations/Idle.fbx');
  const { animations: talk } = useFBX('/animations/Talking.fbx');
  const group = useRef();
  run[0].name = 'run';
  walk[0].name = 'walk';
  idle[0].name = 'idle';
  talk[0].name = 'talk';
  const { actions } = useAnimations([run[0], walk[0], idle[0],talk[0]], group);

  useEffect(() => {
    if (animation === 'idle') {
      actions.idle.play();
      actions.run.stop();
      actions.walk.stop();
      actions.talk.stop();
    } else if (animation === 'run') {
      actions.idle.stop();
      actions.run.play();
      actions.walk.stop();
      actions.talk.stop();
    } else if (animation === 'walk') {
      actions.idle.stop();
      actions.run.stop();
      actions.walk.play();
      actions.talk.stop();
    } 
    else if (animation === 'talk') {
      actions.talk.play();
      actions.idle.stop();
      actions.run.stop();
      actions.walk.stop();
    } 
    
    else {
      actions.idle.stop();
      actions.run.stop();
      actions.walk.stop();
      actions.talk.stop();
    }
  }, [animation, actions]);
  const [blink, setBlink] = useState(false);

   useFrame(() => {
    if (!nodes.Wolf3D_Head) return;
    nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary["eyeBlinkLeft"]] = blink ? 1 : 0;
    nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary["eyeBlinkRight"]] = blink ? 1 : 0;

  });
  
  

  useEffect(() => {
    if(!playAudio){

      console.log(nodes.Wolf3D_Head.morphTargetDictionary)
      let blinkTimeout;
      const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
    
  }

  }, []);
  const corresponding = {
    A: "viseme_PP",
    B: "viseme_kk",
    C: "viseme_I",
    D: "viseme_AA",
    E: "viseme_O",
    F: "viseme_U",
    G: "viseme_FF",
    H: "viseme_TH",
    X: "viseme_PP",
  };
//   const {
//   script,
//   headFollow,
//   smoothMorphTarget,
//   morphTargetSmoothing,
// } = useControls({
//   headFollow: true,
//   smoothMorphTarget: true,
//   morphTargetSmoothing: 0.5,
//   script: {
//     value: "saud",
//     options: ["saud"],
//   },
// });
const headFollow = true;
const smoothMorphTarget = true;
const morphTargetSmoothing = 0.5;
const script = "saud";
const[playAudio,setPlay]=useState(false);
function play() {
  setPlay(prevPlay => !prevPlay);
  // setAnimation('dance')
}
//  const playAudio= false
// const  headFollow= true
// const  smoothMorphTarget= true
//  const morphTargetSmoothing= 0.5,
//  const script: {
//     value: "saud",
//     options: ["saud"],
//   },

const audio = useMemo(() => new Audio(`/audios/${script}.mp3`), [script]);
console.log(audio)
const jsonFile = useLoader(THREE.FileLoader, `audios/${script}.json`);
const lipsync = JSON.parse(jsonFile);


useFrame(() => {
  const currentAudioTime = audio.currentTime;
  if (audio.paused || audio.ended) {
    setAnimation("idle");
    return;
  }

  Object.values(corresponding).forEach((value) => {
    if (!smoothMorphTarget) {
      nodes.Wolf3D_Head.morphTargetInfluences[
        nodes.Wolf3D_Head.morphTargetDictionary[value]
      ] = 0;
      nodes.Wolf3D_Teeth.morphTargetInfluences[
        nodes.Wolf3D_Teeth.morphTargetDictionary[value]
      ] = 0;
    } else {
      nodes.Wolf3D_Head.morphTargetInfluences[
        nodes.Wolf3D_Head.morphTargetDictionary[value]
      ] = THREE.MathUtils.lerp(
        nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[value]
        ],
        0,
        morphTargetSmoothing
      );

      nodes.Wolf3D_Teeth.morphTargetInfluences[
        nodes.Wolf3D_Teeth.morphTargetDictionary[value]
      ] = THREE.MathUtils.lerp(
        nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[value]
        ],
        0,
        morphTargetSmoothing
      );
    }
  });

  for (let i = 0; i < lipsync.mouthCues.length; i++) {
    const mouthCue = lipsync.mouthCues[i];
    if (
      currentAudioTime >= mouthCue.start &&
      currentAudioTime <= mouthCue.end
    ) {
      if (!smoothMorphTarget) {
        nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[
            corresponding[mouthCue.value]
          ]
        ] = 1;
        nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[
            corresponding[mouthCue.value]
          ]
        ] = 1;
      } else {
        nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[
            corresponding[mouthCue.value]
          ]
        ] = THREE.MathUtils.lerp(
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[
              corresponding[mouthCue.value]
            ]
          ],
          1,
          morphTargetSmoothing
        );
        nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[
            corresponding[mouthCue.value]
          ]
        ] = THREE.MathUtils.lerp(
          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[
              corresponding[mouthCue.value]
            ]
          ],
          1,
          morphTargetSmoothing
        );
      }

      break;
    }
  }
});

useEffect(() => {
  nodes.Wolf3D_Head.morphTargetInfluences[
    nodes.Wolf3D_Head.morphTargetDictionary["viseme_I"]
  ] = 1;
  nodes.Wolf3D_Teeth.morphTargetInfluences[
    nodes.Wolf3D_Teeth.morphTargetDictionary["viseme_I"]
  ] = 1;
  if (playAudio) {
    audio.play();
    if (script === "saud") {
      setAnimation("talk");
    } else {
      setAnimation("idle");
    }
  } else {
    setAnimation("idle");
    audio.pause();
  }
}, [playAudio, script]);




  return (
    <>

  {/* <Html  position={[-3,2.3,-2]}   >
  <ReactPlayer
          url='https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
          // playing={playing}
          controls
          height="50px"
          width="300px"
        />
    <button onClick={play} style={{position:"fixed"}} >click</button>
  </Html> */}
  <group onClick={play}   >


    <group {...props} dispose={null}  ref={group}  position={[-3,1,0]} rotation={[5,0,0]}  >
      <ambientLight intensity={[3]} />
     
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
        onClick={play}
      />
       {/* <group onClick={play} rotation={[Math.PI/2,0,0]} position={[0,-0.22,1.3]}  >
        <mesh  >
        <meshBasicMaterial map={texture} color={"grey"}  />
      <planeGeometry args={[0.2,0.07]}  />

        </mesh>
        <Text fontSize={0.04} color={"white"} position={[0,0,0.01]} >Saud</Text>
      </group> */}
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
    </group>
    </group>
    </>
  )

}

useGLTF.preload('models/Avatar.glb')