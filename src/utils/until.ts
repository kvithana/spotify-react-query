/**
 * Utility function to wait until a condition is met
 * @param fn - function to check
 * @param time - time to wait between checks
 */
export const until = (fn: () => boolean, time = 1000) => {
    if (fn()) {                             
      return Promise.resolve(true);          
    } else {                                 
      return new Promise((resolve) => {
        const timer = setInterval(() => {
          if (fn()) {
            clearInterval(timer);
            resolve(true);
          }
        }, time);
      });
    }
  };