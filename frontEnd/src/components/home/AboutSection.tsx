import { MessageSquare, Cpu, Zap, Shield, House } from "lucide-react"
import { Link } from "react-router"
import { Button } from "../ui/button"

export function AboutSection() {
  return (
    <>
    <section id="about" className="py-20 bg-gray-50 dark:bg-black-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-black mb-4">About Local AI Talker</h2>
            <p className="text-xl text-gray-600 dark:text-black-300 max-w-2xl mx-auto">
              A simple, powerful AI conversation tool that runs entirely on your device. No internet required, no data
              sent to servers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-black mb-4">Why Local AI?</h3>
              <p className="text-gray-600 dark:text-black-300 mb-6">
                Local AI Talker brings the power of artificial intelligence directly to your device. Chat with AI models
                without worrying about internet connectivity, data privacy, or usage limits. It's AI conversation made
                simple and accessible.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-black">Complete Privacy</h4>
                    <p className="text-sm text-gray-600 dark:text-black-300">
                      Your conversations never leave your device
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Lightning Fast</h4>
                    <p className="text-sm text-gray-600 dark:text-black-300">No network delays, instant responses</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Cpu className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-black">Optimized Performance</h4>
                    <p className="text-sm text-gray-600 dark:text-black-300">
                      Efficient local processing for smooth conversations
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-black-800 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-8 h-8 text-blue-600" />
                <h4 className="text-xl font-semibold text-gray-900 dark:text-black">How It Works</h4>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-black-900 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h5 className="font-medium text-black-900 dark:text-black">Download & Install</h5>
                    <p className="text-sm text-gray-600 dark:text-black-300">
                      Get the app and install it on your device
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-black-900 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h5 className="font-medium text-black-900 dark:text-black">Load AI Model</h5>
                    <p className="text-sm text-gray-600 dark:text-black-300">
                      Choose and load your preferred AI model locally
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-black-900 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-black">Start Chatting</h5>
                    <p className="text-sm text-gray-600 dark:text-black-300">
                      Begin conversations with your local AI assistant
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Perfect For</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Developers</h4>
                <p className="text-sm text-gray-600 dark:text-black-300">Code assistance and debugging help</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Privacy-Conscious Users</h4>
                <p className="text-sm text-gray-600 dark:text-black-300">Keep conversations completely private</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Cpu className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Offline Workers</h4>
                <p className="text-sm text-gray-600 dark:text-black-300">AI assistance without internet</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Power Users</h4>
                <p className="text-sm text-gray-600 dark:text-black-300">Fast, unlimited AI conversations</p>
              </div>
            </div>
          </div>
        </div>
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
    </section>
    </>
  )
}
