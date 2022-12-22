import { AppShell, Button, Flex, Textarea } from '@mantine/core'
import {
  Html,
  Text,
  OrthographicCamera,
  PerspectiveCamera,
} from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Controllers,
  Hands,
  RayGrab,
  useXR,
  XR,
  XRButton,
} from '@react-three/xr'
import React, { useRef, useState } from 'react'
import useWhisper from './useRecording'

const CustomText = ({ children, ...props }) => {
  const fontProps = {
    font: '/Inter-Bold.woff',
    fontSize: 0.25,
    letterSpacing: -0.05,
    lineHeight: 1,
    'material-toneMapped': false,
  }

  return (
    <group {...props}>
      <Text
        {...fontProps}
        outlineWidth={0.03}
        outlineColor="#000"
        maxWidth={5}
        children={children}
      />
    </group>
  )
}

const WhisperHud = (props) => {
  const [started, setStarted] = useState(true)
  const [text, setText] = useState([])
  useWhisper(started, (text) => setText(text))

  return <CustomText {...props}>{text}</CustomText>
}

const RotationBox = (props) => {
  const ref = useRef()
  useFrame(() => {
    ref.current.rotation.y += 0.01
    ref.current.rotation.x += 0.01
  })
  return (
    <mesh ref={ref} {...props}>
      <boxGeometry />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}

const Hud = () => {
  const ref = useRef()
  // const player = useXR((s) => s.player)

  useFrame(({ camera, gl }) => {
    const cam = gl.xr.isPresenting ? gl.xr.getCamera(camera) : camera
    // set position of ref to cam position
    ref.current.position.copy(cam.position)
    // set rotation of ref to cam rotation
    ref.current.rotation.copy(cam.rotation)
  })

  return (
    <group ref={ref}>
      <RotationBox position={[0, 2.5, -5]} scale={0.2} />
      <WhisperHud position={[0, -2.5, -5]} />
      {/* <CustomText position={[0, -2.5, -5]}>
        Hello, World! This is a test of the emergency broadcast system.
      </CustomText> */}
    </group>
  )
}

const Player = () => {
  return (
    <group position={[0, 0, 10]}>
      <mesh scale={0.15}>
        <boxGeometry />
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
  )
}

const App = () => {
  useWhisper(true, (text) => setText(text))
  return (
    <>
      <AppShell>
        <XRButton
          mode="AR"
          sessionInit={{
            // requiredFeatures: ['camera-access'],
            optionalFeatures: [
              'local-floor',
              'bounded-floor',
              'hand-tracking',
              'layers',
              // 'dom-overlay',
            ],
            // domOverlay: {
            //   root: document.getElementById('overlay'),
            // },
          }}
        />
      </AppShell>
      <Canvas style={{ width: '100vw', height: '100vh' }}>
        <XR player={<Player />}>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} />
          <Controllers />
          <Hands />
          <RayGrab>
            <mesh>
              <boxGeometry />
              <meshStandardMaterial color="blue" />
            </mesh>
          </RayGrab>
          <Hud />
        </XR>
      </Canvas>
    </>
  )
}

export default App
