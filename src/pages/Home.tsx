import React from 'react';
import { motion } from 'framer-motion';
import { Pickaxe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <Pickaxe className="w-24 h-24 text-blue-400 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">EMSX Miner</h1>
        <p className="text-gray-400 mb-8">Mine, upgrade, and earn coins!</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/game')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg"
        >
          Start Mining
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Home;