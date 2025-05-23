
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X } from "lucide-react";
import { useState } from "react";

export type SubscriptionRequest = {
  id: number;
  userId: string;
  email: string;
  plan: string;
  duration: number;
  requestDate: string;
  paymentMethod: string;
  proofUrl: string;
  status: "pending" | "approved" | "rejected";
};

interface SubscriptionRequestsListProps {
  requests: SubscriptionRequest[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

const SubscriptionRequestsList = ({ 
  requests, 
  onApprove, 
  onReject 
}: SubscriptionRequestsListProps) => {
  const [viewProofDialog, setViewProofDialog] = useState(false);
  const [selectedProofUrl, setSelectedProofUrl] = useState("");

  const handleViewProof = (proofUrl: string) => {
    setSelectedProofUrl(proofUrl);
    setViewProofDialog(true);
  };

  return (
    <div>
      <h3 className="font-medium text-lg mb-4">Permintaan Berlangganan</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pengguna</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Paket</TableHead>
              <TableHead>Durasi</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Pembayaran</TableHead>
              <TableHead>Bukti</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4 text-gray-500">
                  Tidak ada permintaan berlangganan baru
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.userId}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.plan}</TableCell>
                  <TableCell>{request.duration} bulan</TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>{request.paymentMethod}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewProof(request.proofUrl)}
                    >
                      Lihat
                    </Button>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        request.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : request.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {request.status === "pending"
                        ? "Menunggu"
                        : request.status === "approved"
                        ? "Disetujui"
                        : "Ditolak"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {request.status === "pending" && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => onApprove(request.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Setujui
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => onReject(request.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Tolak
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Proof of transfer dialog */}
      <Dialog open={viewProofDialog} onOpenChange={setViewProofDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bukti Transfer</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <img
              src={selectedProofUrl}
              alt="Bukti Transfer"
              className="max-w-full h-auto rounded-md"
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setViewProofDialog(false)}>
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionRequestsList;
