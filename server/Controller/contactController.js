const Contact = require("../Model/contactModel");

const contactController = {
  submitContact: async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({
          success: false,
          message: "All fields (name, email, subject, message) are required.",
        });
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email address.",
        });
      }

      const newContact = await Contact.create({
        name,
        email,
        subject,
        message,
      });

      return res.status(201).json({
        success: true,
        message: "Thank you for contacting us! Your message has been received.",
        data: newContact,
      });
    } catch (error) {
      console.error("Error in contact submission:", error);
      return res.status(500).json({
        success: false,
        message: "An internal server error occurred while processing your message.",
        error: error.message,
      });
    }
  },

  // Fetch all contact requests
  getAllContacts: async (req, res) => {
    try {
      const contacts = await Contact.find().sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: contacts.length,
        data: contacts,
      });
    } catch (error) {
      console.error("Error in fetching contact requests:", error);
      return res.status(500).json({
        success: false,
        message: "An internal server error occurred while fetching contact requests.",
        error: error.message,
      });
    }
  },
};

module.exports = contactController;
