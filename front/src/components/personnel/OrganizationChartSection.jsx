// front/src/components/personnel/OrganizationChartSection.jsx
import React from 'react';
import styled from 'styled-components';
import { Tree, TreeNode } from 'react-organizational-chart';

// スタイル付きのコンポーネント
const StyledNode = styled.div`
  padding: 12px;
  border-radius: 8px;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  display: inline-block;
  width: 200px;
  position: relative;
  margin: 0 auto;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #e5e7eb;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
`;

const StyledTreeNode = styled(TreeNode)`
  padding: 16px 0;
`;

// ツリー全体のスタイル
const StyledTree = styled(Tree)`
  padding: 20px;
  
  /* 木の各レベルの間隔を調整 */
  & > div {
    padding-top: 20px;
  }
`;

const OrganizationChartSection = ({ organizations, orgStats, onOrganizationClick }) => {
    // 組織カードコンポーネント
    const OrganizationNode = ({ organization, onClick }) => {
        const stats = orgStats[organization.id] || { score: 0, measureCount: 0, responseRate: 0 };
        
        // スコアに基づく色の設定
        let scoreColor = "text-yellow-600";
        if (stats.score >= 4) {
            scoreColor = "text-green-600";
        } else if (stats.score < 3) {
            scoreColor = "text-red-600";
        }
        
        return (
            <StyledNode onClick={() => onClick(organization.id)}>
                <div className='flex gap-4 justify-center'>
                  <div className="font-bold text-brand-darkBlue truncate">{organization.name}</div>
                  <div className="text-xs text-brand-darkBlue mt-1">コード: {organization.code}</div>
                </div>
                <div className="mt-2 border-t pt-1">
                    <div className={`text-sm font-medium ${scoreColor}`}>
                        スコア: {stats.score.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-600">
                        施策数: {stats.measureCount}
                    </div>
                    <div className="text-xs text-gray-600">
                        回答率: {stats.responseRate}%
                    </div>
                </div>
            </StyledNode>
        );
    };

    // 再帰的にツリーノードを構築する関数
    const renderTreeNodes = (organization) => {
        return (
            <StyledTreeNode 
                key={organization.id} 
                label={
                    <OrganizationNode 
                        organization={organization} 
                        onClick={onOrganizationClick}
                    />
                }
            >
                {organization.children && organization.children.map(child => (
                    renderTreeNodes(child)
                ))}
            </StyledTreeNode>
        );
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
            <div className="min-w-max flex justify-center">
                {organizations.map(org => (
                    <div key={org.id} className="min-w-max">
                        <StyledTree 
                            lineWidth={'2px'}
                            lineColor={'#9ca3af'}
                            lineBorderRadius={'10px'}
                            label={<div style={{ width: 0, height: 0 }}></div>}
                        >
                            {renderTreeNodes(org)}
                        </StyledTree>
                    </div>
                ))}
            </div>
            <div className="text-sm text-gray-500 text-center mt-4">
                カードをクリックすると、組織の改善ページに移動します
            </div>
        </div>
    );
};

export default OrganizationChartSection;