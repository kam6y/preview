import React, { useState } from 'react';

const OrganizationSelector = ({ 
  onSelectOrganization,
  organizations = [] // デフォルト値を空配列に
}) => {
  // 現在選択されている組織
  const [selectedOrg, setSelectedOrg] = useState(organizations[0]?.id || '');
  
  // 組織を選択したときのハンドラー
  const handleSelectOrg = (orgId) => {
    setSelectedOrg(orgId);
    if (onSelectOrganization) {
      onSelectOrganization(orgId);
    }
  };

  return (
    <div className="mb-6 pt-2 pl-4 bg-white">
      {/* 組織切り替えタブ */}
      <div className="flex border-b">
        {organizations.map(org => (
          <button 
            key={org.id}
            className={`py-2 px-6 font-medium relative ${selectedOrg === org.id ? 'text-brand-coral' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => handleSelectOrg(org.id)}
          >
            {org.name}
            {selectedOrg === org.id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-coral"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrganizationSelector;