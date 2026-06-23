import { motion } from 'framer-motion';

interface BrandLogoProps {
  onClick: () => void;
}

export default function BrandLogo({ onClick }: BrandLogoProps) {
  return (
    <div className="fixed top-6 inset-x-0 w-full flex justify-center z-50 pointer-events-none">
      <motion.div
        layoutId="brand-logo-container"
        onClick={onClick}
        className="cursor-pointer pointer-events-auto hover:scale-110 active:scale-95 transition-transform"
      >
        <div className="relative flex items-center justify-center w-[140px] h-[140px]">
          {/* Siri Futuristic Animated Mesh Glow */}
          <div className="absolute inset-0 opacity-100 mix-blend-screen pointer-events-none scale-100">
            <div className="absolute top-0 -left-6 w-[110%] h-[110%] bg-cyan-500/90 rounded-[40%_60%_70%_30%] blur-[20px] mix-blend-color-dodge animate-[spin_5s_linear_infinite]" />
            <div className="absolute top-6 -right-6 w-[110%] h-[110%] bg-purple-600/90 rounded-[60%_40%_30%_70%] blur-[25px] mix-blend-color-dodge animate-[spin_7s_linear_infinite_reverse]" />
            <div className="absolute -bottom-8 left-4 w-[120%] h-[110%] bg-pink-500/80 rounded-[50%_50%_20%_80%] blur-[20px] mix-blend-color-dodge animate-[spin_6s_linear_infinite]" />
            <div className="absolute -top-4 right-8 w-[105%] h-[115%] bg-blue-500/90 rounded-[30%_70%_70%_30%] blur-[30px] mix-blend-color-dodge animate-[spin_8s_linear_infinite_reverse]" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
