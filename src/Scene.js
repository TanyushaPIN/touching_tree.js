import { Canvas, useFrame, useThree } from '@react-three/fiber'

import { PointerLockControls, useGLTF } from '@react-three/drei'

import { RigidBody, CapsuleCollider, Physics } from '@react-three/rapier'

import { useEffect, useRef } from 'react'

import { Vector3 } from 'three'



function Player() {

  const { camera } = useThree()

  const playerRef = useRef()

  const keys = useRef({})

  const moveSpeed = 0.5

  const jumpForce = 5

  const canJump = useRef(true)

  

  useEffect(() => {

    const handleKeyDown = (e) => keys.current[e.code] = true

    const handleKeyUp = (e) => keys.current[e.code] = false

    

    window.addEventListener('keydown', handleKeyDown)

    window.addEventListener('keyup', handleKeyUp)

    

    camera.position.set(0, 1.3, 5)

    

    return () => {

      window.removeEventListener('keydown', handleKeyDown)

      window.removeEventListener('keyup', handleKeyUp)

    }

  }, [camera])

  

  useFrame(() => {

    if (!playerRef.current) return

    

    const direction = new Vector3()

    

    if (keys.current['KeyW']) direction.z -= 1

    if (keys.current['KeyS']) direction.z += 1

    if (keys.current['KeyA']) direction.x -= 1

    if (keys.current['KeyD']) direction.x += 1

    

    direction.normalize().multiplyScalar(moveSpeed)

    direction.applyEuler(camera.rotation)

    

    playerRef.current.setLinvel({ 

      x: direction.x * 10,

      y: playerRef.current.linvel().y,

      z: direction.z * 10

    })

    

    if (keys.current['Space'] && canJump.current) {

      playerRef.current.setLinvel({ 

        x: playerRef.current.linvel().x,

        y: jumpForce,

        z: playerRef.current.linvel().z

      })

      canJump.current = false

      setTimeout(() => { canJump.current = true }, 500)

    }

    

    const position = playerRef.current.translation()

    camera.position.set(position.x, position.y + 1.3, position.z)

  })

  

  return (

    <>

      <PointerLockControls />

      <RigidBody 

        ref={playerRef}

        colliders={false}

        mass={1}

        type="dynamic"

        position={[0, 1.3, 5]}

        enabledRotations={[false, false, false]}

      >

        <CapsuleCollider args={[0.7, 0.3]} />

      </RigidBody>

    </>

  )

}



function Model() {

  const model = useGLTF('/scene.gltf')

  return (

    <RigidBody type="fixed" colliders="trimesh">

      <primitive 

        object={model.scene} 

        scale={[1, 1, 1]}

        position={[0, 0, 0]}

        rotation={[0, 0, 0]}

      />

    </RigidBody>

  )

}



function Ground() {

  return (

    <RigidBody type="fixed">

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>

        <planeGeometry args={[50, 50]} />

        <meshStandardMaterial color="#666" />

      </mesh>

    </RigidBody>

  )

}



function Scene() {

  return (

    <div style={{ width: '100vw', height: '100vh', background: 'gray' }}>

      <Canvas>

        <Physics gravity={[0, -9.81, 0]}>

          <ambientLight intensity={0.5} />

          <pointLight position={[10, 10, 10]} />

          <Ground />

          <Model />

          <Player />

        </Physics>

      </Canvas>

      <div style={{

        position: 'absolute',

        top: '20px',

        left: '20px',

        color: 'white',

        backgroundColor: 'rgba(0,0,0,0.5)',

        padding: '10px',

      }}>

        Нажмите для управления.<br/>

        WASD - движение<br/>

        Пробел - прыжок

      </div>

    </div>

  )

}



useGLTF.preload('/scene.gltf')



export default Scene;
