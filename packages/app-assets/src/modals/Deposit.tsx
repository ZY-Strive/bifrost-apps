/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2019 @bifrost/app-assets authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React, { useState } from 'react';
import styled from 'styled-components';
import {Button, Input, InputBalance, Modal} from '@polkadot/react-components';

import translate from '../translate';
import BN from "bn.js";

interface Props extends I18nProps {
  className?: string;
  onClose: () => void;
  onChange: (address: string) => void;
  address?: string;
  eos: any;
  eosAccount: any;
}

function Deposit ({ className, onClose, address: propAddress, eos, eosAccount, onChange, t }: Props): React.ReactElement<Props> {
  const [address, setAddress] = useState<string | null>(propAddress || null);
  const [amount, setAmount] = useState<BN | undefined>(new BN(0));
  const [hasAvailable, setHasAvailable] = useState(true);
  const [maxBalance] = useState(new BN(0));

  const _onDeposite = async (): Promise<void> => {
    console.log(eos, eosAccount);
    if (eos && eosAccount) {
      eos.transact({
        actions: [{
          account: 'eosio.token',
          name: 'transfer',
          authorization: [{
            actor: eosAccount.name,
            permission: eosAccount.authority,
          }],
          data: {
            from: eosAccount.name,
            to: 'testa',
            quantity: '1.0001 EOS',
            memo: address,
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      }).then((res: any) => {
        console.log('sent: ', res);
        onClose();
      }).catch((err: any) => {
        console.error('error: ', err);
      });
    }
  };

  return (
    <Modal
      className='app--accounts-Modal'
      dimmer='inverted'
      open
    >
      <Modal.Header>{t('Deposit')}</Modal.Header>
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
            help={t('Deposit memo')}
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
            help={t('Type the amount you want to deposit. Note that you can select the unit on the right e.g sending 1 milli is equivalent to sending 0.001.')}
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
          <Button
            icon='send'
            label={t('Make deposit')}
            onClick={_onDeposite}
            isPrimary
            isDisabled={!address}
          />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  );
}

export default translate(
  styled(Deposit)`
    article.padded {
      box-shadow: none;
      margin-left: 2rem;
    }

    label.with-help {
      flex-basis: 10rem;
    }
  `
);
