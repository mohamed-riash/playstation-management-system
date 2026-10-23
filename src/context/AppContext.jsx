import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  INITIAL_DEVICES,
  INITIAL_INVENTORY,
  INITIAL_INVOICES,
  INITIAL_EXPENSES,
  INITIAL_SETTINGS,
  INITIAL_STAFF,
  INITIAL_SHIFT,
} from '../utils/constants';
import { useAudio } from './AudioContext';
import confetti from 'canvas-confetti';

// Automatically clean legacy mock data from browser localStorage if present
if (typeof window !== 'undefined' && window.localStorage) {
  const legacyV1Keys = [
    'vip_gaming_devices_v1',
    'vip_gaming_inventory_v1',
    'vip_gaming_invoices_v1',
    'vip_gaming_expenses_v1',
    'vip_gaming_settings_v1',
    'vip_gaming_staff_v1',
    'vip_gaming_shift_v1',
    'vip_gaming_shift_history_v1',
  ];
  legacyV1Keys.forEach((key) => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore errors when clearing legacy storage
    }
  });
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { playTone } = useAudio();

  // Navigation State
  const [activeTab, setActiveTab] = useState('devices');

  // Persistent States (v2 - Clean Production Dataset)
  const [devices, setDevices] = useLocalStorage('vip_gaming_devices_v2', INITIAL_DEVICES);
  const [inventory, setInventory] = useLocalStorage('vip_gaming_inventory_v2', INITIAL_INVENTORY);
  const [invoices, setInvoices] = useLocalStorage('vip_gaming_invoices_v2', INITIAL_INVOICES);
  const [expenses, setExpenses] = useLocalStorage('vip_gaming_expenses_v2', INITIAL_EXPENSES);
  const [settings, setSettings] = useLocalStorage('vip_gaming_settings_v2', INITIAL_SETTINGS);
  const [staff, setStaff] = useLocalStorage('vip_gaming_staff_v2', INITIAL_STAFF);
  const [currentShift, setCurrentShift] = useLocalStorage('vip_gaming_shift_v2', INITIAL_SHIFT);
  const [shiftHistory, setShiftHistory] = useLocalStorage('vip_gaming_shift_history_v2', []);

  // UI Modals State
  const [activeReceiptModal, setActiveReceiptModal] = useState(null);
  const [shiftClosureModalOpen, setShiftClosureModalOpen] = useState(false);
  const [staffPinModalOpen, setStaffPinModalOpen] = useState(false);

  // Active cashier
  const activeStaffMember = staff.find((s) => s.active) || staff[0];

  // ==========================================
  // DEVICE & SESSION ACTIONS
  // ==========================================

  const startSession = (deviceId, { type = 'open', durationMinutes = 60, mode = 'single', customerName = '' }) => {
    setDevices((prevDevices) =>
      prevDevices.map((dev) => {
        if (dev.id !== deviceId) return dev;
        return {
          ...dev,
          status: 'occupied',
          activeSession: {
            id: `sess-${Date.now()}`,
            startTime: Date.now(),
            type,
            durationMinutes: type === 'fixed' ? Number(durationMinutes) : null,
            mode,
            customerName: customerName.trim() || 'عميل بدون اسم',
            isPaused: false,
            pausedDuration: 0,
            pausedAt: null,
            orders: [],
          },
        };
      })
    );
    playTone('start');
  };

  const pauseSession = (deviceId) => {
    setDevices((prevDevices) =>
      prevDevices.map((dev) => {
        if (dev.id !== deviceId || !dev.activeSession) return dev;
        if (dev.activeSession.isPaused) return dev;
        return {
          ...dev,
          activeSession: {
            ...dev.activeSession,
            isPaused: true,
            pausedAt: Date.now(),
          },
        };
      })
    );
    playTone('click');
  };

  const resumeSession = (deviceId) => {
    setDevices((prevDevices) =>
      prevDevices.map((dev) => {
        if (dev.id !== deviceId || !dev.activeSession) return dev;
        if (!dev.activeSession.isPaused) return dev;
        const additionalPaused = dev.activeSession.pausedAt
          ? Date.now() - dev.activeSession.pausedAt
          : 0;
        return {
          ...dev,
          activeSession: {
            ...dev.activeSession,
            isPaused: false,
            pausedDuration: (dev.activeSession.pausedDuration || 0) + additionalPaused,
            pausedAt: null,
          },
        };
      })
    );
    playTone('click');
  };

  const switchMode = (deviceId, newMode) => {
    setDevices((prevDevices) =>
      prevDevices.map((dev) => {
        if (dev.id !== deviceId || !dev.activeSession) return dev;
        return {
          ...dev,
          activeSession: {
            ...dev.activeSession,
            mode: newMode,
          },
        };
      })
    );
    playTone('click');
  };

  const extendSession = (deviceId, extraMinutes) => {
    setDevices((prevDevices) =>
      prevDevices.map((dev) => {
        if (dev.id !== deviceId || !dev.activeSession) return dev;
        if (dev.activeSession.type === 'open') return dev;
        const currentMins = dev.activeSession.durationMinutes || 0;
        return {
          ...dev,
          activeSession: {
            ...dev.activeSession,
            durationMinutes: currentMins + Number(extraMinutes),
          },
        };
      })
    );
    playTone('start');
  };

  const convertToOpenSession = (deviceId) => {
    setDevices((prevDevices) =>
      prevDevices.map((dev) => {
        if (dev.id !== deviceId || !dev.activeSession) return dev;
        return {
          ...dev,
          activeSession: {
            ...dev.activeSession,
            type: 'open',
            durationMinutes: null,
          },
        };
      })
    );
    playTone('click');
  };

  const transferSession = (fromDeviceId, toDeviceId) => {
    const fromDev = devices.find((d) => d.id === fromDeviceId);
    const toDev = devices.find((d) => d.id === toDeviceId);

    if (!fromDev || !toDev || !fromDev.activeSession || toDev.status !== 'available') {
      return false;
    }

    const sessionToMove = { ...fromDev.activeSession };

    setDevices((prevDevices) =>
      prevDevices.map((dev) => {
        if (dev.id === fromDeviceId) {
          return {
            ...dev,
            status: 'available',
            activeSession: null,
          };
        }
        if (dev.id === toDeviceId) {
          return {
            ...dev,
            status: 'occupied',
            activeSession: sessionToMove,
          };
        }
        return dev;
      })
    );

    playTone('start');
    return true;
  };

  // Add cafe orders directly to a device session
  const addOrderToDevice = (deviceId, cartItems) => {
    if (!cartItems || cartItems.length === 0) return;

    setDevices((prevDevices) =>
      prevDevices.map((dev) => {
        if (dev.id !== deviceId || !dev.activeSession) return dev;
        const existingOrders = [...(dev.activeSession.orders || [])];

        cartItems.forEach((cartItem) => {
          const existingIdx = existingOrders.findIndex((o) => o.id === cartItem.id);
          if (existingIdx >= 0) {
            existingOrders[existingIdx] = {
              ...existingOrders[existingIdx],
              qty: existingOrders[existingIdx].qty + cartItem.qty,
            };
          } else {
            existingOrders.push({ ...cartItem });
          }
        });

        return {
          ...dev,
          activeSession: {
            ...dev.activeSession,
            orders: existingOrders,
          },
        };
      })
    );

    // Deduct stock from inventory
    setInventory((prevInv) =>
      prevInv.map((item) => {
        const found = cartItems.find((c) => c.id === item.id);
        if (found) {
          return {
            ...item,
            stock: Math.max(0, item.stock - found.qty),
          };
        }
        return item;
      })
    );

    playTone('click');
  };

  // Checkout and complete session
  const checkoutSession = (deviceId, checkoutData) => {
    const dev = devices.find((d) => d.id === deviceId);
    if (!dev || !dev.activeSession) return null;

    const invoiceNum = (invoices.length > 0 ? Math.max(...invoices.map((i) => i.invoiceNumber || 1000)) : 1000) + 1;
    const newInvoice = {
      id: `INV-${new Date().getFullYear()}-${String(invoiceNum).padStart(4, '0')}`,
      invoiceNumber: invoiceNum,
      date: new Date().toISOString(),
      type: 'device_session',
      deviceId: dev.id,
      deviceName: dev.name,
      customerName: checkoutData.customerName || dev.activeSession.customerName || 'عميل',
      durationSeconds: checkoutData.durationSeconds,
      deviceCost: Number(checkoutData.deviceCost) || 0,
      cafeCost: Number(checkoutData.cafeCost) || 0,
      discount: Number(checkoutData.discount) || 0,
      tax: Number(checkoutData.tax) || 0,
      serviceFee: Number(checkoutData.serviceFee) || 0,
      total: Number(checkoutData.total) || 0,
      paymentMethod: checkoutData.paymentMethod || 'cash',
      paidAmount: Number(checkoutData.paidAmount) || Number(checkoutData.total) || 0,
      changeDue: Number(checkoutData.changeDue) || 0,
      cashierName: activeStaffMember.name,
      shiftId: currentShift.id,
      items: checkoutData.items || [],
      notes: checkoutData.notes || '',
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    // Reset device to available
    setDevices((prevDevices) =>
      prevDevices.map((d) => {
        if (d.id !== deviceId) return d;
        return {
          ...d,
          status: 'available',
          activeSession: null,
        };
      })
    );

    playTone('success');
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }

    setActiveReceiptModal(newInvoice);
    return newInvoice;
  };

  // Walk-in POS standalone order
  const createWalkInOrder = (cartItems, checkoutData) => {
    if (!cartItems || cartItems.length === 0) return null;

    const invoiceNum = (invoices.length > 0 ? Math.max(...invoices.map((i) => i.invoiceNumber || 1000)) : 1000) + 1;
    const newInvoice = {
      id: `INV-${new Date().getFullYear()}-${String(invoiceNum).padStart(4, '0')}`,
      invoiceNumber: invoiceNum,
      date: new Date().toISOString(),
      type: 'walkin_cafe',
      deviceName: 'طلب خارجي (كافيه)',
      customerName: checkoutData.customerName || 'عميل كافيه',
      durationSeconds: 0,
      deviceCost: 0,
      cafeCost: Number(checkoutData.cafeCost) || 0,
      discount: Number(checkoutData.discount) || 0,
      tax: Number(checkoutData.tax) || 0,
      serviceFee: 0,
      total: Number(checkoutData.total) || 0,
      paymentMethod: checkoutData.paymentMethod || 'cash',
      paidAmount: Number(checkoutData.paidAmount) || Number(checkoutData.total) || 0,
      changeDue: Number(checkoutData.changeDue) || 0,
      cashierName: activeStaffMember.name,
      shiftId: currentShift.id,
      items: cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
      notes: checkoutData.notes || '',
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    // Deduct stock
    setInventory((prevInv) =>
      prevInv.map((item) => {
        const found = cartItems.find((c) => c.id === item.id);
        if (found) {
          return {
            ...item,
            stock: Math.max(0, item.stock - found.qty),
          };
        }
        return item;
      })
    );

    playTone('success');
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }

    setActiveReceiptModal(newInvoice);
    return newInvoice;
  };

  // Device Management
  const addDevice = (newDeviceData) => {
    const newDev = {
      id: `dev-${Date.now()}`,
      name: newDeviceData.name,
      type: newDeviceData.type || 'ps5',
      screenSize: newDeviceData.screenSize || 'شاشة 55 بوصة',
      rates: {
        single: Number(newDeviceData.rates?.single) || 40,
        multi: Number(newDeviceData.rates?.multi) || 60,
        vip: Number(newDeviceData.rates?.vip) || 90,
      },
      status: 'available',
      activeSession: null,
    };
    setDevices((prev) => [...prev, newDev]);
    playTone('start');
  };

  const updateDevice = (deviceId, updatedFields) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === deviceId ? { ...d, ...updatedFields } : d))
    );
    playTone('click');
  };

  const deleteDevice = (deviceId) => {
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
    playTone('click');
  };

  // ==========================================
  // INVENTORY ACTIONS
  // ==========================================

  const addInventoryItem = (itemData) => {
    const newItem = {
      id: `item-${Date.now()}`,
      name: itemData.name,
      category: itemData.category || 'hot_drinks',
      price: Number(itemData.price) || 0,
      cost: Number(itemData.cost) || 0,
      stock: Number(itemData.stock) || 0,
      minStock: Number(itemData.minStock) || 10,
    };
    setInventory((prev) => [newItem, ...prev]);
    playTone('start');
  };

  const updateInventoryItem = (itemId, updatedFields) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              ...updatedFields,
              price: Number(updatedFields.price ?? item.price),
              cost: Number(updatedFields.cost ?? item.cost),
              stock: Number(updatedFields.stock ?? item.stock),
              minStock: Number(updatedFields.minStock ?? item.minStock),
            }
          : item
      )
    );
    playTone('click');
  };

  const deleteInventoryItem = (itemId) => {
    setInventory((prev) => prev.filter((item) => item.id !== itemId));
    playTone('click');
  };

  const restockItem = (itemId, addedQty, newCost) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          stock: item.stock + Number(addedQty),
          cost: newCost !== undefined && newCost !== '' ? Number(newCost) : item.cost,
        };
      })
    );
    playTone('start');
  };

  // ==========================================
  // EXPENSES ACTIONS
  // ==========================================

  const addExpense = (expenseData) => {
    const newExp = {
      id: `exp-${Date.now()}`,
      date: new Date().toISOString(),
      category: expenseData.category || 'general',
      title: expenseData.title,
      amount: Number(expenseData.amount) || 0,
      paidBy: activeStaffMember.name,
      notes: expenseData.notes || '',
    };
    setExpenses((prev) => [newExp, ...prev]);
    playTone('click');
  };

  const deleteExpense = (expId) => {
    setExpenses((prev) => prev.filter((e) => e.id !== expId));
    playTone('click');
  };

  // ==========================================
  // SHIFT CLOSURE (Z-REPORT)
  // ==========================================

  const closeShift = ({ countedCash, notes = '' }) => {
    const shiftStart = new Date(currentShift.startTime).getTime();
    const shiftInvoices = invoices.filter(
      (inv) => new Date(inv.date).getTime() >= shiftStart
    );
    const shiftExpenses = expenses.filter(
      (exp) => new Date(exp.date).getTime() >= shiftStart
    );

    const totalCashSales = shiftInvoices
      .filter((i) => i.paymentMethod === 'cash')
      .reduce((sum, i) => sum + i.total, 0);

    const totalCardSales = shiftInvoices
      .filter((i) => i.paymentMethod === 'card')
      .reduce((sum, i) => sum + i.total, 0);

    const totalWalletSales = shiftInvoices
      .filter((i) => i.paymentMethod === 'wallet')
      .reduce((sum, i) => sum + i.total, 0);

    const totalRevenue = totalCashSales + totalCardSales + totalWalletSales;
    const totalExpensesAmount = shiftExpenses.reduce((sum, e) => sum + e.amount, 0);

    const startingCash = Number(currentShift.startingCash) || 0;
    const expectedCashInDrawer = startingCash + totalCashSales - totalExpensesAmount;
    const actualCash = Number(countedCash) || 0;
    const discrepancy = actualCash - expectedCashInDrawer;

    const closedRecord = {
      id: currentShift.id,
      shiftNumber: currentShift.shiftNumber,
      cashierName: currentShift.cashierName,
      closedBy: activeStaffMember.name,
      startTime: currentShift.startTime,
      endTime: new Date().toISOString(),
      startingCash,
      totalCashSales,
      totalCardSales,
      totalWalletSales,
      totalRevenue,
      totalExpensesAmount,
      expectedCashInDrawer,
      actualCash,
      discrepancy, // > 0 surplus, < 0 deficit
      notes,
      invoicesCount: shiftInvoices.length,
    };

    setShiftHistory((prev) => [closedRecord, ...prev]);

    // Initialize next shift with actual counted cash as opening balance
    const nextShift = {
      id: `shift-${Date.now()}`,
      shiftNumber: (currentShift.shiftNumber || 1) + 1,
      cashierName: activeStaffMember.name,
      startTime: new Date().toISOString(),
      startingCash: actualCash,
      status: 'active',
    };
    setCurrentShift(nextShift);
    playTone('success');
    return closedRecord;
  };

  // Switch Staff / Cashier
  const switchStaffMember = (staffId) => {
    setStaff((prev) =>
      prev.map((s) => ({
        ...s,
        active: s.id === staffId,
      }))
    );
    playTone('click');
  };

  // Add Staff Member
  const addStaffMember = ({ name, role = 'كاشير', pin = '0000' }) => {
    const newMember = {
      id: `staff-${Date.now()}`,
      name: name.trim() || 'موظف جديد',
      role: role.trim() || 'كاشير',
      pin: pin.trim() || '0000',
      active: false,
    };
    setStaff((prev) => [...prev, newMember]);
    playTone('success');
  };

  // Update Staff Member
  const updateStaffMember = (staffId, updatedFields) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, ...updatedFields } : s))
    );
    playTone('success');
  };

  // Delete Staff Member
  const deleteStaffMember = (staffId) => {
    if (staff.length <= 1) return;
    setStaff((prev) => {
      const filtered = prev.filter((s) => s.id !== staffId);
      if (!filtered.some((s) => s.active) && filtered.length > 0) {
        filtered[0].active = true;
      }
      return filtered;
    });
    playTone('click');
  };

  // Clear Invoices & Sales Records (keeps devices and inventory intact)
  const clearSalesHistory = () => {
    setInvoices([]);
    setExpenses([]);
    setShiftHistory([]);
    setCurrentShift({
      ...INITIAL_SHIFT,
      startTime: new Date().toISOString(),
    });
    playTone('success');
  };

  // Reset to default dataset
  const resetToDefaultData = () => {
    setDevices(INITIAL_DEVICES);
    setInventory(INITIAL_INVENTORY);
    setInvoices(INITIAL_INVOICES);
    setExpenses(INITIAL_EXPENSES);
    setSettings(INITIAL_SETTINGS);
    setStaff(INITIAL_STAFF);
    setCurrentShift({
      ...INITIAL_SHIFT,
      startTime: new Date().toISOString(),
    });
    setShiftHistory([]);
    playTone('success');
  };

  // Calculate low stock items count
  const lowStockItems = inventory.filter((item) => item.stock <= item.minStock);

  // Calculate quick metrics for today
  const todayInvoices = invoices.filter((inv) => {
    const invDate = new Date(inv.date).toDateString();
    const today = new Date().toDateString();
    return invDate === today;
  });

  const todayRevenue = todayInvoices.reduce((acc, inv) => acc + (Number(inv.total) || 0), 0);
  const activeDevicesCount = devices.filter((d) => d.status === 'occupied').length;

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        devices,
        inventory,
        invoices,
        expenses,
        settings,
        setSettings,
        staff,
        activeStaffMember,
        switchStaffMember,
        addStaffMember,
        updateStaffMember,
        deleteStaffMember,
        currentShift,
        shiftHistory,
        lowStockItems,
        todayRevenue,
        activeDevicesCount,
        // Modals
        activeReceiptModal,
        setActiveReceiptModal,
        shiftClosureModalOpen,
        setShiftClosureModalOpen,
        staffPinModalOpen,
        setStaffPinModalOpen,
        // Operations
        startSession,
        pauseSession,
        resumeSession,
        switchMode,
        extendSession,
        convertToOpenSession,
        transferSession,
        addOrderToDevice,
        checkoutSession,
        createWalkInOrder,
        addDevice,
        updateDevice,
        deleteDevice,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        restockItem,
        addExpense,
        deleteExpense,
        closeShift,
        clearSalesHistory,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
