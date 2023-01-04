import React, { useState } from 'react';

type BalanceContextObj = {
  isHidden: boolean;
  toggle: () => void;
};

type Props = {
  children?: React.ReactNode;
};

const Context = React.createContext<BalanceContextObj>({
  isHidden: false,
  toggle: () => {},
});

export const ContextProvider: React.FC<Props> = (props) => {
  const [isHidden, setIsHidden] = useState<boolean>(false);

  const toggleHandler = () => {
    let toggleIsHidden = !isHidden;
    setIsHidden(toggleIsHidden);
  };

  const contextValue: BalanceContextObj = {
    isHidden: isHidden,
    toggle: toggleHandler,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default Context;
