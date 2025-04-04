'use client'

import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  RiUploadCloudLine as CloudUpload, 
  RiShareLine as Share, 
  RiDashboardLine as Dashboard 
} from '@remixicon/react';
import Link from 'next/link';

const featureVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: 'spring', 
      stiffness: 100 
    }
  }
};

const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-background-dark dark:text-foreground-dark">
      {/* Hero Section */}
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/20 dark:from-primary-dark/10 dark:to-primary-dark/20"
      >
        <div className="container mx-auto px-6 lg:px-20">
          <motion.div 
            variants={{
              hidden: { opacity: 0, x: -100 },
              visible: { opacity: 1, x: 0 }
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6">
              <motion.h1 
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent dark:from-primary-dark dark:to-secondary-dark"
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 120 }}
              >
                Turn Your Data<br/>Into Visual Stories
              </motion.h1>
              <motion.p 
                className="text-muted-foreground dark:text-muted-foreground-dark text-lg max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Upload CSV files, create charts within dashboards, and share insights with others - all in one place
              </motion.p>
              <motion.div 
                className="flex gap-4 flex-wrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Link href="/signup">
                  <motion.button 
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-shadow dark:bg-primary-dark dark:hover:bg-primary-dark/90"
                  >
                    Get Started
                  </motion.button>
                </Link>
                <Link href="/dashboard/1/view">
                  <motion.button 
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-shadow dark:bg-secondary-dark dark:hover:bg-secondary-dark/90"
                  >
                    View Demo
                  </motion.button>
                </Link>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative mt-12 lg:mt-0"
            >
              <div className="mockup-window border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-xl">
                <Image 
                  src={`/insighthub/dashboard-preview.png`}
                  alt="Dashboard Preview"
                  width={2499}
                  height={1452}
                  className="object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
        <motion.svg 
          className="absolute bottom-0 left-0 w-full h-48 text-primary/20 dark:text-primary-dark/20 pointer-events-none"
          viewBox="0 0 1440 320"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        >
          <path 
            fill="currentColor"
            fillOpacity="0.1"
            d="M0,160L48,176C96,192,192,224,288,208C384,192,480,128,576,128C672,128,768,192,864,202.7C960,213,1056,171,1152,144C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </motion.svg>
      </motion.header>

      {/* Workflow Section */}
      <motion.section 
        className="py-20 bg-background dark:bg-background-dark"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 lg:px-20">
          <motion.div 
            className="text-center mb-16"
            variants={featureVariants}
          >
            <h2 className="text-3xl font-bold mb-4">Your Data Journey in 3 Steps</h2>
            <p className="text-muted-foreground dark:text-muted-foreground-dark max-w-2xl mx-auto">
              Transform raw data into compelling visual narratives in just a few minutes
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
            initial="hidden"
            whileInView="visible"
          >
            {[
              { icon: CloudUpload, title: "Upload Data", desc: "Upload your Dataset files" },
              { icon: Dashboard, title: "Build Dashboards", desc: "Create data visualizations" },
              { icon: Share, title: "Share Stories", desc: "Publish & share your dashboard" }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="p-6 bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark"
                variants={featureVariants}
                whileHover={{ y: -10 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-primary/10 dark:bg-primary-dark/10 rounded-full mb-4">
                    <step.icon className="text-primary dark:text-primary-dark !w-8 !h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground dark:text-muted-foreground-dark">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}