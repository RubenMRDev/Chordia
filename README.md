<p align="center">
  <img src="https://res.cloudinary.com/doy4x4chv/image/upload/v1743164811/logo_rkxbip.webp" alt="Chordia" width="400">
</p>

<h1 align="center">🎵 Chordia 🎹</h1>

Experience the perfect blend of music theory and technology with Chordia, your ultimate chord progression management platform. Create, explore, and manage your musical ideas with our intuitive interface, designed for musicians of all levels.

Develop your musical skills with our interactive piano interface, where you can visualize and experiment with chord progressions in real-time. Whether you're composing a new piece or learning music theory, Chordia provides the tools you need to make your musical journey seamless and enjoyable.

Sign up now and start building your chord library today!

<h1>🎼 Features</h1>

- **Interactive Piano Interface**: Create and visualize chord progressions with our intuitive keyboard
- **Custom Song Management**: Save songs with key, tempo, and time signature information
- **Personal Library**: Organize and access all your musical creations in one place
- **Real-time Chord Recognition**: Instantly see chord names and progressions as you play
- **Community Sharing**: Share your arrangements and collaborate with other musicians
- **Smart Practice Tools**: Track your progress and get personalized recommendations

<h1>📸 Screenshots</h1>

**Desktop Version 💻**:

<table align="center">
  <tr>
    <th colspan="1" style="text-align:center; font-size:20px;">Landing Page</th>
  </tr>
  <tr>
    <td><img src="https://res.cloudinary.com/doy4x4chv/image/upload/v1743165458/b329ccb3-9cac-4d17-9322-c24a74ff852c.png" alt="Chordia Landing Page" width="850"></td>
  </tr>
</table>

<table align="center">
  <tr>
    <th colspan="3" style="text-align:center; font-size:20px;">App Features</th>
  </tr>
  <tr>
    <td><img src="https://res.cloudinary.com/doy4x4chv/image/upload/v1743165225/7c9ed27d-8d7f-4b91-92d6-d84f1f6dfde4.png" alt="Stage Page" width="280"></td>
    <td><img src="https://res.cloudinary.com/doy4x4chv/image/upload/v1743165262/acf8247c-6351-442c-89b5-5143774e54ee.png" alt="Library Page" width="280"></td>
    <td><img src="https://res.cloudinary.com/doy4x4chv/image/upload/v1743165330/bd8247d9-4f2b-45a5-985b-8e11fd11ce1f.png" alt="Song Creation Page" width="280"></td>
  </tr>
  <tr>
    <td align="center"><strong>Stage</strong></td>
    <td align="center"><strong>Library</strong></td>
    <td align="center"><strong>Song Creation</strong></td>
  </tr>
</table>

<h1>⚙️ Tech Stack & Libraries 📖</h1>

1. **Main Technologies**:
   - **Frontend**: React with TypeScript
   - **Styling**: Tailwind CSS
   - **Backend**: Firebase (Authentication, Firestore, Storage)
   - **Build Tool**: Vite

2. **Libraries**:
   - **react-icons** - For UI icons
   - **react-router-dom** - For navigation and routing
   - **firebase** - For backend services
   - **sweetalert2** - For attractive alerts and confirmations
   - **tailwindcss** - For utility-first CSS

<h1>🔧 Installation</h1>

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/RubenMRDev/Chordia
    cd Chordia
    ```

2. **Install Dependencies**:

    ```bash
    npm install
    # or
    yarn
    ```

3. **Install SweetAlert2 for confirmation dialogs**:

    ```bash
    npm install sweetalert2
    # or
    yarn add sweetalert2
    ```

4. **Set Up Firebase**:
   
   Create a `.env` file in the root directory with your Firebase configuration:

    ```
    VITE_FIREBASE_API_KEY=your-api-key
    VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
    VITE_FIREBASE_PROJECT_ID=your-project-id
    VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    VITE_FIREBASE_APP_ID=your-app-id
    VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
    ```

5. **Run the Development Server**:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

6. **Open [http://localhost:5173](http://localhost:5173)** with your browser to see the result.

<h1>🔍 Project Structure</h1>

```
chordia-landing/
├── public/           # Static assets
├── src/              # Source code
│   ├── components/   # Reusable components
│   ├── context/      # React context providers
│   ├── firebase/     # Firebase configuration and services
│   ├── pages/        # Application pages
│   ├── App.tsx       # Main application component
│   ├── main.tsx      # Application entry point
│   └── index.css     # Global styles
├── .env              # Environment variables
└── README.md         # Project documentation
```

<h1>🚀 Future Enhancements</h1>

- **Collaborative Editing**: Allow multiple users to work on compositions simultaneously
- **Audio Export**: Enable exporting compositions as MIDI or audio files

<h1>🧪 Testing</h1>

Chordia includes comprehensive test suites for both frontend and backend components to ensure reliability and stability.

### Running Tests

To run all tests, use the following command:

```bash
npm test
# or
yarn test
```

### Test Structure

```
chordia-landing/
├── src/              
│   ├── __tests__/     # Frontend component tests
│   │   ├── components/   # Component-specific tests
│   │   ├── pages/        # Page-specific tests
│   │   └── utils/        # Utility function tests
│   │
│   ├── firebase/      
│       └── __tests__/    # Backend/Firebase service tests
```

### Test Coverage

<table align="center">
  <tr>
    <th style="text-align:center; font-size:20px;">Test Results</th>
  </tr>
  <tr>
    <td><img src="https://res.cloudinary.com/doy4x4chv/image/upload/v1748262462/dfbf276d-cb40-4d34-bb79-dfc30257db78.png" alt="Chordia Test Results" width="600"></td>
  </tr>
</table>

<h1>📜 License</h1>

This project is licensed under the MIT License - see the LICENSE file for details.
