import * as React from 'react';
import './PluginStateTest.css';
import { Services } from './types';

interface TestData {
  counter: number;
  textInput: string;
  checkboxValue: boolean;
  selectValue: string;
  timestamp: string;
}

interface PluginStateTestProps {
  moduleId?: string;
  pluginId?: string;
  instanceId?: string;
  services: Services;
  title?: string;
  description?: string;
  config?: any;
}

interface PluginStateTestState {
  // Test data that will be persisted
  testData: TestData;
  
  // UI state
  isLoading: boolean;
  error: string;
  currentTheme: string;
  isInitializing: boolean;
  
  // State management info
  isStateConfigured: boolean;
  lastSaveTime: string | null;
  lastRestoreTime: string | null;
  saveCount: number;
  restoreCount: number;
  
  // Debug info
  debugLogs: string[];
}

/**
 * Plugin State Test Component
 * 
 * This component demonstrates and tests the BrainDrive plugin state persistence functionality.
 * It provides a comprehensive interface for testing state save, restore, and clear operations.
 */
class PluginStateTest extends React.Component<PluginStateTestProps, PluginStateTestState> {
  private themeChangeListener: ((theme: string) => void) | null = null;
  private pageContextUnsubscribe: (() => void) | null = null;
  private saveStateUnsubscribe: (() => void) | null = null;
  private restoreStateUnsubscribe: (() => void) | null = null;
  private clearStateUnsubscribe: (() => void) | null = null;

  constructor(props: PluginStateTestProps) {
    super(props);
    
    this.state = {
      testData: {
        counter: 0,
        textInput: '',
        checkboxValue: false,
        selectValue: 'option1',
        timestamp: new Date().toISOString()
      },
      isLoading: false,
      error: '',
      currentTheme: 'light',
      isInitializing: true,
      isStateConfigured: false,
      lastSaveTime: null,
      lastRestoreTime: null,
      saveCount: 0,
      restoreCount: 0,
      debugLogs: []
    };
  }

  async componentDidMount() {
    try {
      await this.initializeServices();
      await this.configurePluginState();
      await this.restoreState();
      this.setState({ isInitializing: false });
      this.addDebugLog('Component initialized successfully');
    } catch (error) {
      console.error('PluginStateTest: Failed to initialize:', error);
      this.setState({ 
        error: 'Failed to initialize plugin state test',
        isInitializing: false 
      });
      this.addDebugLog(`Initialization failed: ${error}`);
    }
  }

  componentWillUnmount() {
    this.cleanupServices();
  }

  private addDebugLog(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    
    this.setState(prevState => ({
      debugLogs: [...prevState.debugLogs.slice(-19), logEntry] // Keep last 20 logs
    }));
  }

  /**
   * Initialize BrainDrive services
   */
  private async initializeServices(): Promise<void> {
    const { services } = this.props;

    // Initialize theme service
    if (services.theme) {
      const currentTheme = services.theme.getCurrentTheme();
      this.setState({ currentTheme });

      this.themeChangeListener = (theme: string) => {
        this.setState({ currentTheme: theme });
        this.addDebugLog(`Theme changed to: ${theme}`);
      };
      services.theme.addThemeChangeListener(this.themeChangeListener);
      this.addDebugLog('Theme service initialized');
    }

    // Initialize page context service
    if (services.pageContext) {
      this.pageContextUnsubscribe = services.pageContext.onPageContextChange((context) => {
        this.addDebugLog(`Page context changed: ${context.pageId}`);
      });
      this.addDebugLog('Page context service initialized');
    }
  }

  /**
   * Configure plugin state management
   */
  private async configurePluginState(): Promise<void> {
    const { services } = this.props;
    
    if (!services.pluginState) {
      throw new Error('Plugin state service not available');
    }

    // Configure the plugin state service
    services.pluginState.configure({
      pluginId: 'PluginState',
      stateStrategy: 'session',
      preserveKeys: ['testData', 'saveCount', 'restoreCount'],
      stateSchema: {
        testData: {
          type: 'object',
          required: false,
          default: {
            counter: 0,
            textInput: '',
            checkboxValue: false,
            selectValue: 'option1',
            timestamp: new Date().toISOString()
          }
        },
        saveCount: { type: 'number', required: false, default: 0 },
        restoreCount: { type: 'number', required: false, default: 0 }
      },
      maxStateSize: 10240 // 10KB
    });

    // Set up lifecycle hooks
    this.saveStateUnsubscribe = services.pluginState.onSave((state) => {
      this.addDebugLog(`State saved: ${JSON.stringify(state).substring(0, 100)}...`);
    });

    this.restoreStateUnsubscribe = services.pluginState.onRestore((state) => {
      this.addDebugLog(`State restored: ${JSON.stringify(state).substring(0, 100)}...`);
    });

    this.clearStateUnsubscribe = services.pluginState.onClear(() => {
      this.addDebugLog('State cleared');
    });

    this.setState({ isStateConfigured: true });
    this.addDebugLog('Plugin state configured successfully');
  }

