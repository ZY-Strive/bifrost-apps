// Copyright 2019 @bifrost/app-assets authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {I18nProps} from '@polkadot/react-components/types';
import {SubjectInfo} from '@polkadot/ui-keyring/observable/types';
import {ComponentProps} from './types';

import React from 'react';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import {withMulti, withObservable} from '@polkadot/react-api';
import {Columar, Column} from '@polkadot/react-components';

import Asset from './Asset';
import VAsset from './VAsset';
import translate from './translate';

interface Props extends ComponentProps, I18nProps {
  accounts?: SubjectInfo[];
}

function Overview({accounts, t}: Props): React.ReactElement<Props> {
  return (
    <Columar className='validator--ValidatorsList'>
      <Column
        emptyText={t('No bifrost asset')}
        headerText={t('Bifrost asset')}
      >
        {accounts && Object.keys(accounts).map((address): React.ReactNode => (
          <Asset
            address={address}
            key={address}
          />
        ))}
      </Column>
      <Column
        emptyText={t('No vToken available')}
        headerText={t('vToken')}
      >
        {accounts && Object.keys(accounts).map((address): React.ReactNode => (
          <VAsset
            address={address}
            key={address}
          />
        ))}
      </Column>
    </Columar>
  );
}

export default withMulti(
  Overview,
  translate,
  withObservable(accountObservable.subject, {propName: 'accounts'})
);
