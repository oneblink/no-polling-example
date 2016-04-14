'use strict';

// poly-fill for TextEncoder
import encoding from 'text-encoding';
global.TextEncoder = global.TextEncoder || encoding.TextEncoder;
global.TextDecoder = global.TextDecoder || encoding.TextDecoder;

import './bus.js';
