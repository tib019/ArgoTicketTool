// Jest setup file: mock Chrome extension APIs and global fetch
global.chrome = {
  storage: {
    sync: {
      get: jest.fn((keys, cb) => cb({})),
      set: jest.fn((obj, cb) => cb())
    }
  }
};

global.fetch = jest.fn();
