import styles from './Container.module.css';

type Props = {
  children?: React.ReactNode;
  customClass: string;
};

const Container: React.FC<Props> = (props) => {
  return (
    <div className={`${styles.container} ${styles[props.customClass]}`}>
      {props.children}
    </div>
  );
};

export default Container;
