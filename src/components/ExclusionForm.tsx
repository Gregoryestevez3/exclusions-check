import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { exclusionSchema, ExclusionFormData } from '../utils/validation';
import { AlertCircle, Info } from 'lucide-react';
import StateCombobox from './StateCombobox';
import DocumentTypeSelector from './DocumentTypeSelector';
import IdentificationField from './IdentificationField';

interface ExclusionFormProps {
  onSubmit: (data: ExclusionFormData) => void;
  isSubmitting: boolean;
}

const ExclusionForm: React.FC<ExclusionFormProps> = ({ onSubmit, isSubmitting }) => {
  const [documentType, setDocumentType] = useState<string>('ssn');
  
  const { 
    register, 
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty } 
  } = useForm<ExclusionFormData>({
    resolver: zodResolver(exclusionSchema),
    mode: 'onChange',
    defaultValues: {
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      }
    }
  });

  return (
    <div className="card overflow-hidden max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-6 py-4">
        <h2 className="text-xl font-bold text-white">Exclusion Verification</h2>
        <p className="text-indigo-100 text-sm mt-1">
          Fill out the form below to verify against exclusion lists
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6">
        <div className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Personal Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  {...register('firstName')}
                  className={`form-control ${errors.firstName ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : ''}`}
                />
                <div className="form-error-container">
                  {errors.firstName && (
                    <p className="form-error">
                      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
                      <span>{errors.firstName.message}</span>
                    </p>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  {...register('lastName')}
                  className={`form-control ${errors.lastName ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : ''}`}
                />
                <div className="form-error-container">
                  {errors.lastName && (
                    <p className="form-error">
                      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
                      <span>{errors.lastName.message}</span>
                    </p>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  {...register('email')}
                  className={`form-control ${errors.email ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : ''}`}
                />
                <div className="form-error-container">
                  {errors.email && (
                    <p className="form-error">
                      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
                      <span>{errors.email.message}</span>
                    </p>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="dateOfBirth" className="form-label">
                  Date of Birth
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  {...register('dateOfBirth')}
                  className={`form-control ${errors.dateOfBirth ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : ''}`}
                />
                <div className="form-error-container">
                  {errors.dateOfBirth && (
                    <p className="form-error">
                      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
                      <span>{errors.dateOfBirth.message}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* ID Documents Section - Fixed to prevent overlap */}
            <div className="mt-6 pt-2 border-t border-gray-100">
              <h4 className="text-base font-medium text-gray-800 mb-3">Identification Documents</h4>
              
              {/* Modified layout to prevent overlap */}
              <div className="space-y-4">
                {/* First, the document type selector (full width on mobile) */}
                <div className="form-group">
                  <Controller
                    name="documentType"
                    control={control}
                    defaultValue="ssn"
                    render={({ field }) => (
                      <DocumentTypeSelector
                        value={field.value || documentType}
                        onChange={(value) => {
                          field.onChange(value);
                          setDocumentType(value);
                        }}
                      />
                    )}
                  />
                </div>
                
                {/* Then, the identification field (full width) */}
                <div className="form-group">
                  <Controller
                    name="identificationNumber"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <IdentificationField
                        id="identificationNumber"
                        type={documentType}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.identificationNumber?.message}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Address Information Section - Improved responsive layout */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Address Information</h3>
            
            <div className="form-group">
              <label htmlFor="address.street" className="form-label">
                Street Address
              </label>
              <input
                id="address.street"
                type="text"
                {...register('address.street')}
                className={`form-control ${errors.address?.street ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : ''}`}
              />
              <div className="form-error-container">
                {errors.address?.street && (
                  <p className="form-error">
                    <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
                    <span>{errors.address.street.message}</span>
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="form-group">
                <label htmlFor="address.city" className="form-label">
                  City
                </label>
                <input
                  id="address.city"
                  type="text"
                  {...register('address.city')}
                  className={`form-control ${errors.address?.city ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : ''}`}
                />
                <div className="form-error-container">
                  {errors.address?.city && (
                    <p className="form-error">
                      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
                      <span>{errors.address.city.message}</span>
                    </p>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="address.state" className="form-label">
                  State
                </label>
                <Controller
                  name="address.state"
                  control={control}
                  render={({ field }) => (
                    <StateCombobox
                      id="address.state"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.address?.state?.message}
                    />
                  )}
                />
              </div>
              
              <div className="form-group sm:col-span-2 lg:col-span-1">
                <label htmlFor="address.zipCode" className="form-label">
                  Zip Code
                </label>
                <input
                  id="address.zipCode"
                  type="text"
                  inputMode="numeric"
                  placeholder="12345"
                  {...register('address.zipCode')}
                  className={`form-control ${errors.address?.zipCode ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : ''}`}
                />
                <div className="form-error-container">
                  {errors.address?.zipCode && (
                    <p className="form-error">
                      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
                      <span>{errors.address.zipCode.message}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg mt-4">
            <Info className="h-5 w-5 mr-2 text-indigo-500 flex-shrink-0" />
            <p>All information is securely processed and remains confidential.</p>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || (!isDirty && !isValid)}
              className={`w-full btn btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Verification...
                </span>
              ) : (
                'Verify Exclusion Status'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ExclusionForm;
