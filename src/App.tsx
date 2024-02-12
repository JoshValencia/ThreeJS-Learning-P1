import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import "./App.css";
import { useRef } from "react";
import { MathUtils, TextureLoader, AdditiveBlending } from "three";

type AddStar = () => {
  x: number;
  y: number;
  z: number;
};

function App() {
  const earthTexture = useLoader(TextureLoader, "earth.jpg");
  const earthLightTexture = useLoader(TextureLoader, "earthlights.jpg");
  const earthCloudTexture = useLoader(TextureLoader, "earthcloud.jpg");
  const earthBumpTexture = useLoader(TextureLoader, "earthbump.jpg");
  const starTexture = useLoader(TextureLoader, "star.jpg");

  const Earth = () => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame(() => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.002;
        groupRef.current.rotation.z = 0.25;
      }
    });

    return (
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[2, 24, 24]} />
          <meshStandardMaterial
            map={earthTexture}
            bumpMap={earthBumpTexture}
            bumpScale={1}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[2, 24, 24]} />
          <meshBasicMaterial
            map={earthCloudTexture}
            blending={AdditiveBlending}
            opacity={0.2}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[2, 24, 24]} />
          <meshBasicMaterial
            map={earthLightTexture}
            blending={AdditiveBlending}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[2.1, 24, 24]} />
          <meshStandardMaterial
            color="#0072ff"
            emissive="#0072ff"
            emissiveIntensity={1}
            opacity={0.1}
            transparent={true}
          />
        </mesh>
      </group>
    );
  };

  const addStar: AddStar = () => {
    const [x, y, z] = Array(3)
      .fill(null)
      .map(() => MathUtils.randFloatSpread(500) - 200);

    // Ensure stars are not near the Earth
    const distanceThreshold = 100;
    const earthPosition = [0, 0, 0];
    const distanceToEarth = Math.sqrt(
      Math.pow(x - earthPosition[0], 2) +
        Math.pow(y - earthPosition[1], 2) +
        Math.pow(z - earthPosition[2], 2)
    );

    if (distanceToEarth < distanceThreshold) {
      return addStar(); // Recursively generate a new star
    }

    return { x, y, z };
  };

  return (
    <Canvas camera={{ position: [5, 0, 5] }}>
      <directionalLight color="white" position={[0, 0, 5]} intensity={2} />
      <Earth />
      {Array(1000)
        .fill(null)
        .map((a, i) => {
          const { x, y, z } = addStar();
          const colors = ["blue", "white", "yellow", "orange", "red"];
          const color = colors[Math.floor(Math.random() * colors.length)];

          return (
            <group key={a + i} position={[x, y, z]}>
              <mesh>
                <sphereGeometry args={[0.25, 24, 24, 24]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={5}
                />
              </mesh>
              <mesh>
                <sphereGeometry args={[0.25, 24, 24, 24]} />
                <meshBasicMaterial
                  map={starTexture}
                  blending={AdditiveBlending}
                  opacity={0.2}
                  transparent={true}
                />
              </mesh>
            </group>
          );
        })}
      <OrbitControls />
    </Canvas>
  );
}

export default App;
