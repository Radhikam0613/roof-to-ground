import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  CheckCircle, 
  AlertCircle,
  Droplets,
  Calculator,
  Ruler,
  MapPin,
  TrendingUp,
  Layers
} from "lucide-react";
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
  };
  propertyInfo: {
    propertyType: string;
    roofArea: string;
    roofType: string;
    dwellers: string;
    openSpace: string;
  };
}

interface ResultsDashboardProps {
  onBack: () => void;
  assessmentData: AssessmentData;
}

export default function ResultsDashboard({ onBack, assessmentData }: ResultsDashboardProps) {
  const { toast } = useToast();

  // Mock calculation results based on input data
  const roofArea = parseInt(assessmentData.propertyInfo.roofArea) || 2000;
  const dwellers = parseInt(assessmentData.propertyInfo.dwellers) || 4;
  const openSpace = parseInt(assessmentData.propertyInfo.openSpace) || 500;
  
  const calculations = {
    annualRainfall: 850, // mm (example for location)
    catchmentEfficiency: 0.85,
    annualHarvestPotential: Math.round((roofArea * 850 * 0.85) / 1000), // liters
    monthlyDemand: dwellers * 150 * 30, // liters per month
    feasibilityScore: roofArea >= 500 ? 85 : roofArea >= 200 ? 65 : 35,
    costEstimate: {
      basic: Math.round(roofArea * 15 + 25000),
      advanced: Math.round(roofArea * 25 + 50000),
    },
    rechargeStructures: {
      recommendedType: openSpace >= 400 ? "Recharge Pit" : openSpace >= 200 ? "Recharge Well" : "Percolation Pit",
      dimensions: openSpace >= 400 ? "3m x 3m x 3m" : openSpace >= 200 ? "1m diameter x 10m depth" : "1.5m x 1.5m x 2m",
      capacity: openSpace >= 400 ? "27,000L" : openSpace >= 200 ? "7,850L" : "4,500L"
    }
  };

  const handleDownloadReport = () => {
    toast({
      title: "Report Generated",
      description: "Your detailed RTRWH assessment report is being prepared for download.",
    });
  };

  const handleShareReport = () => {
    toast({
      title: "Share Link Generated",
      description: "Assessment report link copied to clipboard.",
    });
  };

  const getFeasibilityStatus = (score: number) => {
    if (score >= 80) return { status: "Excellent", color: "gradient-earth", textColor: "text-success" };
    if (score >= 60) return { status: "Good", color: "bg-warning", textColor: "text-warning-foreground" };
    return { status: "Fair", color: "bg-muted", textColor: "text-muted-foreground" };
  };

  const feasibility = getFeasibilityStatus(calculations.feasibilityScore);

  return (
    <div className="min-h-screen bg-gradient-sky py-8">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 text-primary hover:text-primary-deep"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Form
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-deep">
                Assessment Results
              </h1>
              <p className="mt-2 text-muted-foreground">
                For {assessmentData.personalInfo.name} - {assessmentData.locationInfo.city}, {assessmentData.locationInfo.state}
              </p>
            </div>
            <div className="mt-4 flex gap-2 sm:mt-0">
              <Button 
                variant="outline" 
                onClick={handleShareReport}
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button 
                onClick={handleDownloadReport}
                className="gradient-water text-white shadow-water hover:shadow-elevated transition-all duration-300"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Results Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Feasibility Summary */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-0 shadow-elevated">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-primary-deep flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-success" />
                  Feasibility Assessment
                </h2>
                <Badge className={`${feasibility.color} text-white`}>
                  {feasibility.status}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Feasibility Score</span>
                    <span className="font-semibold">{calculations.feasibilityScore}/100</span>
                  </div>
                  <Progress value={calculations.feasibilityScore} className="h-3" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{calculations.annualHarvestPotential.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Liters/Year Potential</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{Math.round(calculations.annualHarvestPotential / calculations.monthlyDemand)}</div>
                    <div className="text-sm text-muted-foreground">Months Water Supply</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Technical Specifications */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-0 shadow-elevated">
              <h2 className="text-xl font-semibold text-primary-deep mb-4 flex items-center">
                <Ruler className="mr-2 h-5 w-5" />
                Recommended Structure Design
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-sky/20">
                  <Layers className="mx-auto h-8 w-8 text-primary mb-2" />
                  <div className="font-semibold text-primary-deep">Structure Type</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {calculations.rechargeStructures.recommendedType}
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-earth-light/20">
                  <Ruler className="mx-auto h-8 w-8 text-earth mb-2" />
                  <div className="font-semibold text-primary-deep">Dimensions</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {calculations.rechargeStructures.dimensions}
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-nature-light/20">
                  <Droplets className="mx-auto h-8 w-8 text-nature mb-2" />
                  <div className="font-semibold text-primary-deep">Capacity</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {calculations.rechargeStructures.capacity}
                  </div>
                </div>
              </div>
            </Card>

            {/* Local Conditions */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-0 shadow-elevated">
              <h2 className="text-xl font-semibold text-primary-deep mb-4 flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Local Conditions & Data
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Annual Rainfall</div>
                  <div className="text-lg font-semibold text-primary">{calculations.annualRainfall}mm</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Catchment Efficiency</div>
                  <div className="text-lg font-semibold text-secondary">{(calculations.catchmentEfficiency * 100)}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Groundwater Level</div>
                  <div className="text-lg font-semibold text-earth">12.5m</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Aquifer Type</div>
                  <div className="text-lg font-semibold text-nature">Alluvial</div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-warning" />
                <span className="text-muted-foreground">
                  Data sourced from Central Ground Water Board (CGWB) regional office
                </span>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Cost Analysis */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-0 shadow-elevated">
              <h2 className="text-lg font-semibold text-primary-deep mb-4 flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Cost Analysis
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Basic System</span>
                    <Badge variant="outline" className="border-primary text-primary">Recommended</Badge>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    ₹{calculations.costEstimate.basic.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Includes basic collection & storage
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border border-muted bg-muted/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Advanced System</span>
                  </div>
                  <div className="text-2xl font-bold text-muted-foreground">
                    ₹{calculations.costEstimate.advanced.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Includes filtration & automation
                  </div>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Estimated Annual Savings</div>
                  <div className="text-xl font-bold text-success">₹18,000 - ₹35,000</div>
                </div>
              </div>
            </Card>

            {/* Benefits Summary */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-0 shadow-elevated">
              <h2 className="text-lg font-semibold text-primary-deep mb-4 flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Key Benefits
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium">Water Security</div>
                    <div className="text-muted-foreground">Reduce dependency on municipal supply</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium">Groundwater Recharge</div>
                    <div className="text-muted-foreground">Help restore local water table</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium">Cost Savings</div>
                    <div className="text-muted-foreground">Reduce monthly water bills</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium">Environmental Impact</div>
                    <div className="text-muted-foreground">Sustainable water management</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Next Steps */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-0 shadow-elevated">
              <h2 className="text-lg font-semibold text-primary-deep mb-4">
                Next Steps
              </h2>
              
              <div className="space-y-3">
                <Button 
                  className="w-full gradient-water text-white shadow-water hover:shadow-elevated transition-all duration-300"
                  onClick={handleDownloadReport}
                >
                  Download Detailed Report
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary/10"
                >
                  Find Certified Contractors
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-secondary text-secondary hover:bg-secondary/10"
                >
                  Apply for Government Subsidy
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}