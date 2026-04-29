import './divider.scss';

type DividerProps = {
  className?: string;
};

export const Divider = ({ className = '' }: DividerProps) => {
  const classes = ['divider', className].filter(Boolean).join(' ');

  return <hr className={classes} />;
};
