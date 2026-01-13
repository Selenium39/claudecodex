// Preload script for Electron

import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Config type operations
  getConfigType: () => ipcRenderer.invoke('config:getType'),
  setConfigType: (type: 'claude' | 'codex') =>
    ipcRenderer.invoke('config:setType', type),

  // ClaudeCode config operations
  readConfig: () => ipcRenderer.invoke('config:read'),
  writeConfig: (config: Record<string, unknown>) =>
    ipcRenderer.invoke('config:write', config),
  getEnv: () => ipcRenderer.invoke('config:getEnv'),
  updateEnv: (
    envVars: Record<string, { value: string; type: string }>,
    previousKeys: string[]
  ) => ipcRenderer.invoke('config:updateEnv', envVars, previousKeys),
  removeEnv: (keys: string[]) => ipcRenderer.invoke('config:removeEnv', keys),

  // Codex config operations
  codexReadConfig: () => ipcRenderer.invoke('codex:readConfig'),
  codexWriteConfig: (config: any) =>
    ipcRenderer.invoke('codex:writeConfig', config),
  codexReadAuth: () => ipcRenderer.invoke('codex:readAuth'),
  codexWriteAuth: (auth: any) => ipcRenderer.invoke('codex:writeAuth', auth),
  codexUpdateProvider: (
    providerConfig: {
      name: string;
      model_provider: string;
      model: string;
      base_url: string;
      apikey: string;
      model_reasoning_effort?: string;
    }
  ) => ipcRenderer.invoke('codex:updateProvider', providerConfig),

  // Provider operations
  readProviders: () => ipcRenderer.invoke('providers:read'),
  writeProviders: (providers: unknown[]) =>
    ipcRenderer.invoke('providers:write', providers),

  // Window operations
  hideWindow: () => ipcRenderer.invoke('window:hide'),
  quitApp: () => ipcRenderer.invoke('window:quit'),

  // Shell operations
  openExternal: (url: string) => ipcRenderer.invoke('shell:openExternal', url),
});
