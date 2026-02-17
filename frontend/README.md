# Fonoon Al-Madfoon - Admin Dashboard (FrontEnd)

A comprehensive management system for "Fonoon Al-Madfoon" restaurant, built with Next.js 15 and React.

## 📋 Requirements

- [Node.js](https://nodejs.org/) (Version 18 or higher)
- [npm](https://www.npmjs.com/) (Usually comes with Node.js)

## 🚀 Getting Started

Follow these steps to install and run the project on your local machine:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Eid Project/FrontEnd"
```

### 2. Install Dependencies

```bash
npm install
```
Or if you are using yarn:
```bash
yarn install
```

### 3. Setup Environment Variables (.env)

Create a `.env.local` file in the root directory and add the API (Backend) URL:

```env
NEXT_PUBLIC_API_URL=https://localhost:7262/api
```

### 4. Run Development Server

To start the project in development mode:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🏗️ Production Build

To build the application for production:

```bash
npm run build
```

Then to start the production build:

```bash
npm start
```

## 📂 Project Structure

- `src/app`: Project pages and routing (App Router).
- `src/components`: UI components (Admin, Login, Shared UI).
- `src/lib`: Library configurations and utilities (e.g., axios client).
- `src/services`: API communication services.
- `src/store`: State management using Zustand.
- `src/dto`: TypeScript Data Transfer Objects (Interfaces).

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner

---
Developed by Fonoon Al-Madfoon Team.
