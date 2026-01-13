// Main App Component

import React, { useState } from 'react';
import { Provider, AppView } from './types';
import { useProviderStore } from './hooks/useProviderStore';
import { ProviderRow, DefaultProviderRow } from './components/ProviderRow';
import { AddEditProviderView } from './components/AddEditProviderView';
import { ProviderIcon } from './components/ProviderIcon';
import AppIcon from './assets/Icon.png';
import './App.css';

const isElectron = typeof window !== 'undefined' && window.electronAPI;

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>({ type: 'main' });
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  const {
    providers,
    activeProvider,
    configType,
    loading,
    addProvider,
    updateProvider,
    deleteProvider,
    activateProvider,
    deactivateAllProviders,
    checkTokenDuplicate,
    switchConfigType,
  } = useProviderStore();

  const isDefaultActive = !activeProvider;

  const handleAddProvider = (provider: Provider) => {
    addProvider(provider);
    setCurrentView({ type: 'main' });
  };

  const handleUpdateProvider = async (provider: Provider) => {
    const wasActive = providers.find((p) => p.id === provider.id)?.isActive;
    updateProvider(provider);

    // If editing active provider, sync to config
    if (wasActive && isElectron) {
      const oldManagedKeys = activeProvider
        ? Object.keys(activeProvider.envVariables)
        : [];
      await window.electronAPI.updateEnv(provider.envVariables, oldManagedKeys);
    }

    setCurrentView({ type: 'main' });
  };

  const handleDeleteProvider = async (provider: Provider) => {
    const wasActive = provider.isActive;
    deleteProvider(provider);

    if (wasActive) {
      await deactivateAllProviders();
    }
  };

  const handleQuit = () => {
    if (isElectron) {
      window.electronAPI.quitApp();
    }
  };

  const handleDonate = () => {
    if (isElectron) {
      window.electronAPI.openExternal('https://ko-fi.com/Selenium39');
    }
  };

  if (loading) {
    return (
      <div className="app loading">
        <div className="spinner" />
      </div>
    );
  }

  // Render Add/Edit view
  if (currentView.type === 'add') {
    return (
      <div className="app">
        <AddEditProviderView
          provider={null}
          configType={configType}
          onSave={handleAddProvider}
          onCancel={() => setCurrentView({ type: 'main' })}
          onCheckDuplicate={checkTokenDuplicate}
        />
      </div>
    );
  }

  if (currentView.type === 'edit') {
    return (
      <div className="app">
        <AddEditProviderView
          provider={currentView.provider}
          configType={configType}
          onSave={handleUpdateProvider}
          onCancel={() => setCurrentView({ type: 'main' })}
          onCheckDuplicate={checkTokenDuplicate}
        />
      </div>
    );
  }

  // Main view
  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <ProviderIcon
            icon={activeProvider?.icon || (configType === 'codex' ? 'OpenAILogo' : 'ClaudeLogo')}
            size={32}
          />
          <span className="header-title">
            {activeProvider?.name || (configType === 'codex' ? 'Codex Default' : 'Claude Default')}
          </span>
        </div>
        <div className="header-right">
          <button
            className="config-type-button"
            onClick={() => switchConfigType(configType === 'claude' ? 'codex' : 'claude')}
            title={`Switch to ${configType === 'claude' ? 'Codex' : 'ClaudeCode'}`}
          >
            <img src={AppIcon} alt="Switch" width={20} height={20} />
          </button>
          <button
            className="add-button"
            onClick={() => setCurrentView({ type: 'add' })}
          >
            +
          </button>
        </div>
      </div>

      {/* Provider List */}
      <div className="provider-list">
        <DefaultProviderRow
          isActive={isDefaultActive}
          configType={configType}
          onActivate={deactivateAllProviders}
        />
        {providers.map((provider) => (
          <ProviderRow
            key={provider.id}
            provider={provider}
            isActive={provider.isActive}
            onActivate={() => activateProvider(provider)}
            onEdit={() => setCurrentView({ type: 'edit', provider })}
            onDelete={() => handleDeleteProvider(provider)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="footer">
        <button
          className="footer-button donate"
          onClick={handleDonate}
          title="Buy me a coffee"
        >
          ☕
        </button>
        <span className="version">ClaudeCodeX v1.0.0</span>
        <button
          className="footer-button quit"
          onClick={() => setShowQuitConfirm(true)}
          title="Quit"
        >
          ⏻
        </button>
      </div>

      {/* Quit Confirmation */}
      {showQuitConfirm && (
        <div className="modal-overlay">
          <div className="modal quit-modal">
            <p>Quit ClaudeCodeX now?</p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowQuitConfirm(false)}
              >
                No
              </button>
              <button className="btn btn-danger" onClick={handleQuit}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
