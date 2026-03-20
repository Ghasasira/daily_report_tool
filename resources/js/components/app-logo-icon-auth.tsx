import { ImgHTMLAttributes } from 'react';

export default function AppLogoIconAuth(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/ghasasira.png"
            alt="Logo"
            style={{
                width: '4.0cm', // Approximately 75.59px
                height: 'auto', // Maintain aspect ratio
                ...props.style // Preserve any additional styles passed via props
            }}
        />
    );
}