  /**
   * Clean up services and listeners
   */
  private cleanupServices(): void {
    const { services } = this.props;

    if (services.theme && this.themeChangeListener) {
      services.theme.removeThemeChangeListener(this.themeChangeListener);
    }

    if (this.pageContextUnsubscribe) {
      this.pageContextUnsubscribe();
    }

    if (this.saveStateUnsubscribe) {
      this.saveStateUnsubscribe();
    }

    if (this.restoreStateUnsubscribe) {
      this.restoreStateUnsubscribe();
    }

    if (this.clearStateUnsubscribe) {
      this.clearStateUnsubscribe();
    }

    this.addDebugLog('Services cleaned up');
  }

  /**
   * Save current state
   */
  private async saveState(): Promise<void> {
    const { services } = this.props;
    
    if (!services.pluginState) {
      this.addDebugLog('ERROR: Plugin state service not available for save');
      return;
    }

    try {
      this.setState({ isLoading: true });
      
      const stateToSave = {
        testData: this.state.testData,
        saveCount: this.state.saveCount + 1,
        restoreCount: this.state.restoreCount
      };

      await services.pluginState.saveState(stateToSave);
      
      this.setState({
        isLoading: false,
        lastSaveTime: new Date().toLocaleTimeString(),
        saveCount: this.state.saveCount + 1
      });
      
      this.addDebugLog('State saved successfully');
    } catch (error) {
      this.setState({ 
        isLoading: false,
        error: `Failed to save state: ${error}` 
      });
      this.addDebugLog(`Save failed: ${error}`);
    }
  }

  /**
   * Restore state from storage
   */
  private async restoreState(): Promise<void> {
    const { services } = this.props;
    
    if (!services.pluginState) {
      this.addDebugLog('ERROR: Plugin state service not available for restore');
      return;
    }

    try {
      this.setState({ isLoading: true });
      
      const restoredState = await services.pluginState.getState();
      
      if (restoredState) {
        this.setState({
          testData: restoredState.testData || this.state.testData,
          saveCount: restoredState.saveCount || 0,
          restoreCount: (restoredState.restoreCount || 0) + 1,
          lastRestoreTime: new Date().toLocaleTimeString(),
          isLoading: false
        });
        this.addDebugLog('State restored successfully');
      } else {
        this.setState({ isLoading: false });
        this.addDebugLog('No saved state found');
      }
    } catch (error) {
      this.setState({ 
        isLoading: false,
        error: `Failed to restore state: ${error}` 
      });
      this.addDebugLog(`Restore failed: ${error}`);
    }
  }

  /**
   * Clear saved state
   */
  private async clearState(): Promise<void> {
    const { services } = this.props;
    
    if (!services.pluginState) {
      this.addDebugLog('ERROR: Plugin state service not available for clear');
      return;
    }

    try {
      this.setState({ isLoading: true });
      
      await services.pluginState.clearState();
      
      // Reset to default state
      this.setState({
        testData: {
          counter: 0,
          textInput: '',
          checkboxValue: false,
          selectValue: 'option1',
          timestamp: new Date().toISOString()
        },
        saveCount: 0,
        restoreCount: 0,
        lastSaveTime: null,
        lastRestoreTime: null,
        isLoading: false
      });
      
      this.addDebugLog('State cleared successfully');
    } catch (error) {
      this.setState({ 
        isLoading: false,
        error: `Failed to clear state: ${error}` 
      });
      this.addDebugLog(`Clear failed: ${error}`);
    }
  }

  /**
   * Update test data and auto-save
   */
  private updateTestData = (updates: Partial<TestData>) => {
    this.setState(prevState => ({
      testData: {
        ...prevState.testData,
        ...updates,
        timestamp: new Date().toISOString()
      }
    }), () => {
      // Auto-save after state update
      this.saveState();
    });
  };

  /**
   * Increment counter
   */
  private incrementCounter = () => {
    this.updateTestData({ counter: this.state.testData.counter + 1 });
  };

  /**
   * Decrement counter
   */
  private decrementCounter = () => {
    this.updateTestData({ counter: this.state.testData.counter - 1 });
  };

