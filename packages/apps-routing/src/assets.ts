// Copyright 2017-2019 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

// import Assets from '@bifrost/app-assets';
import Assets from '../../app-assets/src';

export default ([
  {
    Component: Assets,
    display: {
      needsApi: []
    },
    i18n: {
      defaultValue: 'Assets'
    },
    icon: 'dollar sign',
    name: 'assets'
  }
] as Routes);
