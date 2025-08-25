import { TonConnectUI } from '@tonconnect/ui';

let tonConnectUI = null;

export function getTonConnectUI() {
  if (!tonConnectUI) {
    tonConnectUI = new TonConnectUI({
      manifestUrl: 'https://21mln.xyz/tonconnect-manifest.json',
      buttonRootId: null
    });
  }
  return tonConnectUI;
} 