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
    age: 25,
    gamesPlayed: 50,
    team: "FC Barcelona",
    trophies: ["Champions League Winner 2020", "World Cup Winner 2018"],
    profilePhotos: [
      require("../assets/player1.jpg"),
      require("../assets/player5.jpg"),
      require("../assets/player6.jpg"),
      require("../assets/player6.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
    ],
    position: "Forward",
    city: "Barcelona",
    country: "Spain",
    sport: "Football", // Adding the sport property
    isFriend: true,
    type: "player",
    followers: 500,
    following: 460000,
  },
  {
    id: 2,
    photo: require("../assets/user_photo.jpg"),
    username: "Jane Smith",
    age: 28,
    gamesPlayed: 70,
    team: "Real Madrid",
    trophies: ["La Liga Winner 2019", "UEFA Super Cup Winner 2021"],
    profilePhotos: [
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
    ],
    position: "Midfielder",
    city: "Madrid",
    country: "Spain",
    sport: "Football", // Adding the sport property
    isFriend: false,
    type: "player",
    followers: 0,
    following: 0,
  },
  {
    id: 3, // Unique ID for this player
    photo: require("../assets/user_photo.jpg"),
    username: "Nelal Doe",
    age: 30,
    gamesPlayed: 5,
    team: "FC Barcelona",
    trophies: ["Champions League Winner 2020", "World Cup Winner 2018"],
    profilePhotos: [
      require("../assets/player4.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
    ],
    position: "Forward",
    city: "Barcelona",
    country: "Spain",
    sport: "Football", // Adding the sport property
    isFriend: true,
    type: "player",
    followers: 500,
    following: 460000,
  },
];

// Dummy data for clubs
export const dummyClubs = [
  {
    id: 1,
    photo: require("../assets/user_photo.jpg"),
    name: "FC Barcelona",
    city: "Barcelona",
    country: "Spain",
    sports: ["Football", "Basketball"],
    rating: 4.5,
    profilePhotos: [require("../assets/user_photo.jpg")], // Add profilePhotos property
    type: "club",
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
    profilePhotos: [require("../assets/user_photo.jpg")],
    type: "team",
    username: "GSW Team",
    description: "Welcome to the Golden State Warriors team profile!",
    up_for_game: true,
    lineup: [
      {
        id: 1,
        name: "Player 1",
        photo: require("../assets/player1.jpg"),
        position: "ST",
        x: 165,
        y: 25,
      },
      {
        id: 2,
        name: "Player 2",
        photo: require("../assets/player5.jpg"),
        position: "LW",
        x: 100,
        y: 150,
      },
      {
        id: 3,
        name: "Player 3",
        photo: require("../assets/player6.jpg"),
        position: "RW",
        x: 250,
        y: 150,
      },
      {
        id: 4,
        name: "Player 4",
        photo: require("../assets/player4.jpg"),
        position: "CM",
        x: 165,
        y: 200,
      },
      {
        id: 5,
        name: "Player 5",
        photo: require("../assets/player6.jpg"),
        position: "CB",
        x: 165,
        y: 400,
      },
      {
        id: 6,
        name: "Player 6",
        photo: require("../assets/player6.jpg"),
        position: "Gk",
        x: 165,
        y: 550,
      },
    ],
    followers: 1000,
    following: 500,
    trophies: ["Champions 2020", "MVP Team"],
    teamPhotos: [
      require("../assets/user_photo.jpg"),
      require("../assets/player6.jpg"),
      require("../assets/player6.jpg"),
      require("../assets/player7.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
    ], // Add team photos here
  },
  {
    id: 2,
    photo: require("../assets/user_photo.jpg"),
    name: "Los Angeles Lakers",
    sport: "Basketball",
    city: "Los Angeles",
    country: "USA",
    profilePhotos: [require("../assets/user_photo.jpg")],
    type: "team",
    username: "Lakers Team",
    description: "Welcome to the Los Angeles Lakers team profile!",
    up_for_game: true,
    lineup: [
      { id: 1, name: "Player 1", photo: require("../assets/player4.jpg") },
      { id: 2, name: "Player 2", photo: require("../assets/player5.jpg") },
      { id: 3, name: "Player 3", photo: require("../assets/player6.jpg") },
    ],
    followers: 1500,
    following: 700,
    trophies: ["Western Conference Champions", "Best Defensive Team"],
    teamPhotos: [
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
    ], // Add team photos here
  },
  {
    id: 3,
    photo: require("../assets/user_photo.jpg"),
    name: "Chicago Bulls",
    sport: "Basketball",
    city: "Chicago",
    country: "USA",
    profilePhotos: [require("../assets/user_photo.jpg")],
    type: "team",
    username: "Bulls Team",
    description: "Welcome to the Chicago Bulls team profile!",
    up_for_game: true,
    lineup: [
      { id: 1, name: "Player 1", photo: require("../assets/user_photo.jpg") },
      { id: 2, name: "Player 2", photo: require("../assets/user_photo.jpg") },
      { id: 3, name: "Player 3", photo: require("../assets/user_photo.jpg") },
    ],
    followers: 800,
    following: 400,
    trophies: ["NBA Champions", "Eastern Conference Winners"],
    teamPhotos: [
      require("../assets/user_photo.jpg"),
      require("../assets/user_photo.jpg"),
    ], // Add team photos here
  },
  // Add more teams here
];

// Dummy data for tournaments
export const dummyTournaments = [
  {
    id: 1,
    photo: require("../assets/user_photo.jpg"),
    name: "FIFA World Cup",
    sport: "Football",
    city: "Various",
    country: "Various",
    state: "Finished",
    profilePhotos: [require("../assets/user_photo.jpg")], // Add profilePhotos property
    type: "tournament",
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
