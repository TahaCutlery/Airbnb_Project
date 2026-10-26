# Airbnb Project

An Airbnb-style accommodation marketplace built with Node.js, Express, MongoDB, and EJS. The app lets users browse vacation stays, create and manage listings, sign up or log in, and leave rating-based reviews for properties.

## Overview

This project is a full-stack web application inspired by Airbnb. It includes a listing catalog, user authentication, owner-only management actions, image uploads, geolocation-based map rendering, and review functionality.

## Features

- Browse all available listings
- Search listings by city/location
- Create new accommodation listings
- Edit and delete only the listings owned by the logged-in user
- User sign up, login, and logout using Passport.js
- Add and remove reviews with star ratings
- Upload listing images to Cloudinary
- Display property location on an interactive map
- Flash-based success/error notifications
- Session-based authentication with MongoDB session storage

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- EJS + EJS Mate
- Passport.js + passport-local-mongoose
- Joi validation
- Cloudinary + Multer
- MapTiler SDK
- OpenWeather geocoding API

## Project Structure

```text
Airbnb/
├── Init/                  # Seed/demo data scripts
├── controller/            # Route logic handlers
├── models/                # Mongoose schemas
├── public/                # Static frontend assets
├── routes/                # Express routes
├── utils/                 # Error handling and async wrappers
├── views/                 # EJS templates
├── cloudinary.js          # Cloudinary configuration
├── index.js               # App entry point
├── joiSchema.js           # Validation schemas
├── middleware.js          # Auth and authorization middleware
├── package.json           # Project metadata and dependencies
├── .gitignore             # Ignored files
├── README.md              # Project documentation
└── .env                   # Local environment variables (not committed)
```

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root with the required environment variables:

```env
MONGO_URI=your_mongodb_connection_string
SECRET=your_session_secret
MAP_API_KEY=your_maptiler_key
WEATHER_API=your_openweather_key
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

4. Start the server:

```bash
node index.js
```

5. Open the app in your browser:

```text
http://localhost:3000
```

## Environment Notes

- The app expects a running MongoDB instance and a valid connection string in `MONGO_URI`.
- Map rendering depends on `MAP_API_KEY` from MapTiler.
- Listing coordinates are derived from the `WEATHER_API` geocoding endpoint by location name.
- Image uploads are stored through Cloudinary using the credentials in the `.env` file.

## App Flow

- Users can browse listings from the home page or search by location.
- New users can sign up, and existing users can log in.
- Logged-in users can create property listings and upload images.
- Listing owners can edit or remove their own listings.
- Visitors can review listings and leave star ratings.
- The app redirects unauthenticated users to the login page when protected actions are attempted.

## Useful Scripts

This project currently does not include a custom `start` script in `package.json`. Use:

```bash
node index.js
```

The repository also includes seed/demo data utilities in `Init/` for loading sample listings, although those scripts may require matching your project configuration and database setup.

## License

This project is currently using the ISC license as declared in `package.json`.
