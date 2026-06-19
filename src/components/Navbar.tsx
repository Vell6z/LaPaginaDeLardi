import { Menu, Squirrel, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-cream-100/80 backdrop-blur-md border-b border-acorn-400/10">
      <nav className="max-w-7xl w-full mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-moss-600 font-sans font-bold text-xl tracking-tight">
          <Squirrel className="w-8 h-8 text-moss-500" />
          <span>LaPaginaDeLardi</span>
        </Link>
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          <Link to="/login" className="text-acorn-600 hover:text-moss-600 px-4 py-2 transition-colors">
            Entrar a la madriguera
          </Link>
          <Link to="/signup" className="bg-moss-500 hover:bg-moss-600 text-white px-6 py-2.5 rounded-full shadow-sm transition-all hover:shadow-md">
            Registrarse
          </Link>
        </div>
        <button 
          className="md:hidden text-acorn-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 w-full bg-cream-100/95 backdrop-blur-md border-b border-acorn-400/10 shadow-lg flex flex-col px-6 py-6 gap-4"
          >
            <Link to="/login" className="text-acorn-600 font-medium text-lg py-2 hover:bg-acorn-400/10 rounded-md transition-colors w-full text-left">
              Entrar a la madriguera
            </Link>
            <Link 
              to="/signup" 
              className="bg-moss-500 hover:bg-moss-600 text-white text-center font-medium text-lg px-6 py-3 rounded-md shadow-sm transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Registrarse
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
