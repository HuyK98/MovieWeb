import axios from "axios";

/**
 * Fetch bookings by user ID and payment method.
 * @param {String} userId - The ID of the user.
 * @param {String} paymentMethod - The payment method (e.g., "cash", "momo").
 * @returns {Promise<Array>} - A promise that resolves to the list of bookings.
 */
export const fetchBookingsByPaymentMethod = async (userId, paymentMethod) => {
  try {
    const response = await axios.get("http://localhost:5000/api/bookings", {
      params: {
        userId,
        paymentMethod,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};