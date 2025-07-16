# BrainDrive Plugin State Example

A comprehensive example demonstrating BrainDrive's plugin state persistence functionality. This plugin showcases how to use the plugin state service for saving, restoring, and managing plugin state across page changes and browser sessions.

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
├── dist/                     # Build output (generated)
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── webpack.config.js         # Webpack Module Federation setup
├── lifecycle_manager.py      # Plugin lifecycle management
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

### 2. Development

Start the development server with hot reload:

```bash
npm start
```

This will start the development server at `http://localhost:3003` with mock BrainDrive services.

### 3. Build

Build the plugin for production:

```bash
chmod +x build.sh
./build.sh
```

Or use npm:

```bash
npm run build
```

## 🔧 Plugin State Service Features Demonstrated

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
      default: { /* default values */ }
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

## 🎯 Interactive Features

### Test Controls

- **Save State**: Manually trigger state saving
- **Restore State**: Manually trigger state restoration
- **Clear State**: Clear all saved state

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

- **Theme Service**: For theme switching
- **Page Context Service**: For page context awareness
- **Settings Service**: For configuration persistence

## 🚀 Installation

### Via BrainDrive Plugin Manager

1. Build the plugin using `./build.sh`
2. Use the BrainDrive Plugin Manager to install
3. The plugin will appear in your available plugins

### Via Lifecycle Manager

```bash
python3 lifecycle_manager.py install
```

## 🧪 Testing State Persistence

1. **Load the Plugin**: Install and load the plugin in BrainDrive
2. **Modify Test Data**: Use the interactive controls to change values
3. **Navigate Away**: Go to a different page or refresh
4. **Return to Plugin**: The state should be automatically restored
5. **Check Debug Logs**: Monitor the debug section for operation details

## 📝 Development Notes

### State Management Best Practices

1. **Configure Early**: Set up state configuration in `componentDidMount`
2. **Auto-save**: Implement auto-save for better user experience
3. **Cleanup**: Always clean up lifecycle hook subscriptions
4. **Error Handling**: Wrap state operations in try-catch blocks
5. **Validation**: Use schema validation for state integrity

### Performance Considerations

- State operations are asynchronous
- Use debouncing for frequent state changes
- Keep state size reasonable (default limit: 10KB)
- Clean up subscriptions to prevent memory leaks

## 🐛 Troubleshooting

### Plugin State Service Not Available

- Ensure BrainDrive supports plugin state service
- Check that the service is properly bridged
- Verify plugin configuration includes pluginState service

### State Not Persisting

- Check browser console for errors
- Verify state configuration is correct
- Ensure state size doesn't exceed limits
- Check that preserveKeys are properly set

### Performance Issues

- Reduce auto-save frequency with debouncing
- Minimize state size
- Use efficient state update patterns

## 📄 License

MIT License - see LICENSE file for details

## 📚 Resources

- [BrainDrive Plugin State Documentation](https://braindrive.ai/docs/plugin-state)
- [BrainDrive Plugin Development Guide](https://braindrive.ai/docs/plugins)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🆘 Support

For issues and support:
- Check the troubleshooting section above
- Review BrainDrive plugin state documentation
- Create an issue in the repository

---

**Happy State Management! 💾**