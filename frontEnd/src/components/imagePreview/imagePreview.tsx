import  { useState, useRef, useEffect } from 'react';
// استيراد الـ ReactNode كـ type منفصل لحل الخطأ ts(1484)
import type { ReactNode } from 'react';

interface imagePreviewPopupProps {
  name: string;
  imgUrl: string;
  children?: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  width?: string;
  height?: string;
}

function imagePreview({ 
  name, 
  imgUrl, 
  children, 
  placement = 'bottom', 
  width = '150px',      
  height = '150px'      
}: imagePreviewPopupProps) {
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current && !popupRef.current.contains(event.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getPlacementClass = (): string => {
    switch (placement) {
      case 'top': return 'bottom-100 start-50 translate-middle-x mb-2';
      case 'left': return 'end-100 top-50 translate-middle-y me-2';
      case 'right': return 'start-100 top-50 translate-middle-y ms-2';
      default: return 'top-100 start-50 translate-middle-x mt-2';
    }
  };

  return (
    <div className="position-relative d-inline-block" ref={triggerRef}>
      <span 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ cursor: 'pointer', textDecoration: 'underline' }}
        className="text-primary fw-bold"
      >
        {children || name}
      </span>

      {isOpen && (
        <div 
          ref={popupRef}
          className={`position-absolute popover show bs-popover-auto shadow rounded border bg-white p-2 z-3 ${getPlacementClass()}`}
          style={{ width: width, minWidth: '120px' }}
        >
          <div className="popover-arrow position-absolute"></div>
          
          <div className="text-center">
            <img 
              src={imgUrl} 
              alt={name} 
              className="img-fluid rounded" 
              style={{ height: height, width: '100%', objectFit: 'contain' }} 
            />
            <div className="small fw-bold text-dark mt-1 text-truncate">{name}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default imagePreview;
