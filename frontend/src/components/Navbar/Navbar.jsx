import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const LogoIcon = () => (
  <svg
    viewBox="0 0 40 50"
    aria-hidden="true"
    className="w-full h-full"
  >
    <path
      d="M20 2C10.6 2 3 9.6 3 19c0 12.7 17 28.5 17 28.5S37 31.7 37 19C37 9.6 29.4 2 20 2Z"
      fill="currentColor"
    />

    <circle cx="20" cy="18" r="10" fill="#03143d" />
  </svg>
);

function Navbar() {
  const { pathname } = useLocation();

  const getNavLinkClass = (path) => `
    relative
    py-[29px]
    text-[17px]
    font-semibold
    no-underline
    whitespace-nowrap
    transition-colors
    duration-200
    ${
      pathname === path
        ? "text-white active-link"
        : "text-[rgba(235,242,255,0.8)] hover:text-white"
    }
  `;

  return (
    <header
      className="
        relative
        z-50

        w-[calc(100%-80px)]
        min-h-[76px]

        mx-10

        grid
        grid-cols-[auto_1fr_auto]

        items-center
        gap-10

        border-b
        border-[rgba(115,157,224,0.13)]

        max-[1050px]:grid-cols-[auto_auto]
        max-[1050px]:gap-5

        max-[850px]:w-[calc(100%-40px)]
        max-[850px]:ml-5

        max-[650px]:gap-3
      "
    >
      {/* ================================
          LOGO / BRAND
      ================================= */}

      <Link
        to="/"
        className="
          inline-flex
          items-center
          gap-[9px]

          text-white
          no-underline

          text-[25px]
          font-bold
          tracking-[-0.7px]

          max-[650px]:text-[21px]
        "
      >
        <span
          className="
            inline-flex
            w-8
            h-[42px]

            text-[#2584ff]

            max-[650px]:w-[27px]
            max-[650px]:h-[37px]
          "
        >
          <LogoIcon />
        </span>

        <span>TripMesh</span>
      </Link>

      {/* ================================
          NAVIGATION LINKS
      ================================= */}

      <nav
        className="
          justify-self-center

          flex
          items-center
          gap-[52px]

          max-[1050px]:order-3
          max-[1050px]:col-span-2
          max-[1050px]:w-full
          max-[1050px]:justify-center
          max-[1050px]:overflow-x-auto

          max-[650px]:justify-start
          max-[650px]:gap-[90px]
        "
      >
        {/* Home */}
        <Link
          to="/"
          className={getNavLinkClass("/")}
        >
          Home
        </Link>

        {/* Explore */}
        <Link
          to="/explore"
          className={getNavLinkClass("/explore")}
        >
          Explore
        </Link>

        {/* About */}
        <Link
          to="/about"
          className={getNavLinkClass("/about")}
        >
          About Us
        </Link>

        {/* Contact */}
        <Link
          to="/contact"
          className={getNavLinkClass("/contact")}
        >
          Contact Us
        </Link>
      </nav>

      {/* ================================
          AUTH BUTTONS
      ================================= */}

      <div
        className="
          flex
          items-center
          gap-3

          justify-self-end
          ml-auto
        "
      >
        {/* Login */}
        <Link
          to="/login"
          className="
            min-w-[82px]
            min-h-[42px]

            px-[17px]

            inline-flex
            items-center
            justify-center

            rounded-lg

            border
            border-[rgba(133,171,232,0.55)]

            text-white
            text-[13px]
            font-medium

            no-underline

            bg-[rgba(2,19,55,0.65)]

            transition-all
            duration-200

            hover:-translate-y-px
            hover:bg-[rgba(15,57,125,0.7)]

            max-[650px]:hidden
          "
        >
          Log In
        </Link>

        {/* Sign Up */}
        <Link
          to="/signup"
          className="
            min-w-[82px]
            min-h-[42px]

            px-[17px]

            inline-flex
            items-center
            justify-center

            rounded-lg

            border
            border-[#2184ff]

            text-white
            text-[13px]
            font-medium

            no-underline

            bg-gradient-to-br
            from-[#258dff]
            to-[#0865e5]

            shadow-[0_7px_18px_rgba(0,82,205,0.3)]

            transition-all
            duration-200

            hover:-translate-y-px
            hover:from-[#3497ff]
            hover:to-[#1474ef]

            max-[650px]:min-w-[72px]
            max-[650px]:min-h-[38px]
            max-[650px]:px-3
          "
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
}

export default Navbar;