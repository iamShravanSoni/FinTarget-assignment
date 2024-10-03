Overview of the Project:

Live link: https://fin-target-assignment.vercel.app/

Describe what the project does (e.g., "This project displays live Binance cryptocurrency market data using charts for price, volume, and market dominance.").
Key Features:

Mention the key features of your app, such as:
    Live price chart (line chart).
    Volume chart (bar chart).
    Market dominance chart (doughnut chart).
    Cryptocurrency and time interval selection.
    Responsive design for mobile and desktop.
    Technologies Used:

List the key technologies and libraries, for example:
    Next.js for server-side rendering and React components.
    Chart.js with react-chartjs-2 for interactive charts.
    WebSockets for live data streaming from Binance.
    Tailwind CSS for responsive styling.

How to Run the Project:
    Include instructions to run the project locally:
    bash
    Copy code
    # Install dependencies
    npm install

    # Run the development server
    npm run dev

    # Open http://localhost:3000 in your browser
File Structure:

Briefly describe the structure of your project files, for example:
    pages/index.js: Main page with cryptocurrency selection and charts.
    components/ui/*: UI components like Select, Button.
    public/: Static files.

How Data is Fetched:

Explain that data is fetched in real-time using WebSocket connections to Binance, updating the charts dynamically.

Additional Notes (if needed):

Mention any improvements, assumptions, or known issues. For example:
"The app is optimized for mobile and desktop viewing using Tailwind's responsive utilities."
"The data is stored temporarily in localStorage for better performance."