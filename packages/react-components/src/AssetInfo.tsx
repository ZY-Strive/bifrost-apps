/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2019 @bifrost/app-assets authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances, DerivedStaking } from '@polkadot/api-derive/types';
import { BareProps, I18nProps } from './types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { formatBalance, formatNumber } from '@polkadot/util';
import { Icon, Tooltip, TxButton } from '@polkadot/react-components';
import { withCalls, withMulti } from '@polkadot/react-api';

import Label from './Label';
import translate from './translate';

// true to display, or (for bonded) provided values [own, ...all extras]
export interface BalanceActiveType {
  available?: boolean;
  bonded?: boolean | BN[];
  redeemable?: boolean;
  reserved?: boolean;
  total?: boolean;
  unlocking?: boolean;
}

export interface ValidatorPrefsType {
  unstakeThreshold?: boolean;
  validatorPayment?: boolean;
}

interface Props extends BareProps, I18nProps {
  address: string;
  balances_all?: DerivedBalances;
  children?: React.ReactNode;
  staking_info?: DerivedStaking;
  withBalance?: boolean | BalanceActiveType;
}

const DEFAULT_BALANCES: BalanceActiveType = {
  available: true,
  bonded: true,
  redeemable: true,
  reserved: true,
  total: true,
  unlocking: true
};

// calculates the bonded, first being the own, the second being nominated
function calcBonded (staking_info?: DerivedStaking, bonded?: boolean | BN[]): [BN, BN[]] {
  let other: BN[] = [];
  let own = new BN(0);

  if (Array.isArray(bonded)) {
    other = bonded
      .filter((_, index): boolean => index !== 0)
      .filter((value): boolean => value.gtn(0));

    own = bonded[0];
  } else if (staking_info && staking_info.stakingLedger && staking_info.accountId.eq(staking_info.stashId)) {
    own = staking_info.stakingLedger.active.unwrap();
  }

  return [own, other];
}

function renderUnlocking ({ staking_info, t }: Props): React.ReactNode {
  if (!staking_info || !staking_info.unlocking || !staking_info.unlocking.length) {
    return null;
  }

  const total = staking_info.unlocking.reduce((total, { value }): BN => total.add(value), new BN(0));

  if (total.eqn(0)) {
    return null;
  }

  return (
    <div>
      {formatBalance(total)}
      <Icon
        name='info circle'
        data-tip
        data-for='unlocking-trigger'
      />
      <Tooltip
        text={staking_info.unlocking.map(({ remainingBlocks, value }, index): React.ReactNode => (
          <div key={index}>
            {t('{{value}}, {{remaining}} blocks left', {
              replace: {
                remaining: formatNumber(remainingBlocks),
                value: formatBalance(value)
              }
            })}
          </div>
        ))}
        trigger='unlocking-trigger'
      />
    </div>
  );
}

function renderBalances (props: Props): React.ReactNode {
  const { balances_all, staking_info, t, withBalance = true } = props;
  const balanceDisplay = withBalance === true
    ? DEFAULT_BALANCES
    : withBalance || undefined;

  if (!balanceDisplay || !balances_all) {
    return null;
  }

  const [ownBonded, otherBonded] = calcBonded(staking_info, balanceDisplay.bonded);

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
      {balanceDisplay.reserved && balances_all.reservedBalance && balances_all.reservedBalance.gtn(0) && (
        <>
          <Label label={t('reserved')} />
          <div className='result'>{formatBalance(balances_all.reservedBalance)}</div>
        </>
      )}
      {balanceDisplay.bonded && (ownBonded.gtn(0) || otherBonded.length !== 0) && (
        <>
          <Label label={t('bonded')} />
          <div className='result'>{formatBalance(ownBonded)}{otherBonded.length !== 0 && (
            ` (+${otherBonded.map((bonded): string => formatBalance(bonded)).join(', ')})`
          )}</div>
        </>
      )}
      {balanceDisplay.redeemable && staking_info && staking_info.redeemable && staking_info.redeemable.gtn(0) && (
        <>
          <Label label={t('redeemable')} />
          <div className='result'>
            {formatBalance(staking_info.redeemable)}
            {staking_info.controllerId && (
              <TxButton
                accountId={staking_info.controllerId.toString()}
                className='iconButton'
                icon='lock'
                size='small'
                isPrimary
                key='unlock'
                params={[]}
                tooltip={t('Redeem these funds')}
                tx='staking.withdrawUnbonded'
              />
            )}
          </div>
        </>
      )}
      {balanceDisplay.unlocking && staking_info && staking_info.unlocking && (
        <>
          <Label label={t('unbonding')} />
          <div className='result'>
            {renderUnlocking(props)}
          </div>
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
