
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

export type PaymentMethod = {
  id: number;
  name: string;
  enabled: boolean;
};

interface PaymentMethodsManagerProps {
  paymentMethods: PaymentMethod[];
  onUpdatePaymentMethods: (methods: PaymentMethod[]) => void;
}

const PaymentMethodsManager = ({ 
  paymentMethods, 
  onUpdatePaymentMethods 
}: PaymentMethodsManagerProps) => {
  
  const togglePaymentMethod = (id: number) => {
    const updatedMethods = paymentMethods.map(method => 
      method.id === id ? {...method, enabled: !method.enabled} : method
    );
    
    onUpdatePaymentMethods(updatedMethods);
    toast.success("Metode pembayaran diperbarui");
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {paymentMethods.map(method => (
        <div key={method.id} className="flex justify-between items-center border rounded-lg p-4">
          <div>
            <h3 className="font-medium">{method.name}</h3>
            <p className="text-sm text-gray-500">
              {method.enabled ? "Aktif" : "Tidak Aktif"}
            </p>
          </div>
          <Button 
            variant={method.enabled ? "default" : "outline"}
            onClick={() => togglePaymentMethod(method.id)}
          >
            {method.enabled ? "Nonaktifkan" : "Aktifkan"}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethodsManager;
