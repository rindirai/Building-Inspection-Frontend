'use client';

import { useState, useCallback } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _userAbout, _userPlans, _userPayment, _userInvoices, _userAddressBook } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import AccountGeneral from '../account-general';
import FoundationStage from '../foundation-stage';
import FramingStage from '../framing-stage';
import ElectricalStage from '../electrical-stage';
import PlumbingStage from '../plumbing-stage';
import HVACStage from '../hvac-stage';
import InsulationStage from '../insulation-stage';
import DrywallStage from '../drywall-stage';
import FinalStage from '../final-stage';
// import AccountBilling from '../account-billing';
// import AccountSocialLinks from '../account-social-links';
// import AccountNotifications from '../account-notifications';
// import AccountChangePassword from '../account-change-password';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'general',
    label: 'General',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'foundation',
    label: 'Foundation',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'framing',
    label: 'Framing',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'electrical',
    label: 'Electrical',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'plumbing',
    label: 'Plumbing',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'hvac',
    label: 'HVAC',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'insulation',
    label: 'Insulation',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'drywall',
    label: 'DryWall',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'final',
    label: 'Final',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  // {
  //   value: 'billing',
  //   label: 'Billing',
  //   icon: <Iconify icon="solar:bill-list-bold" width={24} />,
  // },
  // {
  //   value: 'notifications',
  //   label: 'Notifications',
  //   icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
  // },
  // {
  //   value: 'social',
  //   label: 'Social links',
  //   icon: <Iconify icon="solar:share-bold" width={24} />,
  // },
  // {
  //   value: 'security',
  //   label: 'Security',
  //   icon: <Iconify icon="ic:round-vpn-key" width={24} />,
  // },
];

// ----------------------------------------------------------------------

export default function AccountView({ data, client_id }) {
  console.log('account data', data);
  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('general');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Account"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: 'Account' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {currentTab === 'general' && <AccountGeneral data={data} client_id={client_id} />}
      {currentTab === 'foundation' && <FoundationStage data={data} client_id={client_id} />}
      {currentTab === 'framing' && <FramingStage data={data} client_id={client_id} />}
      {currentTab === 'electrical' && <ElectricalStage data={data} client_id={client_id} />}
      {currentTab === 'plumbing' && <PlumbingStage data={data} client_id={client_id} />}
      {currentTab === 'hvac' && <HVACStage data={data} client_id={client_id} />}
      {currentTab === 'insulation' && <InsulationStage data={data} client_id={client_id} />}
      {currentTab === 'drywall' && <DrywallStage data={data} client_id={client_id} />}
      {currentTab === 'final' && <FinalStage data={data} client_id={client_id} />}

      {/* {currentTab === 'billing' && (
        <AccountBilling
          plans={_userPlans}
          cards={_userPayment}
          invoices={_userInvoices}
          addressBook={_userAddressBook}
        />
      )}

      {currentTab === 'notifications' && <AccountNotifications />}

      {currentTab === 'social' && <AccountSocialLinks socialLinks={_userAbout.socialLinks} />}

      {currentTab === 'security' && <AccountChangePassword />} */}
    </Container>
  );
}
