// Electron API type definitions

export interface ElectronAPI {
  // Config type operations
  getConfigType: () => Promise<'claude' | 'codex'>;
  setConfigType: (type: 'claude' | 'codex') => Promise<boolean>;

  // ClaudeCode config operations
  readConfig: () => Promise<Record<string, unknown> | null>;
  writeConfig: (config: Record<string, unknown>) => Promise<boolean>;
  getEnv: () => Promise<Record<string, unknown>>;
  updateEnv: (
    envVars: Record<string, { value: string; type: string }>,
    previousKeys: string[]
  ) => Promise<boolean>;
  removeEnv: (keys: string[]) => Promise<boolean>;

  // Codex config operations
  codexReadConfig: () => Promise<any | null>;
  codexWriteConfig: (config: any) => Promise<boolean>;
  codexReadAuth: () => Promise<any | null>;
  codexWriteAuth: (auth: any) => Promise<boolean>;
  codexUpdateProvider: (providerConfig: {
    name: string;
    model_provider: string;
    model: string;
    base_url: string;
    apikey: string;
    model_reasoning_effort?: string;
  }) => Promise<boolean>;

  // Provider operations
  readProviders: () => Promise<unknown[]>;
  writeProviders: (providers: unknown[]) => Promise<boolean>;

  // Provider templates operations
  readTemplates: () => Promise<{ claude: unknown[]; codex: unknown[] }>;

  // Window operations
  hideWindow: () => Promise<void>;
  quitApp: () => Promise<void>;

  // Shell operations
  openExternal: (url: string) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
