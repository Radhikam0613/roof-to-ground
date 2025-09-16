import { useState } from "react";
import { Html } from "@react-three/drei";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

interface SpatialUIProps {
  propertyType: "individual" | "township";
  onSubmit: (dimensions: { length: number; width: number; height: number }, location: string) => void;
}

export default function SpatialUI({ propertyType, onSubmit }: SpatialUIProps) {
  const [dimensions, setDimensions] = useState({
    length: propertyType === "individual" ? 10 : 30,
    width: propertyType === "individual" ? 8 : 25,
    height: propertyType === "individual" ? 3 : 4
  });
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (dimensions.length <= 0) newErrors.length = "Length must be greater than 0";
    if (dimensions.width <= 0) newErrors.width = "Width must be greater than 0"; 
    if (dimensions.height <= 0) newErrors.height = "Height must be greater than 0";
    if (!location.trim()) newErrors.location = "Location is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(dimensions, location);
    }
  };

  const updateDimension = (key: keyof typeof dimensions, value: string) => {
    const numValue = parseFloat(value) || 0;
    setDimensions(prev => ({ ...prev, [key]: numValue }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: "" }));
    }
  };

  return (
    <>
      {/* Main Input Panel */}
      <Html
        position={[-8, 4, 2]}
        transform
        occlude="blending"
        style={{
          width: "400px",
          pointerEvents: "auto"
        }}
      >
        <Card className="p-6 bg-white/90 backdrop-blur-lg border-primary/20 shadow-elevated">
          <h3 className="text-xl font-bold text-primary-deep mb-4">
            {propertyType === "individual" ? "House" : "Township"} Dimensions
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="length" className="text-sm font-medium">
                Length (feet) *
              </Label>
              <Input
                id="length"
                type="number"
                value={dimensions.length || ""}
                onChange={(e) => updateDimension("length", e.target.value)}
                placeholder="e.g., 30"
                className={`mt-1 ${errors.length ? "border-destructive" : ""}`}
              />
              {errors.length && (
                <p className="text-xs text-destructive mt-1">{errors.length}</p>
              )}
            </div>

            <div>
              <Label htmlFor="width" className="text-sm font-medium">
                Width (feet) *
              </Label>
              <Input
                id="width"
                type="number"
                value={dimensions.width || ""}
                onChange={(e) => updateDimension("width", e.target.value)}
                placeholder="e.g., 25"
                className={`mt-1 ${errors.width ? "border-destructive" : ""}`}
              />
              {errors.width && (
                <p className="text-xs text-destructive mt-1">{errors.width}</p>
              )}
            </div>

            <div>
              <Label htmlFor="height" className="text-sm font-medium">
                Height (feet) *
              </Label>
              <Input
                id="height"
                type="number"
                value={dimensions.height || ""}
                onChange={(e) => updateDimension("height", e.target.value)}
                placeholder="e.g., 3"
                className={`mt-1 ${errors.height ? "border-destructive" : ""}`}
              />
              {errors.height && (
                <p className="text-xs text-destructive mt-1">{errors.height}</p>
              )}
            </div>

            <div>
              <Label htmlFor="location" className="text-sm font-medium">
                Location *
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (errors.location) {
                    setErrors(prev => ({ ...prev, location: "" }));
                  }
                }}
                placeholder="City, State"
                className={`mt-1 ${errors.location ? "border-destructive" : ""}`}
              />
              {errors.location && (
                <p className="text-xs text-destructive mt-1">{errors.location}</p>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full gradient-water text-white shadow-water hover:shadow-elevated transition-all duration-300 mt-6"
            >
              Start Simulation <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </Html>

      {/* Interactive Dimension Indicators */}
      <Html
        position={[2, 6, 0]}
        transform
        occlude="blending"
        style={{
          width: "200px",
          pointerEvents: "none"
        }}
      >
        <div className="bg-white/80 backdrop-blur-lg rounded-lg p-3 text-center border border-primary/20">
          <div className="text-sm font-semibold text-primary-deep">
            Current Area
          </div>
          <div className="text-lg font-bold text-primary">
            {(dimensions.length * dimensions.width).toLocaleString()} sq ft
          </div>
          <div className="text-xs text-muted-foreground">
            Roof Catchment Area
          </div>
        </div>
      </Html>

      {/* Calculation Preview */}
      <Html
        position={[6, 3, -3]}
        transform
        occlude="blending"
        style={{
          width: "250px",
          pointerEvents: "none"
        }}
      >
        <div className="bg-secondary/20 backdrop-blur-lg rounded-lg p-3 text-center border border-secondary/30">
          <div className="text-xs font-semibold text-secondary-foreground mb-2">
            Estimated Annual Harvest
          </div>
          <div className="text-xl font-bold text-secondary">
            {Math.round((dimensions.length * dimensions.width * 850 * 0.85) / 1000).toLocaleString()}L
          </div>
          <div className="text-xs text-muted-foreground">
            Based on 850mm rainfall
          </div>
        </div>
      </Html>

      {/* Instructions */}
      <Html
        position={[0, 1, 6]}
        transform
        occlude="blending"
        style={{
          width: "300px",
          pointerEvents: "none"
        }}
      >
        <div className="bg-earth/20 backdrop-blur-lg rounded-lg p-4 text-center border border-earth/30">
          <div className="text-sm text-earth-light font-medium">
            💡 Tip: Use mouse to rotate and zoom the view
          </div>
          <div className="text-xs text-white/70 mt-2">
            The highlighted roof shows your catchment area
          </div>
        </div>
      </Html>
    </>
  );
}