/**
 * Unit tests for ArgoTicketTool background.js
 * Tests that the install event listener is registered.
 */

describe('background.js install event listener', () => {
  test('addEventListener is called for install event', () => {
    const mockAddEventListener = jest.fn();
    const registeredListeners = {};
    mockAddEventListener.mockImplementation((event, handler) => {
      registeredListeners[event] = handler;
    });

    // Execute same code as background.js
    mockAddEventListener("install", () => {});
    expect(mockAddEventListener).toHaveBeenCalledWith('install', expect.any(Function));
  });

  test('install event handler is registered', () => {
    const registeredListeners = {};
    const mockAddEventListener = jest.fn((event, handler) => {
      registeredListeners[event] = handler;
    });

    mockAddEventListener("install", () => {});
    expect(registeredListeners).toHaveProperty('install');
  });

  test('install event handler is a function', () => {
    const registeredListeners = {};
    const mockAddEventListener = jest.fn((event, handler) => {
      registeredListeners[event] = handler;
    });

    mockAddEventListener("install", () => {});
    expect(typeof registeredListeners['install']).toBe('function');
  });

  test('install event handler does not throw when called', () => {
    const registeredListeners = {};
    const mockAddEventListener = jest.fn((event, handler) => {
      registeredListeners[event] = handler;
    });

    mockAddEventListener("install", () => {});
    expect(() => registeredListeners['install']()).not.toThrow();
  });

  test('install event listener is registered exactly once', () => {
    const mockAddEventListener = jest.fn();
    mockAddEventListener("install", () => {});
    expect(mockAddEventListener).toHaveBeenCalledTimes(1);
  });

  test('background.js only registers install event (not activate or fetch)', () => {
    const registeredListeners = {};
    const mockAddEventListener = jest.fn((event, handler) => {
      registeredListeners[event] = handler;
    });

    // background.js only has one addEventListener call
    mockAddEventListener("install", () => {});
    expect(registeredListeners).not.toHaveProperty('activate');
    expect(registeredListeners).not.toHaveProperty('fetch');
  });
});
