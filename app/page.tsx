// "use client";

import Link from "next/link";
import {
  IconTruck,
  IconDashboard,
  IconShieldCheck,
  IconGasStation,
  // IconSpeed,
  IconChecklist,
  IconMapPin,
  IconBell,
  IconChartBar,
  IconUsers,
  IconBuilding,
  IconArrowRight,
  IconStar,
  IconCertificate,
} from "@tabler/icons-react";

export default function Home() {
  const features = [
    {
      icon: <IconTruck className="w-8 h-8" />,
      title: "Real-time Fleet Tracking",
      description:
        "Live GPS tracking of all vehicles with detailed movement history and route playback.",
    },
    {
      icon: <IconDashboard className="w-8 h-8" />,
      title: "Intelligent Dashboards",
      description:
        "Customizable dashboards with key metrics for each role - Admin, Dispatcher, Driver & Mechanic.",
    },
    {
      icon: <IconGasStation className="w-8 h-8" />,
      title: "Fuel & Cost Management",
      description:
        "Monitor fuel consumption, optimize routes, and reduce operational costs by up to 30%.",
    },
    {
      icon: <IconChecklist className="w-8 h-8" />,
      title: "Predictive Maintenance",
      description:
        "AI-powered insights to predict vehicle failures before they happen, reducing downtime.",
    },
    {
      icon: <IconGasStation className="w-8 h-8" />,
      title: "Performance Analytics",
      description:
        "Comprehensive reports on driver behavior, vehicle efficiency, and operational performance.",
    },
    {
      icon: <IconShieldCheck className="w-8 h-8" />,
      title: "Safety & Compliance",
      description:
        "Ensure regulatory compliance with automated reporting and safety monitoring.",
    },
  ];

  const stats = [
    { value: "500+", label: "Companies Trust Us" },
    { value: "10K+", label: "Vehicles Managed" },
    { value: "99.9%", label: "System Uptime" },
    { value: "30%", label: "Cost Reduction Avg." },
  ];

  const testimonials = [
    {
      name: "Muhammad Taha Rasheed",
      role: "Project Lead & Backend Developer",
      quote:
        "FleetWise transforms how logistics companies manage their operations with AI-powered insights.",
      avatar: "TR",
    },
    {
      name: "Muhammad Kaif Tahir",
      role: "Frontend & UI/UX Developer",
      quote:
        "We've created an intuitive interface that makes fleet management accessible to everyone.",
      avatar: "KT",
    },
    {
      name: "Hassan Tayyab",
      role: "AI & Deployment Specialist",
      quote:
        "Our predictive maintenance system reduces vehicle breakdowns by up to 70%.",
      avatar: "HT",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="min-h-screen bg-linear-to-b from-blue-50 via-white to-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Navigation */}
          <nav className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-br from-blue-600 to-cyan-500 p-2 rounded-xl">
                <IconTruck size={28} className="text-white" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-black text-gray-900">
                  FLEETWISE
                </div>
                <div className="text-xs font-semibold text-cyan-600 tracking-widest">
                  FLEET MANAGEMENT
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                About
              </a>
              <a
                href="#team"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Team
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-5 py-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2 bg-linear-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
              >
                Get Started Free
              </Link>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="max-w-7xl mx-auto pt-16 pb-24 text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              <IconCertificate size={16} />
              BS Computer Science Final Year Project
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
              AI-Powered{" "}
              <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Predictive Fleet Management
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              An intelligent fleet management platform that combines real-time
              tracking with predictive analytics to optimize operations, reduce
              costs, and prevent vehicle breakdowns.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <Link
                href="/signup"
                className="px-8 py-4 bg-linear-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Start Free Trial
                <IconArrowRight size={20} />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 border-2 border-blue-200 text-blue-600 font-semibold text-lg rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                Existing User? Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Smart Fleet Management
            </h2>
            <p className="text-lg text-gray-600">
              Our comprehensive platform combines cutting-edge technology with
              intuitive design
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-linear-to-br from-white to-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-3 bg-linear-to-r from-blue-500 to-cyan-400 rounded-xl w-fit mb-4">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                About FleetWise Project
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                FleetWise is a Final Year Project developed by BS Computer
                Science students at The Superior University, Lahore. Our mission
                is to revolutionize fleet management through AI-powered
                predictive analytics.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <IconStar className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium text-gray-900">
                    AI-Powered Predictive Maintenance
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <IconBell className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-gray-900">
                    Real-time Notifications & Alerts
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <IconUsers className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-900">
                    Role-based Access Control
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <IconBuilding className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-gray-900">
                    Enterprise-grade Security
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-linear-to-br from-blue-600 to-cyan-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Project Information</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm opacity-80">FYP ID</div>
                  <div className="font-semibold">FYP-BSCS-F25-109</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">University</div>
                  <div className="font-semibold">
                    The Superior University, Lahore
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Degree</div>
                  <div className="font-semibold">BS in Computer Science</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Supervisor</div>
                  <div className="font-semibold">Dr. ABC</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Co-Supervisor</div>
                  <div className="font-semibold">Mr. XYZ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div id="team" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Development Team
            </h2>
            <p className="text-lg text-gray-600">
              The talented students behind FleetWise from The Superior
              University
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {testimonials.map((member, index) => (
              <div
                key={index}
                className="bg-linear-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-linear-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {member.avatar}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <div className="text-blue-600 font-medium mb-4">
                  {member.role}
                </div>
                <p className="text-gray-600 italic">
                  &quot;{member.quote}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-20 bg-linear-to-r from-blue-600 to-cyan-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Fleet Management?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Join 500+ companies that trust FleetWise for their fleet operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl hover:bg-gray-100 transition-colors shadow-xl"
            >
              Start Your Free Trial
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white/10 transition-colors"
            >
              Sign In to Dashboard
            </Link>
          </div>
          <p className="text-blue-100 mt-8">
            No credit card required • 14-day free trial • Full feature access
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-linear-to-br from-blue-500 to-cyan-400 p-2 rounded-lg">
                  <IconTruck size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">FLEETWISE</div>
                  <div className="text-sm text-cyan-400">
                    AI-Powered Fleet Management
                  </div>
                </div>
              </div>
              <p className="text-gray-400">
                Final Year Project • BS Computer Science • The Superior
                University
              </p>
            </div>
            <div className="flex gap-8">
              <div>
                <div className="font-bold mb-4">Product</div>
                <div className="space-y-2">
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-white block"
                  >
                    Features
                  </a>
                  <a
                    href="#about"
                    className="text-gray-400 hover:text-white block"
                  >
                    About
                  </a>
                  <a
                    href="#team"
                    className="text-gray-400 hover:text-white block"
                  >
                    Team
                  </a>
                </div>
              </div>
              <div>
                <div className="font-bold mb-4">Account</div>
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="text-gray-400 hover:text-white block"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="text-gray-400 hover:text-white block"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              © {new Date().getFullYear()} FleetWise • FYP-BSCS-F25-109 • The
              Superior University, Lahore
            </p>
            <p className="mt-2 text-sm">
              All rights reserved • This is an academic project
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
