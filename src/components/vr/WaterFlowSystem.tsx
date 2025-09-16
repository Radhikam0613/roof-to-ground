import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { Text } from "@react-three/drei";

interface WaterFlowSystemProps {
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  isPlaying: boolean;
  currentMonth: number;
  onMonthChange: (month: number) => void;
}

export default function WaterFlowSystem({ 
  dimensions, 
  isPlaying, 
  currentMonth, 
  onMonthChange 
}: WaterFlowSystemProps) {
  const tankRef = useRef<Mesh>(null);
  const waterLevelRef = useRef<Mesh>(null);
  const overflowRef = useRef<Mesh>(null);
  const timeRef = useRef(0);

  // Calculate monthly water accumulation
  const monthlyRainfall = [40, 30, 20, 35, 60, 120, 180, 160, 140, 80, 20, 15]; // mm per month
  const roofArea = (dimensions.length || 10) * (dimensions.width || 8); // sq ft
  const catchmentEfficiency = 0.85;
  
  // Convert sq ft to sq m and calculate liters
  const monthlyCollection = monthlyRainfall.map(rainfall => 
    Math.round((roofArea * 0.092903 * rainfall * catchmentEfficiency) / 1000) * 1000 // Round to nearest 1000L
  );

  const cumulativeCollection = monthlyCollection.slice(0, currentMonth)
    .reduce((sum, current) => sum + current, 0);

  const tankCapacity = 50000; // 50,000 liters
  const currentLevel = Math.min(cumulativeCollection, tankCapacity);
  const overflow = cumulativeCollection > tankCapacity ? cumulativeCollection - tankCapacity : 0;

  useFrame((state, delta) => {
    if (isPlaying) {
      timeRef.current += delta;
      
      // Advance month every 2 seconds in simulation
      if (timeRef.current >= 2) {
        timeRef.current = 0;
        if (currentMonth < 12) {
          onMonthChange(currentMonth + 1);
        }
      }
    }

    // Animate water level
    if (waterLevelRef.current) {
      const targetHeight = (currentLevel / tankCapacity) * 2;
      waterLevelRef.current.scale.y = targetHeight;
      waterLevelRef.current.position.y = -1 + targetHeight / 2;
    }

    // Animate tank water color based on level
    if (tankRef.current) {
      const material = tankRef.current.material as any;
      if (material.color) {
        const intensity = currentLevel / tankCapacity;
        material.color.setHSL(0.6, 0.8, 0.3 + intensity * 0.4);
      }
    }
  });

  return (
    <group>
      {/* Storage Tank */}
      <mesh ref={tankRef} position={[dimensions.length/2 + 4, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 2, 12]} />
        <meshLambertMaterial color="#4682B4" transparent opacity={0.7} />
      </mesh>

      {/* Water Level Inside Tank */}
      <mesh ref={waterLevelRef} position={[dimensions.length/2 + 4, -1, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 2, 12]} />
        <meshLambertMaterial color="#00BFFF" transparent opacity={0.8} />
      </mesh>

      {/* Tank Base */}
      <mesh position={[dimensions.length/2 + 4, -1.2, 0]}>
        <cylinderGeometry args={[1.6, 1.6, 0.4, 12]} />
        <meshLambertMaterial color="#696969" />
      </mesh>

      {/* Water Collection Pipe from Roof */}
      <mesh position={[dimensions.length/2 + 2, 1, 0]}>
        <boxGeometry args={[4, 0.2, 0.2]} />
        <meshLambertMaterial color="#C0C0C0" />
      </mesh>

      {/* Recharge Pit */}
      <mesh position={[-dimensions.length/2 - 3, -1.5, 0]}>
        <boxGeometry args={[2, 1, 2]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>

      {/* Water in Recharge Pit */}
      {overflow > 0 && (
        <mesh position={[-dimensions.length/2 - 3, -1.8, 0]}>
          <boxGeometry args={[1.8, 0.4, 1.8]} />
          <meshLambertMaterial color="#00BFFF" transparent opacity={0.6} />
        </mesh>
      )}

      {/* Overflow Pipe */}
      {overflow > 0 && (
        <mesh position={[dimensions.length/2 + 1, -0.5, 0]}>
          <boxGeometry args={[6, 0.15, 0.15]} />
          <meshLambertMaterial color="#FF6B6B" />
        </mesh>
      )}

      {/* Data Display */}
      <Text
        position={[dimensions.length/2 + 4, 2.5, 0]}
        fontSize={0.3}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
      >
        Storage Tank
      </Text>

      <Text
        position={[dimensions.length/2 + 4, 2, 0]}
        fontSize={0.4}
        color="#00BFFF"
        anchorX="center"
        anchorY="middle"
      >
        {currentLevel.toLocaleString()}L
      </Text>

      <Text
        position={[dimensions.length/2 + 4, 1.6, 0]}
        fontSize={0.25}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        of {tankCapacity.toLocaleString()}L
      </Text>

      {/* Recharge Pit Label */}
      <Text
        position={[-dimensions.length/2 - 3, 0.5, 0]}
        fontSize={0.3}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
      >
        Recharge Pit
      </Text>

      {overflow > 0 && (
        <Text
          position={[-dimensions.length/2 - 3, 0, 0]}
          fontSize={0.25}
          color="#00FF00"
          anchorX="center"
          anchorY="middle"
        >
          Recharging: {overflow.toLocaleString()}L
        </Text>
      )}

      {/* Monthly Collection Stats */}
      <Text
        position={[0, dimensions.height + 6, 0]}
        fontSize={0.4}
        color="#32CD32"
        anchorX="center"
        anchorY="middle"
      >
        This Month: {monthlyCollection[currentMonth - 1]?.toLocaleString() || 0}L
      </Text>

      <Text
        position={[0, dimensions.height + 5.5, 0]}
        fontSize={0.3}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        Total Collected: {cumulativeCollection.toLocaleString()}L
      </Text>

      {/* Water Flow Animation */}
      {isPlaying && currentMonth <= 12 && (
        <>
          {/* Animated Water Droplets from Roof to Tank */}
          <mesh position={[dimensions.length/4, 1.5 + Math.sin(Date.now() * 0.01) * 0.5, 0]}>
            <sphereGeometry args={[0.1, 8, 6]} />
            <meshLambertMaterial color="#00BFFF" transparent opacity={0.8} />
          </mesh>

          <mesh position={[dimensions.length/2 + 1, 1 + Math.sin(Date.now() * 0.015) * 0.3, 0]}>
            <sphereGeometry args={[0.08, 8, 6]} />
            <meshLambertMaterial color="#00BFFF" transparent opacity={0.8} />
          </mesh>

          {/* Flow Effect in Pipes */}
          <mesh position={[dimensions.length/2 + 2, 1, 0]} rotation={[0, 0, Math.PI/4]}>
            <boxGeometry args={[0.5, 0.05, 0.05]} />
            <meshLambertMaterial 
              color="#87CEEB" 
              emissive="#87CEEB"
              emissiveIntensity={0.3}
              transparent 
              opacity={0.7}
            />
          </mesh>
        </>
      )}

      {/* Groundwater Arrows */}
      {overflow > 0 && (
        <>
          <mesh position={[-dimensions.length/2 - 3, -2.5, 0]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.2, 0.5, 8]} />
            <meshLambertMaterial color="#32CD32" />
          </mesh>
          
          <Text
            position={[-dimensions.length/2 - 3, -3.2, 0]}
            fontSize={0.2}
            color="#32CD32"
            anchorX="center"
            anchorY="middle"
          >
            Groundwater Recharge
          </Text>
        </>
      )}
    </group>
  );
}