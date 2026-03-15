import { v4 as uuidv4 } from 'uuid';

/**
 * Gets the current guestId from localStorage, or generates a new one.
 */
export const getGuestId = () => {
  let guestId = localStorage.getItem('guestId');
  if (!guestId) {
    guestId = uuidv4();
    localStorage.setItem('guestId', guestId);
  }
  return guestId;
};
