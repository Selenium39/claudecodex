// Add/Edit Provider View Component

import React, { useState, useEffect } from 'react';
import {
  Provider,
  EnvValue,
  EnvValueType,
  TokenCheckResult,
  getEnvKeyInfo,
  createEnvValue,
  ConfigType,
  ProviderTemplate,
} from '../types';
import { 
  getTemplatesByType,
  loadTemplates,
  inferIconFromUrl 
} from '../types/templates';
import './AddEditProviderView.css';

interface AddEditProviderViewProps {
  provider: Provider | null;
  configType: ConfigType;
  onSave: (provider: Provider) => void;
  onCancel: () => void;
  onCheckDuplicate: (
    token: string,
    baseURL: string,
    excludingID?: string
  ) => TokenCheckResult;
}

export const AddEditProviderView: React.FC<AddEditProviderViewProps> = ({
  provider,
  configType,
  onSave,
  onCancel,
  onCheckDuplicate,
}) => {
  const isEditing = provider !== null;

  // State for templates (loaded dynamically)
  const [templates, setTemplates] = useState<ProviderTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);

  // Initialize state based on whether we're editing or adding
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [providerName, setProviderName] = useState('');
  const [envVariables, setEnvVariables] = useState<Record<string, EnvValue>>({});
  const [baseTemplateKeys, setBaseTemplateKeys] = useState<Set<string>>(new Set());
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicateResult, setDuplicateResult] = useState<TokenCheckResult | null>(null);

  // Load templates on mount
  useEffect(() => {
    const initTemplates = async () => {
      await loadTemplates();
      const loadedTemplates = getTemplatesByType(configType);
      setTemplates(loadedTemplates);
      setTemplatesLoading(false);
    };
    initTemplates();
  }, [configType]);

  // Custom variable state
  const [showAddCustomVar, setShowAddCustomVar] = useState(false);
  const [newCustomKey, setNewCustomKey] = useState('');
  const [newCustomValue, setNewCustomValue] = useState('');
  const [newCustomType, setNewCustomType] = useState<EnvValueType>('string');

  // Password visibility state
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const togglePasswordVisibility = (key: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    if (templatesLoading || templates.length === 0) return;
    
    if (isEditing && provider) {
      setProviderName(provider.name);
      setEnvVariables(provider.envVariables);
      setBaseTemplateKeys(new Set(Object.keys(provider.envVariables)));
    } else {
      const firstTemplate = templates[0];
      setProviderName(firstTemplate.name);
      setEnvVariables(firstTemplate.envVariables);
      setBaseTemplateKeys(new Set(Object.keys(firstTemplate.envVariables)));
    }
  }, [provider, isEditing, templates, templatesLoading]);

  const handleTemplateChange = (index: number) => {
    setSelectedTemplateIndex(index);
    const template = templates[index];
    if (!template) return;

    // Use the new template's env variables directly (no merging)
    // This ensures model configs from previous template don't carry over
    setProviderName(template.name);
    setEnvVariables(template.envVariables);
    setBaseTemplateKeys(new Set(Object.keys(template.envVariables)));
  };

  const handleEnvChange = (key: string, value: string) => {
    setEnvVariables((prev) => ({
      ...prev,
      [key]: { ...prev[key], value },
    }));
  };

  const handleBooleanChange = (key: string, checked: boolean) => {
    setEnvVariables((prev) => ({
      ...prev,
      [key]: { value: checked ? '1' : '0', type: 'boolean' },
    }));
  };

  const handleAddCustomVar = () => {
    if (newCustomKey) {
      setEnvVariables((prev) => ({
        ...prev,
        [newCustomKey]: createEnvValue(newCustomValue, newCustomType),
      }));
      setNewCustomKey('');
      setNewCustomValue('');
      setNewCustomType('string');
      setShowAddCustomVar(false);
    }
  };

  const handleRemoveCustomVar = (key: string) => {
    setEnvVariables((prev) => {
      const newVars = { ...prev };
      delete newVars[key];
      return newVars;
    });
  };

  const isSaveDisabled = configType === 'codex'
    ? (!providerName ||
       !envVariables.CODEX_BASE_URL?.value ||
       !envVariables.CODEX_API_KEY?.value)
    : (!providerName ||
       !envVariables.ANTHROPIC_BASE_URL?.value ||
       !envVariables.ANTHROPIC_AUTH_TOKEN?.value);

  const handleSave = () => {
    if (configType === 'claude') {
      const token = envVariables.ANTHROPIC_AUTH_TOKEN?.value || '';
      const baseURL = envVariables.ANTHROPIC_BASE_URL?.value || '';
      const result = onCheckDuplicate(token, baseURL, provider?.id);

      if (result.type !== 'unique') {
        setDuplicateResult(result);
        setShowDuplicateWarning(true);
        return;
      }
    }

    saveProvider();
  };

  const saveProvider = () => {
    // Filter out empty model env variables
    const cleanedEnvVariables = { ...envVariables };
    const modelKeys = configType === 'codex'
      ? ['CODEX_MODEL', 'CODEX_MODEL_PROVIDER', 'CODEX_REASONING_EFFORT']
      : [
          'ANTHROPIC_DEFAULT_HAIKU_MODEL',
          'ANTHROPIC_DEFAULT_SONNET_MODEL',
          'ANTHROPIC_DEFAULT_OPUS_MODEL',
        ];
    for (const key of modelKeys) {
      if (cleanedEnvVariables[key] && !cleanedEnvVariables[key].value) {
        delete cleanedEnvVariables[key];
      }
    }

    const baseUrlKey = configType === 'codex' ? 'CODEX_BASE_URL' : 'ANTHROPIC_BASE_URL';
    const newProvider: Provider = {
      id: provider?.id || crypto.randomUUID(),
      name: providerName || 'Untitled Provider',
      envVariables: cleanedEnvVariables,
      icon: provider?.icon || inferIconFromUrl(cleanedEnvVariables[baseUrlKey]?.value || ''),
      isActive: provider?.isActive || false,
      configType: configType,
    };

    onSave(newProvider);
  };

  const templateKeys = Object.keys(envVariables).filter((key) =>
    baseTemplateKeys.has(key)
  );
  const customKeys = Object.keys(envVariables).filter(
    (key) => !baseTemplateKeys.has(key)
  );

  return (
    <div className="add-edit-view">
      {/* Header */}
      <div className="view-header">
        <button className="back-button" onClick={onCancel}>
          ←
        </button>
        <h2>{isEditing ? 'Edit Provider' : 'Add Provider'}</h2>
        <button
          className="save-button"
          onClick={handleSave}
          disabled={isSaveDisabled}
        >
          ✓ Save
        </button>
      </div>

      {/* Content */}
      <div className="view-content">
        {/* Template Picker (only for adding) */}
        {!isEditing && (
          <div className="form-group">
            <label>Provider Template</label>
            <select
              value={selectedTemplateIndex}
              onChange={(e) => handleTemplateChange(Number(e.target.value))}
              className="template-select"
            >
              {templates.map((template, index) => (
                <option key={template.name} value={index}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Provider Name */}
        <div className="form-group">
          <label>Provider Name</label>
          <input
            type="text"
            value={providerName}
            onChange={(e) => setProviderName(e.target.value)}
            placeholder="Enter provider name"
            className="form-input"
          />
        </div>

        {/* Template Environment Variables */}
        {templateKeys.map((key) => {
          const envKeyInfo = getEnvKeyInfo(key);
          const envValue = envVariables[key];

          if (!envValue) return null;

          if (envValue.type === 'boolean') {
            return (
              <div className="form-group" key={key}>
                <label>{envKeyInfo?.displayName || key}</label>
                <div className="toggle-wrapper">
                  <input
                    type="checkbox"
                    checked={envValue.value === '1' || envValue.value === 'true'}
                    onChange={(e) => handleBooleanChange(key, e.target.checked)}
                    className="toggle-input"
                  />
                  <span className="toggle-label">
                    {envValue.value === '1' ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            );
          }

          const isPasswordField = key === 'ANTHROPIC_AUTH_TOKEN' || key === 'CODEX_API_KEY';
          return (
            <div className="form-group" key={key}>
              <label>
                {envKeyInfo?.displayName || key}
                {(key === 'ANTHROPIC_BASE_URL' || key === 'ANTHROPIC_AUTH_TOKEN' ||
                  key === 'CODEX_BASE_URL' || key === 'CODEX_API_KEY') && (
                  <span className="required">*</span>
                )}
              </label>
              <div className="input-wrapper">
                <input
                  type={isPasswordField && !showPasswords[key] ? 'password' : 'text'}
                  value={envValue.value}
                  onChange={(e) => handleEnvChange(key, e.target.value)}
                  placeholder={envKeyInfo?.placeholder || ''}
                  className="form-input"
                />
                {isPasswordField && (
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility(key)}
                    tabIndex={-1}
                  >
                    {showPasswords[key] ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Custom Variables */}
        {customKeys.length > 0 && (
          <div className="custom-vars-section">
            <h3>Custom Variables</h3>
            {customKeys.map((key) => {
              const envValue = envVariables[key];
              return (
                <div className="custom-var-row" key={key}>
                  <div className="custom-var-header">
                    <span className="custom-var-key">{key}</span>
                    <span className="custom-var-type">{envValue.type}</span>
                    <button
                      className="remove-var-button"
                      onClick={() => handleRemoveCustomVar(key)}
                    >
                      ✕
                    </button>
                  </div>
                  {envValue.type === 'boolean' ? (
                    <input
                      type="checkbox"
                      checked={envValue.value === '1'}
                      onChange={(e) => handleBooleanChange(key, e.target.checked)}
                    />
                  ) : (
                    <input
                      type="text"
                      value={envValue.value}
                      onChange={(e) => handleEnvChange(key, e.target.value)}
                      className="form-input"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Add Custom Variable Button */}
        <button
          className="add-custom-var-button"
          onClick={() => setShowAddCustomVar(true)}
        >
          + Add Custom Variable
        </button>

        {/* Add Custom Variable Modal */}
        {showAddCustomVar && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Add Custom Variable</h3>
              <div className="form-group">
                <label>Key</label>
                <input
                  type="text"
                  value={newCustomKey}
                  onChange={(e) => setNewCustomKey(e.target.value)}
                  placeholder="CUSTOM_ENV_KEY"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={newCustomType}
                  onChange={(e) => setNewCustomType(e.target.value as EnvValueType)}
                  className="form-input"
                >
                  <option value="string">String</option>
                  <option value="integer">Integer</option>
                  <option value="boolean">Boolean</option>
                </select>
              </div>
              <div className="form-group">
                <label>Value</label>
                {newCustomType === 'boolean' ? (
                  <input
                    type="checkbox"
                    checked={newCustomValue === '1'}
                    onChange={(e) => setNewCustomValue(e.target.checked ? '1' : '0')}
                  />
                ) : (
                  <input
                    type="text"
                    value={newCustomValue}
                    onChange={(e) => setNewCustomValue(e.target.value)}
                    placeholder={newCustomType === 'integer' ? '123' : 'value'}
                    className="form-input"
                  />
                )}
              </div>
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAddCustomVar(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleAddCustomVar}
                  disabled={!newCustomKey}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Duplicate Warning Modal */}
        {showDuplicateWarning && duplicateResult && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Token Already in Use</h3>
              <p>
                {duplicateResult.type === 'duplicateWithSameURL' && 'provider' in duplicateResult
                  ? `This token is already used by "${duplicateResult.provider.name}" with the same URL.`
                  : duplicateResult.type === 'duplicateWithDifferentURL' && 'provider' in duplicateResult
                  ? `This token is already used by "${duplicateResult.provider.name}" with a different URL.`
                  : 'Token conflict detected.'}
              </p>
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDuplicateWarning(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowDuplicateWarning(false);
                    saveProvider();
                  }}
                >
                  Save Anyway
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
