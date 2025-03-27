import { useState, useEffect } from 'react'

const UserInfoForm = ({ userType, userInfo, setUserInfo, onNext }) => {
  const [level1Options, setLevel1Options] = useState([])
  const [level2Options, setLevel2Options] = useState([])
  const [level3Options, setLevel3Options] = useState([])

  const [selectedLevel1, setSelectedLevel1] = useState(
    userInfo?.departmentLevel1 || ''
  )
  const [selectedLevel2, setSelectedLevel2] = useState(
    userInfo?.departmentLevel2 || ''
  )
  const [selectedLevel3, setSelectedLevel3] = useState(
    userInfo?.departmentLevel3 || ''
  )

  const [email, setEmail] = useState(userInfo.email || '')
  useEffect(() => {
    const fetchTopLevelDepartments = async () => {
      try {
        const res = await fetch('http://localhost/api/departments')
        if (!res.ok) throw new Error('トップレベル組織の取得に失敗しました')
        const data = await res.json()
        setLevel1Options(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchTopLevelDepartments()
  }, [])

  useEffect(() => {
    if (!selectedLevel1) {
      setLevel2Options([])
      setSelectedLevel2('')
      return
    }

    const fetchSecondLevel = async () => {
      try {
        const res = await fetch(
          `http://localhost/api/departments/${selectedLevel1}/children`
        )
        if (!res.ok) throw new Error('第二階層組織の取得に失敗しました')
        const data = await res.json()
        setLevel2Options(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchSecondLevel()

    setSelectedLevel2('')
    setLevel3Options([])
    setSelectedLevel3('')
  }, [selectedLevel1])

  useEffect(() => {
    if (!selectedLevel2) {
      setLevel3Options([])
      setSelectedLevel3('')
      return
    }

    const fetchThirdLevel = async () => {
      try {
        const res = await fetch(
          `http://localhost/api/departments/${selectedLevel2}/children`
        )
        if (!res.ok) throw new Error('第三階層組織の取得に失敗しました')
        const data = await res.json()
        setLevel3Options(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchThirdLevel()

    setSelectedLevel3('')
  }, [selectedLevel2])

  const handleSubmit = () => {
    setUserInfo({
      departmentLevel1: selectedLevel1,
      departmentLevel2: selectedLevel2,
      departmentLevel3: selectedLevel3,
      email: email,
    })
    onNext()
  }

  return (
    <div className="px-12  rounded-lg text-black">
      {/* タイトルをカード外に移動 */}
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-brand-darkBlue">
        STEP2 あなたの情報を入力してください。
      </h2>
      <div className="w-32 h-1 bg-brand-teal mx-auto mb-8 rounded-full opacity-60"></div>
      <div className="bg-white p-8 rounded-lg shadow-xl">
        {/* 1階層目 */}
        <div className="mb-6">
          <label className="block mb-2 text-lg font-semibold text-gray-700">
            部署 (1階層目)
          </label>
          <select
            value={selectedLevel1}
            onChange={(e) => setSelectedLevel1(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-darkBlue"
          >
            <option value="">-- 選択してください --</option>
            {level1Options.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2階層目 */}
        {level2Options.length > 0 && (
          <div className="mb-6">
            <label className="block mb-2 text-lg font-semibold text-gray-700">
              部署 (2階層目)
            </label>
            <select
              value={selectedLevel2}
              onChange={(e) => setSelectedLevel2(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-darkBlue"
            >
              <option value="">-- 選択してください --</option>
              {level2Options.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 3階層目 */}
        {level3Options.length > 0 && (
          <div className="mb-6">
            <label className="block mb-2 text-lg font-semibold text-gray-700">
              部署 (3階層目)
            </label>
            <select
              value={selectedLevel3}
              onChange={(e) => setSelectedLevel3(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-darkBlue"
            >
              <option value="">-- 選択してください --</option>
              {level3Options.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* メールアドレス */}
        {userType === 'manager' && (
          <div className="mb-6">
            <label className="block mb-2 text-lg font-semibold text-gray-700">
              メールアドレス
            </label>
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-darkBlue"
            />
          </div>
        )}
      </div>

      {/* 次へボタン */}
      <button
        onClick={handleSubmit}
        className="w-full py-3 mt-6 bg-brand-darkBlue text-white font-semibold rounded-full hover:bg-brand-cyan focus:outline-none focus:ring-2 focus:ring-brand-darkBlue transition duration-200"
      >
        次へ
      </button>
    </div>
  )
}

export default UserInfoForm
