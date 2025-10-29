import '@nomicfoundation/hardhat-ethers';
import '@nomicfoundation/hardhat-toolbox';
import '@nomicfoundation/hardhat-verify';
import '@typechain/hardhat';
import 'hardhat-contract-sizer';
import 'hardhat-deploy';
import 'hardhat-gas-reporter';
import 'hardhat-signer-kms';

import * as dotenv from 'dotenv';
import { HardhatUserConfig, HttpNetworkUserConfig, NetworkUserConfig } from 'hardhat/types';

dotenv.config();

const DEFAULT_ENDPOINT = 'http://localhost:8545';
const DEFAULT_PRIVATE_KEY =
  process.env.DEFAULT_PRIVATE_KEY || 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

const kmsKeyId = process.env.KMS_KEY_ID || '';

// Testnets
const sepoliaEndpoint = process.env.SEPOLIA_ENDPOINT || DEFAULT_ENDPOINT;
const sepoliaPrivateKey = process.env.SEPOLIA_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;

const baseSepoliaEndpoint = process.env.BASE_SEPOLIA_ENDPOINT || DEFAULT_ENDPOINT;
const baseSepoliaPrivateKey = process.env.BASE_SEPOLIA_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;

const bscTestEndpoint = process.env.BSC_TEST_ENDPOINT || DEFAULT_ENDPOINT;
const bscTestPrivateKey = process.env.BSC_TEST_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;

const optimismTestEndpoint = process.env.OPTIMISM_TEST_ENDPOINT || DEFAULT_ENDPOINT;
const optimismTestPrivateKey = process.env.OPTIMISM_TEST_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;

const qubeticsTestEndpoint = process.env.QUBETICS_TEST_ENDPOINT || DEFAULT_ENDPOINT;
const qubeticsTestPrivateKey = process.env.QUBETICS_TEST_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;

const avalancheTestEndpoint = process.env.AVALANCHE_TEST_ENDPOINT || DEFAULT_ENDPOINT;
const avalancheTestPrivateKey = process.env.AVALANCHE_TEST_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;

const polygonTestEndpoint = process.env.POLYGON_TEST_ENDPOINT || DEFAULT_ENDPOINT;
const polygonTestPrivateKey = process.env.POLYGON_TEST_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;


// Mainnets
const ethMainnetEndpoint = process.env.ETH_MAINNET_ENDPOINT || DEFAULT_ENDPOINT;
const ethMainnetPrivateKey = process.env.ETH_MAINNET_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;

const baseEndpoint = process.env.BASE_ENDPOINT || DEFAULT_ENDPOINT;
const basePrivateKey = process.env.BASE_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;

const bscEndpoint = process.env.BSC_ENDPOINT || DEFAULT_ENDPOINT;
const bscPrivateKey = process.env.BSC_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;

const polygonEndpoint = process.env.POLYGON_ENDPOINT || DEFAULT_ENDPOINT;
const polygonPrivateKey = process.env.POLYGON_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;

const qubeticsEndpoint = process.env.QUBETICS_ENDPOINT || DEFAULT_ENDPOINT;
const qubeticsPrivateKey = process.env.QUBETICS_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;

const avalancheEndpoint = process.env.AVALANCHE_ENDPOINT || DEFAULT_ENDPOINT;
const avalanchePrivateKey = process.env.AVALANCHE_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;

const optimismEndpoint = process.env.OPTIMISM_ENDPOINT || DEFAULT_ENDPOINT;
const optimismPrivateKey = process.env.OPTIMISM_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;

