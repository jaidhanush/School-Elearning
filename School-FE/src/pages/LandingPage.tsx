import { Link } from "react-router-dom";
import {
  Award,
  BookOpen,
  GraduationCap,
  Users,
} from "lucide-react";

const LandingPage = () => {
  return (
    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-[#FFFEF8]
      via-[#FFF7DA]
      to-[#FFE8AA]
      text-[#1E1E1E]
      "
    >

      {/* NAVBAR */}

      <nav
        className="
        sticky
        top-0
        z-50
        bg-white/60
        backdrop-blur-3xl
        border-b
        border-yellow-100"
      >

        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">

          <div className="flex items-center gap-4">

            <div
              className="
              w-12
              h-12
              rounded-[18px]
              flex
              items-center
              justify-center
              bg-gradient-to-br
              from-yellow-300
              via-amber-400
              to-orange-400
              shadow-xl"
            >
              <GraduationCap size={28} />
            </div>

            <h1 className="text-2xl font-bold">

              <span
                className="
                bg-gradient-to-r
                from-yellow-500
                to-orange-500
                bg-clip-text
                text-transparent"
              >

                Edu

              </span>

              Portal

            </h1>

          </div>

          <div className="flex gap-4">

            <Link
              to="/login"
              className="
              px-6
              py-2
              rounded-xl
              bg-white
              hover:shadow-lg
              transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="
              px-6
              py-2
              rounded-xl
              text-black
              font-semibold
              bg-gradient-to-r
              from-yellow-400
              to-orange-400
              hover:scale-105
              transition"
            >
              Register
            </Link>

          </div>

        </div>

      </nav>

      {/* HERO */}

      <section className="max-w-7xl mx-auto px-8 py-28">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT */}

          <div>

            <div
              className="
              inline-flex
              mb-8
              px-5
              py-2
              rounded-full
              bg-white
              shadow-md"
            >

              ✨ Premium Learning Experience

            </div>

            <h1
              className="
              text-7xl
              font-black
              leading-tight"
            >

              Education

              <span
                className="
                block
                bg-gradient-to-r
                from-yellow-500
                via-orange-500
                to-amber-600
                bg-clip-text
                text-transparent"
              >

                Elevated

              </span>

            </h1>

            <p
              className="
              mt-8
              text-lg
              text-gray-600
              leading-8"
            >

              Modern digital education platform
              designed to create meaningful learning
              experiences for students and teachers.

            </p>

            <div className="flex gap-5 mt-10">

              <Link
                to="/register"
                className="
                px-8
                py-4
                rounded-[20px]
                font-bold
                text-black
                bg-gradient-to-r
                from-yellow-400
                to-orange-400
                shadow-2xl
                hover:scale-105
                transition"
              >
                Get Started
              </Link>

              <Link
                to="/Explore"
                className="
                px-8
                py-4
                rounded-[20px]
                bg-white
                shadow-lg"
              >
                Explore
              </Link>

            </div>

          </div>

          {/* IMAGE */}

          <div>

            <div
              className="
              rounded-[40px]
              overflow-hidden
              bg-white
              shadow-[0_40px_120px_rgba(255,200,0,.25)]"
            >

              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
                className="
                w-full
                h-[560px]
                object-cover"
                alt=""
              />

            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}

      <section className="max-w-7xl mx-auto px-8 pb-28">

        <h2
          className="
          text-center
          text-4xl
          font-bold
          mb-14"
        >

          Why Choose EduPortal

        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <PremiumCard
            icon={<BookOpen size={30} />}
            title="Modern Learning"
            desc="Interactive and engaging education."
          />

          <PremiumCard
            icon={<Users size={30} />}
            title="Expert Teachers"
            desc="Guided by experienced educators."
          />

          <PremiumCard
            icon={<Award size={30} />}
            title="Growth Tracking"
            desc="Measure progress beautifully."
          />

        </div>

      </section>

    </div>
  );
};

function PremiumCard({
  icon,
  title,
  desc,
}: any) {
  return (
    <div
      className="
      rounded-[36px]
      p-8
      bg-white
      shadow-xl
      hover:-translate-y-2
      transition"
    >

      <div
        className="
        w-16
        h-16
        rounded-[18px]
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-yellow-400
        to-orange-400"
      >
        {icon}
      </div>

      <h3 className="mt-6 text-2xl font-bold">

        {title}

      </h3>

      <p className="mt-4 text-gray-600">

        {desc}

      </p>

    </div>
  );
}

export default LandingPage;