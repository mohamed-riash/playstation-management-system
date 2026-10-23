import React, { useState } from 'react';
import {
  Settings,
  Building,
  Gamepad2,
  Shield,
  RotateCcw,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Edit2,
  KeyRound,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { formatCurrency } from '../../utils/formatters';
import { DEVICE_TYPES } from '../../utils/constants';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { AddDeviceModal } from './AddDeviceModal';

export function SettingsView() {
  const {
    settings,
    setSettings,
    devices,
    deleteDevice,
    updateDevice,
    staff,
    addStaffMember,
    updateStaffMember,
    deleteStaffMember,
    clearSalesHistory,
    resetToDefaultData,
  } = useApp();

  const { playTone } = useAudio();

  const [activeSection, setActiveSection] = useState('lounge'); // lounge, devices, staff, general
  const [formData, setFormData] = useState({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [addDeviceModalOpen, setAddDeviceModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [editStaffData, setEditStaffData] = useState({ name: '', role: '', pin: '' });
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaffData, setNewStaffData] = useState({ name: '', role: 'كاشير', pin: '' });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettings(formData);
    setSaveSuccess(true);
    playTone('success');
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleRateChange = (deviceId, modeKey, newRate) => {
    const dev = devices.find((d) => d.id === deviceId);
    if (!dev) return;
    updateDevice(deviceId, {
      rates: {
        ...dev.rates,
        [modeKey]: Number(newRate) || 0,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-[#131722] border border-[#232C42] rounded-2xl">
        <button
          onClick={() => setActiveSection('lounge')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSection === 'lounge'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>بيانات الصالة والفاتورة</span>
        </button>

        <button
          onClick={() => setActiveSection('devices')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSection === 'devices'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>إدارة الأجهزة والأسعار ({devices.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('staff')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSection === 'staff'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>الموظفين ورموز PIN</span>
        </button>

        <button
          onClick={() => setActiveSection('general')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSection === 'general'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>النظام والتنبيهات</span>
        </button>
      </div>

      {/* SECTION 1: LOUNGE PROFILE */}
      {activeSection === 'lounge' && (
        <form
          onSubmit={handleSaveSettings}
          className="bg-[#131722] border border-[#232C42] rounded-2xl p-6 space-y-5 max-w-3xl"
        >
          <div className="border-b border-[#232C42] pb-3">
            <h3 className="text-base font-bold text-white">بيانات الصالة وترويسة الفاتورة</h3>
            <p className="text-xs text-slate-400">تظهر هذه البيانات على الفاتورة الحرارية المطبوعة للعميل</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="اسم الصالة / الكافيه:"
              required
              value={formData.loungeName}
              onChange={(e) => setFormData({ ...formData, loungeName: e.target.value })}
            />
            <Input
              label="الشعار أو الوصف المختصر:"
              value={formData.loungeTagline}
              onChange={(e) => setFormData({ ...formData, loungeTagline: e.target.value })}
            />
            <Input
              label="العنوان بالتفصيل:"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Input
              label="رقم الهاتف والتواصل:"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <Input
            label="رسالة تذييل الفاتورة (Footer Note):"
            value={formData.receiptFooterNote}
            onChange={(e) => setFormData({ ...formData, receiptFooterNote: e.target.value })}
            helperText="تظهر في أسفل الفاتورة الحرارية للترحيب بالعميل"
          />

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="success"
              size="md"
              icon={Save}
              className="font-bold"
            >
              حفظ التغييرات
            </Button>
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                تم حفظ التعديلات بنجاح!
              </span>
            )}
          </div>
        </form>
      )}

      {/* SECTION 2: DEVICE MANAGEMENT */}
      {activeSection === 'devices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">أجهزة الصالة وتسعير الساعات</h3>
              <p className="text-xs text-slate-400">يمكنك تعديل أسعار الساعة الفردي والزوجي وVIP مباشرة</p>
            </div>
            <Button
              variant="success"
              size="md"
              icon={Plus}
              onClick={() => setAddDeviceModalOpen(true)}
            >
              إضافة جهاز جديد
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {devices.map((device) => {
              const isOccupied = device.status === 'occupied';
              return (
                <div
                  key={device.id}
                  className="p-4 rounded-2xl bg-[#131722] border border-[#232C42] space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#1F273E] pb-2.5">
                    <div>
                      <h4 className="text-sm font-bold text-white">{device.name}</h4>
                      <p className="text-[11px] text-slate-400">{device.screenSize}</p>
                    </div>
                    <Badge variant={isOccupied ? 'success' : 'default'} size="sm">
                      {isOccupied ? 'مشغول حالياً' : 'متاح'}
                    </Badge>
                  </div>

                  {/* Hourly Rates inputs */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">فردي (ج.م):</label>
                      <input
                        type="number"
                        min="0"
                        value={device.rates?.single || 40}
                        onChange={(e) => handleRateChange(device.id, 'single', e.target.value)}
                        className="w-full bg-[#0F131D] border border-[#232C42] rounded-lg px-2 py-1 text-center font-bold text-emerald-400 font-mono-numbers focus:border-violet-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">زوجي (ج.م):</label>
                      <input
                        type="number"
                        min="0"
                        value={device.rates?.multi || 60}
                        onChange={(e) => handleRateChange(device.id, 'multi', e.target.value)}
                        className="w-full bg-[#0F131D] border border-[#232C42] rounded-lg px-2 py-1 text-center font-bold text-violet-400 font-mono-numbers focus:border-violet-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">VIP (ج.م):</label>
                      <input
                        type="number"
                        min="0"
                        value={device.rates?.vip || 90}
                        onChange={(e) => handleRateChange(device.id, 'vip', e.target.value)}
                        className="w-full bg-[#0F131D] border border-[#232C42] rounded-lg px-2 py-1 text-center font-bold text-amber-400 font-mono-numbers focus:border-violet-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1F273E] flex justify-end">
                    <button
                      onClick={() => {
                        if (isOccupied) {
                          alert('لا يمكن حذف جهاز عليه جلسة نشطة حالياً!');
                          return;
                        }
                        if (confirm(`هل أنت متأكد من حذف الجهاز "${device.name}"؟`)) {
                          deleteDevice(device.id);
                        }
                      }}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف الجهاز</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {addDeviceModalOpen && (
            <AddDeviceModal
              isOpen={addDeviceModalOpen}
              onClose={() => setAddDeviceModalOpen(false)}
            />
          )}
        </div>
      )}

      {/* SECTION 3: STAFF & PINS */}
      {activeSection === 'staff' && (
        <div className="bg-[#131722] border border-[#232C42] rounded-2xl p-6 space-y-4 max-w-3xl">
          <div className="flex items-center justify-between border-b border-[#232C42] pb-3">
            <div>
              <h3 className="text-base font-bold text-white">طاقم العمل والكاشير</h3>
              <p className="text-xs text-slate-400">إدارة حسابات الكباتن والمشرفين ورموز الدخول (PIN)</p>
            </div>
            {!showAddStaff && (
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => {
                  setShowAddStaff(true);
                  setNewStaffData({ name: '', role: 'كاشير', pin: '' });
                }}
              >
                إضافة موظف جديد
              </Button>
            )}
          </div>

          {/* Add Staff Form */}
          {showAddStaff && (
            <div className="p-4 rounded-xl bg-[#0F131D] border border-violet-500/40 space-y-3">
              <h4 className="text-xs font-bold text-violet-300">بيانات الموظف الجديد:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="اسم الموظف / الكابتن:"
                  placeholder="مثال: أحمد علي"
                  required
                  value={newStaffData.name}
                  onChange={(e) => setNewStaffData({ ...newStaffData, name: e.target.value })}
                />
                <Input
                  label="المسمى الوظيفي:"
                  placeholder="كاشير / مشرف"
                  value={newStaffData.role}
                  onChange={(e) => setNewStaffData({ ...newStaffData, role: e.target.value })}
                />
                <Input
                  label="رمز PIN (4 أرقام):"
                  type="text"
                  maxLength={6}
                  placeholder="1234"
                  required
                  value={newStaffData.pin}
                  onChange={(e) => setNewStaffData({ ...newStaffData, pin: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2 justify-end pt-1">
                <Button
                  variant="primary"
                  size="sm"
                  icon={Save}
                  onClick={() => {
                    if (!newStaffData.name.trim() || !newStaffData.pin.trim()) {
                      alert('يرجى إدخال اسم الموظف ورمز PIN');
                      return;
                    }
                    addStaffMember(newStaffData);
                    setShowAddStaff(false);
                    setNewStaffData({ name: '', role: 'كاشير', pin: '' });
                  }}
                >
                  حفظ الموظف
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={X}
                  onClick={() => setShowAddStaff(false)}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          )}

          {/* Staff List */}
          <div className="space-y-3">
            {staff.map((member) => {
              const isEditing = editingStaffId === member.id;

              if (isEditing) {
                return (
                  <div
                    key={member.id}
                    className="p-4 rounded-xl bg-[#0F131D] border border-violet-500/40 space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Input
                        label="اسم الموظف:"
                        value={editStaffData.name}
                        onChange={(e) => setEditStaffData({ ...editStaffData, name: e.target.value })}
                      />
                      <Input
                        label="الوظيفة:"
                        value={editStaffData.role}
                        onChange={(e) => setEditStaffData({ ...editStaffData, role: e.target.value })}
                      />
                      <Input
                        label="رمز PIN:"
                        value={editStaffData.pin}
                        onChange={(e) => setEditStaffData({ ...editStaffData, pin: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="primary"
                        size="sm"
                        icon={Save}
                        onClick={() => {
                          if (!editStaffData.name.trim() || !editStaffData.pin.trim()) return;
                          updateStaffMember(member.id, editStaffData);
                          setEditingStaffId(null);
                        }}
                      >
                        حفظ التعديل
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingStaffId(null)}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={member.id}
                  className="p-3.5 rounded-xl bg-[#0F131D] border border-[#232C42] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold text-xs">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {member.name}
                        {member.active && (
                          <Badge variant="success" size="sm">
                            الكاشير النشط حالياً
                          </Badge>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400">{member.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-400">PIN:</span>
                      <span className="px-2 py-0.5 rounded bg-[#181E2F] border border-[#232C42] text-xs font-mono font-bold text-emerald-400">
                        {member.pin}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setEditingStaffId(member.id);
                        setEditStaffData({
                          name: member.name,
                          role: member.role,
                          pin: member.pin,
                        });
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="تعديل الموظف"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {staff.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من حذف حساب "${member.name}"؟`)) {
                            deleteStaffMember(member.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="حذف الموظف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 4: GENERAL & FACTORY RESET */}
      {activeSection === 'general' && (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-[#131722] border border-[#232C42] rounded-2xl p-6 space-y-4">
            <div className="border-b border-[#232C42] pb-3">
              <h3 className="text-base font-bold text-white">إعدادات النظام العامة والتنبيهات</h3>
              <p className="text-xs text-slate-400">تخصيص تنبيهات الوقت والمؤقتات والعهدة النقدية</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="تنبيه قبل انتهاء الوقت المحدد بـ (دقائق):"
                type="number"
                min="1"
                max="30"
                value={settings.warningCountdownMinutes || 5}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    warningCountdownMinutes: Number(e.target.value),
                  })
                }
                helperText="يتم إطلاق نغمة تحذيرية وتلوين بطاقة الجهاز بالأصفر"
              />

              <Input
                label="العهدة النقدية الافتتاحية التلقائية للوردية (ج.م):"
                type="number"
                min="0"
                value={settings.startingCashDefault ?? 500}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    startingCashDefault: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          {/* Clear Sales & Invoices Records */}
          <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <FileSpreadsheet className="w-5 h-5" />
              <h3 className="text-sm font-bold">تصفير سجلات المبيعات والفواتير</h3>
            </div>
            <p className="text-xs text-slate-300">
              يقوم هذا الخيار بمسح جميع الفواتير والمصروفات المسجلة وتصفير الوردية الحالية، مع الحفاظ التام على الأجهزة والأسعار وقائمة المخزن.
            </p>
            <Button
              variant="outline"
              size="md"
              icon={RotateCcw}
              onClick={() => {
                if (confirm('هل أنت متأكد من مسح جميع الفواتير والمصروفات المسجلة وتصفير العمليات؟')) {
                  clearSalesHistory();
                }
              }}
            >
              تصفير الفواتير والعمليات المالية
            </Button>
          </div>

          {/* Danger Zone / Factory Reset */}
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-rose-400">
              <RotateCcw className="w-5 h-5 text-rose-400" />
              <h3 className="text-sm font-bold">إعادة ضبط المصنع وتهيئة النظام بالكامل</h3>
            </div>
            <p className="text-xs text-slate-300">
              يقوم هذا الخيار بإعادة تهيئة النظام بالكامل للحالة النظيفة الجاهزة للتشغيل (إفراغ الفواتير، إتاحة كافة الأجهزة، إعادة ضبط الإعدادات الافتراضية).
            </p>
            <Button
              variant="danger"
              size="md"
              icon={RotateCcw}
              onClick={() => {
                if (confirm('تحذير: هل أنت متأكد من إعادة ضبط المصنع وتهيئة النظام بالكامل؟')) {
                  resetToDefaultData();
                }
              }}
            >
              إعادة ضبط المصنع الشامل
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
