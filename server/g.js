const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyCmJIeonwGIeqQc2T2vL3EhetARTT4cuEA");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
