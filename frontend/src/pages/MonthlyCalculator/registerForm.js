import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate



export default function Example() {
    //存储input数据内容
    const [formData, setFormData] = useState({
        payer: '',
        location: '',
        price: '',
        year: '2026',
        month: '',
        description: ''
      });

    const allPayers = ["Lenora", "Christy", "Yining", "Tang", "Kai"];
    const [allPayersList, setAllPayersList] = useState(null); // 存储获取的数据
    const [error, setError] = useState(null); // 存储错误信息
    const [loading, setLoading] = useState(true); // 存储加载状态

    useEffect(() => {
            // 定义一个异步函数以发送 GET 请求
            const fetchData1 = async () => {
                try {
                const response = await fetch('http://localhost:3000/api/familyMember'); // 替换为你的 API 地址

                //如果可以正常获取到值，则将result保存在前端 data array当中
                const result = await response.json();
                setAllPayersList(result);

                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false); // 请求完成后设置加载状态为 false
                }
            };

        fetchData1(); // 调用请求函数
    }, []); // 空数组确保只在组件挂载时运行一次
    console.log(allPayersList)


    const navigate = useNavigate(); // 初始化 navigate 函数
    
    const [message, setMessage] = useState('');
    
      // 处理表单输入变化
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    
      // 提交表单数据到后端
    const handleSubmit = async (e) => {
        e.preventDefault(); // 防止默认表单提交行为

        const finalData = {
            payer: formData.payer,
            location: formData.location,
            price: parseFloat(formData.price).toFixed(2),
            regDate: `${formData.year}-${formData.month}`, // 拼接为 "YYYY-MM" 格式
            description: formData.description,
          };
        delete finalData.year; // 删除不需要的字段
        delete finalData.month;

        //检查post content内容
        console.log('Sending data:', finalData); 
    
        //发送post请求
        try {
          const response = await fetch('http://192.168.50.56:3000/api/expense', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(finalData), // 将表单数据转换为 JSON 格式
          });

          //再次检查post content内容
          console.log('Sending data:', finalData); 
    
          //防错机制
          if (response.ok) {
            const result = await response.json();
            setMessage('Registration successful');

            setTimeout(() => {
                navigate('/MonthlyCalculator/dashboard');
              }, 1000); // 2000 毫秒（2 秒）

          } else {
            const error = await response.json();
            setMessage(`Error: ${error.message}`);
          }
        } catch (err) {
          setMessage('Network error. Please try again later.');
        }
    };


  return (
    <>
        {/* <Header/> */}
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {allPayersList ? (
            <div className="relative isolate overflow-hidden pt-16 min-h-screen bg-zinc-50">
                <header className="pb-4 pt-6 sm:pb-6">
                    <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 py-1">
                        <h1 className="text-xl font-semibold text-gray-900">Register Entry</h1>
                        <p className="mt-1 text-sm/6 text-gray-600">Please retain your receipt until next month.</p>
                    </div>
                </header>
                <form onSubmit={handleSubmit} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-white shadow sm:rounded-xl">
                    <div className="space-y-12 ">
                        <div className="border-b border-gray-900/10 pb-12 ">
                        {/* <h2 className="text-base/7 font-semibold text-gray-900">Personal Information</h2> */}
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-3 ">
                                    <label htmlFor="payer" className="block text-sm/6 font-medium text-gray-900 relative">
                                        Payer
                                        <span className="absolute top-1 left-10 text-red-500 text-sm">*</span>
                                    </label>
                                    <div className="mt-2 grid grid-cols-1">
                                        <select
                                            id="payer"
                                            name="payer"
                                            autoComplete="payer-name"
                                            
                                            value={formData.payer}
                                            onChange={handleChange}
                                            required
                                            className="border-0 required:border-red-500 col-start-1 row-start-1 w-full appearance-none rounded-md text-gray-900 bg-white py-1.5 pl-3 pr-8 text-base  outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 "
                                        >
                                            <option value="" disabled className="bg-neutral-300  ">
                                                Select your payer
                                            </option>
                                            {/* <option>Lenora</option>
                                            <option>Christy</option>
                                            <option>Kai</option>
                                            <option>Yining</option>
                                            <option>Tang</option> */}
                                            {allPayersList.familyMember.map((item, index) => (
                                                <option key={index} value={item.payer} disabled={item.status === "onLeave"}>
                                                    {item.payer} {item.status === "onLeave" ? "(on leave)" : ""}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                </div>
                                <div className="sm:col-span-3 ">
                                    <label htmlFor="payer" className="block text-sm/6 font-medium text-gray-900 relative">
                                        Payment Location
                                        <span className="absolute top-1 left-31 text-red-500 text-sm">*</span>
                                    </label>
                                    <div className="mt-2 grid grid-cols-1">
                                        <select
                                            id="location"
                                            name="location"
                                            autoComplete="location-name"
                                            
                                            value={formData.location}
                                            onChange={handleChange}
                                            required
                                            className="border-0 col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        >
                                            <option value="" disabled className="bg-neutral-300 ">
                                                Select your payment location
                                            </option>
                                            <option>Taiping</option>
                                            <option>Smart</option>
                                            <option>Countdown</option>
                                            <option>Paknsave</option>
                                            <option>Costco</option>
                                            <option>Sales Warehouse</option>
                                            <option>Others</option>
                                        </select>
                                    </div>
                                    
                                </div>

                                <div className="sm:col-span-2 sm:col-start-1 ">
                                    <label htmlFor="first-name" className="text-sm/6 font-medium text-gray-900 relative">
                                            Expense Amount
                                            <span className="absolute top-0 left-30 text-red-500 text-sm">*</span>
                                    </label>
                                    <div className="mt-2 relative flex items-center rounded-md bg-white px-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">$</div>
                                        <input
                                            id="price"
                                            name="price"
                                            type="number"
                                            placeholder="0.00"
                                            aria-describedby="price-currency"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                            className="border-0 block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm/6 appearance-none active:bg-white "
                                            />
                                    </div>
                                    
                                </div>

                                <div className="sm:col-span-2 ">
                                <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900 relative">
                                        Year
                                        <span className="absolute top-1 left-8 text-red-500 text-sm">*</span>
                                    </label>
                                    <div className="mt-2 grid grid-cols-1">
                                        <select
                                            id="year"
                                            name="year"
                                            autoComplete="year"
                                            
                                            value={formData.year}
                                            onChange={handleChange}
                                            required
                                            className="border-0 overflow-y-scroll col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        >
                                            <option>2026</option>
                                        </select>
                                    </div>
                                    
                                </div>

                                <div className="sm:col-span-2 ">
                                    <label htmlFor="postal-code" className="block text-sm/6 font-medium text-gray-900 relative">
                                        Month
                                        <span className="absolute top-1 left-11 text-red-500 text-sm">*</span>
                                    </label>
                                    <div className="mt-2 grid grid-cols-1">
                                        <select
                                            id="month"
                                            name="month"
                                            autoComplete="month"
                                            
                                            value={formData.month}
                                            onChange={handleChange}
                                            required
                                            className="border-0 overflow-y-scroll col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        >
                                            <option value="" disabled className="bg-neutral-300 ">
                                                Select payment month
                                            </option>
                                            <option>January</option>
                                            <option>February</option>
                                            <option>March</option>
                                            <option>April</option>
                                            <option>May</option>
                                            <option>June</option>
                                            <option>July</option>
                                            <option>August</option>
                                            <option>September</option>
                                            <option>October</option>
                                            <option>November</option>
                                            <option>December</option>
                                        </select>
                                    </div>
                                    
                                </div>

                                <div className="sm:col-span-6">
                                    <label htmlFor="last-name" className="block text-sm/6 font-medium text-gray-900">
                                        Description
                                    </label>
                                    <div className="mt-2">
                                        <input
                                        id="description"
                                        name="description"
                                        type="description"
                                        autoComplete="description"
                                        placeholder="Please note anything important"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">

                        <Link to="/MonthlyCalculator/dashboard"
                            href="#"
                            className="text-sm/6 font-semibold text-gray-900"
                        >
                            Cancel
                        </Link>

                        <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Submit
                        </button>
                    </div>
                    {message && <p className="mt-4 text-sm text-green-400">{message}</p>}
                </form>
            </div>
        ) : (
            !loading && <p>No data available</p> // 提示无数据而非直接渲染空内容
        )}
                    
    </>

  )
}
