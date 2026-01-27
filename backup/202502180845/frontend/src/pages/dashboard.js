'use client'

import { useState } from 'react'
import React, { useEffect} from 'react';
import { Link } from 'react-router-dom';



const statuses = {
    Paid: 'text-green-700 bg-green-50 ring-green-600/20',
    Withdraw: 'text-gray-600 bg-gray-50 ring-gray-500/10',
    Overdue: 'text-red-700 bg-red-50 ring-red-600/10',
}

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Example() {
    // const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [dashboardUnsortedData, setDashboardUnsortedData] = useState(null); // 存储获取的数据
    const [error, setError] = useState(null); // 存储错误信息
    const [loading, setLoading] = useState(true); // 存储加载状态

    const currentDateTime = new Date().toLocaleString()


    useEffect(() => {
        //获取当前日期，用于重新格式regDate并且显示到table当中
        const currentDate = new Date();
        const dbDate = currentDate.getFullYear() + '-' + monthNames[currentDate.getMonth()];
        console.log(dbDate)

        const dbLastMonthDate = currentDate.getFullYear() + '-' + monthNames[currentDate.getMonth() -1];
        console.log(dbLastMonthDate)

        //test dbDate
        const testDbDate = "2024-March"
        const testDbLastMonthDate = "2024-February"
        // 定义一个异步函数以发送 GET 请求
        const fetchData1 = async () => {
            try {
            const response = await fetch('http://192.168.50.56:3000/api/expense/monthSummary/'+ dbDate); // 替换为你的 API 地址
            if (!response.ok) {
                //防错机制，并且获取到api传来的默认json数据
                const defaultData = await response.json();
                //当404报错，即get不到regDate的数据，意味着数据库里没有当月信息，则在前端显示默认json数据，空
                if (response.status === 404) {
                    //检查默认json数据
                    console.log('404 Error no data found:', defaultData); // 打印后端返回的内容
                    //将默认json数据储存在前端data array当中
                    setDashboardUnsortedData(defaultData)
                    return defaultData; // 返回默认的空数据
                }
            }
            //如果可以正常获取到值，则将result保存在前端 data array当中
            const result = await response.json();
            setDashboardUnsortedData(result);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false); // 请求完成后设置加载状态为 false
            }
        };

        fetchData1(); // 调用请求函数


        
    }, []); // 空数组确保只在组件挂载时运行一次

    // // 渲染逻辑
    if (loading) return <div className="text-center">加载中...</div>;
    if (error) return <div className="text-red-500">出错了: {error}</div>;

    console.log(dashboardUnsortedData)


    return (
        <>
            {/* <Header/> */}
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {dashboardUnsortedData ? (
                <main className="bg-zinc-50">
                    <div className="relative isolate overflow-hidden pt-16 ">
                        {/* Secondary navigation */}
                        <header className="pb-4 pt-6 sm:pb-6">
                            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
                                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                                <Link to="/registerForm"
                                    href="#"
                                    className="ml-auto flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    New expense
                                </Link>


                            </div>
                        </header>
                        <div className="overflow-hidden shadow sm:rounded-xl flex items-center justify-center w-1/2 mx-auto xl:w-1/4 mb-6">
                            <div className="w-full flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-gray-900/5 px-4 py-6 sm:px-6 lg:border-t-0 xl:px-8 bg-white">{/* Content goes here */}
                                <div className="text-sm/6 font-medium text-gray-700">
                                    Total Expense
                                </div>
                                <div className="text-gray-500 text-xs font-medium">
                                    {/* Due to 2024-12-07 17:12:30 */}
                                    Due to {currentDateTime}
                                </div>
                                <div className="w-full flex text-5xl/10 font-medium tracking-tight text-gray-900 items-center justify-center mt-3 py-8">
                                    ${dashboardUnsortedData.totalPrice}
                                    {/* ${totalPaid} */}
                                </div>
                            </div>
                        </div>

                        {/* 3 lines stats data */}
                        <div className='overflow-hidden flex items-center justify-center max-w-7xl mx-auto pb-16'>

                            <div className="w-full flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-x-2 border-y-2 border-gray-900/5 px-4 py-6 sm:px-6 xl:px-8 bg-white mr-3 sm:rounded-xl ">{/* Content goes here */}
                                <div className="text-sm/6 font-medium text-gray-700">
                                    Expense Count
                                </div>
                                <div className="text-gray-500 text-xs font-medium">
                                    {/* Due to 2024-12-07 17:12:30 */}
                                    Due to {currentDateTime}
                                </div>
                                <div className="w-full flex text-4xl/10 font-medium tracking-tight text-gray-900 items-center justify-center mt-3 py-8">
                                    {dashboardUnsortedData.totalCount}
                                    {/* ${totalCount} */}
                                </div>
                            </div>

                            <div className="w-full flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-x-2 border-y-2 border-gray-900/5 px-4 py-6 sm:px-6 xl:px-8 bg-white mr-3  sm:rounded-xl ">{/* Content goes here */}
                                <div className="text-sm/6 font-medium text-gray-700">
                                    Average Costs
                                </div>
                                <div className="text-gray-500 text-xs font-medium">
                                    {/* Due to 2024-12-07 17:12:30 */}
                                    Due to {currentDateTime}
                                </div>
                                <div className="w-full flex text-4xl/10 font-medium tracking-tight text-gray-900 items-center justify-center mt-3 py-8">
                                    {/* ${parseFloat(dashboardUnsortedData.totalPrice.$numberDecimal/4).toFixed(2)} */}
                                    {/* ${averageAmount} */}
                                    ${dashboardUnsortedData.averagePrice}
                                </div>
                            </div>

                            <div className="w-full flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-x-2 border-y-2 border-gray-900/5 px-4 py-6 sm:px-6 xl:px-8 bg-white  sm:rounded-xl ">{/* Content goes here */}
                                <div className="text-sm/6 font-medium text-gray-700">
                                    Compare to last month
                                </div>
                                <div className={classNames(
                                    dashboardUnsortedData.diffStatus === 'positive' ? 'text-lime-600' : 'text-rose-600',
                                    'text-xs font-bold',
                                    )}>
                                    {/* {monthDiff} */}
                                    {dashboardUnsortedData.monthDiff}
                                </div>
                                <div className="w-full flex text-4xl/10 font-medium tracking-tight text-gray-900 items-center justify-center mt-3 py-8">
                                    {/* {lastMonthData} */}
                                    {dashboardUnsortedData.lastTotalPrice}
                                </div>
                            </div>
                        </div>


                        {/* Stats */}
                        <div className="shadow-xl ">
                            <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 border-b-gray-900/5  lg:border-t-gray-900/5 sm:rounded-xl ">
                                {dashboardUnsortedData.sortedExpenseSummary.map((item, index) => (
                                    <div
                                        key={item.name}
                                        className={classNames(
                                            (index+1) % 2 === 1 ? 'sm:border-l-2 sm:border-r-1 mr-2' : 'sm:border-r-2',
                                            (index+1) <3 ? 'sm:border-t-2 sm:border-b-1 mb-2' : 'sm:border-b-2',
                                            // statIdx < 2 ? 'sm:border-t-2' : 'sm:border-b-2',
                                            'flex flex-wrap items-baseline justify-between  gap-y-2 border-t border-gray-900/5  py-10 sm:px-6 xl:px-8 shadow-sm sm:rounded-xl bg-white box-border',
                                        )}
                                    >
                                        <dt className="text-xl/2 font-medium w-full text-gray-800">{item.name}</dt>

                                        <dd
                                            className={classNames(
                                                
                                                'text-xs font-medium text-gray-500 w-1/2 mt-3',
                                            )}
                                        >
                                            <span
                                                className={classNames(
                                                    statuses.Paid, 'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                                                )}
                                            >
                                                Already Paid
                                            </span>
                                        </dd>

                                        <dd
                                            className={classNames(
                                                
                                                'text-xs font-medium text-gray-500 w-1/2 mt-3',
                                            )}
                                        >
                                            <span
                                                className={classNames(
                                                    statuses.Overdue, 'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                                                )}
                                            >
                                                To be Paid
                                            </span>
                                        </dd>

                                        <dd className="block w-1/2 flex-none text-2xl/10 font-medium tracking-tight text-gray-900">
                                            {/* {stat.paid_amount} */}
                                            {/* {parseFloat(dashboardUnsortedData.totalPrice.$numberDecimal/4).toFixed(2)} */}
                                            {/* ${parseFloat(dashboardUnsortedData.totalExpenseByPayer.find(expense => expense._id === stat.name || expense._id.replace(/\s/g, '') === stat.name).totalExpense).toFixed(2)} */}
                                            ${item.paid}
                                        </dd>

                                        <dd className="w-1/2 flex-none text-2xl/10 font-medium tracking-tight text-gray-900">
                                        {/* ${parseFloat(dashboardUnsortedData.totalPrice.$numberDecimal/4).toFixed(2) - parseFloat(dashboardUnsortedData.totalExpenseByPayer.find(expense => expense._id === stat.name || expense._id.replace(/\s/g, '') === stat.name).totalExpense).toFixed(2)} */}
                                            ${item.toBePaid}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        {/* <div
                            aria-hidden="true"
                            className="absolute left-0 top-full -z-10 mt-96 origin-top-left translate-y-40 -rotate-90 transform-gpu opacity-20 blur-3xl sm:left-1/2 sm:-ml-96 sm:-mt-10 sm:translate-y-0 sm:rotate-0 sm:transform-gpu sm:opacity-50"
                        >
                            <div
                                style={{
                                    clipPath:
                                        'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)',
                                }}
                                className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#FF80B5] to-[#9089FC]"
                            />
                        </div> */}
                    </div>

                    <div className="space-y-16 py-16 xl:space-y-20 ">
                        {/* Recent activity table */}
                        <div className='mx-auto max-w-7xl lg:px-2 py-10 bg-white shadow sm:rounded-xl'>
                            <div className="mx-auto max-w-7xl px-2 ">
                                <h2 className="mx-auto max-w-2xl text-base font-semibold text-gray-900 lg:mx-0 lg:max-w-none indent-3 py-2 sm:rounded-lg">
                                    Recent activity
                                </h2>
                            </div>
                            <div className="mt-6 overflow-hidden border-t border-gray-100 ">
                                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
                                    <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                                        <table className="w-full text-left">
                                            <thead className="sr-only">
                                                <tr>
                                                    <th>Amount</th>
                                                    <th className="hidden sm:table-cell">Client</th>
                                                    <th>More details</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dashboardUnsortedData.monthlyRecentDetaiListResult.map((item) => (
                                                    <tr key={item._id}>
                                                        <td className="hidden py-5 pr-6 sm:table-cell">
                                                            <div className="text-sm/6 text-gray-900">{item.regDate}</div>
                                                        </td>
                                                        <td className="hidden py-5 pr-6 sm:table-cell">
                                                            <div className="text-sm/6 text-gray-900">{item.payer}</div>
                                                        </td>
                                                        <td className="relative py-5 pr-6">
                                                            <div className="flex gap-x-6">
                                                                <div className="flex-auto">
                                                                    <div className="flex items-start gap-x-3">
                                                                        <div className="text-sm/6 font-medium text-gray-900 text-left">{item.price}</div>
                                                                        <div
                                                                            className={classNames(
                                                                                statuses.Paid,
                                                                                'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                                                                            )}
                                                                        >
                                                                            paid
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                                                            <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                                                        </td>
                                                        <td className="hidden py-5 pr-6 sm:table-cell">
                                                            <div className="text-sm/6 text-gray-900">{item.description}</div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent client list*/}
                        {/* <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base/7 font-semibold text-gray-900">Recent clients</h2>
                                    <a href="#" className="text-sm/6 font-semibold text-indigo-600 hover:text-indigo-500">
                                        View all<span className="sr-only">, clients</span>
                                    </a>
                                </div>
                                <ul role="list" className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
                                    {clients.map((client) => (
                                        <li key={client.id} className="overflow-hidden rounded-xl border border-gray-200">
                                            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                                                <img
                                                    alt={client.name}
                                                    src={client.imageUrl}
                                                    className="size-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
                                                />
                                                <div className="text-sm/6 font-medium text-gray-900">{client.name}</div>
                                                <Menu as="div" className="relative ml-auto">
                                                    <MenuButton className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                                                        <span className="sr-only">Open options</span>
                                                        <EllipsisHorizontalIcon aria-hidden="true" className="size-5" />
                                                    </MenuButton>
                                                    <MenuItems
                                                        transition
                                                        className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                                    >
                                                        <MenuItem>
                                                            <a
                                                                href="#"
                                                                className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                                                            >
                                                                View<span className="sr-only">, {client.name}</span>
                                                            </a>
                                                        </MenuItem>
                                                        <MenuItem>
                                                            <a
                                                                href="#"
                                                                className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                                                            >
                                                                Edit<span className="sr-only">, {client.name}</span>
                                                            </a>
                                                        </MenuItem>
                                                    </MenuItems>
                                                </Menu>
                                            </div>
                                            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm/6">
                                                <div className="flex justify-between gap-x-4 py-3">
                                                    <dt className="text-gray-500">Last invoice</dt>
                                                    <dd className="text-gray-700">
                                                        <time dateTime={client.lastInvoice.dateTime}>{client.lastInvoice.date}</time>
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between gap-x-4 py-3">
                                                    <dt className="text-gray-500">Amount</dt>
                                                    <dd className="flex items-start gap-x-2">
                                                        <div className="font-medium text-gray-900">{client.lastInvoice.amount}</div>
                                                        <div
                                                            className={classNames(
                                                                statuses[client.lastInvoice.status],
                                                                'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                                                            )}
                                                        >
                                                            {client.lastInvoice.status}
                                                        </div>
                                                    </dd>
                                                </div>
                                            </dl>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div> */}
                    </div>
                </main>
            ) : (
                !loading && <p>No data available</p> // 提示无数据而非直接渲染空内容
            )}
            
        </>
    )
}
