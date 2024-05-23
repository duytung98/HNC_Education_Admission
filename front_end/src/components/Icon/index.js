import { forwardRef } from 'react';
import EyeOff from '~/assets/images/eye-crossed.png';
import Eye from '~/assets/images/eye.png';
import Excel from '~/assets/images/excel.png';
import PdfIcon from '~/assets/images/pdf.png';

export function UserIcon({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + ' main-grid-item-icon'}
            fill={color}
            stroke="currentColor"
        >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

export function LockIcon({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + ' main-grid-item-icon'}
            fill={color}
            stroke="currentColor"
        >
            <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}

export function HomeIcon({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + ' main-grid-item-icon'}
            fill={color}
            stroke="currentColor"
        >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    );
}

export function ListIcon({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + ' main-grid-item-icon'}
            fill={color}
            stroke="currentColor"
        >
            <line x1="8" x2="21" y1="6" y2="6" />
            <line x1="8" x2="21" y1="12" y2="12" />
            <line x1="8" x2="21" y1="18" y2="18" />
            <line x1="3" x2="3.01" y1="6" y2="6" />
            <line x1="3" x2="3.01" y1="12" y2="12" />
            <line x1="3" x2="3.01" y1="18" y2="18" />
        </svg>
    );
}

export function CheckIcon({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + ' main-grid-item-icon'}
            fill={color}
            stroke="currentColor"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

export function CheckSquareIcon({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + ' main-grid-item-icon'}
            fill={color}
            stroke="currentColor"
        >
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
    );
}

export function FileMinusIcon({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + ' main-grid-item-icon'}
            fill={color}
            stroke="currentColor"
        >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="9" x2="15" y1="15" y2="15" />
        </svg>
    );
}

export function ChevronDownIcon({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + 'main-grid-item-icon'}
            fill={color}
            stroke="currentColor"
        >
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

export function BarChart2Icon({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + ' main-grid-item-icon'}
            fill={color}
            stroke="currentColor"
        >
            <line x1="18" x2="18" y1="20" y2="10" />
            <line x1="12" x2="12" y1="20" y2="4" />
            <line x1="6" x2="6" y1="20" y2="14" />
        </svg>
    );
}

export function BarChartIcon({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + 'main-grid-item-icon'}
            fill={color}
            stroke="currentColor"
        >
            <line x1="12" x2="12" y1="20" y2="10" />
            <line x1="18" x2="18" y1="20" y2="4" />
            <line x1="6" x2="6" y1="20" y2="16" />
        </svg>
    );
}

export function PieChartIcon({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + ' main-grid-item-icon'}
            fill={color}
            stroke="currentColor"
        >
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
        </svg>
    );
}
export function FormIcon({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill={color}
            className={className + ' main-grid-item-icon'}
            stroke="currentColor"
        >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
    );
}

export function LogOutIcon({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + ' main-grid-item-icon'}
            fill={color}
            stroke="currentColor"
        >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
    );
}

export function EyeIcon({ height = '24px', width = '24px', className }) {
    return <img src={Eye} width={width} height={height} className={className} alt="icon-eye" />;
}

export function EyeOffIcon({ height = '24px', width = '24px', className }) {
    return <img src={EyeOff} width={width} height={height} className={className} alt="icon-eyeoff" />;
}

export function PlusCircleIcon({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + ' main-grid-item-icon'}
            fill={color}
            stroke="currentColor"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="16" />
            <line x1="8" x2="16" y1="12" y2="12" />
        </svg>
    );
}

export function MailIcon({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + ' main-grid-item-icon'}
            fill={color}
            stroke="currentColor"
        >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    );
}

export function DownloadIcon({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + ' main-grid-item-icon'}
            fill={color}
            stroke="currentColor"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
    );
}

export function SearchIcon({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + ' main-grid-item-icon'}
            fill={color}
            stroke="currentColor"
        >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" x2="16.65" y1="21" y2="16.65" />
        </svg>
    );
}

export function ExcelIcon({ height = '24px', width = '24px', className }) {
    return <img src={Excel} width={width} height={height} className={className} alt="icon-eyeoff" />;
}

export function PDFIcon({ height = '24px', width = '24px', className }) {
    return <img src={PdfIcon} width={width} height={height} className={className} alt="icon-eyeoff" />;
}

export function ChevronLeftIcon({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + ' main-grid-item-icon'}
            fill={color}
            stroke="currentColor"
        >
            <polyline points="15 18 9 12 15 6" />
        </svg>
    );
}

export function ChevronRight({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + ' main-grid-item-icon'}
            fill={color}
            stroke="currentColor"
        >
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );
}

export function UploadIcon({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + ' main-grid-item-icon'}
            fill={color}
            stroke="currentColor"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
    );
}

export function XSquareCloseIcon({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + ' main-grid-item-icon'}
            fill={color}
            stroke="currentColor"
        >
            <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
            <line x1="9" x2="15" y1="9" y2="15" />
            <line x1="15" x2="9" y1="9" y2="15" />
        </svg>
    );
}

export const XCircleCloseIcon = forwardRef(({ color = 'none', height = '24px', width = '24px', className = '' }, ref) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + ' main-grid-item-icon'}
            fill={color} stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            ref={ref}
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" x2="9" y1="9" y2="15" />
            <line x1="9" x2="15" y1="9" y2="15" />
        </svg>
    );
})


export function ToolIcon({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + ' main-grid-item-icon'}
            fill={color}
            stroke="currentColor"
        >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
    );
}

export function PrinterIcon({ color = 'none', height = '24px', width = '24px', className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className + ' main-grid-item-icon'}
            fill={color}
            stroke="currentColor"
        >
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect height="8" width="12" x="6" y="14" />
        </svg>
    );
}

export function ArrowUp(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="main-grid-item-icon"
            fill="none"
            stroke="#128080"
            {...props}
        >
            <line x1="12" x2="12" y1="19" y2="5" />
            <polyline points="5 12 12 5 19 12" />
        </svg>
    );
}

export function AlertCircle(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="main-grid-item-icon"
            fill="none"
            stroke="red"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            {...props}
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
    );
}

export function Close(props) {
    return (
        <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 15.642 15.642"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            enableBackground="new 0 0 15.642 15.642"
            {...props}
        >
            <path
                fillRule="evenodd"
                d="M8.882,7.821l6.541-6.541c0.293-0.293,0.293-0.768,0-1.061  c-0.293-0.293-0.768-0.293-1.061,0L7.821,6.76L1.28,0.22c-0.293-0.293-0.768-0.293-1.061,0c-0.293,0.293-0.293,0.768,0,1.061  l6.541,6.541L0.22,14.362c-0.293,0.293-0.293,0.768,0,1.061c0.147,0.146,0.338,0.22,0.53,0.22s0.384-0.073,0.53-0.22l6.541-6.541  l6.541,6.541c0.147,0.146,0.338,0.22,0.53,0.22c0.192,0,0.384-0.073,0.53-0.22c0.293-0.293,0.293-0.768,0-1.061L8.882,7.821z"
            />
        </svg>
    );
}
