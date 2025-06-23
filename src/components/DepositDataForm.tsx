
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface DepositData {
  beneficiaryName: string;
  beneficiaryAccount: string;
  beneficiaryIFSC: string;
  paymentType: string;
  amount: string;
  remark: string;
  mobile: string;
  email: string;
}

interface DepositDataFormProps {
  onSubmit: (data: DepositData) => void;
  onCancel: () => void;
  initialAmount?: string;
}

const DepositDataForm: React.FC<DepositDataFormProps> = ({ onSubmit, onCancel, initialAmount = '' }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DepositData>({
    beneficiaryName: '',
    beneficiaryAccount: '',
    beneficiaryIFSC: '',
    paymentType: 'UPI',
    amount: initialAmount,
    remark: '',
    mobile: '',
    email: ''
  });

  const handleInputChange = (field: keyof DepositData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.beneficiaryName && formData.beneficiaryAccount && formData.beneficiaryIFSC;
      case 2:
        return formData.paymentType && formData.amount && parseFloat(formData.amount) > 0;
      case 3:
        return formData.mobile && formData.email;
      default:
        return false;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="bg-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <span>Deposit Transaction Details</span>
          <span className="text-sm bg-blue-500 px-2 py-1 rounded">Step {currentStep} of 3</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>

        {/* Step 1: Beneficiary Details */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Beneficiary Details</h3>
            
            <div>
              <Label htmlFor="beneficiaryName">Beneficiary Name *</Label>
              <Input
                id="beneficiaryName"
                value={formData.beneficiaryName}
                onChange={(e) => handleInputChange('beneficiaryName', e.target.value)}
                placeholder="Enter beneficiary's full name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="beneficiaryAccount">Account Number *</Label>
              <Input
                id="beneficiaryAccount"
                value={formData.beneficiaryAccount}
                onChange={(e) => handleInputChange('beneficiaryAccount', e.target.value)}
                placeholder="Enter account number"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="beneficiaryIFSC">IFSC Code *</Label>
              <Input
                id="beneficiaryIFSC"
                value={formData.beneficiaryIFSC}
                onChange={(e) => handleInputChange('beneficiaryIFSC', e.target.value.toUpperCase())}
                placeholder="e.g., SBIN0001234"
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Step 2: Payment Details */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Payment Details</h3>
            
            <div>
              <Label htmlFor="paymentType">Payment Type *</Label>
              <select
                id="paymentType"
                value={formData.paymentType}
                onChange={(e) => handleInputChange('paymentType', e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="UPI">UPI</option>
                <option value="NEFT">NEFT</option>
                <option value="IMPS">IMPS</option>
                <option value="RTGS">RTGS</option>
              </select>
            </div>

            <div>
              <Label htmlFor="amount">Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="1"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="remark">Remark (Optional)</Label>
              <Textarea
                id="remark"
                value={formData.remark}
                onChange={(e) => handleInputChange('remark', e.target.value)}
                placeholder="Enter payment remark"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step 3: Contact Information */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
            
            <div>
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                placeholder="Enter your mobile number"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email address"
                className="mt-1"
              />
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Transaction Summary</h4>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">To:</span> {formData.beneficiaryName}</p>
                <p><span className="font-medium">Account:</span> {formData.beneficiaryAccount}</p>
                <p><span className="font-medium">Amount:</span> ₹{formData.amount}</p>
                <p><span className="font-medium">Type:</span> {formData.paymentType}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onCancel : handlePrevious}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="flex items-center bg-blue-600 hover:bg-blue-700"
          >
            {currentStep === 3 ? 'Complete Deposit' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepositDataForm;
