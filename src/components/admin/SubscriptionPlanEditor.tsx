
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

export type SubscriptionPlan = {
  id: number;
  name: string;
  price: number;
  features: string[];
  durations: {
    id: number;
    months: number;
    priceMultiplier: number;
    isPopular: boolean;
  }[];
};

interface SubscriptionPlanEditorProps {
  plans: SubscriptionPlan[];
  onUpdatePlans: (plans: SubscriptionPlan[]) => void;
}

const SubscriptionPlanEditor = ({ plans, onUpdatePlans }: SubscriptionPlanEditorProps) => {
  const [newDuration, setNewDuration] = useState({ months: 0, priceMultiplier: 0, isPopular: false });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const updateSubscriptionPlan = (id: number, field: string, value: string | number) => {
    const updatedPlans = plans.map(plan =>
      plan.id === id ? { ...plan, [field]: field === 'price' ? parseInt(value.toString()) : value } : plan
    );
    onUpdatePlans(updatedPlans);
  };

  const handleSavePlan = (id: number) => {
    toast.success(`Perubahan pada paket berhasil disimpan`);
  };

  const addDuration = (planId: number) => {
    if (newDuration.months <= 0 || newDuration.priceMultiplier <= 0) {
      toast.error("Masa berlaku dan pengali harga harus lebih dari 0");
      return;
    }

    const updatedPlans = plans.map(plan => {
      if (plan.id === planId) {
        const newDurationId = Math.max(...plan.durations.map(d => d.id)) + 1;
        return {
          ...plan,
          durations: [
            ...plan.durations,
            {
              id: newDurationId,
              months: newDuration.months,
              priceMultiplier: newDuration.priceMultiplier,
              isPopular: newDuration.isPopular
            }
          ]
        };
      }
      return plan;
    });
    
    onUpdatePlans(updatedPlans);
    setNewDuration({ months: 0, priceMultiplier: 0, isPopular: false });
    toast.success("Durasi langganan berhasil ditambahkan");
  };

  const removeDuration = (planId: number, durationId: number) => {
    const updatedPlans = plans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          durations: plan.durations.filter(d => d.id !== durationId)
        };
      }
      return plan;
    });

    onUpdatePlans(updatedPlans);
    toast.success("Durasi langganan berhasil dihapus");
  };

  const togglePopular = (planId: number, durationId: number) => {
    const updatedPlans = plans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          durations: plan.durations.map(d => ({
            ...d,
            isPopular: d.id === durationId ? !d.isPopular : false
          }))
        };
      }
      return plan;
    });

    onUpdatePlans(updatedPlans);
    toast.success("Status popularitas berhasil diperbarui");
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {plans.map(plan => (
        <div key={plan.id} className="border rounded-lg p-4 shadow-sm">
          <input 
            className="text-lg font-bold w-full mb-2 border-b pb-2" 
            value={plan.name} 
            onChange={(e) => updateSubscriptionPlan(plan.id, 'name', e.target.value)}
          />
          <div className="flex items-center mb-2">
            <span className="text-sm mr-1">Rp</span>
            <input 
              className="text-xl font-semibold w-full" 
              type="number"
              value={plan.price} 
              onChange={(e) => updateSubscriptionPlan(plan.id, 'price', parseInt(e.target.value))}
            />
            <span className="text-sm">/bulan</span>
          </div>
          <ul className="mt-3 space-y-1">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="text-sm flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                {feature}
              </li>
            ))}
          </ul>

          {/* Duration options */}
          <div className="mt-4 border-t pt-3">
            <h4 className="text-sm font-medium mb-2">Durasi Langganan</h4>
            <div className="space-y-2">
              {plan.durations.map(duration => (
                <div key={duration.id} className="flex items-center justify-between text-sm border-b pb-2">
                  <div>
                    <span className="font-medium">{duration.months} bulan</span>
                    {duration.isPopular && (
                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">
                        Populer
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{formatPrice(plan.price * duration.priceMultiplier)}</span>
                    <button
                      className="text-blue-600 hover:text-blue-800 p-1"
                      onClick={() => togglePopular(plan.id, duration.id)}
                    >
                      {duration.isPopular ? "Hapus Populer" : "Set Populer"}
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 p-1"
                      onClick={() => removeDuration(plan.id, duration.id)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new duration */}
            <div className="mt-3 flex gap-2">
              <input
                type="number"
                placeholder="Bulan"
                className="border rounded px-2 py-1 w-16 text-sm"
                value={newDuration.months || ""}
                onChange={(e) => setNewDuration({...newDuration, months: parseInt(e.target.value) || 0})}
              />
              <input
                type="number"
                step="0.1"
                placeholder="Pengali"
                className="border rounded px-2 py-1 w-20 text-sm"
                value={newDuration.priceMultiplier || ""}
                onChange={(e) => setNewDuration({...newDuration, priceMultiplier: parseFloat(e.target.value) || 0})}
              />
              <button
                className="text-white bg-blue-600 hover:bg-blue-700 rounded px-2 py-1 text-sm"
                onClick={() => addDuration(plan.id)}
              >
                Tambah
              </button>
            </div>
          </div>

          <Button 
            className="w-full mt-4"
            onClick={() => handleSavePlan(plan.id)}
          >
            Simpan Perubahan
          </Button>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionPlanEditor;
