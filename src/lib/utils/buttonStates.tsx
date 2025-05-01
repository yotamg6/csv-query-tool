import { ButtonState } from '@/src/types/buttonStates';
import { ClipLoader } from 'react-spinners';

export const getButtonClasses = (state: ButtonState): string => {
  const classMap: Record<ButtonState, string> = {
    loading: 'bg-gray-400',
    success: 'bg-green-600 hover:bg-green-700',
    error: 'bg-red-600 hover:bg-red-700',
    idle: 'bg-purple-600 hover:bg-purple-700',
  };

  return classMap[state];
};

export const getButtonContent = (state: ButtonState): React.ReactNode => {
  const contentMap: Record<ButtonState, React.ReactNode> = {
    loading: <ClipLoader size={20} color="#ffffff" />,
    success: 'Success!',
    error: 'Error, Try Again',
    idle: 'Submit',
  };

  return contentMap[state];
};
