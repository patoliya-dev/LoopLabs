import { Badge } from "../ui/badge";
import { MessageSquare, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { FeaturesSection } from "./FeatureSection";
import { Navbar } from "./Navbar";
import { AboutSection } from "./AboutSection";
import { Link } from "react-router";

function Home() {
  return (
    <div>
      <Navbar  />
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-2 text-sm font-medium"
          >
            <Zap className="w-4 h-4 mr-2" />
            {"100% Local Processing"}
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            <span className="text-primary">{"Local AI"}</span>
            {" Talker"}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            "Chat with AI directly on your device. Simple, fast, and works
            offline - no internet required."
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
            to="/chat"
                className="text-muted-foreground hover:text-foreground transition-colors"
            >
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg bg-transparent"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              
              {"Try Chat"}
            </Button>
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            {"Easy to use local AI conversations"}
          </div>
        </div>
      </section>
      <FeaturesSection />
      <AboutSection />
    </div>
  );
}

export default Home;
