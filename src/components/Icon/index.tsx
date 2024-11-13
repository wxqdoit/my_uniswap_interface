import React from 'react';
import styled from 'styled-components';

interface IconImageArg {
	src: any;
	width?: number | string;
	height?: number | string;
	borderRadius?: string;
	isRadius?: boolean;
	className?: string;
}

interface FoldIconImageArg {
	src: Array<string>;
	width?: number | string;
	height?: number | string;
	offset?: number;
	proportion?: number;
	className?: string;
	isRadius?: boolean;
}

const IconImage = styled.img`
	display: block;
	transition: all 0.2s;
`;

const IconImageBox = styled.div`
	cursor: pointer;
	display: flex;
	position: relative;
`;
const IconItem = styled.div`
	cursor: pointer;
	float: left;
	display: flex;
	justify-items: center;
`;

export const Icon: React.FC<IconImageArg> = ({ src, width, height, isRadius = true, className }) => {
	return (
		<IconImage
			className={className}
			src={src}
			width={width ? width + 'px' : '24px'}
			height={height ? height + 'px' : '24px'}
			style={{ borderRadius: isRadius ? '50%' : '0' }}
		/>
	);
};

export const Image: React.FC<IconImageArg> = ({ src, width, height, isRadius = true, className, borderRadius }) => {
	return (
		<IconImage
			className={className}
			src={src}
			width={width ? width : 'auto'}
			height={height ? height : 'auto'}
			style={{ borderRadius: borderRadius ? borderRadius : isRadius ? '50%' : '0' }}
		/>
	);
};

export const FoldIconBox: React.FC<FoldIconImageArg> = ({ src, width, height, offset = 0, isRadius = true }) => {
	return (
		<IconImageBox>
			{src.map((item, index) => {
				return (
					<IconItem
						key={index}
						style={{
							zIndex: index + 1,
							marginLeft: index == 0 ? '0px' : offset + 'px',
							width: width ? width + 'px' : '24px',
							height: height ? height + 'px' : '24px'
						}}
					>
						<IconImage
							src={item}
							width={width ? width : 24}
							height={height ? height : 24}
							style={{ borderRadius: isRadius ? '50%' : '0' }}
						/>
					</IconItem>
				);
			})}
		</IconImageBox>
	);
};
export const FoldIconBoxBig: React.FC<FoldIconImageArg> = ({ src, width, height, offset = 0, proportion = 1 }) => {
	return (
		<IconImageBox>
			{src.map((item, index) => {
				return (
					<IconItem
						key={index}
						style={{
							zIndex: index + 1,
							marginLeft: index == 0 ? '0px' : offset + 'px',
							marginTop: index == 0 ? '0px' : -(offset / 2) + 'px',
							width: width ? width + 'px' : '24px',
							height: height ? height + 'px' : '24px'
						}}
					>
						{index === src.length - 1 ? (
							<IconImage
								src={item}
								width={width ? Number(width) * proportion : 24 * proportion}
								height={height ? Number(height) * proportion : 24 * proportion}
							/>
						) : (
							<IconImage src={item} width={width ? width : 24} height={height ? height : 24} />
						)}
					</IconItem>
				);
			})}
		</IconImageBox>
	);
};

export default Icon;
