import React from "react";
import { Link } from "react-router-dom";
import { Squirrel } from "lucide-react";
import { AuthHero } from "../components/AuthHero";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F9F6F0] font-body">
      {/* Left Half: Art & Return */}
      <AuthHero />

      {/* Right Half: Login Form */}
      <div className="w-full lg:w-1/2 h-full flex flex-col px-8 py-12 md:px-16 md:py-16 overflow-y-auto">
        
        {/* Top Right Navigation */}
        <div className="flex justify-end items-center text-sm mb-16">
          <span className="text-[#112613]/60 mr-2">¿Aún no tienes acceso?</span>
          <Link to="/signup" className="font-bold text-[#112613] underline decoration-2 underline-offset-4 hover:text-moss-600 transition-colors">
            Construye tu espacio
          </Link>
        </div>

        {/* Form Container */}
        <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
          <div className="mb-10 lg:hidden flex items-center gap-2 text-[#112613] font-sans font-bold text-2xl tracking-tight">
            <Squirrel className="w-8 h-8 text-moss-600" />
            <span>LaPaginaDeLardi</span>
          </div>

          <LoginForm />

        </div>
      </div>
    </div>
  );
}
