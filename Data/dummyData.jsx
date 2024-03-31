export const dummyPosts = [
  {
    id: 1,
    profilePhoto: require("../assets/user_photo.jpg"), // Replace with actual image path
    name: "John cyka",
    time: "10:00 AM",
    date: "14/3/2024",
    club: "Example Club 1",
    text: "This is a sample post text 1. Looking for a player for a friendly football game.",
    level: "Excellent",
    sport: "Football",
    type: "player", // Updated type field
    postedAt: new Date("2024-03-13T10:00:00"),
    lat: 40.7128, // Latitude of New York City
    lon: -74.0059,
  },
  {
    id: 2,
    profilePhoto: require("../assets/user_photo.jpg"), // Replace with actual image path
    name: "Jane Doe",
    time: "11:00 AM",
    date: "16/3/2024",
    club: "Example Club 2",
    text: "This is a sample post text 2. Our basketball team is looking for a challenging match. Up for it?",
    level: "Good",
    sport: "Basketball",
    type: "team", // Updated type field
    postedAt: new Date("2024-03-13T11:00:00"),
    lat: 34.0522, // Latitude of Los Angeles
    lon: -118.2437,
  },
  {
    id: 3,
    profilePhoto: require("../assets/user_photo.jpg"), // Replace with actual image path
    name: "Alice Smith",
    time: "1:00 PM",
    date: "15/3/2024",
    club: "Example Club 3",
    text: "Anyone up for some casual tennis this afternoon? Intermediate level here.",
    level: "Intermediate",
    sport: "Tennis",
    type: "player", // Updated type field
    postedAt: new Date("2024-03-13T13:00:00"),
    lat: 41.8818, // Latitude of Chicago
    lon: -87.6231,
  },
  {
    id: 4,
    profilePhoto: require("../assets/user_photo.jpg"),
    name: "Bob Johnson",
    time: "2:00 PM",
    date: "18/3/2024",
    club: "Example Club 4",
    text: "This is a sample post text 4.",
    level: "Beginner",
    sport: "Football",
    type: "player", // Updated type field
    postedAt: new Date("2024-03-11T14:00:00"),
    lat: 25.7617, // Latitude of Miami
    lon: -80.1887,
  },
  {
    id: 5,
    profilePhoto: require("../assets/user_photo.jpg"),
    name: "Bobe Johnsons",
    time: "3:00 PM",
    date: "19/3/2024",
    club: "Example Club 5",
    text: "This is a sample post text 5.",
    level: "Beginner",
    sport: "Football",
    type: "team", // Updated type field
    postedAt: new Date("2024-03-12T14:00:00"),
    lat: 37.7749, // Latitude of San Francisco
    lon: -122.4194,
  },
];
export const dummyPlayers = [
  {
    id: 1,
    photo: require("../assets/user_photo.jpg"),
    username: "John Doe",
    sport: "Football",
    position: "Striker",
    city: "New York",
    country: "USA",
    isFriend: true,
    type: "player",
    profilePhotos: [require("../assets/user_photo.jpg")], // Add profilePhotos property
  },

  // Add more player data as needed
];

export const dummyClubs = [
  {
    id: 1,
    photo: require("../assets/user_photo.jpg"),
    name: "FC Barcelona",
    city: "Barcelona",
    country: "Spain",
    sports: ["Football", "Basketball"],
    rating: 4.5,
    type: "club",
    profilePhotos: [require("../assets/user_photo.jpg")], // Add profilePhotos property
  },
  {
    id: 2,
    photo: require("../assets/user_photo.jpg"),
    name: "FC Bayern Munich",
    sport: "Football",
    city: "Munich",
    country: "Germany",
    type: "team",
    profilePhotos: [require("../assets/user_photo.jpg")], // Add profilePhotos property
  },

  // Add more club data as needed
];

export const dummyTeams = [
  {
    id: 1,
    photo: require("../assets/user_photo.jpg"),
    name: "Golden State Warriors",
    sport: "Basketball",
    city: "San Francisco",
    country: "USA",
    type: "team",
    profilePhotos: [require("../assets/user_photo.jpg")], // Add profilePhotos property
  },
  {
    id: 2,
    photo: require("../assets/user_photo.jpg"),
    name: "FC Bayern Munich",
    sport: "Football",
    city: "Munich",
    country: "Germany",
    type: "team",
    profilePhotos: [require("../assets/user_photo.jpg")], // Add profilePhotos property
  },
  {
    id: 3,
    photo: require("../assets/user_photo.jpg"),
    name: "Los Angeles Dodgers",
    sport: "Baseball",
    city: "Los Angeles",
    country: "USA",
    type: "team",
    profilePhotos: [require("../assets/user_photo.jpg")], // Add profilePhotos property
  },
  // Add more team data as needed
];

export const dummyTournaments = [
  {
    id: 1,
    photo: require("../assets/user_photo.jpg"),
    name: "FIFA World Cup",
    sport: "Football",
    city: "Various",
    country: "Various",
    state: "Finished",
    type: "tournament",
    profilePhotos: [require("../assets/user_photo.jpg")], // Add profilePhotos property
  },
  {
    id: 2,
    photo: require("../assets/user_photo.jpg"),
    name: "NBA Finals",
    sport: "Basketball",
    city: "Various",
    country: "USA",
    state: "Ongoing",
    type: "tournament",
    profilePhotos: [require("../assets/user_photo.jpg")], // Add profilePhotos property
  },
  {
    id: 3,
    photo: require("../assets/user_photo.jpg"),
    name: "UEFA Champions League",
    sport: "Football",
    city: "Various",
    country: "Various",
    state: "Upcoming",
    type: "tournament",
    profilePhotos: [require("../assets/user_photo.jpg")], // Add profilePhotos property
  },
  // Add more tournament data as needed
];
// Dummy data for notifications
export const notifications = [
  {
    id: 1,
    type: "friend_request",
    senderName: "John Doe",
    senderPhoto: require("../assets/user_photo.jpg"),
    receivedDate: "2024-02-28", // Example received date
    receivedTime: "10:30", // Example received time
  },

  {
    id: 2,
    type: "team_request",
    teamName: "FC Barcelona",
    teamPhoto: require("../assets/user_photo.jpg"),
  },
  {
    id: 3,
    type: "challenge_match_request",
    challengerName: "Real Madrid",
    challengerPhoto: require("../assets/user_photo.jpg"),
    challengeType: "Football",
  },
  {
    id: 4,
    type: "join_team_request",
    teamName: "Los Angeles Lakers",
    teamPhoto: require("../assets/user_photo.jpg"),
  },
  {
    id: 5,
    type: "invite_to_team",
    inviterName: "Golden State Warriors",
    inviterPhoto: require("../assets/user_photo.jpg"),
    teamName: "Golden State Warriors",
    teamPhoto: require("../assets/user_photo.jpg"),
  },
  {
    id: 6,
    type: "invite_to_tournament",
    inviterName: "FIFA World Cup",
    inviterPhoto: require("../assets/user_photo.jpg"),
    tournamentName: "FIFA World Cup",
    tournamentPhoto: require("../assets/user_photo.jpg"),
  },
  {
    id: 7,
    type: "booking_reminder",
    bookingDetails: {
      location: "Stadium",
      time: "12:00 PM",
      sport: "Football",
    },
  },
  // Add more notification data as needed
];
