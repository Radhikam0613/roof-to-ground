import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { Text, Html } from "@react-three/drei";

interface SimulationData {
  propertyType: "individual" | "township" | null;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  location: string;
  currentMonth: number;
  isPlaying: boolean;
  speed: number;
}

interface VRDataVisualizationProps {
  data: SimulationData;
  phase: string;
  position: [number, number, number];
}

export default function VRDataVisualization({ 
  data, 
  phase, 
  position 
}: VRDataVisualizationProps) {
  const chartRef = useRef<Group>(null);
  const hologramRef = useRef<Group>(null);

  // Calculate stats based on current simulation
  const roofArea = (data.dimensions.length || 10) * (data.dimensions.width || 8);
  const monthlyRainfall = [40, 30, 20, 35, 60, 120, 180, 160, 140, 80, 20, 15];
  const currentRainfall = monthlyRainfall[data.currentMonth - 1] || 0;
  const yearlyTotal = monthlyRainfall.reduce((sum, month) => sum + month, 0);
  
  const potentialCollection = Math.round((roofArea * 0.092903 * yearlyTotal * 0.85) / 1000) * 1000;
  const currentCollection = Math.round((roofArea * 0.092903 * currentRainfall * 0.85) / 1000) * 1000;
  
  const estimatedCost = data.propertyType === "township" ? 
    Math.round(roofArea * 25 + 100000) : 
    Math.round(roofArea * 15 + 25000);
  
  const annualSavings = Math.round(potentialCollection * 0.03); // ₹0.03 per liter

  useFrame((state) => {
    // Rotate hologram
    if (hologramRef.current) {
      hologramRef.current.rotation.y += 0.01;
    }

    // Animate chart bars
    if (chartRef.current && phase === "analysis") {
      chartRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + position[1];
    }
  });

  return (
    <group position={position}>
      {/* Floating Data Panel */}
      <Html
        transform
        occlude="blending"
        style={{
          width: "300px",
          pointerEvents: "none"
        }}
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 text-white">
          <h3 className="text-lg font-bold mb-3 text-center">Live Statistics</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Roof Area:</span>
              <span className="font-semibold">{roofArea.toLocaleString()} sq ft</span>
            </div>
            
            <div className="flex justify-between">
              <span>Current Month:</span>
              <span className="font-semibold">{data.currentMonth}/12</span>
            </div>
            
            <div className="flex justify-between">
              <span>Monthly Rainfall:</span>
              <span className="font-semibold">{currentRainfall}mm</span>
            </div>
            
            <div className="flex justify-between">
              <span>Collection:</span>
              <span className="font-semibold text-blue-300">
                {currentCollection.toLocaleString()}L
              </span>
            </div>
            
            <hr className="border-white/30 my-2" />
            
            <div className="flex justify-between">
              <span>Annual Potential:</span>
              <span className="font-semibold text-green-300">
                {potentialCollection.toLocaleString()}L
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Est. Cost:</span>
              <span className="font-semibold text-yellow-300">
                ₹{estimatedCost.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Annual Savings:</span>
              <span className="font-semibold text-green-300">
                ₹{annualSavings.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Html>

      {/* 3D Bar Chart for Monthly Data */}
      {phase === "simulation" && (
        <group position={[0, 2, 0]}>
          {monthlyRainfall.slice(0, data.currentMonth).map((rainfall, index) => (
            <mesh 
              key={index}
              ref={index === data.currentMonth - 1 ? undefined : undefined}
              position={[index * 0.5 - 3, rainfall * 0.01, 0]}
            >
              <boxGeometry args={[0.3, rainfall * 0.02, 0.3]} />
              <meshLambertMaterial 
                color={index === data.currentMonth - 1 ? "#FFD700" : "#4169E1"}
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}
          
          <Text
            position={[0, 2.5, 0]}
            fontSize={0.3}
            color="#FFD700"
            anchorX="center"
            anchorY="middle"
          >
            Monthly Rainfall (mm)
          </Text>
        </group>
      )}

      {/* Holographic Environmental Impact Display */}
      {phase === "analysis" && (
        <group ref={hologramRef} position={[4, 1, 0]}>
          {/* Hologram Base */}
          <mesh>
            <cylinderGeometry args={[1.5, 1.5, 0.1, 16]} />
            <meshLambertMaterial 
              color="#00FF00" 
              transparent 
              opacity={0.3}
              emissive="#00FF00"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Floating Elements */}
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.3, 16, 12]} />
            <meshLambertMaterial 
              color="#32CD32" 
              transparent 
              opacity={0.7}
              emissive="#32CD32"
              emissiveIntensity={0.3}
            />
          </mesh>

          <mesh position={[0.8, 0.5, 0]} rotation={[0, 0, Math.PI/4]}>
            <boxGeometry args={[0.2, 1, 0.2]} />
            <meshLambertMaterial 
              color="#00BFFF" 
              transparent 
              opacity={0.8}
              emissive="#00BFFF"
              emissiveIntensity={0.2}
            />
          </mesh>

          <Text
            position={[0, 2, 0]}
            fontSize={0.25}
            color="#00FF00"
            anchorX="center"
            anchorY="middle"
          >
            Environmental Impact
          </Text>

          <Text
            position={[0, 1.6, 0]}
            fontSize={0.2}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            CO₂ Saved: {Math.round(potentialCollection * 0.0002)} kg/year
          </Text>

          <Text
            position={[0, 1.3, 0]}
            fontSize={0.2}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            Groundwater Recharged
          </Text>
        </group>
      )}

      {/* Efficiency Indicator */}
      <group position={[-2, 0, 2]}>
        <mesh>
          <torusGeometry args={[0.8, 0.1, 8, 16]} />
          <meshLambertMaterial color="#FFD700" />
        </mesh>
        
        <mesh rotation={[0, 0, (data.currentMonth / 12) * Math.PI * 2]}>
          <boxGeometry args={[1, 0.05, 0.05]} />
          <meshLambertMaterial 
            color="#32CD32"
            emissive="#32CD32" 
            emissiveIntensity={0.5}
          />
        </mesh>

        <Text
          position={[0, -1.5, 0]}
          fontSize={0.25}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
        >
          Collection Progress
        </Text>

        <Text
          position={[0, -1.8, 0]}
          fontSize={0.3}
          color="#32CD32"
          anchorX="center"
          anchorY="middle"
        >
          {Math.round((data.currentMonth / 12) * 100)}%
        </Text>
      </group>

      {/* Cost-Benefit Analysis Hologram */}
      {phase === "analysis" && (
        <group position={[-4, 2, 0]}>
          <mesh>
            <boxGeometry args={[2, 1.5, 0.1]} />
            <meshLambertMaterial 
              color="#4169E1" 
              transparent 
              opacity={0.3}
            />
          </mesh>

          <Text
            position={[0, 0.5, 0.1]}
            fontSize={0.2}
            color="#FFD700"
            anchorX="center"
            anchorY="middle"
          >
            Cost-Benefit Analysis
          </Text>

          <Text
            position={[0, 0, 0.1]}
            fontSize={0.15}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            Payback Period: {Math.round(estimatedCost / annualSavings)} years
          </Text>

          <Text
            position={[0, -0.3, 0.1]}
            fontSize={0.15}
            color="#32CD32"
            anchorX="center"
            anchorY="middle"
          >
            ROI: {Math.round((annualSavings / estimatedCost) * 100)}% annually
          </Text>
        </group>
      )}
    </group>
  );
}