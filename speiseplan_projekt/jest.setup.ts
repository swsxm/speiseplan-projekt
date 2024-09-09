import '@testing-library/jest-dom'

if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = require('util').TextEncoder;
    global.TextDecoder = require('util').TextDecoder;
  }
global.fetch = jest.fn();