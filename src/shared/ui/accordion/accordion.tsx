import { useState } from 'react';

import './accordion.scss';

export type AccordionItem = {
  id: string;
  title: string;
  content: string;
};

type AccordionProps = {
  items: AccordionItem[];
  className?: string;
};

export const Accordion = ({ items, className = '' }: AccordionProps) => {
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const classes = ['accordion', className].filter(Boolean).join(' ');

  const handleToggle = (itemId: string) => {
    setOpenItemId((currentOpenItemId) => (currentOpenItemId === itemId ? null : itemId));
  };

  return (
    <div className={classes}>
      {items.map((item) => {
        const isOpen = item.id === openItemId;
        const contentId = `${item.id}-content`;

        return (
          <div className="accordion__item" key={item.id}>
            <button
              className="accordion__header"
              type="button"
              aria-expanded={isOpen}
              aria-controls={contentId}
              onClick={() => handleToggle(item.id)}
            >
              <span>{item.title}</span>
              <span
                className={`accordion__icon${isOpen ? ' accordion__icon--open' : ''}`}
                aria-hidden="true"
              />
            </button>

            <div className="accordion__panel" id={contentId} hidden={!isOpen}>
              <p className="accordion__text">{item.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};