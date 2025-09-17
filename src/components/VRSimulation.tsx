import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html } from "@react-three/drei";
import { Vector3 } from "three";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, VolumeX, Volume2, RotateCcw, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import HouseModel from "./vr/HouseModel";
import TownshipModel from "./vr/TownshipModel";
import RainfallSystem from "./vr/RainfallSystem";
import WaterFlowSystem from "./vr/WaterFlowSystem";
import SpatialUI from "./vr/SpatialUI";
import VRDataVisualization from "./vr/VRDataVisualization";

interface VRSimulationProps {
  onBack: () => void;
}

type PropertyType = "individual" | "township" | null;
type SimulationPhase = "selection" | "input" | "simulation" | "analysis";

interface SimulationData {
  propertyType: PropertyType;
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

export default function VRSimulation({ onBack }: VRSimulationProps) {
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<SimulationPhase>("selection");
  const [isMuted, setIsMuted] = useState(false);
  const [simulationData, setSimulationData] = useState<SimulationData>({
    propertyType: null,
    dimensions: { length: 0, width: 0, height: 0 },
    location: "",
    currentMonth: 1,
    isPlaying: false,
    speed: 1
  });

  const handlePropertyTypeSelect = (type: PropertyType) => {
    setSimulationData(prev => ({ ...prev, propertyType: type }));
    setCurrentPhase("input");
    toast({
      title: "Property Selected",
      description: `Starting ${type} simulation setup...`,
    });
  };

  const handleDimensionsInput = (dimensions: typeof simulationData.dimensions, location: string) => {
    setSimulationData(prev => ({ 
      ...prev, 
      dimensions, 
      location 
    }));
    setCurrentPhase("simulation");
    toast({
      title: "Setup Complete",
      description: "Initializing rainfall simulation...",
    });
  };

  const toggleSimulation = () => {
    setSimulationData(prev => ({ 
      ...prev, 
      isPlaying: !prev.isPlaying 
    }));
  };

  const resetSimulation = () => {
    setSimulationData(prev => ({ 
      ...prev, 
      currentMonth: 1, 
      isPlaying: false 
    }));
    toast({
      title: "Simulation Reset",
      description: "Restarting from month 1...",
    });
  };

  const moveToAnalysis = () => {
    setCurrentPhase("analysis");
    setSimulationData(prev => ({ ...prev, isPlaying: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-900 via-sky-700 to-blue-900 relative overflow-hidden">
      
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center">
        <Button 
          variant="default" 
          onClick={onBack}
          className="bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assessment
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className="bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          
          {currentPhase === "simulation" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSimulation}
                className="bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30"
              >
                {simulationData.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={resetSimulation}
                className="bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Phase Selection UI */}
      {currentPhase === "selection" && (
        <div className="absolute inset-0 flex items-center justify-center z-40">
          <Card className="p-8 bg-white/10 backdrop-blur-lg border-white/20 text-white max-w-md text-center">
            <h2 className="text-2xl font-bold mb-6 text-gradient">Choose Property Type</h2>
            <p className="mb-8 text-white/80">
              Select your property type to begin the AR/VR simulation experience
            </p>
            <div className="space-y-4">
              <Button
                size="lg"
                onClick={() => handlePropertyTypeSelect("individual")}
                className="w-full gradient-water text-white shadow-water hover:shadow-elevated transition-all duration-300"
              >
                Individual House
              </Button>
              <Button
                size="lg" 
                variant="outline"
                onClick={() => handlePropertyTypeSelect("township")}
                className="w-full border-white/30 text-white hover:bg-white/20"
              >
                Township/Complex
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 8, 15], fov: 75 }}
        style={{ height: "100vh", width: "100vw" }}
      >
        <Environment preset="sunset" />
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        
        {/* Ground Plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshLambertMaterial color="#2d5a27" />
        </mesh>

        {/* Models based on phase and selection */}
        {currentPhase !== "selection" && simulationData.propertyType === "individual" && (
          <HouseModel 
            position={[0, 0, 0]}
            dimensions={simulationData.dimensions}
            phase={currentPhase}
          />
        )}
        
        {currentPhase !== "selection" && simulationData.propertyType === "township" && (
          <TownshipModel 
            position={[0, 0, 0]}
            dimensions={simulationData.dimensions}
            phase={currentPhase}
          />
        )}

        {/* Spatial UI for input phase */}
        {currentPhase === "input" && (
          <SpatialUI
            propertyType={simulationData.propertyType!}
            onSubmit={handleDimensionsInput}
          />
        )}

        {/* Rainfall Animation */}
        {currentPhase === "simulation" && simulationData.isPlaying && (
          <RainfallSystem 
            intensity={0.8}
            area={simulationData.dimensions}
            month={simulationData.currentMonth}
          />
        )}

        {/* Water Flow System */}
        {currentPhase === "simulation" && (
          <WaterFlowSystem
            dimensions={simulationData.dimensions}
            isPlaying={simulationData.isPlaying}
            currentMonth={simulationData.currentMonth}
            onMonthChange={(month) => {
              setSimulationData(prev => ({ ...prev, currentMonth: month }));
              if (month >= 12) moveToAnalysis();
            }}
          />
        )}

        {/* VR Data Visualization */}
        {(currentPhase === "simulation" || currentPhase === "analysis") && (
          <VRDataVisualization
            data={simulationData}
            phase={currentPhase}
            position={[5, 2, 0]}
          />
        )}

        {/* Title Text in 3D Space */}
        {currentPhase === "selection" && (
          <Html
            position={[0, 3, 0]}
            transform
            style={{
              width: "400px",
              pointerEvents: "none"
            }}
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white text-gradient">
                RTRWH AR/VR Simulation
              </h1>
            </div>
          </Html>
        )}

        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          maxDistance={25}
          minDistance={5}
          target={[0, 0, 0]}
        />
      </Canvas>

      {/* Bottom UI Panel for Simulation */}
      {currentPhase === "simulation" && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40">
          <Card className="p-4 bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-white/70">Month:</span>
                <span className="ml-2 font-bold">{simulationData.currentMonth}/12</span>
              </div>
              <div className="w-32 h-2 bg-white/20 rounded-full">
                <div 
                  className="h-full gradient-water rounded-full transition-all duration-500"
                  style={{ width: `${(simulationData.currentMonth / 12) * 100}%` }}
                />
              </div>
              <div className="text-sm text-white/70">
                {simulationData.isPlaying ? "Simulating..." : "Paused"}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Analysis Phase Controls */}
      {currentPhase === "analysis" && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40">
          <Card className="p-4 bg-white/10 backdrop-blur-lg border-white/20 text-white text-center">
            <h3 className="text-lg font-semibold mb-2">Simulation Complete</h3>
            <p className="text-sm text-white/70 mb-4">
              Explore the 3D analysis or return to traditional assessment
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={resetSimulation}
                className="gradient-earth text-white"
              >
                Restart Simulation
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onBack}
                className="border-white/30 text-white hover:bg-white/20"
              >
                Exit to Report
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}