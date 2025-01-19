const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyAr7rZzlbvBfhKa9fFekY4-LIFW4J2fILQ");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
