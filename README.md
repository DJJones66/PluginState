# BrainDrive Plugin State Example

A comprehensive example plugin demonstrating BrainDrive's plugin state persistence functionality. This plugin showcases how to use the plugin state service for saving, restoring, and managing plugin state across page changes and browser sessions.

## 🚀 Features

- **Plugin State Service Integration**: Complete demonstration of BrainDrive's plugin state management
- **State Persistence**: Automatic state saving and restoration using session storage
- **Lifecycle Hooks**: Examples of onSave, onRestore, and onClear callbacks
- **Interactive Testing**: Real-time state manipulation with immediate persistence
- **Debug Logging**: Comprehensive logging system for state operations
- **Auto-save**: Automatic state saving on data changes
- **State Validation**: Schema-based state validation and sanitization
- **Theme Support**: Automatic light/dark theme switching
- **TypeScript**: Full TypeScript support with proper type definitions

## 📁 Project Structure

```
PluginState/
├── src/
│   ├── PluginStateTest.tsx    # Main plugin component with state examples
│   ├── PluginStateTest.css    # Theme-aware styles
│   ├── types.ts              # TypeScript type definitions
│   ├── utils.ts              # Utility functions for state management
│   └── index.tsx             # Entry point
├── public/
│   └── index.html            # Development HTML template
├── references/               # Documentation and reference files
├── dist/                     # Build output (generated)
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── webpack.config.js         # Webpack Module Federation setup
├── lifecycle_manager.py      # Plugin lifecycle management
├── DEVELOPMENT.md           # Development notes
└── README.md                # This file
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 16+
- npm 7+
- Python 3.8+ (for lifecycle management)
- BrainDrive with plugin state service enabled

### 1. Install Dependencies

```bash
npm install
```

### 2. Build for Production

Build the plugin for production deployment:

```bash
npm run build
```

The build output will be in the `dist/` directory with `remoteEntry.js` as the main bundle.

### 3. Clean Build Directory

```bash
npm run clean
```

## 🔧 Plugin Configuration

### Plugin Metadata

The plugin is configured in [`lifecycle_manager.py`](lifecycle_manager.py) with the following metadata:

```python
plugin_data = {
    "name": "PluginState",
    "description": "A test plugin demonstrating BrainDrive plugin state persistence",
    "version": "1.0.0",
    "type": "frontend",
    "icon": "Save",
    "category": "testing",
    "official": True,
    "author": "BrainDrive",
    "bundle_method": "webpack",
    "bundle_location": "dist/remoteEntry.js",
    "permissions": ["storage.read", "storage.write", "api.access", "state.manage"]
}
```

### Module Configuration

The plugin exposes a single module `PluginStateTest` with the following configuration:

```python
module_data = {
    "name": "PluginStateTest",
    "display_name": "Plugin State Test",
    "description": "A comprehensive test component for plugin state persistence",
    "icon": "Save",
    "category": "testing",
    "required_services": {
        "api": {"methods": ["get", "post"], "version": "1.0.0"},
        "theme": {"methods": ["getCurrentTheme", "addThemeChangeListener"], "version": "1.0.0"},
        "settings": {"methods": ["getSetting", "setSetting"], "version": "1.0.0"},
        "event": {"methods": ["sendMessage", "subscribeToMessages"], "version": "1.0.0"},
        "pageContext": {"methods": ["getCurrentPageContext", "onPageContextChange"], "version": "1.0.0"},
        "pluginState": {"methods": ["configure", "saveState", "getState", "clearState"], "version": "1.0.0"}
    }
}
```

## 🎯 Plugin State Service Features Demonstrated

### State Configuration

The plugin demonstrates how to configure the plugin state service:

```typescript
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
```

### Lifecycle Hooks

Examples of all lifecycle hooks:

```typescript
// Save hook - called when state is saved
const saveUnsubscribe = services.pluginState.onSave((state) => {
  console.log('State saved:', state);
});

// Restore hook - called when state is restored
const restoreUnsubscribe = services.pluginState.onRestore((state) => {
  console.log('State restored:', state);
});

// Clear hook - called when state is cleared
const clearUnsubscribe = services.pluginState.onClear(() => {
  console.log('State cleared');
});
```

### State Operations

Complete examples of all state operations:

```typescript
// Save state
await services.pluginState.saveState(stateData);

// Get/restore state
const restoredState = await services.pluginState.getState();

// Clear state
await services.pluginState.clearState();
```

## 🎮 Interactive Features

### Test Controls

- **💾 Save State**: Manually trigger state saving
- **📥 Restore State**: Manually trigger state restoration
- **🗑️ Clear State**: Clear all saved state

### Test Data

The plugin includes interactive test data that demonstrates state persistence:

- **Counter**: Increment/decrement buttons with auto-save
- **Text Input**: Text field with auto-save on change
- **Checkbox**: Boolean value with auto-save
- **Select Dropdown**: Selection with auto-save
- **Timestamp**: Automatic timestamp updates

### Debug Information

Real-time display of:

- State configuration status
- Last save/restore times
- Save/restore operation counts
- Debug log with timestamped entries
- Service availability status

## 🎨 Theme Support

The plugin automatically supports BrainDrive's theme system:

- CSS variables automatically switch between light/dark themes
- Theme changes are handled via the Theme service
- Components re-render when theme changes

## 📡 Service Integration

### Plugin State Service

```typescript
// Configure the service
services.pluginState.configure(config);

