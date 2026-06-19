import React, { useState, useEffect } from "react";
import { Squirrel } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const messages = [
    "Organizando tus ideas...",
    "Preparando la madriguera...",
    "Conectando conceptos...",
    "Casi listo para aprender."
];

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 2000);

        const finishTimeout = setTimeout(() => {
            onComplete();
        }, 4000); // the total loading duration

        return () => {
            clearInterval(interval);
            clearTimeout(finishTimeout);
        };
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F9F6F0]"
        >
            <div className="flex flex-col items-center justify-center max-w-sm w-full px-6">
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="mb-8"
                >
                    <Squirrel className="w-16 h-16 text-[#112613]" strokeWidth={1.5} />
                </motion.div>

                <div className="h-[20px] w-full flex items-center justify-center mb-2 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={messageIndex}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.4 }}
                            className="text-sm font-sans font-light text-[#112613]/80 absolute text-center w-full"
                        >
                            {messages[messageIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>

                <div className="w-48 h-[1px] bg-[#112613]/10 relative overflow-hidden mt-2 rounded-full">
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="absolute top-0 left-0 h-full w-1/2 bg-[#112613] rounded-full opacity-60"
                    />
                </div>
            </div>
        </motion.div>
    );
}
