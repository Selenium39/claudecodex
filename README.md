# ClaudeCodeX

A menu bar application for switching Claude Code API providers.

## Introduction

ClaudeCodeX is a lightweight macOS menu bar application designed to help users conveniently switch and manage Claude Code API providers.

## Features

- 🔄 Quickly switch between Claude Code API providers
- 🎨 Clean and simple menu bar interface
- ⚙️ Configuration file management

## Installation

### Install from Release

Download and install the latest release:

1. Visit the [Releases](https://github.com/selenium39/ClaudeCodeX/releases) page
2. Download the installer for your operating system
   - **macOS**: `.dmg` or `.zip` file
   - **Windows**: `.exe` installer or portable version
   - **Linux**: `.AppImage` or `.deb` file

### Build from Source

```bash
# Clone the repository
git clone https://github.com/selenium39/ClaudeCodeX.git
cd ClaudeCodeX

# Install dependencies
pnpm install

# Run in development mode
pnpm run devx

# Build the application
pnpm run build:all
```

## Usage

1. Launch the ClaudeCodeX application
2. Click the menu bar icon to open the settings panel
3. Add or select your API provider configuration
4. Save the configuration, and the application will automatically switch to the new provider

## Configuration File

ClaudeCodeX configuration file is located at:

- **macOS**: `~/Library/Application Support/ClaudeCodeX/config.json`
- **Windows**: `%APPDATA%/ClaudeCodeX/config.json`
- **Linux**: `~/.config/ClaudeCodeX/config.json`

## Development

```bash
# Install dependencies
pnpm install

# Development mode
pnpm run devx

# Build renderer process only
pnpm run build

# Build main process only
pnpm run build:electron

# Build for all platforms
pnpm run build:all

# Build for specific platform
pnpm run build:mac    # macOS
pnpm run build:win    # Windows
pnpm run build:linux  # Linux
```

## Tech Stack

- **Electron** - Cross-platform desktop application framework
- **React** - User interface library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Frontend build tool

## License

This project is open-sourced under the [MIT License](LICENSE).

## Author

Selenium39 <selenium39@qq.com>

## Contributing

Issues and Pull Requests are welcome!

## Acknowledgments

- [Claude Code](https://code.anthropic.com) - AI coding assistant by Anthropic
- [Electron](https://www.electronjs.org/) - Cross-platform desktop application development framework
- [ChatTempMail](https://chat-tempmail.com) - AI-powered temporary email service
