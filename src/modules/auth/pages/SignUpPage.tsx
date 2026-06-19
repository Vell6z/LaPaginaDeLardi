import React from "react";
import { Link } from "react-router-dom";
import { SignUpHero } from "../components/SignUpHero";
import { SignUpForm } from "../components/SignUpForm";

export function SignUpPage() {
  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F9F6F0] font-body">
      {/* Left Half: Art & Motivation */}
      <SignUpHero />

      {/* Right Half: Sign Up Form */}
      <div className="w-full lg:w-1/2 h-full flex flex-col px-8 py-12 md:px-16 md:py-16 overflow-y-auto">
        
        {/* Top Right Navigation */}
        <div className="flex justify-end items-center text-sm mb-16">
          <span className="text-[#112613]/60 mr-2">¿Ya tienes la llave de la madriguera?</span>
          <Link to="/login" className="font-bold text-[#112613] underline decoration-2 underline-offset-4 hover:text-moss-600 transition-colors">
            Inicia Sesión
          </Link>
        </div>

        {/* Form Container */}
        <SignUpForm />

      </div>
    </div>
  );
}
