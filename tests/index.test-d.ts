import {expectType} from 'tsd';

import {sum} from '../dist/index.js';

expectType<number>(sum(1, 2));
