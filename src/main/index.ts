// Electron Main Process

import {
  app,
  BrowserWindow,
  Tray,
  Menu,
  ipcMain,
  nativeImage,
  screen,
  shell,
} from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as TOML from '@iarna/toml';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

// Config paths for ClaudeCode
const CLAUDE_DIR = path.join(os.homedir(), '.claude');
const CONFIG_PATH = path.join(CLAUDE_DIR, 'settings.json');
const BACKUP_PATH = path.join(CLAUDE_DIR, 'settings.json.backup');

// Config paths for Codex
const CODEX_DIR = path.join(os.homedir(), '.codex');
const CODEX_CONFIG_PATH = path.join(CODEX_DIR, 'config.toml');
const CODEX_AUTH_PATH = path.join(CODEX_DIR, 'auth.json');
const CODEX_BACKUP_PATH = path.join(CODEX_DIR, 'config.toml.backup');

// Store path for providers
const STORE_PATH = path.join(app.getPath('userData'), 'providers.json');

// Path for provider templates JSON
const PROVIDER_TEMPLATES_PATH = (() => {
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    return path.join(__dirname, '../../providers.json');
  }
  // In production, look in the app resources directory
  return path.join(process.resourcesPath || app.getAppPath(), 'providers.json');
})();

// Store current config type (claude or codex)
const CONFIG_TYPE_PATH = path.join(app.getPath('userData'), 'config-type.json');

// Ensure config directory and file exist
function ensureConfigExists(): void {
  if (!fs.existsSync(CLAUDE_DIR)) {
    fs.mkdirSync(CLAUDE_DIR, { recursive: true });
    console.log('✅ Created .claude directory');
  }

  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({}, null, 2));
    console.log('✅ Created empty settings.json');
  }
}

// Read Claude config
function readConfig(): Record<string, unknown> | null {
  ensureConfigExists();
  try {
    const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read Claude config:', error);
    return null;
  }
}

// Write Claude config
function writeConfig(config: Record<string, unknown>): boolean {
  ensureConfigExists();
  createBackup();

  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error('Failed to write Claude config:', error);
    restoreBackup();
    return false;
  }
}

// Create backup
function createBackup(): void {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      fs.copyFileSync(CONFIG_PATH, BACKUP_PATH);
    }
  } catch (error) {
    console.error('Failed to create backup:', error);
  }
}

// Restore backup
function restoreBackup(): void {
  try {
    if (fs.existsSync(BACKUP_PATH)) {
      fs.copyFileSync(BACKUP_PATH, CONFIG_PATH);
      fs.unlinkSync(BACKUP_PATH);
    }
  } catch (error) {
    console.error('Failed to restore backup:', error);
  }
}

// Read providers from store
function readProviders(): unknown[] {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to read providers:', error);
  }
  return [];
}

// Read provider templates from JSON file
function readProviderTemplates(): { claude: unknown[]; codex: unknown[] } {
  try {
    // First try the user data directory (for user customizations)
    const userTemplatesPath = path.join(app.getPath('userData'), 'providers.json');
    let data: string;
    
    if (fs.existsSync(userTemplatesPath)) {
      data = fs.readFileSync(userTemplatesPath, 'utf-8');
      console.log('✅ Loaded provider templates from user data');
    } else if (fs.existsSync(PROVIDER_TEMPLATES_PATH)) {
      data = fs.readFileSync(PROVIDER_TEMPLATES_PATH, 'utf-8');
      console.log('✅ Loaded provider templates from app bundle');
    } else {
      console.warn('⚠️ Provider templates JSON not found, using defaults');
      return { claude: [], codex: [] };
    }
    
    const parsed = JSON.parse(data);
    return {
      claude: parsed.claude || [],
      codex: parsed.codex || [],
    };
  } catch (error) {
    console.error('Failed to read provider templates:', error);
    return { claude: [], codex: [] };
  }
}

// Write providers to store
function writeProviders(providers: unknown[]): boolean {
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(providers, null, 2));
    return true;
  } catch (error) {
    console.error('Failed to write providers:', error);
    return false;
  }
}

