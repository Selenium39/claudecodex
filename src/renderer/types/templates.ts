// Provider Templates for ClaudeCodeX Electron

import { ProviderTemplate, createEnvValue } from './index';

// ClaudeCode Provider Templates
export const CLAUDE_PROVIDER_TEMPLATES: ProviderTemplate[] = [
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
    name: 'z.ai',
    envVariables: {
      ANTHROPIC_BASE_URL: createEnvValue('https://api.z.ai/api/anthropic', 'string'),
      ANTHROPIC_AUTH_TOKEN: createEnvValue('', 'string'),
      ANTHROPIC_DEFAULT_HAIKU_MODEL: createEnvValue('glm-4.5-air', 'string'),
      ANTHROPIC_DEFAULT_SONNET_MODEL: createEnvValue('glm-4.7', 'string'),
      ANTHROPIC_DEFAULT_OPUS_MODEL: createEnvValue('glm-4.7', 'string'),
    },
    icon: 'ZaiLogo',
    docLink: 'https://docs.z.ai/devpack/tool/claude',
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
    name: 'MiniMax.io',
    envVariables: {
      ANTHROPIC_BASE_URL: createEnvValue('https://api.minimax.io/anthropic', 'string'),
      ANTHROPIC_AUTH_TOKEN: createEnvValue('', 'string'),
      ANTHROPIC_DEFAULT_HAIKU_MODEL: createEnvValue('MiniMax-M2', 'string'),
      ANTHROPIC_DEFAULT_SONNET_MODEL: createEnvValue('MiniMax-M2', 'string'),
      ANTHROPIC_DEFAULT_OPUS_MODEL: createEnvValue('MiniMax-M2', 'string'),
      API_TIMEOUT_MS: createEnvValue('3000000', 'integer'),
      CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: createEnvValue('1', 'boolean'),
    },
    icon: 'MiniMaxLogo',
    docLink: 'https://platform.minimax.io/docs/guides/text-ai-coding-tools',
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
    name: 'Vanchin',
    envVariables: {
      ANTHROPIC_BASE_URL: createEnvValue('https://wanqing.streamlakeapi.com/api/gateway/v1/endpoints/xxx/claude-code-proxy', 'string'),
      ANTHROPIC_AUTH_TOKEN: createEnvValue('', 'string'),
      ANTHROPIC_DEFAULT_HAIKU_MODEL: createEnvValue('KAT-Coder', 'string'),
      ANTHROPIC_DEFAULT_SONNET_MODEL: createEnvValue('KAT-Coder', 'string'),
      ANTHROPIC_DEFAULT_OPUS_MODEL: createEnvValue('KAT-Coder', 'string'),
    },
    icon: 'StreamLakeLogo',
    docLink: 'https://www.streamlake.com/document/WANQING/me6ymdjrqv8lp4iq0o9',
    configType: 'claude',
  },
  {
    name: 'DeepSeek',
    envVariables: {
      ANTHROPIC_BASE_URL: createEnvValue('https://api.deepseek.com/anthropic', 'string'),
      ANTHROPIC_AUTH_TOKEN: createEnvValue('', 'string'),
      ANTHROPIC_DEFAULT_HAIKU_MODEL: createEnvValue('deepseek-chat', 'string'),
      ANTHROPIC_DEFAULT_SONNET_MODEL: createEnvValue('deepseek-chat', 'string'),
      ANTHROPIC_DEFAULT_OPUS_MODEL: createEnvValue('deepseek-chat', 'string'),
      API_TIMEOUT_MS: createEnvValue('600000', 'integer'),
      CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: createEnvValue('1', 'boolean'),
    },
    icon: 'DeepSeekLogo',
    docLink: 'https://api-docs.deepseek.com/',
    configType: 'claude',
  },
  {
    name: 'Aliyuncs',
    envVariables: {
      ANTHROPIC_BASE_URL: createEnvValue('https://dashscope.aliyuncs.com/apps/anthropic', 'string'),
      ANTHROPIC_AUTH_TOKEN: createEnvValue('', 'string'),
      ANTHROPIC_DEFAULT_HAIKU_MODEL: createEnvValue('qwen-flash', 'string'),
      ANTHROPIC_DEFAULT_SONNET_MODEL: createEnvValue('qwen-max', 'string'),
      ANTHROPIC_DEFAULT_OPUS_MODEL: createEnvValue('qwen-max', 'string'),
    },
    icon: 'AliyuncsLogo',
    docLink: 'https://help.aliyun.com/zh/model-studio/developer-reference/use-qwen-by-calling-api',
    configType: 'claude',
  },
  {
    name: 'ModelScope',
    envVariables: {
      ANTHROPIC_BASE_URL: createEnvValue('https://api-inference.modelscope.cn', 'string'),
      ANTHROPIC_AUTH_TOKEN: createEnvValue('', 'string'),
      ANTHROPIC_DEFAULT_HAIKU_MODEL: createEnvValue('Qwen/Qwen3-Coder-480B-A35B-Instruct', 'string'),
      ANTHROPIC_DEFAULT_SONNET_MODEL: createEnvValue('Qwen/Qwen3-Coder-480B-A35B-Instruct', 'string'),
      ANTHROPIC_DEFAULT_OPUS_MODEL: createEnvValue('deepseek-ai/DeepSeek-R1-0528', 'string'),
    },
    icon: 'ModelScopeLogo',
    docLink: 'https://modelscope.cn/docs/models/inference',
    configType: 'claude',
  },
  {
    name: 'PackyCode',
    envVariables: {
      ANTHROPIC_BASE_URL: createEnvValue('https://api.packycode.com', 'string'),
      ANTHROPIC_AUTH_TOKEN: createEnvValue('', 'string'),
      CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: createEnvValue('1', 'boolean'),
    },
    icon: 'PackyCodeLogo',
    docLink: 'https://www.packycode.com/docs',
    configType: 'claude',
  },
  {
    name: 'AnyRouter',
    envVariables: {
      ANTHROPIC_BASE_URL: createEnvValue('https://anyrouter.top', 'string'),
      ANTHROPIC_AUTH_TOKEN: createEnvValue('', 'string'),
    },
    icon: 'AnyRouterLogo',
    docLink: 'https://docs.anyrouter.top/',
    configType: 'claude',
  },
  {
    name: 'LongCat',
    envVariables: {
      ANTHROPIC_BASE_URL: createEnvValue('https://api.longcat.chat/anthropic', 'string'),
      ANTHROPIC_AUTH_TOKEN: createEnvValue('', 'string'),
      ANTHROPIC_DEFAULT_HAIKU_MODEL: createEnvValue('LongCat-Flash-Chat', 'string'),
      ANTHROPIC_DEFAULT_SONNET_MODEL: createEnvValue('LongCat-Flash-Chat', 'string'),
      ANTHROPIC_DEFAULT_OPUS_MODEL: createEnvValue('LongCat-Flash-Thinking', 'string'),
      CLAUDE_CODE_MAX_OUTPUT_TOKENS: createEnvValue('6000', 'integer'),
      CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: createEnvValue('1', 'boolean'),
    },
    icon: 'LongCatLogo',
    docLink: 'https://longcat.chat/platform/docs/ClaudeCode.html',
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

// Codex Provider Templates
export const CODEX_PROVIDER_TEMPLATES: ProviderTemplate[] = [
  {
    name: 'OpenAI',
    envVariables: {
      CODEX_BASE_URL: createEnvValue('https://api.openai.com/v1', 'string'),
      CODEX_API_KEY: createEnvValue('', 'string'),
      CODEX_MODEL: createEnvValue('gpt-5.2-codex', 'string'),
      CODEX_MODEL_PROVIDER: createEnvValue('openai', 'string'),
      CODEX_REASONING_EFFORT: createEnvValue('medium', 'string'),
    },
    icon: 'OpenAILogo',
    docLink: 'https://platform.openai.com/docs',
    configType: 'codex',
  },
  {
    name: 'Zhipu AI (Codex)',
    envVariables: {
      CODEX_BASE_URL: createEnvValue('https://open.bigmodel.cn/api/paas/v4', 'string'),
      CODEX_API_KEY: createEnvValue('', 'string'),
      CODEX_MODEL: createEnvValue('glm-4', 'string'),
      CODEX_MODEL_PROVIDER: createEnvValue('zhipu', 'string'),
      CODEX_REASONING_EFFORT: createEnvValue('medium', 'string'),
    },
    icon: 'ZhipuLogo',
    docLink: 'https://open.bigmodel.cn/dev/api',
    configType: 'codex',
  },
  {
    name: 'DeepSeek (Codex)',
    envVariables: {
      CODEX_BASE_URL: createEnvValue('https://api.deepseek.com/v1', 'string'),
      CODEX_API_KEY: createEnvValue('', 'string'),
      CODEX_MODEL: createEnvValue('deepseek-chat', 'string'),
      CODEX_MODEL_PROVIDER: createEnvValue('deepseek', 'string'),
      CODEX_REASONING_EFFORT: createEnvValue('medium', 'string'),
    },
    icon: 'DeepSeekLogo',
    docLink: 'https://api-docs.deepseek.com/',
    configType: 'codex',
  },
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

// Combined templates for backward compatibility
export const PROVIDER_TEMPLATES: ProviderTemplate[] = [
  ...CLAUDE_PROVIDER_TEMPLATES,
  ...CODEX_PROVIDER_TEMPLATES,
];

export function inferIconFromUrl(baseUrl: string): string {
  if (!baseUrl) return 'ClaudeLogo';

  try {
    const url = new URL(baseUrl);
    const host = url.host.replace(/^www\./, '');

    // Match with template hosts first
    for (const template of PROVIDER_TEMPLATES) {
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

    return PROVIDER_TEMPLATES.find((template) => {
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
