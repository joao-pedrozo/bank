import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Component() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "deposit",
      amount: 1000,
      date: "2023-05-01",
      description: "Paycheck",
    },
    {
      id: 2,
      type: "withdrawal",
      amount: 500,
      date: "2023-05-05",
      description: "Rent Payment",
    },
    {
      id: 3,
      type: "deposit",
      amount: 250,
      date: "2023-05-10",
      description: "Freelance Work",
    },
    {
      id: 4,
      type: "withdrawal",
      amount: 75,
      date: "2023-05-15",
      description: "Grocery Shopping",
    },
  ]);
  const [balance, setBalance] = useState(1000);
  const handleTransfer = (amount: number, recipient: string) => {
    const newTransactions = [
      ...transactions,
      {
        id: transactions.length + 1,
        type: "withdrawal",
        amount,
        date: new Date().toISOString().slice(0, 10),
        description: `Transfer to ${recipient}`,
      },
    ];
    setTransactions(newTransactions);
    setBalance(balance - amount);
  };
  const handleDeposit = (amount: number) => {
    const newTransactions = [
      ...transactions,
      {
        id: transactions.length + 1,
        type: "deposit",
        amount,
        date: new Date().toISOString().slice(0, 10),
        description: "Deposit",
      },
    ];
    setTransactions(newTransactions);
    setBalance(balance + amount);
  };
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Banking App</h1>
        <div className="flex items-center gap-4">
          <div>
            <span className="font-medium">Balance:</span> ${balance.toFixed(2)}
          </div>
          <Button variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6 grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.type === "deposit"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Transfer Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" placeholder="Enter amount" />
              </div>
              <div>
                <Label htmlFor="recipient">Recipient</Label>
                <Input
                  id="recipient"
                  type="text"
                  placeholder="Enter recipient"
                />
              </div>
              <Button onClick={() => handleTransfer(100, "John Doe")}>
                Transfer
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Deposit Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="deposit-amount">Amount</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="Enter amount"
                />
              </div>
              <Button onClick={() => handleDeposit(500)}>Deposit</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
