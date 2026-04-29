import { ReactNode } from 'react';

import './tooltip.scss';

type TooltipProps = {
  content: string;
  children: ReactNode;
};

export const Tooltip = ({ content, children }: TooltipProps) => {
  return (
    <div className="tooltip">
      <div className="tooltip__trigger" tabIndex={0}>
        {children}
      </div>
      <span className="tooltip__content" role="tooltip">
        {content}
      </span>
    </div>
  );
};
