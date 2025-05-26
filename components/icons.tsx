import React from 'react';

interface IconProps {
  className?: string;
}

export const ChevronDownIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

export const CalendarDaysIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c0-.414.336-.75.75-.75h10.5a.75.75 0 0 1 .75.75v1.25a.75.75 0 0 1-.75.75H5.5a.75.75 0 0 1-.75-.75V7.5Zm.75 4a.75.75 0 0 0-.75.75v2.5c0 .414.336.75.75.75h10.5a.75.75 0 0 0 .75-.75v-2.5a.75.75 0 0 0-.75-.75H5.5Z" clipRule="evenodd" />
  </svg>
);

export const UserCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clipRule="evenodd" />
  </svg>
);

export const PriorityIcon: React.FC<IconProps & { level: number }> = ({ className, level }) => {
  return (
    <div className={`flex items-end space-x-0.5 h-3 ${className}`}> {/* Made height smaller */}
      <span className={`w-1 h-1/4 ${level >= 0 ? 'bg-current' : 'bg-slate-600'}`}></span>
      <span className={`w-1 h-2/4 ${level >= 1 ? 'bg-current' : 'bg-slate-600'}`}></span>
      <span className={`w-1 h-3/4 ${level >= 2 ? 'bg-current' : 'bg-slate-600'}`}></span>
      <span className={`w-1 h-full ${level >= 3 ? 'bg-current' : 'bg-slate-600'}`}></span>
    </div>
  );
};

export const PlusIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75V4.5h8V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4.5A1.75 1.75 0 0 0 8.25 6.25V6.5H3.75v1.5h12.5V6.5h-4.5V6.25A1.75 1.75 0 0 0 10 4.5ZM5.523 9.282a.75.75 0 0 0-1.046.84l1.5 6a.75.75 0 0 0 .705.528H12.82a.75.75 0 0 0 .705-.528l1.5-6a.75.75 0 0 0-1.046-.84L13.25 15H6.75l-.728-5.718Z" clipRule="evenodd" />
  </svg>
);

export const XMarkIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
  </svg>
);

export const ClipboardIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-.91-.735-1.657-1.657-1.657H6.407c-.922 0-1.657.746-1.657 1.657v9.585c0 .921.735 1.657 1.657 1.657h3.471m3.071-2.086a2.25 2.25 0 1 0-4.5 0 2.25 2.25 0 0 0 4.5 0Z M15 6.75V9" />
  </svg>
);

export const TicketIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6.75h5.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75h-5.25a.75.75 0 0 1-.75-.75v-9a.75.75 0 0 1 .75-.75Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 16.5A2.25 2.25 0 0 0 15.75 14.25V9.75A2.25 2.25 0 0 0 18 7.5m0 9a2.25 2.25 0 0 0 2.25-2.25v-4.5A2.25 2.25 0 0 0 18 7.5M3 19.5h12m0 0V5.25A2.25 2.25 0 0 0 12.75 3H3.75A2.25 2.25 0 0 0 1.5 5.25v12A2.25 2.25 0 0 0 3.75 19.5h11.25Z" />
  </svg>
);

export const ChartPieIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M10 3.75a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
    <path fillRule="evenodd" d="M10 2a.75.75 0 0 1 .75.75v.047a.75.75 0 0 1-.476.703A2.503 2.503 0 0 0 8 5.75a.75.75 0 0 1-1.5 0A2.5 2.5 0 0 0 4 3.504a.75.75 0 0 1-.476-.703V2.75A.75.75 0 0 1 4.25 2H10Zm0 14.5a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75Zm-2.516-5.623a.75.75 0 0 1 .001-1.061l4.004-4.003a.75.75 0 1 1 1.06 1.06L9.56 12.23a.75.75 0 0 1-1.06.002l-1.001-1.001A.75.75 0 0 1 7.484 10.877Z" clipRule="evenodd" />
    <path d="M3.5 7.5a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm9.503 0a2 2 0 1 1 4.001.001 2 2 0 0 1-4.001-.001Z" />
    <path fillRule="evenodd" d="M2 10a.75.75 0 0 1 .75-.75h.029a.75.75 0 0 1 .703.476A2.503 2.503 0 0 0 5.75 12a.75.75 0 0 1 0 1.5A2.5 2.5 0 0 0 3.482 10.28a.75.75 0 0 1-.703-.476H2.75A.75.75 0 0 1 2 10Zm10.25 4.5a.75.75 0 0 1 .75-.75h.029a.75.75 0 0 1 .703.476A2.503 2.503 0 0 0 15.75 16a.75.75 0 0 1 0 1.5a2.5 2.5 0 0 0-2.268-3.22.75.75 0 0 1-.703-.476h-.029a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.25 1.25 0 0 0 .421.932l3.7 3.256a.75.75 0 0 0 1.028 0l3.7-3.256a1.25 1.25 0 0 0 .421-.932A4.002 4.002 0 0 0 10 12a4.002 4.002 0 0 0-6.535 2.493Z" />
    <path d="M15.75 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM17.535 12.493A4.002 4.002 0 0 0 14 12a4.002 4.002 0 0 0-3.535 2.493 1.25 1.25 0 0 0 .421.932l3.7 3.256a.75.75 0 0 0 1.028 0l3.7-3.256a1.25 1.25 0 0 0 .421-.932Z" />
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
  </svg>
);

export const ListBulletIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
    <path d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z" />
  </svg>
);

export const PencilIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M17.414 2.586a2 2 0 0 0-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 0 0 0-2.828Z" />
    <path fillRule="evenodd" d="M2 6a2 2 0 0 1 2-2h4a1 1 0 0 1 0 2H4v10h10v-4a1 1 0 1 1 2 0v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Z" clipRule="evenodd" />
  </svg>
);

export const ChevronUpDownIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M10 3.621a.75.75 0 0 1 .53.22l4.25 4.25a.75.75 0 0 1-1.06 1.06L10 5.433 6.28 9.16a.75.75 0 0 1-1.06-1.06l4.25-4.25a.75.75 0 0 1 .53-.22Zm0 12.758a.75.75 0 0 1-.53-.22l-4.25-4.25a.75.75 0 0 1 1.06-1.06L10 14.567l3.72-3.72a.75.75 0 0 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-.53.22Z" clipRule="evenodd" />
  </svg>
);