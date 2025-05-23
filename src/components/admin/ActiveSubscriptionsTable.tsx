
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type Subscription = {
  id: number;
  userId: string;
  email: string;
  plan: string;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "cancelled";
  duration: number;
  paymentMethod: string;
};

interface ActiveSubscriptionsTableProps {
  subscriptions: Subscription[];
  onRenew: (id: number) => void;
  onCancel: (id: number) => void;
  onExtend: (id: number, months: number) => void;
}

const ActiveSubscriptionsTable = ({ 
  subscriptions,
  onRenew,
  onCancel,
  onExtend
}: ActiveSubscriptionsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pengguna</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Paket</TableHead>
            <TableHead>Mulai</TableHead>
            <TableHead>Berakhir</TableHead>
            <TableHead>Durasi</TableHead>
            <TableHead>Pembayaran</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map(sub => (
            <TableRow key={sub.id} className="border-b hover:bg-gray-50">
              <TableCell>{sub.userId}</TableCell>
              <TableCell>{sub.email}</TableCell>
              <TableCell>{sub.plan}</TableCell>
              <TableCell>{sub.startDate}</TableCell>
              <TableCell>{sub.endDate}</TableCell>
              <TableCell>{sub.duration} bulan</TableCell>
              <TableCell>{sub.paymentMethod}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  sub.status === 'active' ? 'bg-green-100 text-green-800' : 
                  sub.status === 'expired' ? 'bg-red-100 text-red-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {sub.status === 'active' ? 'Aktif' : 
                   sub.status === 'expired' ? 'Kedaluwarsa' : 
                   'Dibatalkan'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-2">
                  {sub.status !== 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 hover:text-green-800 hover:bg-green-50 h-8 w-full"
                      onClick={() => onRenew(sub.id)}
                    >
                      Perpanjang
                    </Button>
                  )}
                  {sub.status === 'active' && (
                    <>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 h-8"
                          onClick={() => onExtend(sub.id, 1)}
                        >
                          +1 Bulan
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 h-8"
                          onClick={() => onExtend(sub.id, 3)}
                        >
                          +3 Bulan
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 h-8"
                        onClick={() => onCancel(sub.id)}
                      >
                        Batalkan
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {subscriptions.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4 text-gray-500">
                Tidak ada langganan aktif
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ActiveSubscriptionsTable;
