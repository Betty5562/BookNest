#  BookNest: A Personal Library App

> A  Dark Academia themed mobile library application built with React Native and Expo

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![AsyncStorage](https://img.shields.io/badge/AsyncStorage-316192?style=for-the-badge&logo=data&logoColor=white)

BookNest is a mobile application that allows users to manage their personal book collection with a sophisticated Dark Academia aesthetic. Users can sign up, explore books, manage their library, mark favorites, and more — all with persistent local storage.

---

## Features

###  User Authentication
-  Sign up with email validation
-  Secure login system
-  Automatic session persistence
-  Protected routes and access control
- Auto-redirect on app launch

###  Book Management
-  View curated initial book collection
-  Add new books (title, author, description, category, cover)
-  Edit existing books
-  Delete books from library
-  Mark books as **favorites** 
-  Track **owned** 

###  Explore Tab
-  Browse complete book catalog
-  Real-time search by title
- Filter by category (Fiction, Non-Fiction, Science, etc.)
-  View detailed book information
-  Add books to personal library
-  Quick favorite toggle

###  My Library Tab
-  Personal collection view
-  Search within owned books
-  Dark Academia themed interface

###  Dark Academia UI Theme

The theme configuration in `/utils/theme.js`:

```javascript
export const darkAcademia = {
  background: '#0d0b0b',
  text: '#e6e0d0',        
  accent: '#cdad0c',       
  muted: '#88837b',        
  border: '#1a1818',        
  font: 'serif',            
};
```

Applied across all components for visual consistency.

##  Tech Stack

| Technology          | Purpose |
|-----------          |---------
| **React Native**    | Cross-platform mobile framework |
| **Expo**            | Development and build tooling |
| **AsyncStorage**    | Local data persistence |
| **React Navigation**| Stack & tab navigation |
| **@react-native-picker/picker** | Category selection |
| **Expo Image Picker** | Cover image selection |

---

##  Prerequisites

Before running this project, ensure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Expo CLI** (optional but recommended)
  ```bash
  npm install -g expo-cli
  ```
- **Expo Go** app on your mobile device
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

---

##  Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Betty5562/BookNest.git
cd BookNest
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npx expo start
```

### 4. Run on Your Device

**Option A: Expo Go (Recommended for Testing)**
1. Open **Expo Go** on your mobile device
2. Scan the QR code from your terminal
3. App will load automatically

**Option B: iOS Simulator (Mac only)**
```bash
press 'i' in terminal
```

**Option C: Android Emulator**
```bash
press 'a' in terminal
```

---

##  Project Structure

```
BookNest/
│
├── App.js                         # Entry point & navigation setup
├── package.json                   # Dependencies
├── app.json                       # Expo configuration
├── babel.config.js                # Babel configuration
├── eslint.config.js               # ESLint configuration
│
├── components/
│   ├── Button.js                  # Custom button component
│   ├── Card.js                    # Reusable card component
│   ├── ScreenContainer.js         # Screen wrapper component
│   ├── TextInput.js               # Custom input component
│   └── index.js                   # Component exports
│
├── navigation/
│   ├── AuthStack.js               # Authentication navigation
│   └── MainTabs.js                # Main app tab navigation
│
├── screens/
│   ├── auth/
│   │   ├── LandingScreen.js       # Welcome/splash screen
│   │   ├── LoginScreen.js         # User login
│   │   └── SignupScreen.js        # New user registration
│   └── main/
│       ├── AddEditBookScreen.js   # Add/edit book form
│       ├── BookDetailsScreen.js   # Individual book view
│       ├── BookListScreen.js      # Explore & My Library
│       ├── ProfileScreen.js       # User profile
│       └── SettingsScreen.js      # App settings
│
├── utils/
│   ├── storage.js             # AsyncStorage helpers & initialbooks 
│   ├── theme.js                   # Dark Academia theme config
│   └── validators.js              # Input validation utilities
│
├── data/                          # Data folder (currently unused)
│
├── assets/
│   ├── icons/                     # App icons
│   └── images/                    # Default book covers
│
├── .vscode/                       # VS Code settings
├── .gitignore                     # Git ignore file
├── package-lock.json              # Locked dependencies
└── README.md                      # Project documentation
```

---

##  Data Storage

BookNest uses **AsyncStorage** for persistent local storage. No backend required!

### Stored Data:
-  **Users** - All registered accounts
-  **Current User** - Active session
-  **Books** - Complete book catalog (including user additions)
-  **User Libraries** - Favorites and owned status per user

### Data Flow:
1. App launches → Check for current user
2. If logged in → Load user's library
3. If new user → Seed initial books
4. All changes → Save to AsyncStorage immediately

---

##  Navigation Structure

```
Stack Navigator (Root)
├── Landing Screen
├── Login Screen
├── Signup Screen
├── Main Tabs (authenticated)
│   ├── Top Tab Navigator
│   │   ├── Explore Tab
│   │   └── My Library Tab
│   └── Settings Screen
├── Add/Edit Book Screen
└── Book Details Screen
```

---


##  Troubleshooting

### Issue: "Expo Go" won't load the app
**Solution:** Ensure your mobile device and computer are on the same WiFi network

### Issue: AsyncStorage data persists after logout
**Solution:** Clear app data manually or implement a "Clear All Data" feature in settings

### Issue: Images not loading
**Solution:** Check that image URIs are valid and accessible

### Issue: App crashes on Android
**Solution:** Rebuild the app: `npx expo start --clear`

---

##  Known Limitations

-  No cloud sync (data is device-specific)
-  No multi-device support
-  Search is case-sensitive
- Cover images are stored as URIs (not base64)

---

## Future Enhancements

- [ ] Adding Pdf/Epub supporter.
- [ ] Barcode scanner for ISBN lookup
- [ ] Book recommendations based on favorites
- [ ] Reading progress tracker
- [ ] Social features (share books with friends)
- [ ] Export library to CSV/PDF
- [ ] Dark/Light theme toggle
- [ ] Multiple language support

---



##  Author

**Betty5562**  
React Native Developer

- GitHub: [@Betty5562](https://github.com/Betty5562)
- Project Link: [BookNest Repository](https://github.com/Betty5562/BookNest)

---

## Acknowledgments

- Expo team for excellent documentation
- React Native community
- Dark Academia aesthetic inspiration
- Initial book data sourced from public domain

---

##  Support

For questions, issues, or suggestions:
-  [Open an issue](https://github.com/Betty5562/BookNest/issues)
-  Contact via GitHub profile

---