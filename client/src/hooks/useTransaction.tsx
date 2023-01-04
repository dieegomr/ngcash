import { useState } from 'react';

export default function useTransaction() {
  const [isDone, setIsDone] = useState(false);

  const transactionDone = (done: boolean) => {
    setIsDone(done);
  };

  return {
    isDone,
    transactionDone,
  };
}
