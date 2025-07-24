# Smart Attendance System

This project is a **web-based attendance system** that allows professors and students to process attendance using sound signals.
Built with Next.js, React, and TailwindCSS.

## Features

-   **Professor**: When starting attendance, periodically broadcasts a random authentication code as a sound signal (frequency) for a set period.
-   **Student**: When starting attendance, records the sound signal via microphone, extracts the authentication code, and submits it to the server for verification.
-   **Server**: Stores the latest authentication code from the professor and verifies the code submitted by students.

## Getting Started

1. Install dependencies

    ```bash
    yarn install
    # or
    npm install
    ```

2. Run the development server

    ```bash
    yarn dev
    # or
    npm run dev
    ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

-   On the main screen, select either the **Student** or **Professor** menu.
-   Professors start attendance to broadcast sound signals.
-   Students start attendance to record and decode the signal, then automatically attempt attendance verification.

## Tech Stack

-   Next.js (App Router)
-   React 19
-   TypeScript
-   TailwindCSS

## Notes

-   Sound signals are generated and recorded using the browser's Audio API.
