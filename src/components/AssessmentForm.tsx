import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, MapPin, Home, Users, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AssessmentData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
  };
  locationInfo: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: string;
  };
  propertyInfo: {
    propertyType: string;
    roofArea: string;
    roofType: string;
    dwellers: string;
    openSpace: string;
    existingStructures: string;
  };
  additionalInfo: {
    budget: string;
    purpose: string;
    notes: string;
  };
}

interface AssessmentFormProps {
  onBack: () => void;
  onSubmit: (data: AssessmentData) => void;
}

export default function AssessmentForm({ onBack, onSubmit }: AssessmentFormProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [formData, setFormData] = useState<AssessmentData>({
    personalInfo: { name: "", email: "", phone: "" },
    locationInfo: { address: "", city: "", state: "", pincode: "", coordinates: "" },
    propertyInfo: { propertyType: "", roofArea: "", roofType: "", dwellers: "", openSpace: "", existingStructures: "" },
    additionalInfo: { budget: "", purpose: "", notes: "" }
  });

  const updateFormData = (section: keyof AssessmentData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Assessment Submitted",
      description: "Generating your rainwater harvesting potential report...",
    });
    onSubmit(formData);
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <Users className="h-5 w-5" />;
      case 2: return <MapPin className="h-5 w-5" />;
      case 3: return <Home className="h-5 w-5" />;
      case 4: return <Calculator className="h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sky py-8">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 text-primary hover:text-primary-deep"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <h1 className="text-3xl font-bold text-primary-deep">
            RTRWH Assessment Form
          </h1>
          <p className="mt-2 text-muted-foreground">
            Please provide the following information for accurate assessment
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  step <= currentStep ? 'gradient-water text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {getStepIcon(step)}
                </div>
                {step < 4 && (
                  <div className={`h-1 w-20 ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className={currentStep >= 1 ? 'text-primary font-medium' : 'text-muted-foreground'}>
              Personal Info
            </span>
            <span className={currentStep >= 2 ? 'text-primary font-medium' : 'text-muted-foreground'}>
              Location
            </span>
            <span className={currentStep >= 3 ? 'text-primary font-medium' : 'text-muted-foreground'}>
              Property Details
            </span>
            <span className={currentStep >= 4 ? 'text-primary font-medium' : 'text-muted-foreground'}>
              Additional Info
            </span>
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-8 bg-card/80 backdrop-blur-sm border-0 shadow-elevated">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary-deep">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.personalInfo.name}
                    onChange={(e) => updateFormData('personalInfo', 'name', e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.personalInfo.email}
                    onChange={(e) => updateFormData('personalInfo', 'email', e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.personalInfo.phone}
                    onChange={(e) => updateFormData('personalInfo', 'phone', e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary-deep">Location Information</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label htmlFor="address">Complete Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="House/Plot number, Street, Area, Landmark"
                    value={formData.locationInfo.address}
                    onChange={(e) => updateFormData('locationInfo', 'address', e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="City name"
                      value={formData.locationInfo.city}
                      onChange={(e) => updateFormData('locationInfo', 'city', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select onValueChange={(value) => updateFormData('locationInfo', 'state', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="telangana">Telangana</SelectItem>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="gujarat">Gujarat</SelectItem>
                        <SelectItem value="rajasthan">Rajasthan</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pincode">PIN Code *</Label>
                    <Input
                      id="pincode"
                      placeholder="XXXXXX"
                      value={formData.locationInfo.pincode}
                      onChange={(e) => updateFormData('locationInfo', 'pincode', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Property Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary-deep">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <Select onValueChange={(value) => updateFormData('propertyInfo', 'propertyType', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential-house">Residential House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="commercial">Commercial Building</SelectItem>
                      <SelectItem value="industrial">Industrial Facility</SelectItem>
                      <SelectItem value="institutional">Institutional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="roofArea">Roof Area (sq ft) *</Label>
                  <Input
                    id="roofArea"
                    placeholder="e.g., 2000"
                    value={formData.propertyInfo.roofArea}
                    onChange={(e) => updateFormData('propertyInfo', 'roofArea', e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="roofType">Roof Type *</Label>
                  <Select onValueChange={(value) => updateFormData('propertyInfo', 'roofType', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select roof type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concrete-slab">Concrete Slab</SelectItem>
                      <SelectItem value="tile-roof">Tile Roof</SelectItem>
                      <SelectItem value="metal-sheet">Metal Sheet</SelectItem>
                      <SelectItem value="asbestos">Asbestos Sheet</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dwellers">Number of Dwellers *</Label>
                  <Input
                    id="dwellers"
                    placeholder="e.g., 4"
                    value={formData.propertyInfo.dwellers}
                    onChange={(e) => updateFormData('propertyInfo', 'dwellers', e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="openSpace">Available Open Space (sq ft)</Label>
                  <Input
                    id="openSpace"
                    placeholder="e.g., 500 (for recharge structures)"
                    value={formData.propertyInfo.openSpace}
                    onChange={(e) => updateFormData('propertyInfo', 'openSpace', e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Additional Information */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary-deep">Additional Information</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label htmlFor="budget">Estimated Budget (₹)</Label>
                  <Select onValueChange={(value) => updateFormData('additionalInfo', 'budget', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-25000">₹0 - ₹25,000</SelectItem>
                      <SelectItem value="25000-50000">₹25,000 - ₹50,000</SelectItem>
                      <SelectItem value="50000-100000">₹50,000 - ₹1,00,000</SelectItem>
                      <SelectItem value="100000-200000">₹1,00,000 - ₹2,00,000</SelectItem>
                      <SelectItem value="200000+">₹2,00,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="purpose">Primary Purpose</Label>
                  <Select onValueChange={(value) => updateFormData('additionalInfo', 'purpose', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select primary purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="groundwater-recharge">Groundwater Recharge</SelectItem>
                      <SelectItem value="water-conservation">Water Conservation</SelectItem>
                      <SelectItem value="cost-reduction">Cost Reduction</SelectItem>
                      <SelectItem value="environmental">Environmental Benefits</SelectItem>
                      <SelectItem value="compliance">Regulatory Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any specific requirements, existing infrastructure, or concerns..."
                    value={formData.additionalInfo.notes}
                    onChange={(e) => updateFormData('additionalInfo', 'notes', e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="border-primary text-primary hover:bg-primary/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <Button
              onClick={nextStep}
              className="gradient-water text-white shadow-water hover:shadow-elevated transition-all duration-300"
            >
              {currentStep === totalSteps ? 'Generate Report' : 'Next'}
              {currentStep !== totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}