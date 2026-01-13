// Provider Store Hook

import { useState, useEffect, useCallback } from 'react';
import {
  Provider,
  EnvValue,
  TokenCheckResult,
  createProvider,
  ConfigType,
} from '../types';
import { inferIconFromUrl } from '../types/templates';

// Check if running in Electron
const isElectron = typeof window !== 'undefined' && window.electronAPI;

// Fallback storage for browser development
const localStorageKey = 'ClaudeCodeX_providers';
const activeProviderKey = 'ClaudeCodeX_active_provider_id';
const configTypeKey = 'ClaudeCodeX_config_type';

async function loadProviders(): Promise<Provider[]> {
  if (isElectron) {
    const data = await window.electronAPI.readProviders();
    return data as Provider[];
  }
  const stored = localStorage.getItem(localStorageKey);
  return stored ? JSON.parse(stored) : [];
}

async function saveProviders(providers: Provider[]): Promise<void> {
  if (isElectron) {
    await window.electronAPI.writeProviders(providers);
  } else {
    localStorage.setItem(localStorageKey, JSON.stringify(providers));
  }
}

function setActiveProviderId(id: string): void {
  localStorage.setItem(activeProviderKey, id);
}

async function loadConfigType(): Promise<ConfigType> {
  if (isElectron) {
    return await window.electronAPI.getConfigType();
  }
  const stored = localStorage.getItem(configTypeKey);
  return (stored as ConfigType) || 'claude';
}

async function saveConfigType(type: ConfigType): Promise<void> {
  if (isElectron) {
    await window.electronAPI.setConfigType(type);
  } else {
    localStorage.setItem(configTypeKey, type);
  }
}

export function useProviderStore() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [configType, setConfigTypeState] = useState<ConfigType>('claude');

  // Load providers and config type on mount
  useEffect(() => {
    Promise.all([loadProviders(), loadConfigType()]).then(([data, type]) => {
      setProviders(data);
      setConfigTypeState(type);
      setLoading(false);
    });
  }, []);

  // Save providers when they change
  useEffect(() => {
    if (!loading) {
      saveProviders(providers);
    }
  }, [providers, loading]);

  const activeProvider = providers.find((p) => p.isActive) || null;

  const addProvider = useCallback((provider: Provider) => {
    setProviders((prev) => [...prev, { ...provider, isActive: false }]);
  }, []);

  const updateProvider = useCallback((provider: Provider) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === provider.id ? provider : p))
    );
  }, []);

  const deleteProvider = useCallback((provider: Provider) => {
    setProviders((prev) => prev.filter((p) => p.id !== provider.id));
  }, []);

  const activateProvider = useCallback(
    async (provider: Provider) => {
      // Get old managed keys before activation
      const oldManagedKeys = activeProvider
        ? Object.keys(activeProvider.envVariables)
        : [];

      // Update providers state - only affect providers of the same config type
      setProviders((prev) =>
        prev.map((p) => ({
          ...p,
          isActive: p.configType === provider.configType
            ? p.id === provider.id
            : p.isActive,
        }))
      );

      // Update config file based on config type
      if (isElectron) {
        if (provider.configType === 'codex') {
          // For Codex, update config.toml and auth.json
          const codexConfig = {
            name: provider.name,
            model_provider: provider.envVariables.CODEX_MODEL_PROVIDER?.value || 'custom',
            model: provider.envVariables.CODEX_MODEL?.value || 'gpt-5.2-codex',
            base_url: provider.envVariables.CODEX_BASE_URL?.value || '',
            apikey: provider.envVariables.CODEX_API_KEY?.value || '',
            model_reasoning_effort: provider.envVariables.CODEX_REASONING_EFFORT?.value as 'low' | 'medium' | 'high' | undefined,
          };
          await window.electronAPI.codexUpdateProvider(codexConfig);
        } else {
          // For ClaudeCode, update settings.json env
          await window.electronAPI.updateEnv(provider.envVariables, oldManagedKeys);
        }
      }

      setActiveProviderId(provider.id);
    },
    [activeProvider]
  );

  const deactivateAllProviders = useCallback(async () => {
    const oldManagedKeys = activeProvider
      ? Object.keys(activeProvider.envVariables)
      : [];

    // Only deactivate providers of the current config type
    setProviders((prev) =>
      prev.map((p) => ({
        ...p,
        isActive: p.configType === configType ? false : p.isActive,
      }))
    );

    // Remove env from config
    if (isElectron && oldManagedKeys.length > 0) {
      await window.electronAPI.removeEnv(oldManagedKeys);
    }

    setActiveProviderId('');
  }, [activeProvider, configType]);

  const checkTokenDuplicate = useCallback(
    (token: string, baseURL: string, excludingID?: string): TokenCheckResult => {
      if (!token) return { type: 'unique' };

      for (const provider of providers) {
        if (excludingID && provider.id === excludingID) continue;

        const providerToken = provider.envVariables.ANTHROPIC_AUTH_TOKEN?.value;
        if (providerToken === token) {
          const providerURL =
            provider.envVariables.ANTHROPIC_BASE_URL?.value || '';
          if (providerURL === baseURL) {
            return { type: 'duplicateWithSameURL', provider };
          } else {
            return { type: 'duplicateWithDifferentURL', provider };
          }
        }
      }

      return { type: 'unique' };
    },
    [providers]
  );

  const createNewProvider = useCallback(
    (
      name: string,
      envVariables: Record<string, EnvValue>,
      icon?: string,
      providerConfigType?: ConfigType
    ): Provider => {
      const inferredIcon =
        icon || inferIconFromUrl(envVariables.ANTHROPIC_BASE_URL?.value || envVariables.CODEX_BASE_URL?.value || '');
      return createProvider(name, envVariables, inferredIcon, false, providerConfigType || configType);
    },
    [configType]
  );

  const switchConfigType = useCallback(async (newType: ConfigType) => {
    // Save new config type
    await saveConfigType(newType);
    setConfigTypeState(newType);

    // Find active provider for the new config type and apply its config
    const newActiveProvider = providers.find(p => p.configType === newType && p.isActive);
    if (newActiveProvider && isElectron) {
      if (newType === 'codex') {
        const codexConfig = {
          name: newActiveProvider.name,
          model_provider: newActiveProvider.envVariables.CODEX_MODEL_PROVIDER?.value || 'custom',
          model: newActiveProvider.envVariables.CODEX_MODEL?.value || 'gpt-5.2-codex',
          base_url: newActiveProvider.envVariables.CODEX_BASE_URL?.value || '',
          apikey: newActiveProvider.envVariables.CODEX_API_KEY?.value || '',
          model_reasoning_effort: newActiveProvider.envVariables.CODEX_REASONING_EFFORT?.value as 'low' | 'medium' | 'high' | undefined,
        };
        await window.electronAPI.codexUpdateProvider(codexConfig);
      } else {
        await window.electronAPI.updateEnv(newActiveProvider.envVariables, []);
      }
    }
  }, [providers]);

  // Filter providers by current config type
  const filteredProviders = providers.filter(p => p.configType === configType);
  const filteredActiveProvider = filteredProviders.find(p => p.isActive) || null;

  return {
    providers: filteredProviders,
    activeProvider: filteredActiveProvider,
    configType,
    loading,
    addProvider,
    updateProvider,
    deleteProvider,
    activateProvider,
    deactivateAllProviders,
    checkTokenDuplicate,
    createNewProvider,
    switchConfigType,
  };
}
