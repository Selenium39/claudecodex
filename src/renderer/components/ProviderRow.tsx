// Provider Row Component

import React, { useState } from 'react';
import { Provider, ConfigType } from '../types';
import { ProviderIcon } from './ProviderIcon';
import './ProviderRow.css';

interface ProviderRowProps {
  provider: Provider;
  isActive: boolean;
  onActivate: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProviderRow: React.FC<ProviderRowProps> = ({
  provider,
  isActive,
  onActivate,
  onEdit,
  onDelete,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleClick = () => {
    if (!isActive) {
      onActivate();
    }
  };

  return (
    <div
      className={`provider-row ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <div className="provider-info">
        <ProviderIcon icon={provider.icon} size={16} />
        <div className="provider-details">
          <span className="provider-name">{provider.name}</span>
          <span className="provider-url">
            {provider.envVariables.ANTHROPIC_BASE_URL?.value || 
             provider.envVariables.CODEX_BASE_URL?.value || ''}
          </span>
        </div>
      </div>

      <div className="provider-actions">
        <button
          className="icon-button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          title="Edit Provider"
        >
          ℹ️
        </button>
        <button
          className="icon-button delete"
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteConfirm(true);
          }}
          title="Delete Provider"
        >
          −
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="delete-confirm">
            <h4>Delete Provider</h4>
            <p>Are you sure you want to delete "{provider.name}"?</p>
            <div className="delete-confirm-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  onDelete();
                  setShowDeleteConfirm(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface DefaultProviderRowProps {
  isActive: boolean;
  configType: ConfigType;
  onActivate: () => void;
}

export const DefaultProviderRow: React.FC<DefaultProviderRowProps> = ({
  isActive,
  configType,
  onActivate,
}) => {
  const handleClick = () => {
    if (!isActive) {
      onActivate();
    }
  };

  const isCodex = configType === 'codex';
  const icon = isCodex ? 'OpenAILogo' : 'ClaudeLogo';
  const name = isCodex ? 'Codex Default' : 'Claude Default';
  const description = isCodex 
    ? 'Login with OpenAI account' 
    : 'Login with Claude (Console) account';

  return (
    <div
      className={`provider-row ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <div className="provider-info">
        <ProviderIcon icon={icon} size={16} />
        <div className="provider-details">
          <span className="provider-name">{name}</span>
          <span className="provider-url">{description}</span>
        </div>
      </div>

      <div className="provider-actions" />
    </div>
  );
};
