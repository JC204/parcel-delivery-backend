// components/CarAnimation.tsx
import { motion } from "framer-motion";
import { Truck } from "lucide-react";

const CarAnimation = () => {
  return (
    <motion.div
      className="absolute bottom-6 left-0 w-16 h-16 z-50"
      initial={{ x: -100 }}
      animate={{ x: "100vw" }}
      transition={{ duration: 2, repeat: 1 }}
    >
      <Truck className="w-12 h-12 text-blue-600" />
    </motion.div>
  );
};

export default CarAnimation;
