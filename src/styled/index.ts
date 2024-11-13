import styled from 'styled-components';

export const FlexBox = styled.div`
	display: flex;
	position: relative;
`;
export const FlexCenter = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;
export const FlexAICenter = styled.div`
	display: flex;
	align-items: center;
`;
export const FlexJCCenter = styled.div`
	display: flex;
	justify-content: center;
`;
export const FlexJCSpaceBetween = styled.div`
	display: flex;
	justify-content: space-between;
`;

export const FlexJCEnd = styled.div`
	display: flex;
	justify-content: flex-end;
`;
export const FlexJCStart = styled.div`
	display: flex;
	justify-content: flex-start;
`;
export const FlexWrap = styled.div`
	display: flex;
	flex-wrap: wrap;
`;
export const FlexCol = styled.div`
	display: flex;
	flex-direction: column;
`;
export const FlexColAIEnd = styled.div`
	display: flex;
	flex-direction: column;
	align-items: end;
`;
export const FlexColJCEnd = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: end;
`;
export const FlexCenterCol = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;
export const FlexJCCenterCol = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

export const FlexJCSBCol = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;
export const FlexJCSBCenter = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;
export const FlexAICenterCol = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`;
export const WalletItem = styled.div`
	display: flex;
	padding: 12px;
	background: ${({ theme }) => theme.wkItemBg};
	border-radius: 12px;
	cursor: pointer;
`;
export const SlotWrapper = styled.div``;
