# 🗣️ TalkUp

<div align="center">
  <img src="https://media-hosting.imagekit.io/bdce9eed61dd4e06/d10077a3-a197-4a19-88fe-e88fa9437e8e-removebg-preview.png?Expires=1841440791&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=L8BwPMyy3B4M9CXXCG6dx6U3-o3ankbUem6BhM82ceaO3zpxNXzvWrr0Q-aATG7fvc65n3~P-i2YZ~7nfIEGt05sSL9iJfbOE9f0fYZOHnNkwTVGjVtnvuPcZRSl4sBvscVSyAYvC6FVV17~6olljaPu4sl63DqKKW~sCSXbQvZQc~kdp0Nh0oCkypUj-p57I~M5Q2B2aT8epO54qGuBJrqFubUQTIqqCFCTltdWly-FOwuYcPkryEuxiTd9k2zbx0qfU2hppY~FhYsBMLDkOx8omljqMP1TGeqwRLbQSreNc5EWICyvFk9NWtnvm9qzhO6ijVpGb8W0nzsce4qD8w__" alt="TalkUp Logo" width="450"/>
  
  [![Expo](https://img.shields.io/badge/Expo-52.0.0-blue.svg)](https://expo.dev/)
  [![React Native](https://img.shields.io/badge/React%20Native-0.72.6-blue.svg)](https://reactnative.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)
</div>

## 🌟 Overview

TalkUp is a modern social networking platform built with React Native and Expo, designed to connect ENSA Fès students through meaningful conversations and shared experiences. With a focus on clean design and seamless user experience, TalkUp brings students together in an engaging and intuitive way.

## ✨ Features

### 🎯 Core Features

- **Smart Onboarding** - Personalized welcome experience with interactive tutorials
- **Social Connections** - Find and connect with friends, join groups, and build your network
- **Real-time Messaging** - Instant messaging with rich media support and emoji reactions
- **Story Sharing** - Share moments with 24-hour stories featuring photos and videos
- **News Feed** - Customizable feed with posts from friends and followed topics
- **Gaming Hub** - Built-in casual games like Snake, Tetris, and Tic-Tac-Toe
- **Events** - Create, discover, and join local and virtual events

### 🛠️ Technical Features

- **Cross-Platform** - Works seamlessly on iOS, Android, and Web
- **Real-time Updates** - Instant notifications and live chat
- **Offline Support** - Core features work without internet connection
- **Dark Mode** - System-aware theme switching
- **Secure Authentication** - Multi-factor authentication support
- **File Handling** - Efficient media upload and processing
- **Analytics** - Built-in usage tracking and error reporting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/talkup.git
cd talkup
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun start
```

## 📱 Usage

### Development

- **iOS**: Press 'i' in the terminal or run `bun ios`
- **Android**: Press 'a' in the terminal or run `bun android`
- **Web**: Press 'w' in the terminal or run `bun web`

### Building

- **iOS**: `eas build --platform ios`
- **Android**: `eas build --platform android`
- **Web**: `bun build:web`

## 🏗️ Architecture

### Tech Stack

- **Frontend**
  - React Native
  - Expo SDK 53
  - TypeScript
  - Zustand (State Management)
  - React Query
  - React Navigation

- **Backend**
  - Node.js
  - Hono
  - tRPC
  - WebSocket

### Project Structure

```
talkup/
├── app/                  # Expo Router pages
│   ├── (tabs)/          # Tab-based navigation
│   ├── auth/            # Authentication screens
│   └── modal/           # Modal screens
├── components/          # Reusable components
├── constants/           # App constants
├── store/              # State management
├── hooks/              # Custom React hooks
├── utils/              # Helper functions
├── types/              # TypeScript definitions
└── assets/             # Static assets
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Process

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Expo Team](https://expo.dev) for the amazing development platform
- [React Native Community](https://reactnative.dev) for the powerful framework
- [Our Contributors](https://github.com/your-username/talkup/graphs/contributors) for their valuable input

## 📞 Support

Having trouble? Check out our [documentation](docs/) or [open an issue](https://github.com/your-username/talkup/issues/new).

---

<div align="center">
  Made with ❤️ by the TalkUp Team
</div>
