const chatbotResponses = [
  {
    question: /what movies are playing today|movies/i,
    answer: "Today's movies are: 'Bộ Tứ Báo Thủ', 'Caption America', and 'Qủy Nhập Tràng'.",
  },
  {
    question: /what is the ticket price|price/i,
    answer: "The ticket price is 50000VND for adults and 30000VND for children.",
  },
  {
    question: /showtimes for (.+)|showtimes/i,
    answer: (match) => `The showtimes for ${match[1]} are 1:00 PM, 4:00 PM, and 7:00 PM.`,
  },
  {
    question: /hello|hi|hey/i,
    answer: "Hello! How can I assist you today?",
  },
  {
    question: /nice to meet you,can i give you some question|nice to meet you/i,
    answer: "Yes, of course! I'm here to help you with any questions you have.",
  },
  {
    question: /bye|goodbye/i,
    answer: "Goodbye! Have a great day!",
  },
];

export const getChatbotResponse = (userMessage) => {
  for (const response of chatbotResponses) {
    const match = userMessage.match(response.question);
    if (match) {
      return typeof response.answer === "function" ? response.answer(match) : response.answer;
    }
  }
  return "I'm sorry, I didn't understand that. Can you rephrase?";
};