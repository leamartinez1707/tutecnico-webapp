import { motion } from "motion/react";
import SectionErrorBoundary from "@/components/Error/SectionErrorBoundary";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
        >
            <SectionErrorBoundary sectionName="página">
                {children}
            </SectionErrorBoundary>
        </motion.div>
    );
}
