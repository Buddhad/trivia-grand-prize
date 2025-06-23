
interface DepositFileData {
  transaction: {
    id: string;
    amount: number;
    description: string;
    date: string;
    status: string;
  };
  beneficiary: {
    name: string;
    account: string;
    ifsc: string;
  };
  payment: {
    type: string;
    remark: string;
  };
  contact: {
    mobile: string;
    email: string;
  };
  account: {
    accountNumber: string;
    accountType: string;
    cifNumber: string;
    ifscCode: string;
    branch: string;
    balance: number;
  };
}

export const generateDepositFile = (data: DepositFileData) => {
  const depositData = `
=== SBI Bank Deposit Transaction Record ===
Transaction ID: ${data.transaction.id}
Date: ${data.transaction.date}
Amount: ₹${data.transaction.amount.toLocaleString()}
Description: ${data.transaction.description}
Status: ${data.transaction.status}

=== Beneficiary Information ===
Beneficiary Name: ${data.beneficiary.name}
Account Number: ${data.beneficiary.account}
IFSC Code: ${data.beneficiary.ifsc}

=== Payment Details ===
Payment Type: ${data.payment.type}
Remark: ${data.payment.remark || 'N/A'}

=== Contact Information ===
Mobile Number: ${data.contact.mobile}
Email Address: ${data.contact.email}

=== Steps to Fill SBI Bank Details for Online Payment (e.g., UPI, NEFT, IMPS, Merchant Payment) ===

1. Log in to SBI NetBanking
   - Go to https://www.onlinesbi.sbi
   - Click "Personal Banking" > Log in with username/password.

2. Navigate to Payments/Transfers
   - Select "Payments/Transfers" > Choose payment type (e.g., NEFT, IMPS, UPI).

3. Enter Recipient Details
   - Beneficiary Name: ${data.beneficiary.name}
   - Account Number: ${data.beneficiary.account}
   - Confirm Account Number: Re-enter to avoid errors.
   - IFSC Code: ${data.beneficiary.ifsc}

4. Enter Payment Amount
   - Fill in the amount: ₹${data.transaction.amount.toLocaleString()}
   - Add remark: ${data.payment.remark || 'N/A'}

5. Authenticate Transaction
   - Verify details > Enter OTP (sent to ${data.contact.mobile}).
   - Click "Submit" to complete the payment.

=== Your Account Details ===
Account Number: ${data.account.accountNumber}
Account Type: ${data.account.accountType}
CIF Number: ${data.account.cifNumber}
IFSC Code: ${data.account.ifscCode}
Branch: ${data.account.branch}
Current Balance: ₹${data.account.balance.toLocaleString()}

=== Important Notes ===
- Keep this transaction record for your reference
- Contact SBI Customer Care: 1800 1234 or 1800 2100
- For any disputes, quote Transaction ID: ${data.transaction.id}
- This is an auto-generated record from SBI OnlineSBI

Generated on: ${new Date().toLocaleString()}
`;

  // Create and download the file
  const blob = new Blob([depositData], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `SBI_Deposit_${data.transaction.id}_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
