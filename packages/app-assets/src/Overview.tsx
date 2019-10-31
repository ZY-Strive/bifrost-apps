// Copyright 2019 @bifrost/app-assets authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {I18nProps} from '@polkadot/react-components/types';
import {SubjectInfo} from '@polkadot/ui-keyring/observable/types';
import {ComponentProps} from './types';

import React, {useState} from 'react';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import {withCalls, withMulti, withObservable} from '@polkadot/react-api';
import {Button, Columar, Column} from '@polkadot/react-components';

import Asset from './Asset';
import VAsset from './VAsset';
import translate from './translate';
import ChangeAccount from './modals/ChangeAccount';

interface Props extends ComponentProps, I18nProps {
  accounts?: SubjectInfo[];
  exchangeRate: Number;
}

function Overview({accounts, exchangeRate, onStatusChange, t}: Props): React.ReactElement<Props> {
  const [isChangeAccountOpen, setIsChangeAccountOpen] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  const _toggleChangeAccount = (): void => setIsChangeAccountOpen(!isChangeAccountOpen);
  const _onChangeAccount = (address: string): void => {
    setAddress(address);
    if (!!address && accounts && accounts.hasOwnProperty(address)) {
      setName(accounts[address].option.name);
    }
  };

  return (
    <>
      <Button.Group>
        <Button
          icon='user'
          isPrimary
          label={name ? name : t('Set account')}
          onClick={_toggleChangeAccount}
          tooltip={t('Set account')}
        />
        {isChangeAccountOpen && (
          <ChangeAccount
            onChange={_onChangeAccount}
            onClose={_toggleChangeAccount}
          />
        )}
      </Button.Group>

      <Columar>
        <Column
          emptyText={t('No bifrost asset')}
          headerText={t('Bifrost asset')}
        >
          {!!address && accounts && accounts[address] &&
            <Asset
              address={address}
              key={address}
            />
          }
        </Column>
        <Column
          emptyText={t('No vToken available')}
          headerText={t('vToken')}
        >
          {!!address && accounts && accounts[address] &&
            <VAsset
              address={address}
              key={address}
              exchangeRate={exchangeRate}
            />
          }
        </Column>
      </Columar>
    </>
  );
}

export default withMulti(
  Overview,
  translate,
  withObservable(accountObservable.subject, {propName: 'accounts'}),
  withCalls<Props>(
    ['query.exchange.exchangeRate', {
      propName: 'exchangeRate',
      transform: (rate: Number): string => {
        return rate.toString()
      }
    }],
  )
);
