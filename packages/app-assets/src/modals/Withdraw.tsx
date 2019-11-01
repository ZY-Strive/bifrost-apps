/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2019 @bifrost/app-assets authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components';
import {Button, Input, InputBalance, Modal, TxButton} from '@polkadot/react-components';
import { ApiContext } from '@polkadot/react-api';

import translate from '../translate';
import {SubmittableExtrinsic} from "@polkadot/api/promise/types";
import BN from "bn.js";

interface Props extends I18nProps {
  className?: string;
  onClose: () => void;
  onChange: (address: string) => void;
  address?: string;
  eosAccount: any;
}

function Withdraw ({ className, onClose, address: propAddress, eosAccount, onChange, t }: Props): React.ReactElement<Props> {
  const { api } = useContext(ApiContext);
  const [address, setAddress] = useState<string | null>(propAddress || null);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic | null>(null);
  const available = <span className='label'>{t('available ')}</span>;
  const [hasAvailable, setHasAvailable] = useState(true);
  const [maxBalance] = useState(new BN(0));
  const [assetId, setAssetId] = useState<number>(0);
  const [amount, setAmount] = useState<BN | undefined>(new BN(0));
  const [to, setTo] = useState<string | null>("bob");

  useEffect((): void => {
    if (address) {
      setExtrinsic(api.tx.assets.redeem(assetId, amount, to));
    }
  }, [address]);

  const _onWithdraw = async (): Promise<void> => {
  };

  return (
    <Modal
      className='app--accounts-Modal'
      dimmer='inverted'
      open
    >
      <Modal.Header>{t('Withdraw')}</Modal.Header>
      <Modal.Content>
        <div className={className}>
          <Input
            className='full'
            help={t('EOS account')}
            isAction
            isError={false}
            isDisabled={true}
            label={t('EOS account')}
            value={eosAccount ? eosAccount.name : ''}
          >
            <Button
              icon='change'
              label={t('Change')}
            />
          </Input>
          <Input
            help={t('Withdraw memo')}
            label={t('Memo')}
            onChange={setAddress}
            isError={!address}
            isDisabled={true}
            value={address}
          />
          <Input
            help={t('Exchange rate')}
            label={t('Rate')}
            isDisabled={true}
            value={1}
          />
          <InputBalance
            help={t('Type the amount you want to transfer. Note that you can select the unit on the right e.g sending 1 milli is equivalent to sending 0.001.')}
            isError={!hasAvailable}
            label={t('amount')}
            maxValue={maxBalance}
            onChange={setAmount}
            withMax
          />
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button
            icon='cancel'
            isNegative
            label={t('Cancel')}
            onClick={onClose}
          />
          <Button.Or />
          <TxButton
            accountId={address}
            extrinsic={extrinsic}
            icon='send'
            isPrimary
            label={t('Make withdraw')}
            onStart={onClose}
            withSpinner={false}
          />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  );
}

export default translate(
  styled(Withdraw)`
    article.padded {
      box-shadow: none;
      margin-left: 2rem;
    }

    label.with-help {
      flex-basis: 10rem;
    }
  `
);
