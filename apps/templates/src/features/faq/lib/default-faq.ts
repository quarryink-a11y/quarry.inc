export interface DefaultFaqCategory {
  title: string;
  questions: string[];
}

export const DEFAULT_FAQ_CATEGORIES: DefaultFaqCategory[] = [
  {
    title: "Booking & Appointments",
    questions: [
      "Is a deposit required? How to send it?",
      "How long does the session last?",
      "What if I want to cancel or reschedule my appointment?",
      "Can a large tattoo be split into multiple sessions?",
    ],
  },
  {
    title: "Design & Style",
    questions: [
      "Is it possible to create an individual design?",
      "What's tips for choosing placement for a tattoo?",
      "Can I cover an old tattoo with a new one?",
    ],
  },
  {
    title: "Preparation & Aftercare",
    questions: [
      "How to prepare for the session?",
      "How painful is the tattooing process?",
      "What is the proper tattoo aftercare?",
      "How long does the aftercare process usually last?",
      "What should I do if the tattoo peels, itches, or looks unusual?",
    ],
  },
  {
    title: "Touch-ups",
    questions: [
      "Do I need a touch-up? How often?",
      "Is the touch-up included in the price?",
      "Is it normal if the tattoo looks a bit different from the design?",
    ],
  },
  {
    title: "Safety & Practical Info",
    questions: [
      "Are there any AGE restrictions?",
      "How do you ensure everything is sterile and safe?",
      "How can I pay after the session?",
      "Do you offer gift certificates?",
      "Where is the studio located?",
      "Can I come with a friend?",
    ],
  },
];
