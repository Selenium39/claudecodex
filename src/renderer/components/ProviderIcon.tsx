// Provider Icon Component

import React from 'react';

// Import all logo images
import ClaudeLogo from '../assets/ClaudeLogo.svg';
import OpenAILogo from '../assets/OpenAILogo.svg';
import ZhipuLogo from '../assets/ZhipuLogo.svg';
import ZaiLogo from '../assets/ZaiLogo.svg';
import MoonshotLogo from '../assets/MoonshotLogo.svg';
import DeepSeekLogo from '../assets/DeepSeekLogo.svg';
import StreamLakeLogo from '../assets/StreamLakeLogo.svg';
import AliyuncsLogo from '../assets/AliyuncsLogo.svg';
import ModelScopeLogo from '../assets/ModelScopeLogo.svg';
import PackyCodeLogo from '../assets/PackyCodeLogo.svg';
import AnyRouterLogo from '../assets/AnyRouterLogo.svg';
import LongCatLogo from '../assets/LongCatLogo.svg';
import MiniMaxLogo from '../assets/MiniMaxLogo.svg';
import OtherLogo from '../assets/OtherLogo.svg';

const logoMap: Record<string, string> = {
  ClaudeLogo,
  OpenAILogo,
  ZhipuLogo,
  ZaiLogo,
  MoonshotLogo,
  DeepSeekLogo,
  StreamLakeLogo,
  AliyuncsLogo,
  ModelScopeLogo,
  PackyCodeLogo,
  AnyRouterLogo,
  LongCatLogo,
  MiniMaxLogo,
  OtherLogo,
};

interface ProviderIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export const ProviderIcon: React.FC<ProviderIconProps> = ({
  icon,
  size = 24,
  className = '',
}) => {
  const logoSrc = logoMap[icon] || logoMap.OtherLogo;

  return (
    <img
      src={logoSrc}
      alt={icon}
      width={size}
      height={size}
      className={`provider-icon ${className}`}
      style={{ objectFit: 'contain' }}
    />
  );
};
