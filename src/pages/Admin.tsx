import { useEffect, useState } from 'react';
import { useChain } from '@cosmos-kit/react';
import { CHAIN_NAME, STAKING_CONTRACT } from '@/app/utils/constants';
import { useWalletStore } from '@/hooks';
import { formatEther, parseEther } from 'viem';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';

const Admin = () => {
  const { queryContract, executeContract } = useWalletStore();
  const { address } = useChain(CHAIN_NAME);
  const [newOwner, setNewOwner] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositAddress, setDepositAddress] = useState('');
  const [collectionAddress, setCollectionAddress] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  const [rewardCycle, setRewardCycle] = useState('');
  const [spots, setSpots] = useState('');
  const [fee, setFee] = useState('');
  const [withdrawFeeAmount, setWithdrawFeeAmount] = useState('');
  const [collectionAddressToRemove, setCollectionAddressToRemove] =
    useState('');
  const unstakeFee = useSelector((state) => state.staking.unstakeFee);
  const [feeCollected, setFeeCollected] = useState('0');

  useEffect(() => {
    void (async () => {
      const response = await queryContract(STAKING_CONTRACT, {
        get_config: {},
      });
      setFeeCollected(response.fee_collected);
    })();
  }, []);

  return (
    <div className='w-[calc(100%_-_80px)] mx-10 flex flex-col '>
      {address ? (
        <div className='flex flex-col gap-20'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex flex-col w-full gap-4'>
              <input
                type='text'
                placeholder='Collection Address'
                className='bg-transparent border rounded-lg'
                value={depositAddress}
                onChange={(e) => setDepositAddress(e.target.value)}
              />
              <input
                type='text'
                placeholder='Amount in $INJ'
                className='bg-transparent border rounded-lg'
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>
            <button
              className='bg-button-normal btn-hover w-full rounded-lg hover:rounded-lg'
              onClick={async () => {
                await executeContract(
                  STAKING_CONTRACT,
                  {
                    deposit_collection_reward: {
                      address: depositAddress,
                    },
                  },
                  {
                    denom: 'inj',
                    amount: parseEther(depositAmount).toString(),
                  }
                );
              }}
            >
              Deposit Collection Reward
            </button>
          </div>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex flex-col w-full gap-4'>
              <input
                type='text'
                placeholder='New Owner'
                className='bg-transparent border rounded-lg'
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
              />
            </div>
            <button
              className='bg-button-normal btn-hover w-full rounded-lg hover:rounded-lg'
              onClick={async () => {
                await executeContract(STAKING_CONTRACT, {
                  transfer_ownership: {
                    address: newOwner,
                  },
                });
              }}
            >
              Transfer Ownership
            </button>
          </div>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex flex-col w-full'>
              <div className='flex flex-col w-full gap-4'>
                Current fee: {formatEther(unstakeFee.amount ?? '0')} $INJ
              </div>
              <div className='flex flex-col w-full gap-4'>
                <input
                  type='text'
                  placeholder='Unstake Fee amount in $INJ'
                  className='bg-transparent border rounded-lg'
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                />
              </div>
            </div>
            <button
              className='bg-button-normal btn-hover w-full rounded-lg hover:rounded-lg'
              onClick={async () => {
                await executeContract(STAKING_CONTRACT, {
                  change_fee: {
                    fee: {
                      denom: 'inj',
                      amount: parseEther(fee).toString(),
                    },
                  },
                });
              }}
            >
              Change Unstake Fee
            </button>
          </div>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex flex-col w-full'>
              <div className='flex flex-col w-full gap-4'>
                Fee collected: {formatEther(feeCollected ?? '0')} $INJ
              </div>
              <div className='flex flex-col w-full gap-4'>
                <input
                  type='text'
                  placeholder='Withdraw Fee amount in $INJ'
                  className='bg-transparent border rounded-lg'
                  value={withdrawFeeAmount}
                  onChange={(e) => setWithdrawFeeAmount(e.target.value)}
                />
              </div>
            </div>
            <button
              className='bg-button-normal btn-hover w-full rounded-lg hover:rounded-lg'
              onClick={async () => {
                await executeContract(STAKING_CONTRACT, {
                  withdraw_fee: {
                    fee: {
                      denom: 'inj',
                      amount: parseEther(withdrawFeeAmount).toString(),
                    },
                  },
                });
              }}
            >
              Withdraw Fee
            </button>
          </div>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex flex-col w-full gap-4'>
              <input
                type='text'
                placeholder='Collection Address'
                className='bg-transparent border rounded-lg'
                value={collectionAddress}
                onChange={(e) => setCollectionAddress(e.target.value)}
              />
              <input
                type='number'
                placeholder='Reward amount in $INJ'
                className='bg-transparent border rounded-lg'
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
              />
              <input
                type='number'
                placeholder='Reward cycle in seconds'
                className='bg-transparent border rounded-lg'
                value={rewardCycle}
                onChange={(e) => setRewardCycle(e.target.value)}
              />
              <input
                type='text'
                placeholder='Available spots'
                className='bg-transparent border rounded-lg'
                value={spots}
                onChange={(e) => setSpots(e.target.value)}
              />
            </div>
            <button
              className='bg-button-normal btn-hover w-full rounded-lg hover:rounded-lg'
              onClick={async () => {
                await executeContract(STAKING_CONTRACT, {
                  whitelist_collection: {
                    address: collectionAddress,
                    reward: {
                      denom: 'inj',
                      amount: parseEther(rewardAmount).toString(),
                    },
                    cycle: parseInt(rewardCycle),
                    is_whitelisted: true,
                    spots: parseInt(spots),
                  },
                });
              }}
            >
              Add Collection
            </button>
          </div>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex flex-col w-full gap-4'>
              <input
                type='text'
                placeholder='Collection Address'
                className='bg-transparent border rounded-lg'
                value={collectionAddressToRemove}
                onChange={(e) => setCollectionAddressToRemove(e.target.value)}
              />
            </div>
            <button
              className='bg-button-normal btn-hover w-full rounded-lg hover:rounded-lg'
              onClick={async () => {
                const collections = await queryContract(STAKING_CONTRACT, {
                  get_collections: {},
                });
                const collection = collections.find(
                  (c) => c.address == collectionAddressToRemove
                );
                if (collection) {
                  await executeContract(STAKING_CONTRACT, {
                    whitelist_collection: {
                      ...collection,
                      is_whitelisted: false,
                    },
                  });
                } else {
                  toast.error('Collection not found');
                }
              }}
            >
              Remove Collection
            </button>
          </div>
        </div>
      ) : (
        <div className='w-full text-center mt-20'>Connect Wallet</div>
      )}
    </div>
  );
};

export default Admin;
