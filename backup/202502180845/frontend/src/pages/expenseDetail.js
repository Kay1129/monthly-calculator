import React, { useEffect, useState } from 'react';
import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'


  //月份名称，用于get到regDate值之后，统一显示日期 eg 2024-March
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  
  export default function Example() {
    const [monthlyExpenseData, setMonthlyExpenseData] = useState(null); // 存储获取的数据
    const [personalExpenseData, setPersonalExpenseData] = useState([]); // 存储获取的数据
    const [personalTotalExpenseAmount, setPersonalTotalExpenseAmount] = useState(null); // 存储获取的数据
    const [error, setError] = useState(null); // 存储错误信息
    const [loading, setLoading] = useState(true); // 存储加载状态

    const [selectedOption, setSelectedOption] = useState("Fanyi"); // 默认选中值
    const options = ["Fanyi", "Christy", "Kai", "Yining & Tang"]; // 可选项

    const [selectedPayer, setSelectedPayer] = useState({
        payer: '',
      });
    
    const [message, setMessage] = useState('');


    const handleOptionClick = (option) => {
    setSelectedOption(option); // 设置当前选中值
    setSelectedPayer((prev) => ({ ...prev, payer: option })); // 更新 payerName 中的 payer 字段
    console.log('Updated payerName:', { ...selectedPayer, payer: option });
    };

    useEffect(() => {
        //获取当前日期，用于重新格式regDate并且显示到table当中
        const currentDate = new Date();
        const dbDate = currentDate.getFullYear() + '-' + monthNames[currentDate.getMonth()];
        console.log(dbDate)

        //test dbDate
        const testDbDate = "2024-March"
        // 定义一个异步函数以发送 GET 请求
        const fetchData1 = async () => {
            try {
            const response = await fetch('http://192.168.50.56:3000/api/expense/'+ dbDate); // 替换为你的 API 地址
            if (!response.ok) {
                //防错机制，并且获取到api传来的默认json数据
                const defaultData = await response.json();
                //当404报错，即get不到regDate的数据，意味着数据库里没有当月信息，则在前端显示默认json数据，空
                if (response.status === 404) {
                    //检查默认json数据
                    console.log('404 Error no data found:', defaultData); // 打印后端返回的内容
                    //将默认json数据储存在前端data array当中
                    setMonthlyExpenseData(defaultData)
                    return defaultData; // 返回默认的空数据
                }
            }
            //如果可以正常获取到值，则将result保存在前端 data array当中
            const result = await response.json();
            setMonthlyExpenseData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false); // 请求完成后设置加载状态为 false
            }
        };

        fetchData1(); // 调用请求函数
        
    }, []); // 空数组确保只在组件挂载时运行一次


    useEffect(() => {
        if (selectedOption){
            //获取当前日期，用于重新格式regDate并且显示到table当中
            const currentDate = new Date();
            const dbDate = currentDate.getFullYear() + '-' + monthNames[currentDate.getMonth()];
            console.log(dbDate)

            //test dbDate
            const testDbDate = "2024-March"
            // 定义一个异步函数以发送 GET 请求
            const fetchData2 = async () => {
                setLoading(true);
                try {
                const response = await fetch('http://192.168.50.56:3000/api/expense/'+ dbDate +'/' + selectedOption); // 替换为你的 API 地址
                if (!response.ok) {
                    //防错机制，并且获取到api传来的默认json数据
                    const defaultData = await response.json();
                    //当404报错，即get不到regDate的数据，意味着数据库里没有当月信息，则在前端显示默认json数据，空
                    if (response.status === 404) {
                        //检查默认json数据
                        console.log('404 Error no data found:', defaultData); // 打印后端返回的内容
                        //将默认json数据储存在前端data array当中
                        setPersonalExpenseData(defaultData)
                        return defaultData; // 返回默认的空数据
                    }
                }
                //如果可以正常获取到值，则将result保存在前端 data array当中
                const result = await response.json();
                console.log("personal" + result)
                setPersonalExpenseData(result);
                setPersonalTotalExpenseAmount(result.totalPrice)
                } catch (err) {
                setError(err.message);
                } finally {
                setLoading(false); // 请求完成后设置加载状态为 false
                }
            };

            fetchData2(); // 调用请求函数
        }
      
    }, [selectedOption]); // 空数组确保只在组件挂载时运行一次
  
  
    // // 渲染逻辑
    if (loading) return <div className="text-center">加载中...</div>;
    if (error) return <div className="text-red-500">出错了: {error}</div>;


    //存储当月所有expense的list
    // const monthlyExpenseList = monthlyExpenseData.monthlyDetaiListResult;
    console.log("this is monthly expense data")
    console.log(monthlyExpenseData)
    //存储当月每个payer所有expense的list
    // const personalExpenseList = personalExpenseData.personalDetaiListResult;
    console.log("this is personal expense data")
    console.log(personalExpenseData)



    return (
        <>
            {/* <Header/> */}
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {monthlyExpenseData && personalExpenseData ? (
                <div className="relative isolate overflow-hidden pt-16 bg-zinc-50 min-h-screen">
                    <header className="pb-4 pt-6 sm:pb-6">
                        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 py-1">
                            <h1 className="text-xl font-semibold text-gray-900">Expense Detail</h1>
                        </div>
                    </header>
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-white shadow sm:rounded-xl">
                        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap  py-1">
                            <h1 className="text-lg font-semibold text-gray-900">Monthly Expense Detail</h1>
                            <p className="mt-1 text-sm/6 text-gray-600">
                            A list of all the expense in current month. Please double check if any record missing.
                            </p>
                        </div>

                        {/* monthly expense detail table */}
                        <div className="mt-6 overflow-hidden ">
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none border-t border-gray-100 max-h-160 overflow-y-auto">
                                    <table className="w-full text-left min-w-full border-separate border-spacing-0">
                                        <thead>
                                        <tr>
                                            <th
                                            scope="col"
                                            className=" sticky top-0 z-10 hidden border-b border-gray-300 bg-white/75 px-4 py-3.5  text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                                            >
                                            Time
                                            </th>
                                            <th
                                            scope="col"
                                            className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white/75 px-4 py-3.5  text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                                            >
                                            Payer
                                            </th>
                                            <th
                                            scope="col"
                                            className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white/75 px-4 py-3.5  text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                                            >
                                            Payment Location
                                            </th>
                                            <th
                                            scope="col"
                                            className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white/75 px-4 py-3.5  text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                                            >
                                            Description
                                            </th>
                                            <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white/75 px-4 py-3.5 text-right text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                                            >
                                            Amount
                                            </th>
                                            
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {monthlyExpenseData.monthlyDetaiListResult.map((order, _id) => (
                                            <tr key={order._id}>
                                            <td
                                                className={classNames(
                                                    _id !== order.length - 1 ? 'border-b border-gray-200' : '',
                                                'whitespace-nowrap  px-4 py-3.5 text-sm text-gray-500  text-left',
                                                )}
                                            >
                                                {order.regDate}
                                            </td>
                                            <td
                                                className={classNames(
                                                    _id !== order.length - 1 ? 'border-b border-gray-200' : '',
                                                'hidden whitespace-nowrap px-4 py-3.5 text-sm text-gray-800 sm:table-cell text-left font-medium',
                                                )}
                                            >
                                                {order.payer}
                                            </td>
                                            <td
                                                className={classNames(
                                                    _id !== order.length - 1 ? 'border-b border-gray-200' : '',
                                                'whitespace-nowrap px-4 py-3.5 text-sm text-gray-800 text-left',
                                                )}
                                            >
                                                {order.location}
                                            </td>
                                            <td
                                                className={classNames(
                                                    _id !== order.length - 1 ? 'border-b border-gray-200' : '',
                                                'hidden whitespace-nowrap px-4 py-3.5 text-sm text-gray-800 lg:table-cell text-left',
                                                )}
                                            >
                                                {order.description}
                                            </td>
                                            <td
                                                className={classNames(
                                                    _id !== order.length - 1 ? 'border-b border-gray-200' : '',
                                                'whitespace-nowrap px-4 py-3.5 text-sm text-gray-800 text-right font-medium',
                                                )}
                                            >
                                                {order.price}
                                            </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap  py-1 mt-10">
                            <h1 className="text-lg font-semibold text-gray-900">Personal Expense Detail</h1>
                            <p className="mt-1 text-sm/6 text-gray-600">
                            A list of all the personal expense in current month. Please double check if any record missing.
                            </p>
                            <Menu as="div" className="relative inline-block text-left ml-auto items-center gap-x-1 rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                                <div>
                                    <MenuButton 
                                        className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                            {selectedOption} {/* 显示当前选中的值 */}
                                            <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                                    </MenuButton>
                                </div>

                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                >
                                    <div className="py-1">
                                        {options.map((option) => (
                                            <Menu.Item key={option}>
                                                {({ active }) => (
                                                    <p
                                                        onClick={() => handleOptionClick(option)} // 点击时更新选中值
                                                        className={`block px-4 py-2 text-sm text-gray-700 ${
                                                            active ? "bg-gray-100 text-gray-900" : ""
                                                        } cursor-pointer`}
                                                    >
                                                        {option}
                                                    </p>
                                                )}
                                            </Menu.Item>
                                        ))}
                                    </div>
                                </MenuItems>
                            </Menu>
                        </div>
                        
                        {/* personal expense detail list */}
                        {loading && <p>Loading...</p>}
                        {error && <p>Error: {error}</p>}
                        {personalExpenseData.personalDetaiListResult && personalExpenseData.personalDetaiListResult.length > 0 ? (
                            <div className="mt-6 overflow-hidden ">
                                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                    <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none border-t border-gray-100 max-h-160 overflow-y-auto">
                                        <table className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none w-full text-left min-w-full border-separate border-spacing-0 border-t border-gray-100">
                                            <colgroup className=''>
                                                <col className="w-full sm:w-1/4" />
                                                {/* <col className="sm:w-1/5" /> */}
                                                <col className="sm:w-2/4" />
                                                <col className="sm:w-1/4" />
                                            </colgroup>
                                            <thead className="border-b border-gray-300 text-gray-900">
                                                <tr>
                                                <th scope="col" className="px-4 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                                                    Location
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="hidden px-4 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell"
                                                >
                                                    Description
                                                </th>
                                                <th scope="col" className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900">
                                                    Amount
                                                </th>
                                                </tr>
                                            </thead>
                                            
                                            <tbody>
                                                {personalExpenseData.personalDetaiListResult.map((order) => (
                                                <tr key={order._id} className="border-b border-gray-200">
                                                    <td className="max-w-0 py-3.5 pl-5 px-4 text-sm ">
                                                        <div className="font-medium text-gray-900">{order.location}</div>
                                                    </td>
                                                    {/* <td className="hidden px-4 py-5 text-left text-sm text-gray-500 sm:table-cell">{item.expenseID}</td> */}
                                                    <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">{order.description}</td>
                                                    <td className="py-5 pl-3 pr-4 text-right text-sm text-gray-500">{order.price}</td>
                                                </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <th
                                                        scope="row"
                                                        colSpan={2}
                                                        className="hidden pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0"
                                                    >
                                                        Total
                                                    </th>
                                                    <th scope="row" className="pl-4 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden ">
                                                        Total
                                                    </th>
                                                    <td className="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900  border-t border-gray-200">{personalExpenseData.totalPrice}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            !loading && <p>No data available</p> // 提示无数据而非直接渲染空内容
                        )}



                    </div>
                </div>
            ) : (
                !loading && <p>No data available</p> // 提示无数据而非直接渲染空内容
            )}
        </>
    )
  }
  