import Loader from '@/src/components/Loader';
import { JSX } from 'react';
import { toast } from 'react-hot-toast';

export const satutsToFeedback: Record<string, JSX.Element | string> = {
  pending: <Loader label="Running Query..." />,
  success: toast.success('Query ran successfully!'),
  error: toast.error('An error occurred. Please try again'),
  idle: 'submit',
};