  /**
   * Handle text input change
   */
  private handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.updateTestData({ textInput: e.target.value });
  };

  /**
   * Handle checkbox change
   */
  private handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.updateTestData({ checkboxValue: e.target.checked });
  };

  /**
   * Handle select change
   */
  private handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.updateTestData({ selectValue: e.target.value });
  };

  /**
   * Render loading state
   */
  private renderLoading(): JSX.Element {
    return (
      <div className="plugin-template-loading">
        <div className="loading-spinner"></div>
        <p>Loading Plugin State Test...</p>
      </div>
    );
  }

  /**
   * Render error state
   */
  private renderError(): JSX.Element {
    return (
      <div className="plugin-template-error">
        <div className="error-icon">⚠️</div>
        <p>{this.state.error}</p>
        <button onClick={() => this.setState({ error: '' })}>
          Clear Error
        </button>
      </div>
    );
  }

  /**
   * Render main plugin content
   */
  private renderContent(): JSX.Element {
    const { title = "Plugin State Test", description = "Test plugin state persistence functionality" } = this.props;
    const { testData, isStateConfigured, lastSaveTime, lastRestoreTime, saveCount, restoreCount, debugLogs } = this.state;

    return (
      <div className="plugin-template-content">
        <div className="plugin-header">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>

        {/* State Management Status */}
        <div className="plugin-info">
          <h4>State Management Status</h4>
          <div className="info-grid">
            <div className="info-item">
              <strong>State Configured:</strong> {isStateConfigured ? '✅ Yes' : '❌ No'}
            </div>
            <div className="info-item">
              <strong>Last Save:</strong> {lastSaveTime || 'Never'}
            </div>
            <div className="info-item">
              <strong>Last Restore:</strong> {lastRestoreTime || 'Never'}
            </div>
            <div className="info-item">
              <strong>Save Count:</strong> {saveCount}
            </div>
            <div className="info-item">
              <strong>Restore Count:</strong> {restoreCount}
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="plugin-info">
          <h4>Test Controls</h4>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button onClick={() => this.saveState()} disabled={this.state.isLoading}>
              💾 Save State
            </button>
            <button onClick={() => this.restoreState()} disabled={this.state.isLoading}>
              📥 Restore State
            </button>
            <button onClick={() => this.clearState()} disabled={this.state.isLoading}>
              🗑️ Clear State
            </button>
          </div>
        </div>

        {/* Test Data */}
        <div className="plugin-info">
          <h4>Test Data (Auto-saves on change)</h4>
          <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            
            {/* Counter */}
            <div>
              <label><strong>Counter:</strong> {testData.counter}</label>
              <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                <button onClick={this.decrementCounter}>-</button>
                <button onClick={this.incrementCounter}>+</button>
              </div>
            </div>

            {/* Text Input */}
            <div>
              <label><strong>Text Input:</strong></label>
              <input
                type="text"
                value={testData.textInput}
                onChange={this.handleTextChange}
                placeholder="Type something..."
                style={{ width: '100%', marginTop: '5px' }}
              />
            </div>

            {/* Checkbox */}
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={testData.checkboxValue}
                  onChange={this.handleCheckboxChange}
                />
                <strong> Checkbox Value</strong>
              </label>
            </div>

            {/* Select */}
            <div>
              <label><strong>Select Value:</strong></label>
              <select
                value={testData.selectValue}
                onChange={this.handleSelectChange}
                style={{ width: '100%', marginTop: '5px' }}
              >
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </div>

            {/* Timestamp */}
            <div>
              <label><strong>Last Updated:</strong></label>
              <div style={{ fontSize: '0.9em', marginTop: '5px' }}>
                {new Date(testData.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Debug Logs */}
        <div className="plugin-info">
          <h4>Debug Logs</h4>
          <div style={{ 
            height: '200px', 
            overflow: 'auto', 
            backgroundColor: '#f5f5f5', 
            padding: '10px', 
            fontFamily: 'monospace',
            fontSize: '0.8em',
            border: '1px solid #ddd'
          }}>
            {debugLogs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="plugin-info">
          <h4>Testing Instructions</h4>
          <ol>
            <li>Modify the test data above (counter, text, checkbox, select)</li>
            <li>Data is automatically saved on each change</li>
            <li>Navigate to another page and come back</li>
            <li>Verify that your data is restored</li>
            <li>Use the manual Save/Restore/Clear buttons to test operations</li>
            <li>Check the debug logs for detailed operation information</li>
          </ol>
        </div>
      </div>
    );
  }

  render(): JSX.Element {
    const { currentTheme, isInitializing, error } = this.state;

    return (
      <div className={`plugin-template ${currentTheme === 'dark' ? 'dark-theme' : ''}`}>
        {isInitializing ? (
          this.renderLoading()
        ) : error ? (
          this.renderError()
        ) : (
          this.renderContent()
        )}
      </div>
    );
  }
}

export default PluginStateTest;