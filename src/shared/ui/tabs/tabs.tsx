import './tabs.scss';

export type TabItem = {
  id: string;
  label: string;
};

type TabsProps = {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
};

export const Tabs = ({ tabs, activeTab, onTabChange, className = '' }: TabsProps) => {
  const classes = ['tabs', className].filter(Boolean).join(' ');

  return (
    <div className={classes} role="tablist" aria-label="Credit card information">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            className={`tabs__button${isActive ? ' tabs__button--active' : ''}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
