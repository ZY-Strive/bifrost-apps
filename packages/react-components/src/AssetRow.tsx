/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2019 @bifrost/app-assets authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps } from '@polkadot/react-components/types';
import { AccountId, AccountIndex, Address, Balance } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { withCalls, withMulti } from '@polkadot/react-api';
import BaseIdentityIcon from '@polkadot/react-identicon';
import { Bytes, Option } from '@polkadot/types';
import { u8aToString } from '@polkadot/util';

import { classes, getAddressName } from './util';
import IdentityIcon, { getIdentityTheme } from './IdentityIcon';
import Row, { RowProps, RowState as State, styles } from './Row';
import translate from './translate';

export interface Props extends I18nProps, RowProps {
  bonded?: BN | BN[];
  isValid?: boolean;
  label?: string;
  nicks_nameOf?: Option<[Bytes, Balance] & Codec>;
  value: AccountId | AccountIndex | Address | string | null;
}

const DEFAULT_ADDR = '5'.padEnd(16, 'x');
const ICON_SIZE = 48;

class AssetRow extends Row<ApiProps & Props, State> {

  public static getDerivedStateFromProps ({ accounts_idAndIndex = [], defaultName, nicks_nameOf, type, value }: Props, prevState: State): State | null {
    const [_accountId] = accounts_idAndIndex;
    const accountId = _accountId || value;
    const address = accountId
      ? accountId.toString()
      : DEFAULT_ADDR;
    const nickName = nicks_nameOf && nicks_nameOf.isSome
      ? u8aToString(nicks_nameOf.unwrap()[0])
      : undefined;
    const name = nickName || getAddressName(address, type, false, defaultName || '<unknown>') || '';
    const state: Partial<State> = { };
    let hasChanged = false;

    if (address !== prevState.address) {
      state.address = address;
      hasChanged = true;
    }

    if (!prevState.isEditingName && name !== prevState.name) {
      state.name = name;
      hasChanged = true;
    }

    return hasChanged
      ? state as State
      : null;
  }

  public render (): React.ReactNode {
    const { accounts_idAndIndex = [], className, isInline, style } = this.props;
    const [accountId, accountIndex] = accounts_idAndIndex;
    const isValid = this.props.isValid || accountId || accountIndex;

    return (
      <div
        className={classes('ui--Row', !isValid && 'invalid', isInline && 'inline', className)}
        style={style}
      >
        <div className='ui--Row-base'>
          {this.renderIcon()}
          <div className='ui--Row-details'>
            {this.renderSymbol()}
          </div>
          {this.renderButtons()}
        </div>
        {this.renderChildren()}
      </div>
    );
  }

  private renderSymbol (): React.ReactNode {
    return this.renderName();
  }

  private renderIcon (): React.ReactNode {
    const { accounts_idAndIndex = [], iconInfo, systemName, withIcon = true } = this.props;
    const { address } = this.state;
    const [accountId] = accounts_idAndIndex;

    if (!withIcon) {
      return null;
    }

    // Since we do queries to storage in the wrapped example, we don't want
    // to follow that route if we don't have a valid address.
    const Component = accountId
      ? IdentityIcon
      : BaseIdentityIcon;
    const theme = getIdentityTheme(systemName);

    return (
      <div className='ui--Row-icon'>
        <Component
          size={ICON_SIZE}
          theme={theme}
          value={address}
        />
        {iconInfo && (
          <div className='ui--Row-icon-info'>
            {iconInfo}
          </div>
        )}
      </div>
    );
  }
}

export {
  DEFAULT_ADDR,
  AssetRow
};

export default withMulti(
  styled(AssetRow as React.ComponentClass<Props & ApiProps, State>)`
    ${styles},
    .ui--Row-accountId+.ui--Row-accountIndex {
      margin-top: -0.25rem;
    }
  `,
  translate,
  withCalls<Props>(
    ['derive.accounts.idAndIndex', { paramName: 'value' }],
    ['query.nicks.nameOf', { paramName: 'value' }]
  )
);
