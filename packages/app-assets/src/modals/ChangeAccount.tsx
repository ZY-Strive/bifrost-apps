/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2019 @bifrost/app-assets authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, InputAddress, Modal } from '@polkadot/react-components';
import { Available } from '@polkadot/react-query';

import translate from '../translate';

interface Props extends I18nProps {
  className?: string;
  onClose: () => void;
  onChange: (address: string) => void;
  address?: string;
}

function ChangeAccount ({ className, onClose, address: propAddress, onChange, t }: Props): React.ReactElement<Props> {
  const [address, setAddress] = useState<string | null>(propAddress || null);

  const available = <span className='label'>{t('available ')}</span>;

  const _onChange = (): void => {
    if (address) {
      onChange(address);
      onClose();
    }
  };

  return (
    <Modal
      className='app--accounts-Modal'
      dimmer='inverted'
      open
    >
      <Modal.Header>{t('Change Account')}</Modal.Header>
      <Modal.Content>
        <div className={className}>
          <InputAddress
            defaultValue={propAddress}
            label={t('Select an account')}
            labelExtra={<Available label={available} params={address} />}
            onChange={setAddress}
            type='account'
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
            icon='save'
            label={t('Confirm')}
            onClick={_onChange}
            isPrimary
            isDisabled={!address}
          />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  );
}

export default translate(
  styled(ChangeAccount)`
    article.padded {
      box-shadow: none;
      margin-left: 2rem;
    }

    label.with-help {
      flex-basis: 10rem;
    }
  `
);
