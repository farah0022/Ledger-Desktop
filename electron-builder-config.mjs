// App is tagged with a .mjs extension to allow
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * electron-builder doesn't look for the APPLE_TEAM_ID environment variable for some reason.
 * This workaround allows an environment variable to be added to the electron-builder.yml config
 * collection. See: https://github.com/electron-userland/electron-builder/issues/7812
 */

const dirname = path.dirname(fileURLToPath(import.meta.url));
const buildDirPath = path.join(dirname, 'dist_electron', 'build');
const packageDirPath = path.join(dirname, 'dist_electron', 'bundled');

const ledgerDesktopConfig = {
  productName: 'Ledger Desktop',
  appId: 'com.farah.ledgerdesktop',
  artifactName: '${productName}-v${version}-${os}-${arch}.${ext}',
  asarUnpack: '**/*.node',
  extraResources: [
    { from: 'log_creds.txt', to: '../creds/log_creds.txt' },
    { from: 'translations', to: '../translations' },
    { from: 'templates', to: '../templates' },
  ],
  files: '**',
  extends: null,
  directories: {
    output: packageDirPath,
    app: buildDirPath,
  },

  // macOS — build unsigned by default (no Apple Developer cert in this repo).
  // To enable signing + notarization later, set APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD,
  // APPLE_TEAM_ID, CSC_LINK, and CSC_KEY_PASSWORD as GitHub Actions secrets.
  mac: {
    category: 'public.app-category.finance',
    icon: 'build/icon.icns',
    hardenedRuntime: true,
    gatekeeperAssess: false,
    darkModeSupport: false,
    entitlements: 'build/entitlements.mac.plist',
    entitlementsInherit: 'build/entitlements.mac.plist',
    // publish: ['github'], // re-enable when GH_TOKEN publish flow is restored
  },

  // Windows — build unsigned by default (no code-signing cert in this repo).
  // SmartScreen will warn users on first run, but the installer will build and run.
  // To sign later, set WIN_CSC_LINK and WIN_CSC_KEY_PASSWORD as secrets.
  win: {
    icon: 'build/icon.ico',
    // publish: ['github'], // re-enable when GH_TOKEN publish flow is restored
    target: [
      {
        target: 'nsis',
        arch: ['x64'],
      },
      {
        target: 'portable',
        arch: ['x64'],
      },
    ],
  },

  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    installerIcon: 'build/installericon.ico',
    uninstallerIcon: 'build/uninstallericon.ico',
    // publish: ['github'],
  },

  // Linux
  linux: {
    icon: 'build/icons',
    artifactName: '${productName}-v${version}-linux-${arch}.${ext}',
    category: 'Finance',
    // publish: ['github'],
    target: [
      {
        target: 'AppImage',
        arch: ['x64'],
      },
      {
        target: 'deb',
        arch: ['x64'],
      },
    ],
  },
};

export default ledgerDesktopConfig;
