export type User = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
};

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Dewi Lestari",
    company: "Bukalapak",
    email: "dewi@bukalapak.com",
    phone: "+62 812 1234 5678",
  },
  {
    id: "user-2",
    name: "Rizal Maulana",
    company: "Traveloka",
    email: "rizal@traveloka.com",
    phone: "+62 813 8765 4321",
  },
  {
    id: "user-3",
    name: "Siti Nurhaliza",
    company: "Shopee",
    email: "siti@shopee.com",
    phone: "+62 815 3456 7890",
  },
  {
    id: "user-4",
    name: "Agus Salim",
    company: "Grab",
    email: "agus@grab.com",
    phone: "+62 816 5678 1234",
  },
];
