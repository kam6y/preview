// components/personnel/LowResponseRateCard.jsx
import React from 'react';
import styled from 'styled-components';

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 24px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ChartTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const DepartmentCard = styled.div`
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 10px;
  background-color: ${props => 
    props.rate < 30 ? '#ff4d4f' : 
    props.rate < 50 ? '#ff7a45' : 
    props.rate < 70 ? '#ffc53d' : 
    '#52c41a'};
  color: ${props => props.rate < 50 ? 'white' : '#333'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  }
`;

const DepartmentName = styled.div`
  font-weight: 500;
`;

const ResponseRate = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const WarningMessage = styled.div`
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 4px;
  padding: 8px 12px;
  color: #ff4d4f;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
  }
`;

const LowResponseRateCard = () => {
  // 部署データ
  const lowRateDepartments = [
    { id: 1, name: '営業部営業課', rate: 10 },
    { id: 2, name: '開発部開発課', rate: 30 },
    { id: 3, name: '組織マネジメント部', rate: 45 },
    { id: 4, name: 'フルーツジッパー', rate: 40 },
  ];
  
  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>回答率が低下している部署</ChartTitle>
      </ChartHeader>
      
      <WarningMessage>
        <svg viewBox="64 64 896 896" focusable="false" data-icon="exclamation-circle" width="14" height="14" fill="currentColor" aria-hidden="true">
          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
          <path d="M464 688a48 48 0 1096 0 48 48 0 10-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path>
        </svg>
        これらの部署は、解答率が真準より低下しているため、改善の必要があります。
      </WarningMessage>
      
      <div>
        {lowRateDepartments.map(dept => (
          <DepartmentCard key={dept.id} rate={dept.rate}>
            <DepartmentName>{dept.name}</DepartmentName>
            <ResponseRate>{dept.rate}%</ResponseRate>
          </DepartmentCard>
        ))}
      </div>
    </ChartContainer>
  );
};

export default LowResponseRateCard;