import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { Html } from "@react-three/drei";

interface TownshipModelProps {
  position: [number, number, number];
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  phase: string;
}

export default function TownshipModel({ position, dimensions, phase }: TownshipModelProps) {
  const groupRef = useRef<Group>(null);
  
  // Default dimensions for township
  const length = dimensions.length || 30;
  const width = dimensions.width || 25;
  const height = dimensions.height || 4;

  useFrame((state) => {
    // Gentle floating animation for input phase
    if (groupRef.current && phase === "input") {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    }
  });

  // Generate building positions for township
  const buildings = [
    { pos: [-8, 0, -6] as [number, number, number], size: [4, 3, 4] as [number, number, number] },
    { pos: [-8, 0, 0] as [number, number, number], size: [4, 4, 4] as [number, number, number] },
    { pos: [-8, 0, 6] as [number, number, number], size: [4, 3.5, 4] as [number, number, number] },
    { pos: [0, 0, -6] as [number, number, number], size: [4, 4.5, 4] as [number, number, number] },
    { pos: [0, 0, 0] as [number, number, number], size: [4, 3, 4] as [number, number, number] },
    { pos: [0, 0, 6] as [number, number, number], size: [4, 4, 4] as [number, number, number] },
    { pos: [8, 0, -6] as [number, number, number], size: [4, 3.5, 4] as [number, number, number] },
    { pos: [8, 0, 0] as [number, number, number], size: [4, 4, 4] as [number, number, number] },
    { pos: [8, 0, 6] as [number, number, number], size: [4, 3, 4] as [number, number, number] },
  ];

  return (
    <group ref={groupRef} position={position}>
      {/* Buildings */}
      {buildings.map((building, index) => (
        <group key={index} position={building.pos}>
          {/* Building Base */}
          <mesh position={[0, building.size[1]/2, 0]} castShadow>
            <boxGeometry args={building.size} />
            <meshLambertMaterial color="#8B7355" />
          </mesh>

          {/* Roof */}
          <mesh position={[0, building.size[1] + 0.3, 0]} castShadow>
            <boxGeometry args={[building.size[0] + 0.5, 0.6, building.size[2] + 0.5]} />
            <meshLambertMaterial 
              color={phase === "input" ? "#FF6B6B" : "#DC143C"}
              transparent={phase === "input"}
              opacity={phase === "input" ? 0.8 : 1}
            />
          </mesh>

          {/* Roof Highlighting Effect for Input Phase */}
          {phase === "input" && (
            <mesh position={[0, building.size[1] + 0.4, 0]}>
              <boxGeometry args={[building.size[0] + 0.7, 0.1, building.size[2] + 0.7]} />
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
          <mesh position={[-building.size[0]/2 + 0.1, building.size[1]/2, 0]} castShadow>
            <boxGeometry args={[0.2, 1, 2]} />
            <meshLambertMaterial color="#87CEEB" transparent opacity={0.7} />
          </mesh>
        </group>
      ))}

      {/* Common Areas */}
      <mesh position={[0, -1.9, 0]} receiveShadow>
        <boxGeometry args={[length, 0.1, width]} />
        <meshLambertMaterial color="#228B22" />
      </mesh>

      {/* Central Courtyard */}
      <mesh position={[0, -1.85, 0]} receiveShadow>
        <boxGeometry args={[8, 0.1, 8]} />
        <meshLambertMaterial color="#32CD32" />
      </mesh>

      {/* Pathways */}
      <mesh position={[0, -1.8, 0]} receiveShadow>
        <boxGeometry args={[2, 0.1, width]} />
        <meshLambertMaterial color="#696969" />
      </mesh>
      
      <mesh position={[0, -1.8, 0]} receiveShadow>
        <boxGeometry args={[length, 0.1, 2]} />
        <meshLambertMaterial color="#696969" />
      </mesh>

      {/* Dimension Labels */}
      {phase === "input" && (
        <>
          <Html
            position={[0, height + 3, width/2 + 3]}
            transform
            style={{ pointerEvents: "none" }}
          >
            <div className="text-center text-yellow-400 font-bold text-xl">
              Township Area: {length} × {width} ft
            </div>
          </Html>
          
          <Html
            position={[length/2 + 3, height/2, 0]}
            transform
            style={{ pointerEvents: "none" }}
          >
            <div className="text-center text-yellow-400 font-semibold text-lg">
              Length: {length} ft
            </div>
          </Html>
          
          <Html
            position={[0, height/2, width/2 + 3]}
            transform
            style={{ pointerEvents: "none" }}
          >
            <div className="text-center text-yellow-400 font-semibold text-lg">
              Width: {width} ft
            </div>
          </Html>
        </>
      )}

      {/* Catchment Area Visualization */}
      {(phase === "simulation" || phase === "analysis") && (
        <mesh position={[0, -1.7, 0]} receiveShadow>
          <boxGeometry args={[length * 1.1, 0.1, width * 1.1]} />
          <meshLambertMaterial 
            color="#4169E1" 
            transparent 
            opacity={0.2}
          />
        </mesh>
      )}

      {/* Drainage System */}
      {(phase === "simulation" || phase === "analysis") && (
        <>
          {/* Main Collection Points */}
          {buildings.map((building, index) => (
            <mesh 
              key={`drain-${index}`}
              position={[building.pos[0] + 2.5, -1.5, building.pos[2] + 2.5]}
            >
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshLambertMaterial color="#4682B4" />
            </mesh>
          ))}
          
          {/* Central Collection Tank */}
          <mesh position={[12, -1, 0]}>
            <cylinderGeometry args={[2, 2, 2, 8]} />
            <meshLambertMaterial color="#1E90FF" transparent opacity={0.8} />
          </mesh>
          
          <Html
            position={[12, 1, 0]}
            transform
            style={{ pointerEvents: "none" }}
          >
            <div className="text-center text-yellow-400 font-semibold">
              Central Storage
            </div>
          </Html>
        </>
      )}
    </group>
  );
}