import { accounModel } from "../Modal/schemaAccounting";
export const account = {
  getAccounts :async(req:any ,res :any)=>{
try {
  console.log("test")
        
            const resAllCategory = await accounModel.find()
            return res.status(200).json({
                data: resAllCategory,
                success: true,
            });
        } catch (error: unknown) {
            return res.status(400).json({
                message: error,
                success: false,
            });
        }
  },
  createAccount: async (req: any, res: any) => {
    try {
      const { name, amount, creator = 'John Doe' } = req.body;

      if (!name || amount === undefined) {
        return res.status(400).json({ message: 'Name and amount are required' });
      }

      const newAccount = new accounModel({
        name,
        amount,
        creator
      });

      const savedAccount = await newAccount.save();
      console.log(savedAccount, "savedAccount")
      return res.status(200).json({
        success: true,
        data: savedAccount
      })
    } catch (error) {
      console.error('Error creating account:', error);
      return res.status(500).json({
        success: false,
        message: `Error fetching categories:${error}`
      })
    }
  },

// Update account
updateAccount : async (req:any, res:any) => {
  try {
    const { name, amount } = req.body;
    const account = await accounModel.findById(req.params.id);
    
    if (!account) {
      return res.status(404).json({ message: 'Account not found',
        success: false,
       });
    }
    
    // Update deposits or withdrawals based on amount change
    if (amount !== undefined && amount !== account.amount) {
      if (amount > account.amount) {
        account.deposits += 1;
      } else if (amount < account.amount) {
        account.withdrawals += 1;
      }
    }
    
    // Update account fields
    if (name) account.name = name;
    if (amount !== undefined) account.amount = amount;
    
    const updatedAccount = await account.save();
    return res.status(400).json({
      message: updatedAccount,
      success: true,
  });
  } catch (error) {
    console.error('Error updating account:', error);
    return res.status(400).json({
      message: error,
      success: false,
  });
  }
},
  deleteAccount:async (req:any ,res:any)=>{
    try {
      const { id } = req.params;
      const deletedAccount = await accounModel.findByIdAndDelete(id);
      if (!deletedAccount) {
        return res.status(400).json({
          message: 'Account not found',
          success: false,
      });
      }
      return res.status(400).json({
      
        success: true,
    });
    } catch (error) {
      console.error('Error deleting account:', error);
      return res.status(400).json({
        message: error,
        success: false,
    });
    }
  }
}