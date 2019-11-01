// Copyright 2019 @bifrost/app-assets authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@polkadot/react-components';
import { AssetCard, AssetInfo } from '../../react-components/src';
import Deposit from './modals/Deposit';
import Withdraw from './modals/Withdraw';

import translate from './translate';

interface Props extends I18nProps {
  address: string;
  className?: string;
  exchangeRate: Number;
  eos: any;
  eosAccount: any;
}

function VAsset ({ address, className, exchangeRate, eos, eosAccount, t }: Props): React.ReactElement<Props> {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const _toggleDeposit = (): void => setIsDepositOpen(!isDepositOpen);
  const _toggleWithdraw = (): void => setIsWithdrawOpen(!isWithdrawOpen);

  // FIXME It is a bit heavy-handled switching of being editable here completely
  // (and removing the tags, however the keyring cannot save these)
  return (
    <AssetCard
      buttons={
        <div className='assets--Asset-buttons buttons'>
          <div className='actions'>
            <Button
              icon='paper plane'
              isPrimary
              label={t('deposit')}
              onClick={_toggleDeposit}
              size='small'
              tooltip={t('Deposit original chain token')}
            />
            <Button
              icon='paper plane'
              isPrimary
              label={t('withdraw')}
              onClick={_toggleWithdraw}
              size='small'
              tooltip={t('Withdraw vtoken')}
            />
          </div>
        </div>
      }
      className={className}
      isEditable={false}
      type='account'
      value={address}
      withExplorer
    >
      {address && (
        <>
          {isDepositOpen && (
            <Deposit
              key='modal-deposit'
              onClose={_toggleDeposit}
              address={address}
              eos={eos}
              eosAccount={eosAccount}
            />
          )}
          {isWithdrawOpen && (
            <Withdraw
              key='modal-withdraw'
              onClose={_toggleWithdraw}
              address={address}
              eosAccount={eosAccount}
            />
          )}
        </>
      )}
      <AssetInfo
        address={address}
        exchangeRate={exchangeRate}
        withBalance
      />
    </AssetCard>
  );
}

export default translate(
  styled(VAsset)`
    .assets--Asset-buttons {
      text-align: right;

      .others {
        margin-right: 0.125rem;
        margin-top: 0.25rem;
      }
    }
  `
);
