// 'use client';
import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    BarChart, 
    Card, 
    Divider, 
    DonutChart, 
    List, 
    ListItem 
  } from '@tremor/react';
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  const data2 = [
    {
      name: 'Taiping',
      color: 'bg-cyan-500',
    },
    {
      name: 'Smart',
      color: 'bg-blue-500',
    },
    {
      name: 'Countdown',
      color: 'bg-indigo-500',
    },
    {
      name: 'Costco',
      color: 'bg-violet-500',
    },
    {
      name: 'Paknsave',
      color: 'bg-fuchsia-500',
    },
    {
      name: 'Sales Warehouse',
      color: 'bg-green-500',
    },
    {
      name: 'Others',
      color: 'bg-lime-500',
    },
  ];

  let currentMonth = 12;

  const currencyFormatter = (number) => {
    return '$' + Intl.NumberFormat('us').format(number).toString();
  };

  const valueFormatter = (number) =>
    `$${Intl.NumberFormat('us').format(number).toString()}`;
  
  export default function Example() {
    const [annualSummaryData, setAnnualSummaryData] = useState(null); // 存储获取的数据
    const [error, setError] = useState(null); // 存储错误信息
    const [loading, setLoading] = useState(true); // 存储加载状态


    useEffect(() => {
        //获取当前日期，用于重新格式regDate并且显示到table当中
        const currentDate = new Date();
        const dbDate = currentDate.getFullYear();
        currentMonth = currentDate.getMonth() + 1;
        console.log(currentMonth)
        console.log(dbDate)

        //test dbDate
        const testDbDate = "2024"
        // 定义一个异步函数以发送 GET 请求
        const fetchData1 = async () => {
            try {
            // 使用当前主机的后端地址，避免在不同电脑上硬编码 IP 导致请求失败
            const response = await fetch('http://localhost:3000/api/expense/annualSummary/' + dbDate);
            if (!response.ok) {
                //防错机制，并且获取到api传来的默认json数据
                const defaultData = await response.json();
                //当404报错，即get不到regDate的数据，意味着数据库里没有当月信息，则在前端显示默认json数据，空
                if (response.status === 404) {
                    //检查默认json数据
                    console.log('404 Error no data found:', defaultData); // 打印后端返回的内容
                    //将默认json数据储存在前端data array当中
                    setAnnualSummaryData(defaultData)
                    return defaultData; // 返回默认的空数据
                }
            }
            //如果可以正常获取到值，则将result保存在前端 data array当中
            const result = await response.json();
            setAnnualSummaryData(result);
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
    console.log(annualSummaryData)



    let locationListDetail = annualSummaryData.formatLocationDataResult;

    locationListDetail = locationListDetail.map((location) => {
      // 在 data2 中查找对应的颜色
      const colorData = data2.find((item) => item.name === location.location);
    
      // 如果找到对应颜色，则添加 color 信息，否则设置默认颜色
      return {
        ...location,
        color: colorData ? colorData.color : "bg-gray-500", // 设置默认颜色为灰色
      };
    });

    return (
      <>
      {/* <Header/> */}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {annualSummaryData ? (
        <div className="relative isolate overflow-hidden pt-16 bg-zinc-50 min-h-screen">
          <header className="pb-4 pt-6 sm:pb-6">
              <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 py-1">
                  <h1 className="text-xl font-semibold text-gray-900">Annual Summary</h1>
              </div>
          </header>

          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mb-16">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap  py-1">
                <h1 className="text-lg font-semibold text-gray-900">Expense overview</h1>
            </div>

            

            <div className="mt-6">
              <div className="mx-auto max-w-7xl flex">
                <Card className="sm:mr-auto sm:max-w-2xl w-1/2 h-auto">
                  <h3 className="ml-1 mr-1 font-semibold dark:text-dark-tremor-content-strong">
                    Monthly Expense overview
                  </h3>
                  <BarChart
                    data={annualSummaryData.formatMonthlyExpenseResult}
                    index="date"
                    categories={["Expense"]}
                    colors={['blue']}
                    yAxisWidth={50}
                    className="mt-6 sm:block"
                  />
                  <Divider />
                </Card>
                <Card className="sm:ml-auto mr-3 sm:max-w-lg w-1/2">
                  <h3 className=" font-semibold dark:text-dark-tremor-content-strong">
                    Total expenses by category
                  </h3>
                  <DonutChart
                    className="mt-8"
                    data={annualSummaryData.formatLocationDataResult}
                    category= "originalTotalExpense"
                    index="location"
                    valueFormatter={currencyFormatter}
                    showTooltip={false}
                    colors={['cyan', 'blue', 'indigo', 'violet', 'fuchsia', 'green', 'lime']}
                  />
                  <p className="mt-8 flex items-center justify-between text-tremor-label text-tremor-content dark:text-dark-tremor-content">
                    <span>Category</span>
                    <span>Amount / Share</span>
                  </p>
                  <List className="mt-2">
                    {locationListDetail.map((item) => (
                      <ListItem key={item.location} className="space-x-6">
                        <div className="flex items-center space-x-2.5 truncate">
                          <span
                            className={classNames(
                              item.color,
                              'size-2.5 shrink-0 rounded-sm',
                            )}
                            aria-hidden={true}
                          />
                          <span className="truncate dark:text-dark-tremor-content-emphasis">
                            {item.location}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium tabular-nums text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            {currencyFormatter(item.originalTotalExpense)}
                          </span>
                          <span className="rounded-tremor-small bg-tremor-background-subtle px-1.5 py-0.5 text-tremor-label font-medium tabular-nums text-tremor-content-emphasis dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-emphasis">
                            {item.percentage}
                          </span>
                        </div>
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </div>
            </div>
            

            
          </div>

          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mb-16">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap  py-1">
                  <h1 className="text-lg font-semibold text-gray-900">Annual Badage</h1>
            </div>
            <div className='overflow-hidden flex items-center justify-center max-w-7xl mx-auto pb-16 mt-6'>
              <div className="w-full flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-x-2 border-y-2 border-gray-900/5 px-4 py-6 sm:px-6 xl:px-8 bg-white mr-3 sm:rounded-xl ">{/* Content goes here */}
                <div className="text-sm/6 font-medium text-gray-700">
                    Total Costs
                </div>
                <div className="w-full flex text-4xl/10 font-medium tracking-tight text-gray-900 items-center justify-center mt-3 py-8">
                  ${parseFloat(annualSummaryData.annualTotalExpense).toFixed(2)}
                </div>
              </div>

              <div className="w-full flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-x-2 border-y-2 border-gray-900/5 px-4 py-6 sm:px-6 xl:px-8 bg-white mr-3  sm:rounded-xl ">{/* Content goes here */}
                <div className="text-sm/6 font-medium text-gray-700">
                    Average Costs per month
                </div>
                <div className="w-full flex text-4xl/10 font-medium tracking-tight text-gray-900 items-center justify-center mt-3 py-8">
                    ${parseFloat(annualSummaryData.annualTotalExpense/currentMonth).toFixed(2)}
                </div>
              </div>

              <div className="w-full flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-x-2 border-y-2 border-gray-900/5 px-4 py-6 sm:px-6 xl:px-8 bg-white mr-3  sm:rounded-xl ">{/* Content goes here */}
                <div className="text-sm/6 font-medium text-gray-700">
                  Average Costs per person
                </div>
                <div className="w-full flex text-4xl/10 font-medium tracking-tight text-gray-900 items-center justify-center mt-3 py-8">
                  ${parseFloat(annualSummaryData.annualTotalExpense/5).toFixed(2)}
                </div>
              </div>
            </div>
            <div className='overflow-hidden flex items-center justify-center max-w-7xl mx-auto pb-16'>
              <div className="w-full flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-x-2 border-y-2 border-gray-900/5 px-4 py-6 sm:px-6 xl:px-8 bg-white mr-3 sm:rounded-xl ">{/* Content goes here */}
                <div className="text-sm/6 font-medium text-gray-700">
                    Favourite supermarket
                </div>
                <div className="w-full flex text-4xl/10 font-medium tracking-tight text-gray-900 items-center justify-center mt-3 py-8">
                    {annualSummaryData.highestExpenseLocation.location}
                </div>
              </div>

              <div className="w-full flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-x-2 border-y-2 border-gray-900/5 px-4 py-6 sm:px-6 xl:px-8 bg-white mr-3  sm:rounded-xl ">{/* Content goes here */}
                <div className="text-sm/6 font-medium text-gray-700">
                    Richest Month
                </div>
                <div className="w-full flex text-4xl/10 font-medium tracking-tight text-gray-900 items-center justify-center mt-3 py-8">
                    {annualSummaryData.highestMonthlyExpense.regDate}
                </div>
              </div>

              <div className="w-full flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-x-2 border-y-2 border-gray-900/5 px-4 py-6 sm:px-6 xl:px-8 bg-white mr-3  sm:rounded-xl ">{/* Content goes here */}
                <div className="text-sm/6 font-medium text-gray-700">
                    Poorest Month
                </div>
                <div className="w-full flex text-4xl/10 font-medium tracking-tight text-gray-900 items-center justify-center mt-3 py-8">
                    {annualSummaryData.lowestMonthlyExpense.regDate}
                </div>
              </div>
            </div>
          </div>




          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mb-16">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap  py-1">
                    <h1 className="text-lg font-semibold text-gray-900">Total Expense</h1>
              </div>
              
            <div className="pr-4 mt-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 bg-white shadow sm:rounded-xl">
                  <p className="mt-1 text-tremor-metric font-semibold text-tremor-content-strong ">
                    ${annualSummaryData.annualTotalExpense}
                  </p>
                  <LineChart
                    data={annualSummaryData.originalMonthlyLocationExpenseResult}
                    index="month"
                    categories={[
                      'Taiping',
                      'Smart',
                      'Countdown',
                      'Sales Warehouse',
                      'Paknsave',
                      'Costco',
                      'Others',
                    ]}
                    colors={['emerald-400', 'cyan-400', 'blue-400', 'indigo-400', 'fuchsia-300','red-300', 'amber-300', ]}
                    valueFormatter={valueFormatter}
                    yAxisWidth={60}
                    maxValue={1800}
                    onValueChange={() => {}}
                    className="mt-6 hidden h-96 sm:block"
                  />
                  <Table className="mt-8">
                    <TableHead>
                      <TableRow className="border-b border-tremor-border dark:border-dark-tremor-border">
                        <TableHeaderCell className="text-tremor-content-strong">
                          Name
                        </TableHeaderCell>
                        <TableHeaderCell className="text-right text-tremor-content-strong dark:text-dark-tremor-content-strong">
                          Value
                        </TableHeaderCell>
                        <TableHeaderCell className="text-right text-tremor-content-strong dark:text-dark-tremor-content-strong">
                          Average
                        </TableHeaderCell>
                        <TableHeaderCell className="text-right text-tremor-content-strong dark:text-dark-tremor-content-strong">
                          highest
                        </TableHeaderCell>
                        <TableHeaderCell className="text-right text-tremor-content-strong dark:text-dark-tremor-content-strong">
                          lowest
                        </TableHeaderCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {annualSummaryData.formatLocationDataResult.map((item) => (
                        <TableRow key={item.location}>
                          <TableCell className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            <div className="flex space-x-3">
                              <span
                                className={classNames(item.bgColor, 'w-1 shrink-0 rounded')}
                                aria-hidden={true}
                              />
                              <span>{item.location}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{item.totalExpense}</TableCell>
                          <TableCell className="text-right">{item.averageExpense}</TableCell>
                          <TableCell className="text-right">{item.highestExpense}</TableCell>
                          <TableCell className="text-right">{item.lowestExpense}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
            </div>
            

            
          </div>


        
        </div>
      ) : (
        !loading && <p>No data available</p> // 提示无数据而非直接渲染空内容
    )}
    </>
    );
  }