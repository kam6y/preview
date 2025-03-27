// front/src/components/common/SuccessCaseHeader.jsx
import React from 'react';

const SuccessCaseHeader = () => {
  return (
    <div className="flex items-center">
      <h1 className="text-2xl font-bold text-brand-darkBlue mr-4">施策の成功事例</h1>
      <div className="flex items-center bg-brand-lightGray p-3 rounded-md flex-1 justify-end mr-10fb">
        <img 
          src="/images/mascot.png" 
          alt="マスコットキャラクター" 
          className="w-16 h-16 mr-3"
        />
        <div>
          <p className="text-sm">
            社内の成功事例を参考に、自部署の課題解決に活用しましょう！<br />
            <span className="text-brand-teal font-medium">他部署のベストプラクティスから学び、効果的な施策を立案できます</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessCaseHeader;