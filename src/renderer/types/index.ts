// Types for ClaudeCodeX Electron

export type ConfigType = 'claude' | 'codex';

export type EnvValueType = 'string' | 'integer' | 'boolean';

export interface EnvValue {
  value: string;
  type: EnvValueType;
}

export interface Provider {
  id: string;
  name: string;
  envVariables: Record<string, EnvValue>;
  isActive: boolean;
  icon: string;
  configType: ConfigType; // 'claude' or 'codex'
}

export interface ProviderTemplate {
  name: string;
  envVariables: Record<string, EnvValue>;
  icon: string;
  docLink?: string;
  configType: ConfigType; // 'claude' or 'codex'
}

// Codex specific types
export interface CodexProviderConfig {
  name: string;
  model_provider: string;
  model: string;
  base_url: string;
  apikey: string;
  model_reasoning_effort?: 'low' | 'medium' | 'high';
}

export type TokenCheckResult =
  | { type: 'unique' }
  | { type: 'duplicateWithSameURL'; provider: Provider }
  | { type: 'duplicateWithDifferentURL'; provider: Provider };

export type AppView =
  | { type: 'main' }
  | { type: 'add' }
  | { type: 'edit'; provider: Provider };

export interface EnvKeyInfo {
  key: string;
  displayName: string;
  systemImage: string;
  placeholder: string;
  valueType: EnvValueType;
}

export const ENV_KEYS: EnvKeyInfo[] = [
  {
    key: 'ANTHROPIC_BASE_URL',
    displayName: 'Base URL',
    systemImage: 'link',
    placeholder: 'https://api.anthropic.com',
    valueType: 'string',
  },
  {
    key: 'ANTHROPIC_AUTH_TOKEN',
    displayName: 'Auth Token',
    systemImage: 'key',
    placeholder: 'Enter your API token',
    valueType: 'string',
  },
  {
    key: 'ANTHROPIC_DEFAULT_HAIKU_MODEL',
    displayName: 'Haiku Model',
    systemImage: 'cpu',
    placeholder: 'haiku',
    valueType: 'string',
  },
  {
    key: 'ANTHROPIC_DEFAULT_SONNET_MODEL',
    displayName: 'Sonnet Model',
    systemImage: 'cpu',
    placeholder: 'sonnet',
    valueType: 'string',
  },
  {
    key: 'ANTHROPIC_DEFAULT_OPUS_MODEL',
    displayName: 'Opus Model',
    systemImage: 'cpu',
    placeholder: 'opus',
    valueType: 'string',
  },
  {
    key: 'API_TIMEOUT_MS',
    displayName: 'API Timeout (ms)',
    systemImage: 'clock',
    placeholder: '600000',
    valueType: 'integer',
  },
  {
    key: 'CLAUDE_CODE_MAX_OUTPUT_TOKENS',
    displayName: 'Max output tokens',
    systemImage: 'text',
    placeholder: '6000',
    valueType: 'integer',
  },
  {
    key: 'CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC',
    displayName: 'Disable Non-essential Traffic',
    systemImage: 'network',
    placeholder: 'Enabled',
    valueType: 'boolean',
  },
];

// Codex specific env keys
export const CODEX_ENV_KEYS: EnvKeyInfo[] = [
  {
    key: 'CODEX_BASE_URL',
    displayName: 'Base URL',
    systemImage: 'link',
    placeholder: 'https://api.openai.com/v1',
    valueType: 'string',
  },
  {
    key: 'CODEX_API_KEY',
    displayName: 'API Key',
    systemImage: 'key',
    placeholder: 'Enter your API key',
    valueType: 'string',
  },
  {
    key: 'CODEX_MODEL',
    displayName: 'Model',
    systemImage: 'cpu',
    placeholder: 'gpt-5.2-codex',
    valueType: 'string',
  },
  {
    key: 'CODEX_MODEL_PROVIDER',
    displayName: 'Model Provider',
    systemImage: 'cpu',
    placeholder: 'openai',
    valueType: 'string',
  },
  {
    key: 'CODEX_REASONING_EFFORT',
    displayName: 'Reasoning Effort',
    systemImage: 'cpu',
    placeholder: 'medium',
    valueType: 'string',
  },
];

export function getEnvKeyInfo(key: string): EnvKeyInfo | undefined {
  return ENV_KEYS.find((k) => k.key === key);
}

export function createEnvValue(value: string, type: EnvValueType): EnvValue {
  return { value, type };
}

export function createProvider(
  name: string,
  envVariables: Record<string, EnvValue>,
  icon: string = 'ClaudeLogo',
  isActive: boolean = false,
  configType: ConfigType = 'claude'
): Provider {
  return {
    id: crypto.randomUUID(),
    name,
    envVariables,
    icon,
    isActive,
    configType,
  };
}
