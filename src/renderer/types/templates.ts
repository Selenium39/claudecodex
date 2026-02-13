// Provider Templates for ClaudeCodeX Electron
// Templates are now loaded from providers.json file

import { ProviderTemplate, createEnvValue, ConfigType, EnvValue } from './index';

// Default templates (fallback when JSON file is not available)
const DEFAULT_CLAUDE_TEMPLATES: ProviderTemplate[] = [
  {
    name: 'Zhipu AI',
    envVariables: {
      ANTHROPIC_BASE_URL: createEnvValue('https://open.bigmodel.cn/api/anthropic', 'string'),
      ANTHROPIC_AUTH_TOKEN: createEnvValue('', 'string'),
      ANTHROPIC_DEFAULT_HAIKU_MODEL: createEnvValue('glm-4.5-air', 'string'),
      ANTHROPIC_DEFAULT_SONNET_MODEL: createEnvValue('glm-4.7', 'string'),
      ANTHROPIC_DEFAULT_OPUS_MODEL: createEnvValue('glm-4.7', 'string'),
    },
    icon: 'ZhipuLogo',
    docLink: 'https://docs.bigmodel.cn/cn/coding-plan/tool/claude',
    configType: 'claude',
  },
  {
    name: 'MiniMax.com',
    envVariables: {
      ANTHROPIC_BASE_URL: createEnvValue('https://api.minimaxi.com/anthropic', 'string'),
      ANTHROPIC_AUTH_TOKEN: createEnvValue('', 'string'),
      ANTHROPIC_DEFAULT_HAIKU_MODEL: createEnvValue('MiniMax-M2', 'string'),
      ANTHROPIC_DEFAULT_SONNET_MODEL: createEnvValue('MiniMax-M2', 'string'),
      ANTHROPIC_DEFAULT_OPUS_MODEL: createEnvValue('MiniMax-M2', 'string'),
      API_TIMEOUT_MS: createEnvValue('3000000', 'integer'),
      CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: createEnvValue('1', 'boolean'),
    },
    icon: 'MiniMaxLogo',
    docLink: 'https://platform.minimaxi.com/docs/guides/text-ai-coding-tools',
    configType: 'claude',
  },
  {
    name: 'Moonshot AI',
    envVariables: {
      ANTHROPIC_BASE_URL: createEnvValue('https://api.moonshot.cn/anthropic', 'string'),
      ANTHROPIC_AUTH_TOKEN: createEnvValue('', 'string'),
      ANTHROPIC_DEFAULT_HAIKU_MODEL: createEnvValue('kimi-k2-turbo-preview', 'string'),
      ANTHROPIC_DEFAULT_SONNET_MODEL: createEnvValue('kimi-k2-turbo-preview', 'string'),
      ANTHROPIC_DEFAULT_OPUS_MODEL: createEnvValue('kimi-k2-turbo-preview', 'string'),
    },
    icon: 'MoonshotLogo',
    docLink: 'https://platform.moonshot.cn/docs/guide/agent-support',
    configType: 'claude',
  },
  {
    name: 'Custom AI',
    envVariables: {
      ANTHROPIC_BASE_URL: createEnvValue('', 'string'),
      ANTHROPIC_AUTH_TOKEN: createEnvValue('', 'string'),
      ANTHROPIC_DEFAULT_HAIKU_MODEL: createEnvValue('', 'string'),
      ANTHROPIC_DEFAULT_SONNET_MODEL: createEnvValue('', 'string'),
      ANTHROPIC_DEFAULT_OPUS_MODEL: createEnvValue('', 'string'),
    },
    icon: 'OtherLogo',
    configType: 'claude',
  },
];

const DEFAULT_CODEX_TEMPLATES: ProviderTemplate[] = [
  {
    name: 'Custom Codex',
    envVariables: {
      CODEX_BASE_URL: createEnvValue('', 'string'),
      CODEX_API_KEY: createEnvValue('', 'string'),
      CODEX_MODEL: createEnvValue('gpt-5.2-codex', 'string'),
      CODEX_MODEL_PROVIDER: createEnvValue('custom', 'string'),
      CODEX_REASONING_EFFORT: createEnvValue('medium', 'string'),
    },
    icon: 'OtherLogo',
    configType: 'codex',
  },
];

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

// Global template cache
let CLAUDE_PROVIDER_TEMPLATES: ProviderTemplate[] = [...DEFAULT_CLAUDE_TEMPLATES];
let CODEX_PROVIDER_TEMPLATES: ProviderTemplate[] = [...DEFAULT_CODEX_TEMPLATES];
let templatesLoaded = false;

// Load templates from JSON file (called from main process)
export function loadTemplatesFromJson(jsonData: ProvidersJson): void {
  const claude = jsonData.claude?.map(t => convertRawTemplate(t, 'claude')) || DEFAULT_CLAUDE_TEMPLATES;
  const codex = jsonData.codex?.map(t => convertRawTemplate(t, 'codex')) || DEFAULT_CODEX_TEMPLATES;
  
  CLAUDE_PROVIDER_TEMPLATES = claude;
  CODEX_PROVIDER_TEMPLATES = codex;
  templatesLoaded = true;
}

// Async load templates from Electron main process
export async function loadTemplates(): Promise<void> {
  if (templatesLoaded) return;
  
  const isElectron = typeof window !== 'undefined' && window.electronAPI;
  if (isElectron) {
    try {
      const data = await window.electronAPI.readTemplates();
      loadTemplatesFromJson(data as ProvidersJson);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  }
  templatesLoaded = true;
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

// Combined templates for backward compatibility
export const PROVIDER_TEMPLATES: ProviderTemplate[] = [
  ...CLAUDE_PROVIDER_TEMPLATES,
  ...CODEX_PROVIDER_TEMPLATES,
];

// Re-export for compatibility (these will be updated after loadTemplates is called)
export { CLAUDE_PROVIDER_TEMPLATES, CODEX_PROVIDER_TEMPLATES };

export function inferIconFromUrl(baseUrl: string): string {
  if (!baseUrl) return 'ClaudeLogo';

  try {
    const url = new URL(baseUrl);
    const host = url.host.replace(/^www\./, '');

    // Match with template hosts first
    const allTemplates = [...CLAUDE_PROVIDER_TEMPLATES, ...CODEX_PROVIDER_TEMPLATES];
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
    const allTemplates = [...CLAUDE_PROVIDER_TEMPLATES, ...CODEX_PROVIDER_TEMPLATES];

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
