import React from 'react';
import styled from 'styled-components';

interface TextOrg {
	text?: string | number | any;
	size?: number;
	weight?: number;
	color?: string;
	padding?: string;
	margin?: string;
	ellipsis?: boolean;
	className?: string;
	children?: React.ReactNode;
	prefix?: string;
	suffix?: string;
	counting?: boolean;
	href?: string;
}

const TextStyled = styled.div`
	color: #171717;
	height: inherit;
	left: inherit;
	white-space: pre-wrap;
	//word-break: break-all;
	align-items: center;
`;

export const Text: React.FC<TextOrg> = ({
	prefix,
	suffix,
	className = '',
	text,
	size,
	weight,
	color,
	padding = '',
	margin = ''
}) => {
	return (
		<TextStyled
			className={className}
			style={{
				fontSize: size ? size + 'px' : '16px',
				fontWeight: weight || 400,
				color,
				padding,
				margin
			}}
		>
			{prefix ? <span>{prefix}</span> : <></>}
			<span dangerouslySetInnerHTML={{ __html: text }} />
			{suffix ? <span>{suffix}</span> : <></>}
		</TextStyled>
	);
};

export default Text;
