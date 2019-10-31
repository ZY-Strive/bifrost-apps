// Copyright 2019 @bifrost/app-assets authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@polkadot/react-components';
import { AssetCard, AssetInfo } from '../../react-components/src';

import Transfer from './modals/Transfer';
import translate from './translate';

interface Props extends I18nProps {
  address: string;
  className?: string;
  exchangeRate: Number;
}

function VAsset ({ address, className, exchangeRate, t }: Props): React.ReactElement<Props> {
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const _toggleTransfer = (): void => setIsTransferOpen(!isTransferOpen);

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
              onClick={_toggleTransfer}
              size='small'
              tooltip={t('Deposit vtoken')}
            />
            <Button
              icon='paper plane'
              isPrimary
              label={t('withdraw')}
              onClick={_toggleTransfer}
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
          {isTransferOpen && (
            <Transfer
              key='modal-transfer'
              onClose={_toggleTransfer}
              senderId={address}
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
