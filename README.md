# 75-Day RBI Grade B Command Center

The preparation for the RBI Grade B examination is a demanding, 75-day marathon that requires strict discipline and precise time management. Standard to-do lists and spreadsheets lacked the structured architecture and visual feedback I needed to maintain consistency.

To solve this, I engineered a custom Command Center—a fully synchronized, full-stack web application designed to track my deep work blocks, daily mock tests, and physical routines with zero friction.

## Core Capabilities

* **Cross-Device Synchronization:** Integrated with Firebase Realtime Database to ensure that progress updated on a mobile device instantly reflects on a desktop environment without manual refreshing.
* **Automated Itinerary:** The application houses a meticulously pre-programmed, 75-day curriculum. This eliminates the need for daily task entry, allowing for immediate execution upon opening the application.
* **Premium UI & State Management:** Designed with Tailwind CSS to provide a modern, glassmorphism dark-mode interface. The dynamic progress bar visually rewards consistency, shifting to a victory state upon 100% daily completion.
* **Responsive Architecture:** Functions as a split-pane software dashboard on desktop displays and seamlessly collapses into a tactile, thumb-friendly layout for mobile browsers.

## Technology Stack

* **Frontend Engine:** React.js (Bootstrapped with Vite for optimized rendering performance)
* **Styling Framework:** Tailwind CSS
* **Backend Infrastructure:** Firebase Realtime Database
* **Deployment:** GitHub Pages

## Local Installation Guide

To clone and deploy this tracker for your own environment, follow these execution steps:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/rbi-tracker.git](https://github.com/your-username/rbi-tracker.git)
   cd rbi-tracker
2. **Install the required dependencies:**

Bash
npm install
3. **Configure the cloud database:**

Create a free project on the Firebase Console.

Initialize a Realtime Database and configure it for local test mode.

Copy your configuration keys and paste them into the firebaseConfig object inside src/App.jsx.

4. **Start the local development server:**

Bash
npm run dev
Developed by Harsh Pillai to navigate and conquer the 75-day grind.