// Save current state
await services.pluginState.saveState(data);

// Restore saved state
const state = await services.pluginState.getState();

// Clear saved state
await services.pluginState.clearState();

// Set up lifecycle hooks
const unsubscribe = services.pluginState.onSave(callback);
```

### Other Services

The plugin also demonstrates integration with:

- **Theme Service**: For theme switching and theme change listeners
- **Page Context Service**: For page context awareness and navigation tracking
- **Settings Service**: For configuration persistence (if needed)
- **API Service**: For potential database persistence (future enhancement)
- **Event Service**: For inter-plugin communication

## 🚀 Installation & Deployment

### Via BrainDrive Plugin Manager

1. Build the plugin:
   ```bash
   npm run build
   ```

2. Use the BrainDrive Plugin Manager to install from the built files

3. The plugin will appear in your available plugins as "Plugin State Test"

### Via Lifecycle Manager

The plugin includes a comprehensive lifecycle manager that handles:

- Plugin registration and metadata management
- Module configuration and service requirements
- Installation and uninstallation processes
- Version management and updates

```bash
# Install the plugin (when integrated with BrainDrive)
python3 lifecycle_manager.py install

# The lifecycle manager handles:
# - Plugin metadata registration
# - Module configuration
# - Service dependency validation
# - File deployment to shared plugin directory
```

## 🧪 Testing State Persistence

### Basic Testing Flow

1. **Load the Plugin**: Install and load the plugin in BrainDrive
2. **Modify Test Data**: Use the interactive controls to change values
3. **Navigate Away**: Go to a different page or refresh the browser
4. **Return to Plugin**: The state should be automatically restored
5. **Check Debug Logs**: Monitor the debug section for operation details

### Advanced Testing Scenarios

- **Cross-Page Persistence**: Navigate between different BrainDrive pages
- **Browser Refresh**: Refresh the page and verify state restoration
- **Multiple Instances**: Test with multiple plugin instances
- **Error Scenarios**: Test behavior when services are unavailable
- **Large State**: Test with large amounts of state data

## 📝 Development Notes

### State Management Best Practices

1. **Configure Early**: Set up state configuration in `componentDidMount`
2. **Auto-save**: Implement auto-save for better user experience
3. **Cleanup**: Always clean up lifecycle hook subscriptions
4. **Error Handling**: Wrap state operations in try-catch blocks
5. **Validation**: Use schema validation for state integrity

### Performance Considerations

- State operations are asynchronous
- Use debouncing for frequent state changes (implemented via utils)
- Keep state size reasonable (default limit: 10KB)
- Clean up subscriptions to prevent memory leaks

### Code Organization

- **PluginStateTest.tsx**: Main component with comprehensive state examples
- **types.ts**: TypeScript interfaces for services and data structures
- **utils.ts**: Utility functions for state management and data manipulation
- **PluginStateTest.css**: Theme-aware styling with CSS variables

## 🔮 Future Enhancements

### Database Persistence (Planned)

Currently, the plugin uses session storage for state persistence. A hybrid approach with database persistence is planned:

- **Session Storage**: Fast access, survives page refreshes
- **Database Storage**: True persistence, survives browser restarts
- **Hybrid Strategy**: Best of both worlds with intelligent fallback

See [`docs/pagecontext/hybrid-database-persistence-plan.md`](../../docs/pagecontext/hybrid-database-persistence-plan.md) for detailed implementation plans.

### Advanced Features (Future)

- Cross-device state synchronization
- State versioning and history
- Conflict resolution for concurrent modifications
- Advanced analytics and monitoring
- Custom persistence strategies

## 🐛 Troubleshooting

### Plugin State Service Not Available

- Ensure BrainDrive supports plugin state service
- Check that the service is properly bridged in the service bridge
- Verify plugin configuration includes pluginState service in required_services

### State Not Persisting

- Check browser console for errors
- Verify state configuration is correct
- Ensure state size doesn't exceed limits (10KB default)
- Check that preserveKeys are properly set in configuration

### Performance Issues

- Reduce auto-save frequency with debouncing utilities
- Minimize state size by excluding unnecessary data
- Use efficient state update patterns
- Monitor debug logs for operation timing

### Build Issues

- Ensure all dependencies are installed: `npm install`
- Check Node.js version compatibility (16+)
- Verify webpack configuration in `webpack.config.js`
- Clear build directory: `npm run clean`

## 📄 License

MIT License - see LICENSE file for details

## 📚 Resources

- [BrainDrive Plugin State Documentation](../../docs/pagecontext/plugin-state-service-guide.md)
- [BrainDrive Plugin Development Guide](../../docs/pagecontext/plugin-development-guide.md)
- [Plugin State API Reference](../../docs/pagecontext/plugin-state-api-reference.md)
- [Hybrid Database Persistence Plan](../../docs/pagecontext/hybrid-database-persistence-plan.md)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation)

## 🆘 Support

For issues and support:

- Check the troubleshooting section above
- Review BrainDrive plugin state documentation
- Examine debug logs in the plugin interface
- Create an issue in the repository

---

**Happy State Management! 💾**

*This plugin serves as both a functional example and a comprehensive test suite for BrainDrive's plugin state persistence capabilities.*