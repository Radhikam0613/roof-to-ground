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
      {/* Centered Main Input Panel */}
      <Html
        position={[0, 2, 5]}
        transform
        occlude="blending"
        style={{
          width: "450px",
          pointerEvents: "auto",
          zIndex: 1000
        }}
      >
        <div className="relative">
          <Card className="p-6 bg-background/95 backdrop-blur-lg border shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {propertyType === "individual" ? "House" : "Township"} Configuration
              </h3>
              <p className="text-sm text-muted-foreground">
                Enter the dimensions and location to begin simulation
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <Label htmlFor="length" className="text-sm font-medium text-foreground">
                  Length (ft) *
                </Label>
                <Input
                  id="length"
                  type="number"
                  min="1"
                  value={dimensions.length || ""}
                  onChange={(e) => updateDimension("length", e.target.value)}
                  placeholder="30"
                  className={`mt-1 ${errors.length ? "border-destructive focus:border-destructive" : "border-input"}`}
                  aria-describedby={errors.length ? "length-error" : undefined}
                />
                {errors.length && (
                  <p id="length-error" className="text-xs text-destructive mt-1" role="alert">
                    {errors.length}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="width" className="text-sm font-medium text-foreground">
                  Width (ft) *
                </Label>
                <Input
                  id="width"
                  type="number"
                  min="1"
                  value={dimensions.width || ""}
                  onChange={(e) => updateDimension("width", e.target.value)}
                  placeholder="25"
                  className={`mt-1 ${errors.width ? "border-destructive focus:border-destructive" : "border-input"}`}
                  aria-describedby={errors.width ? "width-error" : undefined}
                />
                {errors.width && (
                  <p id="width-error" className="text-xs text-destructive mt-1" role="alert">
                    {errors.width}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="height" className="text-sm font-medium text-foreground">
                  Height (ft) *
                </Label>
                <Input
                  id="height"
                  type="number"
                  min="1"
                  value={dimensions.height || ""}
                  onChange={(e) => updateDimension("height", e.target.value)}
                  placeholder="3"
                  className={`mt-1 ${errors.height ? "border-destructive focus:border-destructive" : "border-input"}`}
                  aria-describedby={errors.height ? "height-error" : undefined}
                />
                {errors.height && (
                  <p id="height-error" className="text-xs text-destructive mt-1" role="alert">
                    {errors.height}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <Label htmlFor="location" className="text-sm font-medium text-foreground">
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
                placeholder="e.g., Mumbai, Maharashtra"
                className={`mt-1 ${errors.location ? "border-destructive focus:border-destructive" : "border-input"}`}
                aria-describedby={errors.location ? "location-error" : undefined}
              />
              {errors.location && (
                <p id="location-error" className="text-xs text-destructive mt-1" role="alert">
                  {errors.location}
                </p>
              )}
            </div>

            {/* Live Calculations */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Catchment Area</div>
                  <div className="text-xl font-bold text-primary">
                    {(dimensions.length * dimensions.width).toLocaleString()} sq ft
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Est. Annual Harvest</div>
                  <div className="text-xl font-bold text-secondary">
                    {Math.round((dimensions.length * dimensions.width * 850 * 0.85) / 1000).toLocaleString()}L
                  </div>
                </div>
              </div>
              <div className="text-xs text-center text-muted-foreground mt-2">
                * Based on 850mm annual rainfall and 85% efficiency
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all duration-300"
              disabled={!dimensions.length || !dimensions.width || !dimensions.height || !location.trim()}
            >
              Start AR/VR Simulation <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        </div>
      </Html>

      {/* Helper Instructions - Positioned at bottom */}
      <Html
        position={[0, -1, 3]}
        transform
        occlude="blending"
        style={{
          width: "350px",
          pointerEvents: "none"
        }}
      >
        <div className="bg-background/80 backdrop-blur-lg rounded-lg p-3 text-center border shadow-lg">
          <div className="text-sm text-foreground font-medium mb-1">
            💡 Navigate the 3D Scene
          </div>
          <div className="text-xs text-muted-foreground">
            Click & drag to rotate • Scroll to zoom • See your roof highlighted above
          </div>
        </div>
      </Html>
    </>
  );
}