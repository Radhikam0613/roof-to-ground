import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Droplets, Calculator, MapPin, Users } from "lucide-react";
import heroImage from "@/assets/hero-rtrwh.jpg";
import waterIcon from "@/assets/water-conservation-icon.jpg";
import rechargeIcon from "@/assets/artificial-recharge-icon.jpg";
import costIcon from "@/assets/cost-estimation-icon.jpg";

interface RTRWHLandingProps {
  onStartAssessment: () => void;
  onStartVR: () => void;
}

export default function RTRWHLanding({ onStartAssessment, onStartVR }: RTRWHLandingProps) {
  return (
    <div className="min-h-screen bg-gradient-sky">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold tracking-tight text-primary-deep sm:text-6xl">
                Rooftop Rainwater 
                <span className="text-gradient block">Harvesting Assessment</span>
              </h1>
              <p className="mt-6 text-xl leading-8 text-muted-foreground">
                Assess your property's potential for rainwater harvesting and artificial recharge. 
                Get personalized recommendations, cost estimates, and technical specifications.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="gradient-water text-white shadow-water hover:shadow-elevated transition-all duration-300"
                  onClick={onStartAssessment}
                >
                  Start Assessment <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  onClick={onStartVR}
                  className="gradient-earth text-white shadow-elevated hover:shadow-elevated transition-all duration-300"
                >
                  🥽 VR Simulation <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="relative lg:row-start-1 lg:col-start-2">
              <div className="relative mx-auto max-w-lg rounded-2xl shadow-elevated animate-gentle-float">
                <img 
                  src={heroImage} 
                  alt="Modern rooftop rainwater harvesting system"
                  className="w-full rounded-2xl object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-deep sm:text-4xl">
              Comprehensive Assessment Features
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get detailed insights into your rainwater harvesting potential with our scientific approach
            </p>
          </div>
          
          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature Cards */}
            <Card className="group p-6 text-center hover:shadow-water transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full gradient-water">
                <img src={waterIcon} alt="Water Conservation" className="h-8 w-8 rounded-full" />
              </div>
              <h3 className="text-lg font-semibold text-primary-deep">Feasibility Analysis</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Determine if RTRWH is viable for your location and property type
              </p>
            </Card>

            <Card className="group p-6 text-center hover:shadow-water transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full gradient-earth">
                <img src={rechargeIcon} alt="Artificial Recharge" className="h-8 w-8 rounded-full" />
              </div>
              <h3 className="text-lg font-semibold text-primary-deep">Structure Recommendations</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get specific recommendations for recharge pits, trenches, and shafts
              </p>
            </Card>

            <Card className="group p-6 text-center hover:shadow-water transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full gradient-water">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-primary-deep">Local Data Integration</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Access rainfall patterns, groundwater levels, and aquifer information
              </p>
            </Card>

            <Card className="group p-6 text-center hover:shadow-water transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full gradient-earth">
                <img src={costIcon} alt="Cost Estimation" className="h-8 w-8 rounded-full" />
              </div>
              <h3 className="text-lg font-semibold text-primary-deep">Cost Analysis</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Complete cost estimation and benefit analysis for your project
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 gradient-hero">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">15M+</div>
              <div className="text-sm text-white/80">Liters Potential</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">₹50K+</div>
              <div className="text-sm text-white/80">Savings Possible</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-sm text-white/80">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">CGWB</div>
              <div className="text-sm text-white/80">Approved Methods</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-primary-deep sm:text-4xl">
            Ready to Start Your Assessment?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of property owners who are making a difference in groundwater conservation
          </p>
          <Button 
            size="lg"
            className="mt-8 gradient-water text-white shadow-water hover:shadow-elevated transition-all duration-300"
            onClick={onStartAssessment}
          >
            Begin Assessment <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}