// Read/Write config type
function readConfigType(): 'claude' | 'codex' {
  try {
    if (fs.existsSync(CONFIG_TYPE_PATH)) {
      const data = fs.readFileSync(CONFIG_TYPE_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      return parsed.type === 'codex' ? 'codex' : 'claude';
    }
  } catch (error) {
    console.error('Failed to read config type:', error);
  }
  return 'claude'; // Default to claude
}

function writeConfigType(type: 'claude' | 'codex'): boolean {
  try {
    const dir = path.dirname(CONFIG_TYPE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_TYPE_PATH, JSON.stringify({ type }, null, 2));
    return true;
  } catch (error) {
    console.error('Failed to write config type:', error);
    return false;
  }
}

// Ensure Codex config directory and files exist
function ensureCodexConfigExists(): void {
  if (!fs.existsSync(CODEX_DIR)) {
    fs.mkdirSync(CODEX_DIR, { recursive: true });
    console.log('✅ Created .codex directory');
  }

  if (!fs.existsSync(CODEX_CONFIG_PATH)) {
    const defaultConfig = {
      model_provider: '',
      model: 'gpt-5.2-codex',
      model_reasoning_effort: 'medium',
      disable_response_storage: true,
      model_providers: {},
    };
    fs.writeFileSync(CODEX_CONFIG_PATH, TOML.stringify(defaultConfig as any));
    console.log('✅ Created empty config.toml');
  }

  if (!fs.existsSync(CODEX_AUTH_PATH)) {
    fs.writeFileSync(CODEX_AUTH_PATH, JSON.stringify({ OPENAI_API_KEY: '' }, null, 2));
    console.log('✅ Created empty auth.json');
  }
}

// Read Codex config
function readCodexConfig(): any | null {
  ensureCodexConfigExists();
  try {
    const data = fs.readFileSync(CODEX_CONFIG_PATH, 'utf-8');
    return TOML.parse(data);
  } catch (error) {
    console.error('Failed to read Codex config:', error);
    return null;
  }
}

// Write Codex config
function writeCodexConfig(config: any): boolean {
  ensureCodexConfigExists();
  createCodexBackup();

  try {
    fs.writeFileSync(CODEX_CONFIG_PATH, TOML.stringify(config));
    return true;
  } catch (error) {
    console.error('Failed to write Codex config:', error);
    restoreCodexBackup();
    return false;
  }
}

// Create Codex backup
function createCodexBackup(): void {
  try {
    if (fs.existsSync(CODEX_CONFIG_PATH)) {
      fs.copyFileSync(CODEX_CONFIG_PATH, CODEX_BACKUP_PATH);
    }
  } catch (error) {
    console.error('Failed to create Codex backup:', error);
  }
}

// Restore Codex backup
function restoreCodexBackup(): void {
  try {
    if (fs.existsSync(CODEX_BACKUP_PATH)) {
      fs.copyFileSync(CODEX_BACKUP_PATH, CODEX_CONFIG_PATH);
      fs.unlinkSync(CODEX_BACKUP_PATH);
    }
  } catch (error) {
    console.error('Failed to restore Codex backup:', error);
  }
}

// Read Codex auth
function readCodexAuth(): any | null {
  ensureCodexConfigExists();
  try {
    const data = fs.readFileSync(CODEX_AUTH_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read Codex auth:', error);
    return null;
  }
}

// Write Codex auth
function writeCodexAuth(auth: any): boolean {
  ensureCodexConfigExists();
  try {
    fs.writeFileSync(CODEX_AUTH_PATH, JSON.stringify(auth, null, 2));
    return true;
  } catch (error) {
    console.error('Failed to write Codex auth:', error);
    return false;
  }
}

function createWindow(): void {
  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 380,
    height: 420,
    show: false,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    transparent: true,
    vibrancy: 'popover',
    visualEffectState: 'active',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Position window at top right initially (will be repositioned when tray is clicked)
  mainWindow.setPosition(screenWidth - 400, 30);

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Hide window when it loses focus
  mainWindow.on('blur', () => {
    if (mainWindow && !mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide();
    }
  });
}

function createTray(): void {
  // Create tray icon - use PNG for proper template image support on macOS
  // In development, use source directory; in production, use dist directory
  const isDev = process.env.NODE_ENV === 'development';
  const assetsPath = isDev
    ? path.join(__dirname, '../../src/renderer/assets')
    : path.join(__dirname, '../renderer/assets');
  const pngIconPath = path.join(assetsPath, 'Icon.png');
  let icon: Electron.NativeImage;

  if (fs.existsSync(pngIconPath)) {
    icon = nativeImage.createFromPath(pngIconPath);
    // Resize to 18x18 for menu bar (macOS will use @2x automatically for Retina)
    icon = icon.resize({ width: 18, height: 18 });
  } else {
    // Create a simple default icon if no file exists
    icon = nativeImage.createEmpty();
  }

  // Set as template image for macOS menu bar
  // This allows macOS to automatically adjust the icon color based on menu bar appearance
  icon.setTemplateImage(true);

  tray = new Tray(icon);
  tray.setToolTip('ClaudeCodeX - Claude Code Provider Switcher');

  // Toggle window on tray click
  tray.on('click', (event, bounds) => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        // Position window below tray icon
        const { x, y } = bounds;
        const { width: windowWidth } = mainWindow.getBounds();
        mainWindow.setPosition(
          Math.round(x - windowWidth / 2),
          Math.round(y + 5)
        );
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });

  // Right-click menu
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click: () => {
        mainWindow?.show();
        mainWindow?.focus();
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.on('right-click', () => {
    tray?.popUpContextMenu(contextMenu);
  });
}

// IPC Handlers
function setupIpcHandlers(): void {
  // Config type operations
  ipcMain.handle('config:getType', () => {
    return readConfigType();
  });

  ipcMain.handle('config:setType', (_, type: 'claude' | 'codex') => {
    return writeConfigType(type);
  });

  // ClaudeCode config operations
  ipcMain.handle('config:read', () => {
    return readConfig();
  });

  ipcMain.handle('config:write', (_, config: Record<string, unknown>) => {
    return writeConfig(config);
  });

  ipcMain.handle('config:getEnv', () => {
    const config = readConfig();
    return config?.env || {};
  });

  ipcMain.handle(
    'config:updateEnv',
    (
      _,
      envVars: Record<string, { value: string; type: string }>,
      previousKeys: string[]
    ) => {
      const config = readConfig() || {};
      let existingEnv = (config.env as Record<string, unknown>) || {};

      // Remove previous keys
      for (const key of previousKeys) {
        delete existingEnv[key];
      }

      // Add new env variables with proper type conversion
      for (const [key, envValue] of Object.entries(envVars)) {
        switch (envValue.type) {
          case 'integer':
            existingEnv[key] = parseInt(envValue.value, 10) || envValue.value;
            break;
          case 'boolean':
            existingEnv[key] =
              envValue.value === '1' || envValue.value.toLowerCase() === 'true'
                ? 1
                : 0;
            break;
          default:
            existingEnv[key] = envValue.value;
        }
      }

      config.env = existingEnv;
      return writeConfig(config);
    }
  );

  ipcMain.handle('config:removeEnv', (_, keys: string[]) => {
    const config = readConfig() || {};
    let existingEnv = (config.env as Record<string, unknown>) || {};

    for (const key of keys) {
      delete existingEnv[key];
    }

    config.env = existingEnv;
    return writeConfig(config);
  });

  // Codex config operations
  ipcMain.handle('codex:readConfig', () => {
    return readCodexConfig();
  });

  ipcMain.handle('codex:writeConfig', (_, config: any) => {
    return writeCodexConfig(config);
  });

  ipcMain.handle('codex:readAuth', () => {
    return readCodexAuth();
  });

  ipcMain.handle('codex:writeAuth', (_, auth: any) => {
    return writeCodexAuth(auth);
  });

  ipcMain.handle(
    'codex:updateProvider',
    (_, providerConfig: {
      name: string;
      model_provider: string;
      model: string;
      base_url: string;
      apikey: string;
      model_reasoning_effort?: string;
    }) => {
      const config = readCodexConfig() || {
        model_provider: '',
        model: 'gpt-5.2-codex',
        model_reasoning_effort: 'medium',
        disable_response_storage: true,
        model_providers: {},
      };

      // Update main config
      config.model_provider = providerConfig.model_provider;
      config.model = providerConfig.model;
      if (providerConfig.model_reasoning_effort) {
        config.model_reasoning_effort = providerConfig.model_reasoning_effort;
      }

      // Update provider config
      if (!config.model_providers) {
        config.model_providers = {};
      }
      config.model_providers[providerConfig.model_provider] = {
        name: providerConfig.model_provider,
        base_url: providerConfig.base_url,
        wire_api: 'responses',
        requires_openai_auth: true,  // Tell Codex to use OPENAI_API_KEY from auth.json
      };

      // Update auth - use OPENAI_API_KEY as the key (Codex standard)
      const auth: Record<string, string> = {
        OPENAI_API_KEY: providerConfig.apikey,
      };

      return writeCodexConfig(config) && writeCodexAuth(auth);
    }
  );

  // Provider operations
  ipcMain.handle('providers:read', () => {
    return readProviders();
  });

  ipcMain.handle('providers:write', (_, providers: unknown[]) => {
    return writeProviders(providers);
  });

  // Provider templates operations
  ipcMain.handle('templates:read', () => {
    return readProviderTemplates();
  });

  // Window operations
  ipcMain.handle('window:hide', () => {
    mainWindow?.hide();
  });

  ipcMain.handle('window:quit', () => {
    app.quit();
  });

  // Open external URL
  ipcMain.handle('shell:openExternal', (_, url: string) => {
    return shell.openExternal(url);
  });
}

// App lifecycle
app.whenReady().then(() => {
  setupIpcHandlers();
  createWindow();
  createTray();

  // Hide dock icon on macOS (menu bar app)
  if (process.platform === 'darwin') {
    app.dock?.hide();
  }
});

app.on('window-all-closed', () => {
  // Don't quit on window close for menu bar app
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
