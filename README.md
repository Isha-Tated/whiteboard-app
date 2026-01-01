# Dynamic Whiteboard Application

A web-based interactive whiteboard that allows users to draw, annotate, and visualize ideas in real time using a smooth and intuitive canvas-based interface.

 **Live Demo:**  https://whiteboard-tutorial-eight.vercel.app/
 **Repository:** https://github.com/Isha-Tated/whiteboard-app

---

## Features

- Interactive drawing canvas built using **HTML5 Canvas**
- Multiple drawing tools:
  - Line
  - Rectangle
  - Ellipse
  - Arrow
  - Text
- **Undo / Redo** functionality for seamless editing
- Eraser tool with smooth clearing
- Tool switching without losing canvas state
- Optimized rendering for better performance

---

## 🛠 Tech Stack

- **Frontend:** React
- **Styling:** Tailwind CSS
- **Canvas Rendering:** HTML5 Canvas
- **State Management:** React Context API
- **Deployment:** Vercel

---

## Architecture & Implementation

- Used **React Context API** to manage global state for:
  - Active drawing tool
  - Canvas history
  - Undo/Redo stack
- Implemented drawing logic by handling **mouse and pointer events** directly in JavaScript.
- Optimized canvas rendering by:
  - Batching canvas updates
  - Avoiding unnecessary React re-renders
- Followed a modular component structure for scalability and maintainability.

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
npm start
