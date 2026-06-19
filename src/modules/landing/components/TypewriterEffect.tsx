import React, { useState, useEffect } from "react";

const TYPEWRITER_TEXTS = [
  "Calculando la derivada de la función...",
  "Extrayendo puntos clave de la clase...",
  "Resumiendo el capítulo de microeconomía...",
  "Organizando estructuras de datos..."
];

export function TypewriterEffect() {
  const [text, setText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = TYPEWRITER_TEXTS[textIndex];
    const typeSpeed = isDeleting ? 25 : 60;

    const timeout = setTimeout(() => {
      if (!isDeleting && text === currentText) {
        setTimeout(() => setIsDeleting(true), 2500);
        return;
      }

      if (isDeleting && text === "") {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % TYPEWRITER_TEXTS.length);
        return;
      }

      setText(
        isDeleting
          ? currentText.substring(0, text.length - 1)
          : currentText.substring(0, text.length + 1)
      );
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [text, textIndex, isDeleting]);

  return (
    <div className="text-sm text-acorn-600 font-body flex items-start h-full pt-2 px-1">
      <p className="flex-1 leading-relaxed min-h-[40px]">
        {text}
        <span className="inline-block w-[2px] h-[1.1em] ml-[2px] bg-moss-500 animate-pulse align-text-bottom" />
      </p>
    </div>
  );
}
