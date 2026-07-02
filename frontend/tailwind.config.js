export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: "#f0fdfb",
                    100: "#ccfbf1",
                    200: "#99f6e4",
                    500: "#14b8a6",
                    600: "#0d9488",
                    700: "#0f766e",
                },
            },
            boxShadow: {
                glow: "0 20px 50px rgba(20, 184, 166, 0.2)",
            },
        },
    },
    plugins: [],
};
