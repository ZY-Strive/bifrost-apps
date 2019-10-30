// Copyright 2019 @bifrost/app-assets authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore This line needed for the styled export... don't ask why
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';

import AssetRow, { Props as AddressProps } from './AssetRow';
import Card from './Card';
import LinkPolkascan from './LinkPolkascan';

import translate from './translate';

interface Props extends AddressProps {
  withExplorer?: boolean;
}

function AssetCard (props: Props): React.ReactElement<Props> {
  const { className, value, withExplorer } = props;

  return (
    <Card className={className}>
      <AssetRow
        {...props}
        className='ui--AssetCard-AssetRow'
      />
      {withExplorer && value && (
        <div className='ui--AssetCard-explorer'>
          <LinkPolkascan
            className='ui--AssetCard-exporer-link'
            data={value.toString()}
            type='address'
          />
        </div>
      )}
    </Card>
  );
}

export default translate(styled(AssetCard)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .ui--Row-buttons .ui--Button-Group .ui.button {
    visibility: visible;
    margin-right: .25rem;
  }

  .ui--AssetCard-explorer {
    margin: 0 -0.25rem -0.5rem 0;
    text-align: right;

    .ui--AssetCard-exporer-link {
      display: inline-block;
      margin-top: 0.5rem;
    }
  }
`);
