import {
  Shield,
  Zap,
  MessageSquare,
  HardDrive,
  Lock,
  Cpu,
  House,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Link } from "react-router";
import { Button } from "../ui/button";

const features = [
  {
    icon: MessageSquare,
    title: "Simple Conversations",
    description:
      "Easy-to-use chat interface for natural conversations with AI. Just type and get instant responses.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Instant responses with local processing. No waiting for server connections or network delays.",
  },
  {
    icon: HardDrive,
    title: "Works Offline",
    description:
      "Chat with AI even without internet. Once installed, everything runs locally on your device.",
  },
  {
    icon: Cpu,
    title: "Local Processing",
    description:
      "All AI processing happens on your device. No data sent to external servers or cloud services.",
  },
  {
    icon: Shield,
    title: "Your Device Only",
    description:
      "Everything stays on your computer. Simple, straightforward, and completely local AI conversations.",
  },
  {
    icon: Lock,
    title: "Easy Setup",
    description:
      "Quick installation and setup. Start chatting with AI in minutes with minimal configuration required.",
  },
];

export function FeaturesSection() {
  return (
    <>
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
              {"Simple Local AI Chat"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              {
                "Everything you need for AI conversations, running locally on your device. Simple, fast, and reliable."
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center my-12">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg bg-transparent"
              >
                <House className="w-5 h-5 mr-2" />

                {"Back to Home"}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