// use kmsKeyId if it's not empty, otherwise use privateKey
function getNetworkConfig(url: string, kmsKeyId: string, privateKey: string, gasPrice?: number): NetworkUserConfig {
  const network: NetworkUserConfig = !kmsKeyId
    ? {
      url: url,
      accounts: [`0x${privateKey}`]
    }
    : {
      url: url,
      kmsKeyId: kmsKeyId
    };
  if (gasPrice) {
    network.gasPrice = gasPrice;
  }

  return network;
}

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    // Testnets
    hardhat: {},
    localhost: { timeout: 600000 },
    sepolia: {
      url: sepoliaEndpoint,
      accounts: [`0x${sepoliaPrivateKey}`]
    },
	baseSepolia: {
      url: baseSepoliaEndpoint,
      accounts: [`0x${baseSepoliaPrivateKey}`]
    },
    bscTest: {
      url: bscTestEndpoint,
      accounts: [`0x${bscTestPrivateKey}`]
    },
    qubeticsTest: {
      url: qubeticsTestEndpoint,
      accounts: [`0x${qubeticsTestPrivateKey}`]
    },
    optimismTest: {
      url: optimismTestEndpoint,
      accounts: [`0x${optimismTestPrivateKey}`]
    },
    avalancheTest: {
      url: avalancheTestEndpoint,
      accounts: [`0x${avalancheTestPrivateKey}`]
    },
    polygonTest: {
      url: polygonTestEndpoint,
      accounts: [`0x${polygonTestPrivateKey}`]
    },
    // Mainnets
    ethMainnet: getNetworkConfig(ethMainnetEndpoint, kmsKeyId, ethMainnetPrivateKey),
    bsc: getNetworkConfig(bscEndpoint, kmsKeyId, bscPrivateKey, 5000000000),
    polygon: getNetworkConfig(polygonEndpoint, kmsKeyId, polygonPrivateKey, 50000000000),
    qubetics: getNetworkConfig(qubeticsEndpoint, kmsKeyId, qubeticsPrivateKey),
    avalanche: getNetworkConfig(avalancheEndpoint, kmsKeyId, avalanchePrivateKey),
    optimism: getNetworkConfig(optimismEndpoint, kmsKeyId, optimismPrivateKey),
	qubetics: getNetworkConfig(qubeticsEndpoint, kmsKeyId, qubeticsPrivateKey),
    base: getNetworkConfig(baseEndpoint, kmsKeyId, basePrivateKey),
  },
  namedAccounts: {
    deployer: {
      default: 0
    }
  },
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 800
      }
    }
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
    disambiguatePaths: false
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === 'true' ? true : false,
    noColors: true,
    outputFile: 'reports/gas_usage/summary.txt'
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v6'
  },
  etherscan: {
    apiKey: {
      // Testnets
      sepolia: process.env.ETHERSCAN_API_KEY || '',
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY || '',
      bscTestnet: process.env.BSCSCAN_API_KEY || '',
      ftmTestnet: process.env.FTMSCAN_API_KEY || '',
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || '',
      // Mainnets
      mainnet: process.env.ETHERSCAN_API_KEY || '',
      avalanche: process.env.SNOWTRACE_API_KEY || '',
      bsc: process.env.BSCSCAN_API_KEY || '',
      polygon: process.env.POLYGONSCAN_API_KEY || '',
      base: process.env.BASE_API_KEY || ''
    },
    customChains: [
      {
        network: 'arbitrumNova',
        chainId: 42170,
        urls: {
          apiURL: process.env.ARBITRUM_NOVA_ENDPOINT || '',
          browserURL: process.env.ARBITRUM_NOVA_EXPLORER || ''
        }
      },
      {
        network: 'linea',
        chainId: 59144,
        urls: {
          apiURL: process.env.LINEA_API_ENDPOINT || '',
          browserURL: process.env.LINEA_EXPLORER || ''
        }
      },
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL: process.env.BASE_API_ENDPOINT || '',
          browserURL: process.env.BASE_EXPLORER || ''
        }
      }
    ]
  },
};

// if (config.networks?.polygon) {
//   config.networks.polygon.minMaxPriorityFeePerGas = 30000000000;
// }
// if (config.networks?.qubetics) {
//   config.networks.qubetics.minMaxPriorityFeePerGas = 30000000000;
// }
// if (config.networks?.bsc) {
//   config.networks.bsc.minMaxPriorityFeePerGas = 3000000000;
//   config.networks.bsc.minMaxFeePerGas = 3000000000;
// }

export default config;
