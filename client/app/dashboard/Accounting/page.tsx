"use client"
import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  User, 
  ArrowDownCircle, 
  ArrowUpCircle,
  CheckCircle2,
  Clock,
  Plus,
  Edit,
  Trash,
  AlertTriangle
} from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

// Account type definition
interface Account {
  _id: string;
  name: string;
  amount: number;
  withdrawals: number;
  deposits: number;
  createdAt: string;
  completedOperations: number;
  pendingOperations: number;
  remainingOperationsValue: number;
  creator: string;
  initalAmount:number
}

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [accountName, setAccountName] = useState('');
  const [accountAmount, setAccountAmount] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentAccountId, setCurrentAccountId] = useState<string | null>(null);

  // Fetch accounts from API
  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/account/getAccounts');
      const data = await response.json();
      console.log(data)
      
      if (data.success === true) {
        setAccounts(data.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to load accounts');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreateAccount = async () => {
    try {
      if (!accountName.trim() || !accountAmount.trim()) {
        toast.error('Please provide both name and amount');
        return;
      }

      const payload = { 
        name: accountName, 
        amount: parseFloat(accountAmount) 
      };

      const response = await fetch('/api/account/createAccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      console.log(data)
      if (data.success === true) {
        toast.success('Account created successfully');
        setAccounts([ data.data]);
        setAccountName('');
        setAccountAmount('');
        setIsDialogOpen(false);
      } else {
        toast.error(data.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      toast.error('Failed to create account');
    }
  };

  const handleUpdateAccount = async () => {
    if (!currentAccountId) return;

    try {
      if (!accountName.trim()) {
        toast.error('Please provide a name');
        return;
      }

      const payload: { name: string; amount?: number } = { 
        name: accountName
      };
      
      // Only include amount if it's provided (to avoid unintended updates)
      if (accountAmount.trim()) {
        payload.amount = parseFloat(accountAmount);
      }

      const response = await fetch(`/api/account/updateAccount/${currentAccountId}`, {
        method: 'Post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.success === true) {
        // Update the account in the local state
        setAccounts(accounts.map(account => 
          account._id === currentAccountId ? data.data : account
        ));
        toast.success('Account updated successfully');
        resetDialogState();
      } else {
        toast.error(data.error || 'Failed to update account');
      }
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('Failed to update account');
    }
  };

  const openDeleteConfirmation = (id: string) => {
    setAccountToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAccount = async () => {
    if (!accountToDelete) return;
    
    try {
      const response = await fetch(`/api/account/deleteAccount/${accountToDelete}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      console.log(data)
      
      if (data.success === true) {
        // Remove the account from the local state
        setAccounts(accounts.filter(account => account._id !== accountToDelete));
        toast.success('Account deleted successfully');
        setIsDeleteDialogOpen(false);
        setAccountToDelete(null);
      } else {
        toast.error(data.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setAccountToDelete(null);
  };

  const openEditDialog = (account: Account) => {
    setCurrentAccountId(account._id);
    setAccountName(account.name);
    setAccountAmount(account.amount.toString());
    setEditMode(true);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetDialogState();
    setIsDialogOpen(true);
  };

  const resetDialogState = () => {
    setAccountName('');
    setAccountAmount('');
    setCurrentAccountId(null);
    setEditMode(false);
    setIsDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Find the account name for the delete confirmation dialog
  const getAccountToDeleteName = () => {
    if (!accountToDelete) return "";
    const account = accounts.find(a => a._id === accountToDelete);
    return account ? account.name : "";
  };

  return (
    <div className="container mx-auto py-8 bg-gradient heighWithOutBar overflow-auto">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bank Accounts</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="card-gradient text-white">
              <Plus className="mr-2 h-4 w-4" /> Add New Account
            </Button>
          </DialogTrigger>
          <DialogContent className="card-gradient w-[60%]">
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Account' : 'Create New Account'}</DialogTitle>
              <DialogDescription>
                {editMode 
                  ? 'Update your bank account information.' 
                  : 'Add a new bank account to your dashboard.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Account Name
                </Label>
                <Input
                  id="name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="col-span-3 inputCustom"
                  placeholder="e.g. Savings Account"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  {editMode ? 'New Amount' : 'Initial Amount'}
                </Label>
                <Input
                  id="amount"
                  value={accountAmount}
                  onChange={(e) => setAccountAmount(e.target.value)}
                  className="col-span-3 inputCustom"
                  type="number"
                  placeholder={editMode ? "Leave empty to keep current amount" : "e.g. 1000"}
                  required={!editMode}
                />
              </div>
            </div>
            <DialogFooter className="flex space-x-2 justify-end">
              <Button variant="outline" onClick={resetDialogState}>
                Cancel
              </Button>
              <Button onClick={editMode ? handleUpdateAccount : handleCreateAccount}>
                {editMode ? 'Update Account' : 'Create Account'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md card-gradient">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-500">
              <AlertTriangle className="h-5 w-5 mr-2" /> Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the account {getAccountToDeleteName()}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              Deleting this account will remove all associated data permanently.
            </p>
          </div>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={cancelDelete} >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAccount}>
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="text-center py-12">Loading accounts...</div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No accounts found. Create your first account to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {accounts?.map((account) => (
    <div 
      key={account._id} 
      className="border rounded-lg p-6 shadow-md card-gradient hover:shadow-lg transition duration-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">{account?.name}</h2>
          <p className="text-sm text-gray-300 flex items-center mt-1">
            <Calendar className="h-4 w-4 mr-1" /> Created on {formatDate(account?.createdAt)}
          </p>
        </div>
        <div className="bg-slate-600 p-2 rounded-full">
          <CreditCard className="h-6 w-6 text-blue-400" />
        </div>
      </div>
      
      <div className="mb-4 grid grid-cols-1 gap-2">
            <div className="second-card-gradient p-3 rounded-md">
          <p className="flex items-center text-sm text-white">
            <DollarSign className="h-4 w-4 mr-1" /> Total Amount
          </p>
          <p className="text-xl font-bold text-purple-400">
            ${(Number(account?.amount) + Number(account?.initalAmount || 0))}
          </p>
        </div>
        <div className="second-card-gradient p-3 rounded-md">
          <p className="flex items-center text-sm text-white">
            <DollarSign className="h-4 w-4 mr-1" /> Profits
          </p>
          <p className="text-xl font-bold text-green-400">${account?.amount}</p>
        </div>
        
        <div className="second-card-gradient p-3 rounded-md">
          <p className="flex items-center text-sm text-white">
            <DollarSign className="h-4 w-4 mr-1" /> Initial Amount
          </p>
          <p className="text-xl font-bold text-blue-400">${account?.initalAmount || 0}</p>
        </div>
    
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="second-card-gradient p-3 rounded-md">
          <div className="flex items-center text-sm text-white">
            <ArrowDownCircle className="h-4 w-4 mr-1" /> Deposits
          </div>
          <p className="font-bold mt-1 text-white">{account?.deposits}</p>
        </div>
        <div className="second-card-gradient p-3 rounded-md">
          <div className="flex items-center text-sm text-white">
            <ArrowUpCircle className="h-4 w-4 mr-1" /> Withdrawals
          </div>
          <p className="font-bold mt-1 text-white">{account?.withdrawals}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="second-card-gradient p-3 rounded-md">
          <div className="flex items-center text-sm text-white">
            <CheckCircle2 className="h-4 w-4 mr-1" /> Completed
          </div>
          <p className="font-bold mt-1 text-white">{account?.completedOperations}</p>
        </div>
        <div className="second-card-gradient p-3 rounded-md">
          <div className="flex items-center text-sm text-white">
            <Clock className="h-4 w-4 mr-1" /> Pending
          </div>
          <p className="font-bold mt-1 text-white">{account?.pendingOperations}</p>
        </div>
      </div>
      
      <div className="border-t border-gray-600 pt-4 mt-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-300 flex items-center text-sm">
            <User className="h-4 w-4 mr-1" /> {account?.creator}
          </span>
          {account?.remainingOperationsValue > 0 && (
            <span className="text-orange-400 font-medium text-sm">
              ${account?.remainingOperationsValue.toLocaleString()} pending
            </span>
          )}
        </div>
        
        <div className="flex justify-end mt-4 space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-blue-400 hover:bg-blue-600 text-white border-transparent"
            onClick={() => openEditDialog(account)}
          >
            <Edit className="h-4 w-4 mr-1" /> 
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-red-400 hover:bg-red-600 text-white border-transparent"
            onClick={() => openDeleteConfirmation(account._id)}
          >
            <Trash className="h-4 w-4 mr-1" /> 
          </Button>
        </div>
      </div>
    </div>
  ))}
</div>
      )}
    </div>
  );
}