import React from 'react';
import { motion } from 'framer-motion';
import logoimg from '../../assets/logoimg.png';

const WelcomeDashboard: React.FC = () => {
  return (
    <div className=" flex items-center justify-center  p-4">
      {/* Animated Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white rounded-3xl w-full px-8 py-20 text-center"
      >
        {/* Logo / Avatar */}
        <motion.img
          src={logoimg}
          alt="User Avatar"
          className="w-30 h-30  mx-auto mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Text content */}
        <motion.h1
          className="text-4xl font-bold text-gray-800 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Welcome to India Phosphate Dashboard
        </motion.h1>

        <motion.p
          className="text-gray-600 text-base mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
           Manage your data, view insights, and navigate your workspace with ease.
        </motion.p>

        {/* Button */}
        <motion.button
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-full transition-all shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </motion.div>
    </div>
  );
};

export default WelcomeDashboard;
