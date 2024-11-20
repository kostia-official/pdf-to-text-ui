import React, { FC, ReactNode } from "react";
import { motion } from "framer-motion";

export interface FadeProps {
  children: ReactNode;
}

export const Fade: FC<FadeProps> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);
