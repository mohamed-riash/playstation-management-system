import React, { useState } from 'react';
import {
  Gamepad2,
  Gamepad,
  Monitor,
  Tv,
  CircleDot,
  Layers,
  Sparkles,
  Filter,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { DEVICE_TYPES } from '../../utils/constants';
import { DeviceCard } from './DeviceCard';
import { StartSessionModal } from './StartSessionModal';
import { DeviceOrderModal } from './DeviceOrderModal';
import { CheckoutModal } from './CheckoutModal';
import { TransferModal } from './TransferModal';
import { Button } from '../common/Button';

export function DevicesView() {
  const { devices, setActiveTab } = useApp();

  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // all, occupied, available

  // Modals state
  const [startModalDevice, setStartModalDevice] = useState(null);
  const [orderModalDevice, setOrderModalDevice] = useState(null);
  const [checkoutModalDevice, setCheckoutModalDevice] = useState(null);
  const [checkoutSessionData, setCheckoutSessionData] = useState(null);
  const [transferModalDevice, setTransferModalDevice] = useState(null);

  // Filter devices
  const filteredDevices = devices.filter((d) => {
    const matchesType = filterType === 'all' || d.type === filterType;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'occupied' && d.status === 'occupied') ||
      (filterStatus === 'available' && d.status === 'available');
    return matchesType && matchesStatus;
  });

  const occupiedCount = devices.filter((d) => d.status === 'occupied').length;
  const availableCount = devices.filter((d) => d.status === 'available').length;

  const handleOpenCheckout = (device, sessionData) => {
    setCheckoutModalDevice(device);
    setCheckoutSessionData(sessionData);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Status Summary */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#131722] border border-[#232C42] p-4 rounded-2xl">
        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-[#0F131D] text-slate-400 hover:text-white border border-[#232C42]'
            }`}
          >
            جميع الأجهزة ({devices.length})
          </button>

          {Object.entries(DEVICE_TYPES).map(([typeKey, typeInfo]) => {
            const count = devices.filter((d) => d.type === typeKey).length;
            if (count === 0) return null;
            return (
              <button
                key={typeKey}
                onClick={() => setFilterType(typeKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  filterType === typeKey
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-[#0F131D] text-slate-400 hover:text-white border border-[#232C42]'
                }`}
              >
                {typeInfo.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setFilterStatus('occupied')}
            className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${
              filterStatus === 'occupied'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            المشغولة ({occupiedCount})
          </button>
          <button
            onClick={() => setFilterStatus('available')}
            className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${
              filterStatus === 'available'
                ? 'bg-slate-700 text-slate-200'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            المتاحة ({availableCount})
          </button>
        </div>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredDevices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onStartSession={(dev) => setStartModalDevice(dev)}
            onAddOrder={(dev) => setOrderModalDevice(dev)}
            onCheckout={(dev, sessionData) => handleOpenCheckout(dev, sessionData)}
            onTransfer={(dev) => setTransferModalDevice(dev)}
          />
        ))}
      </div>

      {/* Modals */}
      {startModalDevice && (
        <StartSessionModal
          device={startModalDevice}
          isOpen={Boolean(startModalDevice)}
          onClose={() => setStartModalDevice(null)}
        />
      )}

      {orderModalDevice && (
        <DeviceOrderModal
          device={orderModalDevice}
          isOpen={Boolean(orderModalDevice)}
          onClose={() => setOrderModalDevice(null)}
        />
      )}

      {checkoutModalDevice && (
        <CheckoutModal
          device={checkoutModalDevice}
          sessionData={checkoutSessionData}
          isOpen={Boolean(checkoutModalDevice)}
          onClose={() => {
            setCheckoutModalDevice(null);
            setCheckoutSessionData(null);
          }}
        />
      )}

      {transferModalDevice && (
        <TransferModal
          device={transferModalDevice}
          isOpen={Boolean(transferModalDevice)}
          onClose={() => setTransferModalDevice(null)}
        />
      )}
    </div>
  );
}
