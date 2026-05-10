import './loader.scss';

export const Loader = ({ label = 'Loading' }: { label?: string }) => {
  return <span className="loader" aria-label={label} />;
};
