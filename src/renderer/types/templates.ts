// Provider Templates for ClaudeCodeX Electron
// Templates are loaded from providers.json file

import { ProviderTemplate, createEnvValue, ConfigType, EnvValue } from './index';

// Raw template data from JSON (without configType)
interface RawProviderTemplate {
  name: string;
  envVariables: Record<string, { value: string; type: string }>;
  icon: string;
  docLink?: string;
}

interface ProvidersJson {
  claude: RawProviderTemplate[];
  codex: RawProviderTemplate[];
}

// Convert raw template to ProviderTemplate with proper EnvValue types
function convertRawTemplate(raw: RawProviderTemplate, configType: ConfigType): ProviderTemplate {
  const envVariables: Record<string, EnvValue> = {};
  
  for (const [key, value] of Object.entries(raw.envVariables)) {
    envVariables[key] = createEnvValue(value.value, value.type as 'string' | 'integer' | 'boolean');
  }
  
  return {
    name: raw.name,
    envVariables,
    icon: raw.icon,
    docLink: raw.docLink,
    configType,
  };
}

// Global template cache (starts empty, loaded from JSON)
let CLAUDE_PROVIDER_TEMPLATES: ProviderTemplate[] = [];
let CODEX_PROVIDER_TEMPLATES: ProviderTemplate[] = [];
let templatesLoaded = false;

// Load templates from JSON file (called from main process)
export function loadTemplatesFromJson(jsonData: ProvidersJson): void {
  console.log('📥 Loading templates from JSON:', {
    claude: jsonData.claude?.length || 0,
    codex: jsonData.codex?.length || 0
  });
  CLAUDE_PROVIDER_TEMPLATES = jsonData.claude?.map(t => convertRawTemplate(t, 'claude')) || [];
  CODEX_PROVIDER_TEMPLATES = jsonData.codex?.map(t => convertRawTemplate(t, 'codex')) || [];
  templatesLoaded = true;
  console.log('✅ Templates loaded:', {
    claude: CLAUDE_PROVIDER_TEMPLATES.length,
    codex: CODEX_PROVIDER_TEMPLATES.length
  });
}

// Async load templates from Electron main process
export async function loadTemplates(): Promise<void> {
  console.log('🔄 loadTemplates called, templatesLoaded:', templatesLoaded);
  if (templatesLoaded) return;

  const isElectron = typeof window !== 'undefined' && window.electronAPI;
  console.log('🔄 isElectron:', isElectron);
  if (isElectron) {
    try {
      const data = await window.electronAPI.readTemplates();
      console.log('🔄 Received data from main:', data);
      loadTemplatesFromJson(data as ProvidersJson);
      templatesLoaded = true;
    } catch (error) {
      console.error('Failed to load templates:', error);
      // Don't set templatesLoaded on error, so we can retry
    }
  }
  // Note: templatesLoaded is only set after successful load
}

// Export getters for templates
export function getClaudeProviderTemplates(): ProviderTemplate[] {
  return CLAUDE_PROVIDER_TEMPLATES;
}

export function getCodexProviderTemplates(): ProviderTemplate[] {
  return CODEX_PROVIDER_TEMPLATES;
}

// Get templates by config type
export function getTemplatesByType(configType: ConfigType): ProviderTemplate[] {
  return configType === 'codex' ? CODEX_PROVIDER_TEMPLATES : CLAUDE_PROVIDER_TEMPLATES;
}

// Combined templates
export function getAllTemplates(): ProviderTemplate[] {
  return [...CLAUDE_PROVIDER_TEMPLATES, ...CODEX_PROVIDER_TEMPLATES];
}

// Re-export for compatibility
export { CLAUDE_PROVIDER_TEMPLATES, CODEX_PROVIDER_TEMPLATES };

export function inferIconFromUrl(baseUrl: string): string {
  if (!baseUrl) return 'ClaudeLogo';

  try {
    const url = new URL(baseUrl);
    const host = url.host.replace(/^www\./, '');

    // Match with template hosts first
    const allTemplates = getAllTemplates();
    for (const template of allTemplates) {
      const templateUrl = template.envVariables.ANTHROPIC_BASE_URL?.value || template.envVariables.CODEX_BASE_URL?.value;
      if (templateUrl) {
        try {
          const templateHost = new URL(templateUrl).host.replace(/^www\./, '');
          if (host === templateHost) {
            return template.icon;
          }
        } catch {
          // Skip invalid template URLs
        }
      }
    }

    // Fallback to host-based inference
    if (host.includes('anthropic.com')) return 'ClaudeLogo';
    if (host.includes('openai.com')) return 'OpenAILogo';
    if (host.includes('bigmodel.cn')) return 'ZhipuLogo';
    if (host.includes('z.ai')) return 'ZaiLogo';
    if (host.includes('moonshot.cn')) return 'MoonshotLogo';
    if (host.includes('streamlakeapi.com')) return 'StreamLakeLogo';
    if (host.includes('deepseek.com')) return 'DeepSeekLogo';
    if (host.includes('minimaxi.com') || host.includes('minimax.io')) return 'MiniMaxLogo';
    if (host.includes('aliyuncs.com')) return 'AliyuncsLogo';
    if (host.includes('modelscope.cn')) return 'ModelScopeLogo';
    if (host.includes('packycode.com')) return 'PackyCodeLogo';
    if (host.includes('anyrouter.top')) return 'AnyRouterLogo';
    if (host.includes('longcat.chat')) return 'LongCatLogo';

    return 'OtherLogo';
  } catch {
    return 'ClaudeLogo';
  }
}

export function inferTemplateFromProvider(envVariables: Record<string, { value: string }>): ProviderTemplate | undefined {
  const baseUrl = envVariables.ANTHROPIC_BASE_URL?.value || envVariables.CODEX_BASE_URL?.value;
  if (!baseUrl) return undefined;

  try {
    const providerHost = new URL(baseUrl).host.replace(/^www\./, '');
    const allTemplates = getAllTemplates();

    return allTemplates.find((template) => {
      const templateUrl = template.envVariables.ANTHROPIC_BASE_URL?.value || template.envVariables.CODEX_BASE_URL?.value;
      if (!templateUrl) return false;
      try {
        const templateHost = new URL(templateUrl).host.replace(/^www\./, '');
        return providerHost === templateHost;
      } catch {
        return false;
      }
    });
  } catch {
    return undefined;
  }
}
