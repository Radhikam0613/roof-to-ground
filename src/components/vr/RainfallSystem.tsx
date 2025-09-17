import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, BufferGeometry, PointsMaterial, BufferAttribute } from "three";
import { Html } from "@react-three/drei";

interface RainfallSystemProps {
  intensity: number;
  area: { length: number; width: number; height: number };
  month: number;
}

export default function RainfallSystem({ intensity, area, month }: RainfallSystemProps) {
  const pointsRef = useRef<Points>(null);
  const materialRef = useRef<PointsMaterial>(null);

  // Monthly rainfall intensity (realistic Indian monsoon pattern)
  const monthlyIntensity = [
    0.1, 0.1, 0.2, 0.3, 0.6, 0.9, // Jan-Jun
    1.0, 0.9, 0.8, 0.4, 0.1, 0.1  // Jul-Dec
  ];

  const currentIntensity = monthlyIntensity[month - 1] * intensity;
  const particleCount = Math.floor(currentIntensity * 1000);

  // Generate raindrop positions
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random position over the roof area
      positions[i3] = (Math.random() - 0.5) * (area.length + 10);
      positions[i3 + 1] = Math.random() * 15 + 5; // Height
      positions[i3 + 2] = (Math.random() - 0.5) * (area.width + 10);

      // Velocity (falling speed)
      velocities[i3] = (Math.random() - 0.5) * 0.1; // Slight horizontal drift
      velocities[i3 + 1] = -Math.random() * 0.3 - 0.2; // Falling speed
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.1; // Slight horizontal drift
    }

    return { positions, velocities };
  }, [particleCount, area.length, area.width]);

  useFrame(() => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Update positions based on velocity
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      // Reset particle if it hits the ground
      if (positions[i3 + 1] < -2) {
        positions[i3] = (Math.random() - 0.5) * (area.length + 10);
        positions[i3 + 1] = Math.random() * 15 + 5;
        positions[i3 + 2] = (Math.random() - 0.5) * (area.width + 10);
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  // Update material opacity based on intensity
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.opacity = currentIntensity * 0.8;
      materialRef.current.size = currentIntensity * 0.1 + 0.05;
    }
  }, [currentIntensity]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <group>
      {/* Rainfall Particles */}
      {particleCount > 0 && (
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            ref={materialRef}
            color="#87CEEB"
            size={0.1}
            transparent
            opacity={0.6}
          />
        </points>
      )}

      {/* Rainfall Intensity Indicator */}
      <Html
        position={[-area.length/2 - 3, area.height + 4, 0]}
        transform
        style={{ pointerEvents: "none" }}
      >
        <div className="text-center text-yellow-400 font-bold">
          {monthNames[month - 1]}
        </div>
      </Html>

      <Html
        position={[-area.length/2 - 3, area.height + 3, 0]}
        transform
        style={{ pointerEvents: "none" }}
      >
        <div className={`text-center font-bold text-xl ${
          currentIntensity > 0.7 ? "text-green-400" : 
          currentIntensity > 0.3 ? "text-yellow-400" : "text-red-400"
        }`}>
          {(currentIntensity * 100).toFixed(0)}%
        </div>
      </Html>

      <Html
        position={[-area.length/2 - 3, area.height + 2.2, 0]}
        transform
        style={{ pointerEvents: "none" }}
      >
        <div className="text-center text-white text-sm">
          Rainfall Intensity
        </div>
      </Html>

      {/* Rainfall Amount Indicator */}
      <Html
        position={[area.length/2 + 3, area.height + 4, 0]}
        transform
        style={{ pointerEvents: "none" }}
      >
        <div className="text-center text-sky-300 font-bold">
          {Math.round(currentIntensity * 850)}mm
        </div>
      </Html>

      <Html
        position={[area.length/2 + 3, area.height + 3.2, 0]}
        transform
        style={{ pointerEvents: "none" }}
      >
        <div className="text-center text-white text-sm">
          Monthly Rainfall
        </div>
      </Html>

      {/* Wind Effect Visualization */}
      {currentIntensity > 0.5 && (
        <mesh position={[0, area.height + 8, 0]} rotation={[0, 0, Math.PI/6]}>
          <boxGeometry args={[0.2, 3, 0.2]} />
          <meshLambertMaterial 
            color="#87CEEB" 
            transparent 
            opacity={0.3}
          />
        </mesh>
      )}

      {/* Rain Clouds */}
      {currentIntensity > 0.2 && (
        <>
          <mesh position={[-5, area.height + 12, -3]}>
            <sphereGeometry args={[2, 8, 6]} />
            <meshLambertMaterial 
              color="#696969" 
              transparent 
              opacity={0.7}
            />
          </mesh>
          
          <mesh position={[3, area.height + 10, 2]}>
            <sphereGeometry args={[1.5, 8, 6]} />
            <meshLambertMaterial 
              color="#696969" 
              transparent 
              opacity={0.6}
            />
          </mesh>
        </>
      )}

      {/* Lightning Effect for Heavy Rain */}
      {currentIntensity > 0.8 && month >= 6 && month <= 9 && (
        <mesh position={[8, area.height + 6, 0]}>
          <boxGeometry args={[0.1, 8, 0.1]} />
          <meshLambertMaterial 
            color="#FFFF00" 
            emissive="#FFFF00"
            emissiveIntensity={0.8}
            transparent 
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
}