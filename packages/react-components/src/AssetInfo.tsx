/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2019 @bifrost/app-assets authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances } from '@polkadot/api-derive/types';
import { BareProps, I18nProps } from './types';

import React from 'react';
import styled from 'styled-components';
import { formatBalance } from '@polkadot/util';
import { withCalls, withMulti } from '@polkadot/react-api';

import Label from './Label';
import translate from './translate';

// true to display, or (for bonded) provided values [own, ...all extras]
export interface BalanceActiveType {
  available?: boolean;
  total?: boolean;
  rate?: boolean;
}

interface Props extends BareProps, I18nProps {
  address: string;
  balances_all?: DerivedBalances;
  exchangeRate: Number;
  children?: React.ReactNode;
  withBalance?: boolean | BalanceActiveType;
}

const DEFAULT_BALANCES: BalanceActiveType = {
  available: true,
  total: true,
  rate: true
};

function renderBalances (props: Props): React.ReactNode {
  const { balances_all, exchangeRate, t, withBalance = true } = props;
  const balanceDisplay = withBalance
    ? DEFAULT_BALANCES
    : withBalance || undefined;

  if (!balanceDisplay || !balances_all) {
    return null;
  }

  return (
    <>
      {balanceDisplay.total && (
        <>
          <Label label={t('total')} />
          <div className='result'>{formatBalance(balances_all.votingBalance)}</div>
        </>
      )}
      {balanceDisplay.available && (
        <>
          <Label label={t('available')} />
          <div className='result'>{formatBalance(balances_all.availableBalance)}</div>
        </>
      )}
      {balanceDisplay.rate && (
        <>
          <Label label={t('rate')} />
          <div className='result'>{exchangeRate}</div>
        </>
      )}
    </>
  );
}

function AssetInfo (props: Props): React.ReactElement<Props> {
  const { className, children } = props;

  return (
    <div className={className}>
      <div className='column'>
        {renderBalances(props)}
      </div>
      {children && (
        <div className='column'>
          {children}
        </div>
      )}
    </div>
  );
}

export default withMulti(
  styled(AssetInfo)`
    align-items: flex-start;
    display: flex;
    flex: 1;
    justify-content: center;
    white-space: nowrap;

    .column {
      flex: 1;
      display: grid;
      opacity: 1;

      label {
        grid-column:  1;
        padding-right: 0.5rem;
        text-align: right;

        .help.circle.icon {
          display: none;
        }
      }

      .result {
        grid-column:  2;

        .icon {
          margin-left: .3em;
          margin-right: 0;
          padding-right: 0 !important;
        }

        button.ui.icon.primary.button.iconButton {
          background: white !important;
        }
      }
    }
  `,
  translate,
  withCalls<Props>(
    ['derive.balances.all', { paramName: 'address' }],
    ['derive.staking.info', { paramName: 'address' }]
  )
);
