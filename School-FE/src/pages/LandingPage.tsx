import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Award,
  FileText,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const slides = [
  {
    title: "Empower Your Future",
    subtitle: "Join thousands of students building their careers.",
    bg: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&q=80",
  },
  {
    title: "Expert-Led Courses",
    subtitle: "Learn from industry professionals and top educators.",
    bg: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80",
  },
  {
    title: "Collaborate & Grow",
    subtitle: "Connect with peers and mentors across the globe.",
    bg: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((c) => (c + 1) % slides.length),
      4000
    );
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <div className="min-h-screen w-screen bg-[#0a1628] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-4 bg-[#0d1b35]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold">
              <span className="text-cyan-400">Edu</span>
              <span className="text-white">Portal</span>
            </span>
            <p className="text-xs text-gray-400 -mt-0.5">
              Elite Learning Platform
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="rounded-full border border-white/30 px-6 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/register")}
            className="rounded-full bg-cyan-500 px-6 py-2 text-sm font-semibold text-white hover:bg-cyan-400 transition"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Carousel */}
      <div className="mx-auto mt-6 max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-2xl h-96 shadow-2xl">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === current ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.bg}
                alt={slide.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="absolute bottom-10 left-10">
                <h2 className="text-4xl font-extrabold text-white drop-shadow">
                  {slide.title}
                </h2>
                <p className="mt-2 text-base text-gray-200">{slide.subtitle}</p>
                <div className="mt-4 flex gap-3">
                  <button className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-white hover:bg-cyan-400 transition">
                    24/7 Access
                  </button>
                  <button className="rounded-full border border-white bg-white/10 px-5 py-2 text-sm font-semibold text-white hover:bg-white/20 transition">
                    Explore Courses
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Arrows */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${
                  i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Three Cards */}
      <div className="mx-auto mt-10 max-w-6xl px-6 pb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Awards */}
        <div className="rounded-2xl bg-white p-8 text-gray-800 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-400">
              <Award className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold">Awards & Honours</h3>
          </div>
          <ul className="space-y-3 text-sm text-gray-600">
            {[
              "Best Online Learning Platform 2024",
              "Excellence in Education Award",
              "Top Rated by 50,000+ Students",
              "Innovation in EdTech Recognition",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Certificates */}
        <div className="rounded-2xl bg-white p-8 text-gray-800 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold">Certificates</h3>
          </div>
          <ul className="space-y-3 text-sm text-gray-600">
            {[
              "Industry-Recognized Certifications",
              "Accredited by Global Education Board",
              "Verified Digital Credentials",
              "Shareable on LinkedIn & Resume",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Address */}
        <div className="rounded-2xl bg-white p-8 text-gray-800 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-500">
              <MapPin className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold">Address</h3>
          </div>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-pink-500 mt-0.5 shrink-0" />
              <span>
                123 Education Boulevard
                <br />
                Silicon Valley, CA 94025
                <br />
                United States
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-pink-500 shrink-0" />
              +1 (555) 123-4567
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-pink-500 shrink-0" />
              contact@eduportal.com
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
