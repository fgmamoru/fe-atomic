import { useState } from "react";

const KEY = 'termsAndConditionsAccepted';

const wasTermsAndConditionsAccepted = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  return !!localStorage.getItem(KEY);
};

const acceptTermsAndConditions = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  localStorage
    .setItem(KEY, 'true');
}

export const useTermsAndConditions = () => {
  const [accepted, setAccepted] = useState(wasTermsAndConditionsAccepted());

  const accept = () => {
    acceptTermsAndConditions();
    setAccepted(true);
  }

  return {
    accepted,
    accept,
  }
};