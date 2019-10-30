// Copyright 2019 @bifrost/app-assets authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/react-components/types';
import { ComponentProps, LocationProps } from './types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import React from 'react';
import { Route, Switch } from 'react-router';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { HelpOverlay, Tabs } from '@polkadot/react-components';
import { withMulti, withObservable } from '@polkadot/react-api';

import basicMd from './md/basic.md';
import Overview from './Overview';
import translate from './translate';

interface Props extends AppProps, I18nProps {
  allAccounts?: SubjectInfo;
  location: any;
}

function AssetsApp ({ basePath, location, onStatusChange, t }: Props): React.ReactElement<Props> {

  const _renderComponent = (Component: React.ComponentType<ComponentProps>): (props: LocationProps) => React.ReactNode => {
    // eslint-disable-next-line react/display-name
    return ({ match }: LocationProps): React.ReactNode => {
      return (
        <Component
          basePath={basePath}
          location={location}
          match={match}
          onStatusChange={onStatusChange}
        />
      );
    };
  };

  return (
    <main className='assets--App'>
      <HelpOverlay md={basicMd} />
      <header>
        <Tabs
          basePath={basePath}
          items={[
            {
              isRoot: true,
              name: 'overview',
              text: t('My assets')
            },
          ]}
        />
      </header>
      <Switch>
        <Route render={_renderComponent(Overview)} />
      </Switch>
    </main>
  );
}

export default withMulti(
  AssetsApp,
  translate,
  withObservable(accountObservable.subject)
);
