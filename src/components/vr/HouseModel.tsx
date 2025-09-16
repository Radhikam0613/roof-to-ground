import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, BoxGeometry, MeshLambertMaterial } from "three";
import { Text } from "@react-three/drei";

interface HouseModelProps {
  position: [number, number, number];
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  phase: string;
}

export default function HouseModel({ position, dimensions, phase }: HouseModelProps) {
  const houseRef = useRef<Mesh>(null);
  const roofRef = useRef<Mesh>(null);
  
  // Default dimensions if not provided
  const length = dimensions.length || 10;
  const width = dimensions.width || 8;
  const height = dimensions.height || 3;

  useFrame((state) => {
    // Gentle floating animation
    if (houseRef.current && phase === "input") {
      houseRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* House Base */}
      <mesh ref={houseRef} position={[0, height/2, 0]} castShadow>
        <boxGeometry args={[length, height, width]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>

      {/* Roof */}
      <mesh ref={roofRef} position={[0, height + 0.5, 0]} castShadow>
        <boxGeometry args={[length + 1, 1, width + 1]} />
        <meshLambertMaterial 
          color={phase === "input" ? "#FF6B6B" : "#DC143C"} 
          transparent={phase === "input"}
          opacity={phase === "input" ? 0.8 : 1}
        />
      </mesh>

      {/* Roof Highlighting Effect for Input Phase */}
      {phase === "input" && (
        <mesh position={[0, height + 0.6, 0]}>
          <boxGeometry args={[length + 1.2, 0.1, width + 1.2]} />
          <meshLambertMaterial 
            color="#FFD700" 
            transparent 
            opacity={0.6}
            emissive="#FFD700"
            emissiveIntensity={0.3}
          />
        </mesh>
      )}

      {/* Windows */}
      <mesh position={[-length/2 + 0.1, height/2, width/4]} castShadow>
        <boxGeometry args={[0.2, 1.5, 1.5]} />
        <meshLambertMaterial color="#87CEEB" transparent opacity={0.7} />
      </mesh>
      
      <mesh position={[-length/2 + 0.1, height/2, -width/4]} castShadow>
        <boxGeometry args={[0.2, 1.5, 1.5]} />
        <meshLambertMaterial color="#87CEEB" transparent opacity={0.7} />
      </mesh>

      {/* Door */}
      <mesh position={[length/2 - 0.1, height/2 - 0.5, 0]} castShadow>
        <boxGeometry args={[0.2, 2, 1]} />
        <meshLambertMaterial color="#654321" />
      </mesh>

      {/* Dimension Labels */}
      {phase === "input" && (
        <>
          <Text
            position={[0, height + 2, width/2 + 2]}
            fontSize={0.5}
            color="#FFD700"
            anchorX="center"
            anchorY="middle"
          >
            Roof Area: {length} × {width} ft
          </Text>
          
          <Text
            position={[length/2 + 2, height/2, 0]}
            fontSize={0.4}
            color="#FFD700"
            anchorX="center"
            anchorY="middle"
            rotation={[0, -Math.PI/2, 0]}
          >
            L: {length} ft
          </Text>
          
          <Text
            position={[0, height/2, width/2 + 2]}
            fontSize={0.4}
            color="#FFD700"
            anchorX="center"
            anchorY="middle"
          >
            W: {width} ft
          </Text>
        </>
      )}

      {/* Catchment Area Visualization */}
      {(phase === "simulation" || phase === "analysis") && (
        <mesh position={[0, -1.9, 0]} receiveShadow>
          <boxGeometry args={[length * 1.2, 0.1, width * 1.2]} />
          <meshLambertMaterial 
            color="#4169E1" 
            transparent 
            opacity={0.3}
          />
        </mesh>
      )}

      {/* Gutters */}
      {(phase === "simulation" || phase === "analysis") && (
        <>
          {/* Side Gutters */}
          <mesh position={[length/2 + 0.5, height + 0.3, 0]}>
            <boxGeometry args={[0.2, 0.3, width]} />
            <meshLambertMaterial color="#C0C0C0" />
          </mesh>
          
          <mesh position={[-length/2 - 0.5, height + 0.3, 0]}>
            <boxGeometry args={[0.2, 0.3, width]} />
            <meshLambertMaterial color="#C0C0C0" />
          </mesh>
          
          {/* Downspouts */}
          <mesh position={[length/2 + 0.5, height/2 - 0.5, width/2]}>
            <boxGeometry args={[0.3, height, 0.3]} />
            <meshLambertMaterial color="#C0C0C0" />
          </mesh>
          
          <mesh position={[-length/2 - 0.5, height/2 - 0.5, width/2]}>
            <boxGeometry args={[0.3, height, 0.3]} />
            <meshLambertMaterial color="#C0C0C0" />
          </mesh>
        </>
      )}
    </group>
  );
}