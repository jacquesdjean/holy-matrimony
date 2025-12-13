export const weddingConfig = {
  couple: {
    name: "Jean-Vosko",
  },
  date: {
    full: "Saturday, September 26, 2026",
    short: "September 26, 2026",
    year: 2026,
  },
  location: {
    city: "Apalachicola",
    state: "Florida",
    tagline: "Florida's Forgotten Coast",
  },
  venues: {
    ceremony: {
      name: "Trinity Episcopal Church",
      address: "79 6th Street, Apalachicola, FL 32320",
      phone: "(850) 653-9550",
      website: "https://www.trinityapalachicola.org",
      capacity: 200,
      description: "Historic Episcopal church dating to 1836, one of Florida's oldest",
      mapLink: "https://maps.google.com/?q=Trinity+Episcopal+Church+Apalachicola+FL",
      image: "png_5",
      guestNotes: [
        "Flash photography is not permitted during the ceremony",
        "Videography is permitted from the balcony only",
      ],
    },
    reception: {
      name: "Benedict Hall",
      description: "Historic hall adjacent to Trinity Church",
      note: "Reception immediately following ceremony — no need to travel",
      image: "png_6",
    },
    welcomeAndBrunch: {
      name: "Gibson Inn",
      address: "51 Avenue C, Apalachicola, FL 32320",
      phone: "(850) 653-2191",
      website: "https://www.gibsoninn.com",
      description: "A beautifully restored Victorian inn in the heart of Apalachicola",
      mapLink: "https://maps.google.com/?q=Gibson+Inn+Apalachicola+FL",
      image: "png_7",
      roomBlockNote: "Mention Jean-Vosko Wedding when booking. Room block on 2nd floor.",
    },
  },
  schedule: [
    {
      day: "Friday, September 25",
      events: [
        { name: "Welcome Reception", time: "6:00 PM", location: "Gibson Inn" },
      ],
    },
    {
      day: "Saturday, September 26",
      events: [
        { name: "Ceremony", time: "TBD", location: "Trinity Episcopal Church" },
        { name: "Reception", time: "Immediately following", location: "Benedict Hall" },
      ],
    },
    {
      day: "Sunday, September 27",
      events: [
        { name: "Farewell Brunch", time: "Morning", location: "Gibson Inn" },
      ],
    },
  ],
  travel: {
    airports: [
      { code: "TLH", name: "Tallahassee", distance: "~80 miles", driveTime: "1.5 hours", recommended: true },
      { code: "ECP", name: "Panama City", distance: "~65 miles", driveTime: "1.25 hours", recommended: true },
      { code: "PNS", name: "Pensacola", distance: "~200 miles", driveTime: "3.5 hours", recommended: false },
    ],
    shuttles: {
      available: true,
      schedule: { friday: 2, saturday: 1, sunday: 1 },
      note: "Signup details coming soon",
    },
    drivingFromTexas: {
      intro: "For our Texas guests, we recommend breaking up the drive with a stop in New Orleans.",
      stopover: {
        city: "New Orleans",
        recommendation: "The Old Jail in Tremé",
        description: "A beautifully restored historic property in one of NOLA's oldest neighborhoods",
      },
      driveTimes: [
        { from: "Houston", time: "~10 hours total" },
        { from: "Austin", time: "~12 hours total" },
        { from: "Dallas", time: "~11 hours total" },
      ],
    },
  },
  lodging: {
    primary: {
      name: "Gibson Inn",
      isPrimary: true,
      roomBlock: true,
      roomBlockNote: "Room block on 2nd floor. Mention Jean-Vosko Wedding when booking.",
      phone: "(850) 653-2191",
      website: "https://www.gibsoninn.com",
      walkable: true,
    },
    alternatives: [
      { name: "Coombs Inn", type: "B&B" },
      { name: "Water Street Hotel", type: "Hotel" },
      { name: "Vrbo / Airbnb", type: "Vacation Rentals" },
    ],
    allLodgingLink: "https://www.google.com/maps/search/hotels+apalachicola+fl",
  },
  contact: {
    email: "info@jeanvosko.wedding",
  },
  images: {
    hero: "png_1",
    town: ["png_2", "png_3", "png_4"],
    trinityChurch: "png_5",
    benedictHall: "png_6",
    gibsonInn: "png_7",
    closing: "png_8",
  },
  copy: {
    welcome: "We're so excited to welcome you to Apalachicola, a quiet oyster town on Florida's Forgotten Coast. It's one of our favorite places — unhurried, beautiful, and full of character. We can't wait to share it with you.",
    scheduleNote: "Formal invitations to follow — this is for planning travel",
    photoNote: "Please note that flash photography is not permitted during the ceremony. We'll have a photographer capturing everything — just be present and enjoy.",
    declineNote: "If you already know you won't be able to attend and prefer not to receive a formal invitation, please let us know.",
    closing: "See you in Apalachicola",
  },
};
